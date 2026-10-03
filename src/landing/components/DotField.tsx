import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

const SPACING = 34;
const DOT_RADIUS = 1.1;
const PULL_RADIUS = 210;
const PULL_STRENGTH = 16;
const LERP = 0.075;

interface Dot {
  bx: number;
  by: number;
  x: number;
  y: number;
}

/**
 * The landing page's dotted field, drawn on a canvas so it can react to the
 * cursor: dots inside the pointer's radius ease toward it and brighten, then
 * settle back once it moves on. Everything runs off one rAF loop and only the
 * handful of dots near the cursor are drawn individually — the rest go out in a
 * single path, which keeps a few thousand dots cheap.
 *
 * Under `prefers-reduced-motion` it draws one static frame and stops.
 */
export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let frame = 0;
    let running = true;

    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const next: Dot[] = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const bx = col * SPACING;
          const by = row * SPACING;
          next.push({ bx, by, x: bx, y: by });
        }
      }
      dots = next;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      for (const dot of dots) {
        ctx.moveTo(dot.bx + DOT_RADIUS, dot.by);
        ctx.arc(dot.bx, dot.by, DOT_RADIUS, 0, Math.PI * 2);
      }
      ctx.fillStyle = 'rgba(148, 163, 184, 0.13)';
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Pass 1: every untouched dot in one path.
      ctx.beginPath();
      for (const dot of dots) {
        if (dot.x === dot.bx && dot.y === dot.by) {
          ctx.moveTo(dot.bx + DOT_RADIUS, dot.by);
          ctx.arc(dot.bx, dot.by, DOT_RADIUS, 0, Math.PI * 2);
        }
      }
      ctx.fillStyle = 'rgba(148, 163, 184, 0.13)';
      ctx.fill();

      // Pass 2: the dots the cursor is currently affecting.
      for (const dot of dots) {
        const dx = pointer.x - dot.bx;
        const dy = pointer.y - dot.by;
        const distance = Math.hypot(dx, dy);

        if (distance < PULL_RADIUS || dot.x !== dot.bx || dot.y !== dot.by) {
          // Quadratic falloff gives a soft edge instead of a hard circle.
          const t = Math.max(0, 1 - distance / PULL_RADIUS);
          const pull = t * t;
          const reach = (PULL_STRENGTH * pull) / PULL_RADIUS;

          dot.x += (dot.bx + dx * reach - dot.x) * LERP;
          dot.y += (dot.by + dy * reach - dot.y) * LERP;

          // Snap home so the cheap path can take the dot back.
          if (Math.abs(dot.x - dot.bx) < 0.01 && Math.abs(dot.y - dot.by) < 0.01) {
            dot.x = dot.bx;
            dot.y = dot.by;
          }

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, DOT_RADIUS + pull * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${0.2 + pull * 0.65})`;
          ctx.fill();
        }
      }

      if (running) frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!reduce && !running) {
        running = true;
        frame = requestAnimationFrame(render);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);

    if (reduce) {
      drawStatic();
    } else {
      frame = requestAnimationFrame(render);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}