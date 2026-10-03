import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TextLayer } from '../../types';
import { drawTextLayerOnCanvas } from '../../utils/videoUtils';
import { Section, SectionLabel, SectionTitle } from './ui';

const POSITIONS = [
  { id: 'top', label: 'Top', y: 18 },
  { id: 'middle', label: 'Middle', y: 50 },
  { id: 'bottom', label: 'Bottom', y: 82 },
] as const;

type PositionId = (typeof POSITIONS)[number]['id'];

const ANIMATIONS: TextLayer['animation'][] = ['none', 'fade', 'slide', 'zoom', 'pop'];
const COLORS = ['#ffffff', '#38bdf8', '#f472b6', '#facc15'];
const CLIP_SECONDS = 3;

/**
 * The canvas is not a mockup: it is painted by the same
 * `drawTextLayerOnCanvas` the app calls on your video, so what you change here
 * is exactly what gets burned into a real clip.
 */
export function OverlayDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [text, setText] = useState('Part - 01');
  const [position, setPosition] = useState<PositionId>('bottom');
  const [animation, setAnimation] = useState<TextLayer['animation']>('fade');
  const [color, setColor] = useState(COLORS[0]);
  const [playing, setPlaying] = useState(true);

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

  const draw = useCallback((elapsedSeconds: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    // Stand-in footage, so the overlay has something to sit on.
    const backdrop = ctx.createLinearGradient(0, 0, width, height);
    backdrop.addColorStop(0, '#132033');
    backdrop.addColorStop(1, '#0b0f16');
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    const t = elapsedSeconds % CLIP_SECONDS;

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const barWidth = width / 26;
    for (let i = 0; i < 24; i++) {
      const barHeight = 40 + Math.abs(Math.sin(t * 3 + i * 0.6)) * (height * 0.22);
      ctx.fillStyle = `rgba(96, 165, 250, ${0.18 + (i % 5) * 0.05})`;
      ctx.fillRect(width * 0.08 + i * barWidth, height * 0.72 - barHeight, barWidth * 0.55, barHeight);
    }

    ctx.beginPath();
    ctx.arc(
      width * 0.72 + Math.cos(t * 1.4) * 90,
      height * 0.34 + Math.sin(t * 1.9) * 50,
      120 + Math.sin(t * 2.2) * 24,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(59, 130, 246, 0.22)';
    ctx.fill();

    // Clip-relative progress is what drives the entry animation.
    drawTextLayerOnCanvas(ctx, layerRef.current, 0, width, height, t / CLIP_SECONDS);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!playing || reduced) {
      draw(0.9);
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
  }, [draw, playing]);

  return (
    <Section id="demo">
      <SectionLabel>Live</SectionLabel>
      <SectionTitle>This is the app&rsquo;s own overlay renderer.</SectionTitle>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
        Same <code className="text-gray-300">drawTextLayerOnCanvas()</code> call, same
        auto-increment logic — just running on a synthetic frame instead of your file.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-[#1f1f24]">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="block aspect-video w-full"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-4">
        <label className="flex min-w-48 flex-1 flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-600">
            Text
          </span>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Part - 01"
            className="rounded-md border border-[#26262c] bg-[#101014] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-blue-500"
          />
        </label>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-600">
            Position
          </legend>
          <div className="flex gap-1.5">
            {POSITIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPosition(item.id)}
                aria-pressed={position === item.id}
                className={`rounded-md border px-3 py-2 text-xs transition-colors ${
                  position === item.id
                    ? 'border-blue-500 bg-blue-600/15 text-blue-300'
                    : 'border-[#26262c] bg-[#101014] text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-600">
            Animation
          </span>
          <select
            value={animation}
            onChange={(event) =>
              setAnimation(event.target.value as TextLayer['animation'])
            }
            className="rounded-md border border-[#26262c] bg-[#101014] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-blue-500"
          >
            {ANIMATIONS.map((item) => (
              <option key={item} value={item} className="capitalize">
                {item}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-600">
            Colour
          </legend>
          <div className="flex items-center gap-2">
            {COLORS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setColor(item)}
                aria-label={`Use ${item}`}
                aria-pressed={color === item}
                style={{ backgroundColor: item }}
                className={`size-6 rounded-full border-2 transition-transform ${
                  color === item ? 'scale-110 border-white' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          className="ml-auto rounded-md border border-[#26262c] bg-[#101014] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-gray-400 transition-colors hover:text-white"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
    </Section>
  );
}