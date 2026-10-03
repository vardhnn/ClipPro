/**
 * The app's visual language, lifted out of the component files it was scattered
 * across. Both entries — the tool and the landing page — compose these strings,
 * so a colour or control style only has to change in one place.
 *
 * Fonts: the product deliberately ships no webfont. Everything is the system
 * sans stack (`font-sans`) with `font-mono` reserved for labels, metadata and
 * anything that should read as machine output.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const surface = {
  /** Page background, including the dotted grid the app sits on. */
  page: 'bg-[#0a0a0c] text-gray-200 font-sans antialiased bg-grid-pattern',
  /** Raised content card. */
  panel: 'bg-[#16161a] border border-[#222] rounded shadow-sm',
  /** Recessed area inside a panel — media frames, tracks, bars. */
  inset: 'bg-[#0d0d10] border border-[#333] rounded',
  footer: 'border-t border-[#222] bg-[#0d0d10]',
  divider: 'border-t border-[#222]',
  hairline: 'h-px w-full bg-[#222]',
  hairlineVertical: 'h-4 w-px bg-[#222]',
} as const;

export const text = {
  title: 'font-bold tracking-tight text-white',
  heading: 'text-sm font-bold text-white',
  /** Page and section scale. */
  hero: 'text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl',
  section: 'text-xl font-bold tracking-tight text-white sm:text-2xl',
  body: 'text-xs text-gray-400',
  lead: 'text-sm leading-relaxed text-gray-400 sm:text-base',
  muted: 'text-[11px] text-gray-500',
  /** The recurring uppercase label used above every control group. */
  label: 'text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400',
} as const;

/** Coloured status chips: `chip.base` carries the shape, the rest the tone. */
export const chip = {
  base: 'text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border',
  blue: 'bg-blue-950/40 border-blue-800/50 text-blue-400',
  emerald: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400',
  amber: 'bg-amber-950/40 border-amber-800/50 text-amber-400',
  indigo: 'bg-indigo-950/40 border-indigo-900/50 text-indigo-300',
  /** Neutral chip for filenames and inert values. */
  mono: 'bg-[#1a1a1f] border border-[#333] text-gray-200',
} as const;

/** The blue square that fronts every titled section in the app. */
export const iconTile =
  'w-7 h-7 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0';

/** Step numerals, mirroring the app's numbered workflow squares. */
export const numeral = {
  active: 'bg-blue-600/20 text-blue-400',
  idle: 'bg-[#22222a] text-gray-500',
  base: 'flex size-6 items-center justify-center rounded text-xs font-bold',
} as const;

export const control = {
  input:
    'w-full px-3 py-1.5 rounded border border-[#333] bg-[#0d0d10] text-xs font-mono text-white focus:outline-none focus:border-blue-500',
  select:
    'w-full px-3 py-1.5 rounded border border-[#333] bg-[#0d0d10] text-xs text-white focus:outline-none focus:border-blue-500',
  /** Primary and secondary share padding *and* border width, so a pair of them
      sits on exactly the same line instead of a couple of pixels apart. */
  primary:
    'px-4 py-2 rounded border border-transparent bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition',
  secondary:
    'px-4 py-2 rounded bg-[#22222a] hover:bg-[#2c2c36] border border-[#333] text-gray-200 font-semibold text-xs transition',
  icon: 'size-8 rounded border border-[#333] bg-[#22222a] flex items-center justify-center',
  /** Segmented track, as used by the clip-duration picker. */
  track: 'relative flex overflow-hidden rounded border border-[#333] bg-[#0d0d10]',
  segment: 'relative z-10 flex-1 border-r border-[#333] px-2 py-1.5 text-xs font-semibold transition-colors last:border-r-0',
  presetOn: 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20',
  presetOff: 'bg-[#0d0d10] text-gray-300 border-[#2b2b34] hover:bg-[#1f1f26]',
} as const;

export const accent = {
  amber: 'text-amber-400',
  emerald: 'text-emerald-400',
  indigo: 'text-indigo-400',
  purple: 'text-purple-400',
  blue: 'text-blue-400',
} as const;

/** One breakpoint-driven container, so every band lines up. */
export const layout = {
  container: 'mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8',
  section: 'py-12 sm:py-16',
  /** Narrower measure for the live preview so it reads as a widget, not a hero. */
  preview: 'mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8',
  /** Centred stack used by the hero and every section heading. */
  centerStack: 'flex flex-col items-center text-center',
} as const;