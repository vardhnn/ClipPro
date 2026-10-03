import { m, useReducedMotion } from 'motion/react';
import { site } from '../site';

const EASE = [0.22, 1, 0.36, 1] as const;

const LINE_1 = 'Cut one long video';
const LINE_2 = 'into numbered clips,';

/**
 * One column, left aligned. Each line arrives on its own so the headline reads
 * as typesetting rather than a block fading in.
 */
export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: EASE },
  });

  return (
    <section id="top" className="px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-44">
      <div className="mx-auto w-full max-w-5xl">
        <m.p
          {...rise(0.05)}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-600"
        >
          {site.tagline}
        </m.p>

        <h1 className="mt-5 max-w-3xl text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
          <m.span {...rise(0.12)} className="block">
            {LINE_1}
          </m.span>
          <m.span {...rise(0.2)} className="block">
            {LINE_2}
          </m.span>
          <m.span {...rise(0.28)} className="block text-gray-500">
            in your browser.
          </m.span>
        </h1>

        <m.p
          {...rise(0.38)}
          className="mt-7 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
        >
          Fixed-length segments, an auto-incrementing overlay burned into each
          one, and a single ZIP at the end. Rendering happens on your machine
          with Canvas and MediaRecorder — no upload, no ffmpeg, no API key.
        </m.p>

        <m.div
          {...rise(0.48)}
          className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3"
        >
          <m.a
            href={site.appPath}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
          >
            Start clipping
          </m.a>
          <m.a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="text-sm text-gray-400 underline decoration-gray-700 underline-offset-[6px] transition-colors hover:text-white hover:decoration-gray-400"
          >
            View source on GitHub
          </m.a>
        </m.div>
      </div>
    </section>
  );
}