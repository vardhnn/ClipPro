import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { m, useReducedMotion } from 'motion/react';
import { cx, iconTile, layout, text } from '../../theme';

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
 * A centred heading: the app's icon tile and its uppercase label share one row,
 * then the title, then a short accent rule. Dropping the full-width hairline
 * that used to float above the icon is what stops these reading as four loose
 * pieces stacked on top of each other.
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
    <Reveal className={layout.centerStack}>
      <m.span
        className="inline-flex items-center gap-2.5 rounded-full border border-[#222] bg-[#16161a] py-1.5 pl-1.5 pr-4"
        initial={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className={iconTile}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <span className={text.label}>{label}</span>
      </m.span>

      <h2 className="mt-3 max-w-2xl text-xl font-bold tracking-tight text-white sm:text-2xl">
        {title}
      </h2>

      <m.span
        aria-hidden="true"
        className="mt-3 block h-px w-10 origin-center rounded-full bg-blue-600/60"
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
      />

      {children && (
        <p className={cx('mt-3 max-w-xl leading-relaxed text-gray-400', text.body)}>
          {children}
        </p>
      )}
    </Reveal>
  );
}