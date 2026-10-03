import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { m, useReducedMotion } from 'motion/react';
import { cx, iconTile, text } from '../../theme';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

/** Parent for <RevealItem>; children stagger without each needing a delay. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-72px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();

  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
    >
      {children}
    </m.div>
  );
}

/**
 * A section heading built from the app's own idiom: a blue icon tile beside an
 * uppercase label and a bold title, with the same divider above it.
 */
export function SectionHead({
  icon: Icon,
  label,
  title,
  children,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <Reveal>
      <m.span
        aria-hidden="true"
        className="block h-px w-full origin-left bg-[#222]"
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      />

      <div className="mt-7 flex items-center gap-3">
        <span className={iconTile}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <div className="min-w-0">
          <p className={text.label}>{label}</p>
          <h2 className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>

      {children && (
        <p className={cx('mt-4 max-w-2xl leading-relaxed text-gray-400', text.body)}>
          {children}
        </p>
      )}
    </Reveal>
  );
}