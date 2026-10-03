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
  /** Recessed area inside a panel. */
  inset: 'bg-[#0d0d10] border border-[#222] rounded',
  /** Footer strip. */
  footer: 'border-t border-[#222] bg-[#0d0d10]',
  divider: 'border-t border-[#222]',
  hairline: 'h-px w-full bg-[#222]',
} as const;

export const text = {
  title: 'font-bold tracking-tight text-white',
  heading: 'text-sm font-bold text-white',
  body: 'text-xs text-gray-400',
  muted: 'text-[11px] text-gray-500',
  /** The recurring uppercase label used above every control group. */
  label: 'text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400',
} as const;

/** Coloured status chips: `chip` carries the shape, the rest supply the tone. */
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

export const control = {
  input:
    'w-full px-3 py-1.5 rounded border border-[#333] bg-[#0d0d10] text-xs font-mono text-white focus:outline-none focus:border-blue-500',
  select:
    'w-full px-3 py-1.5 rounded border border-[#333] bg-[#0d0d10] text-xs text-white focus:outline-none focus:border-blue-500',
  primary:
    'px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition',
  secondary:
    'px-3 py-1.5 rounded bg-[#22222a] hover:bg-[#2c2c36] border border-[#333] text-gray-200 font-semibold text-xs transition',
  /** Segmented preset buttons, exactly as the clip-duration picker uses them. */
  presetOn: 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20',
  presetOff: 'bg-[#0d0d10] text-gray-300 border-[#2b2b34] hover:bg-[#1f1f26]',
} as const;

/** Amber accent, used for the "try the sample" affordance in the app. */
export const accent = {
  amber: 'text-amber-400',
  emerald: 'text-emerald-400',
  indigo: 'text-indigo-400',
  purple: 'text-purple-400',
  blue: 'text-blue-400',
} as const;