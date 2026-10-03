import { m, useReducedMotion } from 'motion/react';
import { Clapperboard, Lock, Terminal } from 'lucide-react';
import { chip, control, cx, iconTile, layout, surface, text } from '../../theme';
import { site } from '../site';

const EASE = [0.22, 1, 0.36, 1] as const;

const TRUST = [
  { icon: Lock, label: 'No upload', tone: chip.emerald },
  { icon: Terminal, label: 'No ffmpeg · no API key', tone: chip.blue },
];

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section id="top" className={cx(layout.section, 'pt-28 sm:pt-32 lg:pt-36')}>
      <div className={layout.container}>
        <m.div {...rise(0.05)} className="flex items-center gap-3">
          <span className={iconTile}>
            <Clapperboard className="w-3.5 h-3.5" />
          </span>
          <p className={text.label}>{site.tagline}</p>
        </m.div>

        <h1 className={cx('mt-6 max-w-3xl', text.hero)}>
          <m.span {...rise(0.12)} className="block">
            Cut one long video
          </m.span>
          <m.span {...rise(0.2)} className="block">
            into numbered clips.
          </m.span>
        </h1>

        <m.p {...rise(0.28)} className={cx('mt-6 max-w-2xl', text.lead)}>
          Fixed-length segments, an auto-incrementing overlay burned into each one,
          and a single ZIP at the end. Rendering happens on your machine with Canvas
          and MediaRecorder.
        </m.p>

        <m.div {...rise(0.36)} className="mt-8 flex flex-wrap items-center gap-2.5">
          <m.a
            href={site.appPath}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={cx(control.primary, 'inline-flex items-center px-5 py-2.5 text-sm')}
          >
            Start clipping
          </m.a>
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={cx(control.secondary, 'inline-flex items-center px-5 py-2.5')}
          >
            View source on GitHub
          </a>
        </m.div>

        <m.div
          {...rise(0.44)}
          className={cx('mt-10 flex flex-wrap items-center gap-2 pt-6', surface.divider)}
        >
          {['MP4', 'MOV', 'MKV', 'AVI', 'WebM'].map((format) => (
            <span key={format} className={cx(chip.base, chip.mono)}>
              {format}
            </span>
          ))}

          <span className={cx('hidden sm:block', surface.hairlineVertical, 'mx-1')} />

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