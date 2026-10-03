import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { m, useReducedMotion } from 'motion/react';
import { cx, layout, text } from '../../theme';

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
 * A centred heading with a rule on each side of its label. The rules scale out
 * from the centre to meet the text, and the gap in the flex row guarantees they
 * never run into it at any width.
 */
export function SectionHead({
  icon: _icon,
  label,
  title,
  children,
}: {
  icon?: LucideIcon;
  label: string;
  title: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <Reveal className={layout.centerStack}>
      <div className="flex w-full items-center gap-3 sm:gap-5">
        <m.span
          aria-hidden="true"
          className="h-px flex-1 origin-right bg-[#222]"
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        />
        <m.span
          className={cx(text.label, 'shrink-0 whitespace-nowrap')}
          initial={{ opacity: 0, y: reduce ? 0 : 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {label}
        </m.span>
        <m.span
          aria-hidden="true"
          className="h-px flex-1 origin-left bg-[#222]"
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>

      <h2 className="mt-4 max-w-2xl text-xl font-bold tracking-tight text-white sm:text-2xl">
        {title}
      </h2>

      {children && (
        <p className={cx('mt-3 max-w-xl leading-relaxed text-gray-400', text.body)}>
          {children}
        </p>
      )}
    </Reveal>
  );
}