import { m, useReducedMotion } from 'motion/react';
import { Clapperboard, Lock, Terminal } from 'lucide-react';
import { chip, control, cx, iconTile, text } from '../../theme';
import { site } from '../site';

const EASE = [0.22, 1, 0.36, 1] as const;

const TRUST = [
  { icon: Lock, label: 'No upload', tone: chip.emerald },
  { icon: Terminal, label: 'No ffmpeg · no API key', tone: chip.blue },
];

/**
 * A website hero, but every part of it is built from the app's own surfaces:
 * the icon tile, the uppercase mono kicker, the format chips from the uploader.
 */
export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section id="top" className="px-4 pt-28 pb-14 sm:px-6 sm:pt-36 sm:pb-20 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <m.div {...rise(0.05)} className="flex items-center gap-3">
          <span className={iconTile}>
            <Clapperboard className="w-3.5 h-3.5" />
          </span>
          <p className={text.label}>{site.tagline}</p>
        </m.div>

        <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
          <m.span {...rise(0.12)} className="block">
            Cut one long video
          </m.span>
          <m.span {...rise(0.2)} className="block">
            into numbered clips.
          </m.span>
        </h1>

        <m.p
          {...rise(0.28)}
          className={cx('mt-6 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base', '')}
        >
          Fixed-length segments, an auto-incrementing overlay burned into each one,
          and a single ZIP at the end. Rendering happens on your machine with Canvas
          and MediaRecorder.
        </m.p>

        <m.div {...rise(0.36)} className="mt-8 flex flex-wrap items-center gap-3">
          <m.a
            href={site.appPath}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={cx(control.primary, 'px-5 py-2.5 text-sm')}
          >
            Start clipping
          </m.a>
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={cx(control.secondary, 'px-4 py-2.5')}
          >
            View source on GitHub
          </a>
          <span className={cx(chip.base, chip.mono, 'hidden sm:inline-flex')}>MIT</span>
        </m.div>

        <m.div
          {...rise(0.44)}
          className="mt-10 flex flex-wrap items-center gap-2 border-t border-[#222] pt-6"
        >
          {['MP4', 'MOV', 'MKV', 'AVI', 'WebM'].map((format) => (
            <span key={format} className={cx(chip.base, chip.mono)}>
              {format}
            </span>
          ))}

          <span className="mx-1 hidden h-4 w-px bg-[#222] sm:block" />

          {TRUST.map(({ icon: Icon, label, tone }) => (
            <span
              key={label}
              className={cx(chip.base, tone, 'inline-flex items-center gap-1')}
            >
              <Icon className="w-3 h-3" />
              {label}
            </span>
          ))}
        </m.div>
      </div>
    </section>
  );
}