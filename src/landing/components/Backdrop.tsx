import { m, useReducedMotion } from 'motion/react';

/**
 * Ambient light behind the content: three heavily blurred colour washes drifting
 * on very long loops, so it reads as light moving behind a dark surface rather
 * than as an animated graphic. Fixed so it never scrolls, and pinned behind
 * every content layer. Under `prefers-reduced-motion` it renders once and stops.
 */
export function Backdrop() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <m.div
        className="absolute -top-1/3 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[130px] sm:h-[46rem] sm:w-[46rem]"
        animate={reduce ? undefined : { x: ['-8%', '8%', '-8%'], y: ['0%', '6%', '0%'] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />

      <m.div
        className="absolute top-1/3 -right-40 h-[26rem] w-[26rem] rounded-full bg-indigo-600/[0.06] blur-[120px] sm:h-[32rem] sm:w-[32rem]"
        animate={reduce ? undefined : { y: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 46, repeat: Infinity, ease: 'easeInOut' }}
      />

      <m.div
        className="absolute bottom-0 -left-40 h-[24rem] w-[24rem] rounded-full bg-emerald-600/[0.05] blur-[130px] sm:h-[30rem] sm:w-[30rem]"
        animate={reduce ? undefined : { y: ['8%', '-8%', '8%'] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}