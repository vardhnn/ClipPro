/**
 * Copy and links for the landing page. Everything brand- or text-related lives
 * here so the page components stay presentational.
 */
export const site = {
  name: 'CLIPPRO',
  version: 'v2.4.0',
  tagline: 'Automatic Video Clip Generator',
  appPath: '/app',
  repositoryUrl: 'https://github.com/vardhnn/ClipPro',
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'How it works', href: '#how' },
  { label: 'Details', href: '#details' },
  { label: 'FAQ', href: '#faq' },
];

/** Footer links mirror the header; kept next to them so they stay in sync. */
export const footerLinks: NavLink[] = navLinks;

export interface Step {
  title: string;
  body: string;
}

export const steps: Step[] = [
  {
    title: 'Upload video',
    body: 'Drag an MP4, MOV, MKV, AVI or WebM onto the page, or load the built-in 15-second sample to see it run.',
  },
  {
    title: 'Clip & overlay',
    body: 'Pick 30s, 1m, 2m, 3m or any custom duration, style the text, and watch it composited over the real frame before you commit.',
  },
  {
    title: 'Export ZIP',
    body: 'Clips render in real time with per-clip progress and an ETA. Pause or cancel at any point and keep whatever finished.',
  },
];

export interface Capability {
  label: string;
  detail: string;
}

export const capabilities: Capability[] = [
  {
    label: 'Clip duration',
    detail: '30s / 1m / 2m / 3m presets or any custom value. A short final remainder still becomes its own clip.',
  },
  {
    label: 'Auto increment',
    detail: 'Type "Part - 01" once. Every clip renders the next number, with padding, a start value, prefix and suffix.',
  },
  {
    label: 'Text styling',
    detail: 'Font, size, weight, colour, outline, shadow, letter spacing, rotation, background box, opacity and position.',
  },
  {
    label: 'Multiple layers',
    detail: 'Watermark plus counter plus subtitle at once, each animated and styled independently.',
  },
  {
    label: 'Entry animation',
    detail: 'Fade, slide, zoom or pop, normalised to the clip — so it replays on every segment, not just the first.',
  },
  {
    label: 'Render quality',
    detail: 'Original (100% native), high (85%), medium (65%) or low (45%), with matching bitrate targets.',
  },
  {
    label: 'ZIP export',
    detail: 'One archive with zero-padded filenames, plus per-clip metadata and total size.',
  },
  {
    label: 'Progress & pause',
    detail: 'Per-clip progress with an ETA. Pause mid-clip, resume later, or cancel and keep what finished.',
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: 'Does my video get uploaded?',
    answer:
      'No. The file is read by a video element in your own tab. CLIPPRO is a static site with no server, so there is nowhere for your video to go.',
  },
  {
    question: 'Do I need ffmpeg or a command line?',
    answer:
      'No. Canvas, MediaRecorder and the Web Audio API do the work. If you can open a web page, you can use CLIPPRO.',
  },
  {
    question: 'Why does rendering take as long as the video?',
    answer:
      'Each clip is captured from a canvas in real time, so a 10-minute source takes about 10 minutes. The progress bar shows where you are, and you can pause or cancel.',
  },
  {
    question: 'Which format do I get?',
    answer:
      'Chrome and Edge encode MP4 (H.264). Firefox and Safari have no H.264 encoder and fall back to WebM. Filenames always match the container that was actually produced.',
  },
  {
    question: 'Is there a size limit?',
    answer:
      'No hard one. Clips are held in memory until the ZIP is assembled, so large or 4K sources are bounded by your RAM rather than an arbitrary cap.',
  },
];