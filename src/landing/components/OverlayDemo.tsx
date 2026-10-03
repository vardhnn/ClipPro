import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import type { TextLayer } from '../../types';

import { drawTextLayerOnCanvas } from '../../utils/videoUtils';
import { SectionHead } from './ui';
// `text` is aliased: this component has its own `text` state for the overlay string.
import { chip, control, cx, layout, surface, text as typeScale } from '../../theme';

const EASE = [0.22, 1, 0.36, 1] as const;

const POSITIONS = [
  { id: 'top', label: 'Top', y: 18 },
  { id: 'middle', label: 'Middle', y: 50 },
  { id: 'bottom', label: 'Bottom', y: 82 },
] as const;

type PositionId = (typeof POSITIONS)[number]['id'];

const ANIMATIONS: TextLayer['animation'][] = ['none', 'fade', 'slide', 'zoom', 'pop'];
const COLORS = ['#ffffff', '#38bdf8', '#f472b6', '#facc15'];

const CLIP_SECONDS = 3;
const CLIP_COUNT = 4;

/**
 * Not a mockup. The canvas is painted by the same `drawTextLayerOnCanvas` call
 * the app makes on your video, cycling through four clips so the auto-increment
 * and the per-clip animation reset are both visible.
 */
export function OverlayDemo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();

  const [text, setText] = useState('Part - 01');
  const [position, setPosition] = useState<PositionId>('bottom');
  const [animation, setAnimation] = useState<TextLayer['animation']>('fade');
  const [color, setColor] = useState(COLORS[0]);
  const [clipIndex, setClipIndex] = useState(0);
  const activePosition = POSITIONS.findIndex((item) => item.id === position);

  // Written straight from the render loop, so the bar animates at frame rate
  // without re-rendering React on every frame.
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, { stiffness: 260, damping: 40 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [56, -56]);

  const layer = useMemo<TextLayer>(
    () => ({
      id: 'landing-demo',
      text,
      xPercent: 50,
      yPercent: POSITIONS.find((item) => item.id === position)?.y ?? 82,
      fontFamily: 'Montserrat, system-ui, sans-serif',
      fontSize: 52,
      color,
      fontWeight: 'bold',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      strokeColor: '#000000',
      strokeWidth: 3,
      shadowColor: 'rgba(0,0,0,0.8)',
      shadowBlur: 8,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      bgPadding: 12,
      letterSpacing: 1,
      rotation: 0,
      animation,
      autoIncrement: true,
      startNumber: 1,
      paddingDigits: 2,
    }),
    [animation, color, position, text]
  );

  const layerRef = useRef(layer);
  layerRef.current = layer;
  const clipRef = useRef(clipIndex);
  clipRef.current = clipIndex;

  const draw = useCallback(
    (elapsedSeconds: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas;

      const backdrop = ctx.createLinearGradient(0, 0, width, height);
      backdrop.addColorStop(0, '#132033');
      backdrop.addColorStop(1, '#0b0f16');
      ctx.fillStyle = backdrop;
      ctx.fillRect(0, 0, width, height);

      const loopSeconds = CLIP_SECONDS * CLIP_COUNT;
      const t = elapsedSeconds % loopSeconds;
      const index = Math.floor(t / CLIP_SECONDS);
      const clipProgress = (t % CLIP_SECONDS) / CLIP_SECONDS;

      rawProgress.set(t / loopSeconds);

      if (index !== clipRef.current) {
        clipRef.current = index;
        setClipIndex(index);
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      const cell = width / 16;
      for (let x = 0; x < width; x += cell) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += cell) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Stand-in footage, measured against the frame so it still fills
      // sensibly if the aspect is ever changed again.
      const baseline = height * 0.8;
      const barCount = 18;
      const barSlot = width * 0.84;
      const barWidth = (barSlot / barCount) * 0.55;
      for (let i = 0; i < barCount; i++) {
        const barHeight =
          height * 0.08 + Math.abs(Math.sin(t * 3 + i * 0.6)) * height * 0.34;
        ctx.fillStyle = `rgba(96, 165, 250, ${0.18 + (i % 5) * 0.05})`;
        ctx.fillRect(
          width * 0.08 + i * (barSlot / barCount),
          baseline - barHeight,
          barWidth,
          barHeight
        );
      }

      ctx.beginPath();
      ctx.arc(
        width * 0.72 + Math.cos(t * 1.4) * width * 0.07,
        height * 0.34 + Math.sin(t * 1.9) * height * 0.07,
        width * 0.09 + Math.sin(t * 2.2) * width * 0.02,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(59, 130, 246, 0.22)';
      ctx.fill();

      // Real call into the app, with the live clip index and clip-relative time.
      drawTextLayerOnCanvas(ctx, layerRef.current, index, width, height, clipProgress);
    },
    [rawProgress]
  );

  useEffect(() => {
    if (reduce) {
      draw(CLIP_SECONDS + 1.2);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const loop = (now: number) => {
      draw((now - startedAt) / 1000);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [draw, reduce]);

  return (
    <section id="demo" ref={sectionRef} className={cx(layout.section, 'overflow-hidden')}>
      <div className={layout.container}>
        <SectionHead
          label="Live preview"
          title="The app’s own overlay renderer, running here."
        >
          Same <code className="text-gray-300">drawTextLayerOnCanvas()</code> call and the
          same auto-increment logic — on a synthetic frame instead of your file, across
          four back-to-back clips.
        </SectionHead>

        {/* Small screens stack the frame above its settings, because half a phone's
            width leaves a 16:9 frame too small to read. From lg up they sit side
            by side at 50/50. The frame carries no card behind it — a panel
            background only made the video look inset. */}
        <m.div
          style={reduce ? undefined : { y: drift }}
          className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2"
        >
        <div className="flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="block w-full rounded border border-[#222] bg-[#0b0f16]"
          />
        </div>

        <div className={cx(surface.panel, 'flex flex-col gap-3 p-3 sm:p-4')}>
          <div className="flex items-center gap-3">
            <div className={cx(surface.inset, 'h-1.5 flex-1 overflow-hidden rounded-full')}>
              <m.div
                style={{ scaleX: progress }}
                className="h-full origin-left rounded-full bg-blue-600"
              />
            </div>
            <AnimatePresence mode="wait">
              <m.span
                key={clipIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={cx(chip.base, chip.blue, 'tabular-nums')}
              >
                Clip {clipIndex + 1} of {CLIP_COUNT}
              </m.span>
            </AnimatePresence>
          </div>

          <div className="grid gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={typeScale.label}>Text Overlay</span>
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Part - 01"
                className={control.input}
              />
            </label>

            <fieldset className="flex flex-col gap-1.5">
              <legend className={typeScale.label}>Position</legend>
              <div className={control.track}>
                {/* No gap, so the sliding highlight is exactly one third of the track. */}
                <m.span
                  aria-hidden="true"
                  animate={{ x: `${activePosition * 100}%` }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute inset-y-0 left-0 w-1/3 bg-blue-600"
                />
                {POSITIONS.map((item) => {
                  const active = position === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPosition(item.id)}
                      aria-pressed={active}
                      className={cx(
                        control.segment,
                        active ? 'text-white' : 'text-gray-300 hover:bg-[#1f1f26]'
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="flex flex-col gap-1.5">
              <span className={typeScale.label}>Entry Animation</span>
              <select
                value={animation}
                onChange={(event) =>
                  setAnimation(event.target.value as TextLayer['animation'])
                }
                className={control.select}
              >
                {ANIMATIONS.map((item) => (
                  <option key={item} value={item} className="capitalize">
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="flex flex-col gap-1.5">
              <legend className={typeScale.label}>Colour</legend>
              <div className="flex items-center gap-2 py-0.5">
                {COLORS.map((item) => (
                  <m.button
                    key={item}
                    type="button"
                    onClick={() => setColor(item)}
                    aria-label={`Use ${item}`}
                    aria-pressed={color === item}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                    style={{ backgroundColor: item }}
                    className={cx(
                      'size-6 rounded-full border-2',
                      color === item ? 'border-white' : 'border-[#333]'
                    )}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </m.div>
      </div>
    </section>
  );
}