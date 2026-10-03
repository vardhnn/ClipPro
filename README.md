# CLIPPRO — Automatic Video Clip Generator

Split a long video into equal-duration clips, burn in sequential text overlays
(`Part - 01`, `Part - 02`, …), and download the whole batch as a ZIP.

**Everything runs in your browser.** No uploads, no server, no ffmpeg, no API keys,
no account. Your video never leaves the tab it was opened in.

![Stack](https://img.shields.io/badge/React-19-61dafb) ![Stack](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Stack](https://img.shields.io/badge/Vite-6-646cff) ![Stack](https://img.shields.io/badge/Tailwind-4-38bdf8) ![License](https://img.shields.io/badge/license-MIT-10b981)

---

## Features

- **Drag-and-drop upload** for MP4, MOV, MKV, AVI and WebM, with a generated
  15-second sample video so you can try the app without a file on hand.
- **Clip duration presets** — 30s / 1m / 2m / 3m, or any custom length. A short
  final remainder becomes the last clip instead of being dropped.
- **Auto-incrementing text overlays** — write `Part - 01` once and every clip
  gets the next number. Zero-padding, custom start value, prefix and suffix are
  all configurable.
- **Full overlay styling** — font family, size, weight, colour, stroke/outline,
  drop shadow, letter spacing, rotation, background box, opacity and position
  anywhere on the frame.
- **Five entry animations** — none, fade, slide, zoom and pop, normalised to
  each clip so they replay on every segment.
- **Render quality control** — original (100% native), high (85%), medium (65%)
  or low (45%) resolution, with matching bitrate targets.
- **Multi-layer overlays** and a live preview canvas showing exactly how the text
  will be composited.
- **ZIP export** of every generated clip, with per-clip metadata and total size.
- **Progress, pause and cancel** during rendering, plus an ETA.
- **Dark/light themes** and keyboard shortcuts (`Ctrl/⌘ + G` to render,
  `Esc` to cancel).

## How it works

| Stage | What happens |
| --- | --- |
| Inspect | A detached `<video>` element reads duration, dimensions and a poster frame. |
| Render | The source is seeked to each clip's start, then frames are painted into a `<canvas>` with the overlay text drawn on top, in real time. |
| Capture | `canvas.captureStream()` plus an audio track from the Web Audio API feed a `MediaRecorder`. Audio is routed through a `MediaStreamDestination` and never reaches your speakers. |
| Package | The resulting blobs are stored uncompressed in a ZIP via JSZip and handed to a download link. |

Because clips are rendered in real time, a 10-minute source takes roughly
10 minutes to process. Chrome and Edge encode to MP4 (H.264); browsers without
an H.264 encoder fall back to WebM, and the clip filenames follow the container
that was actually produced.

## Getting started

Requires **Node.js 20+**.

```bash
# install dependencies
bun install        # or: npm install

# start the dev server on http://localhost:3000
bun run dev        # or: npm run dev
```

Other scripts:

```bash
bun run build      # production bundle into dist/
bun run preview    # serve the production build locally
bun run typecheck  # tsc --noEmit (strict)
```

## Pages

The app is built as two independent HTML entries so a visitor who only came to
read the landing page never downloads the render engine:

| Route | Entry | What it is |
| --- | --- | --- |
| `/` | `index.html` | Marketing page — hero, a live demo of the real overlay renderer, and docs. |
| `/app` | `app.html` | The clip generator itself. |

`/app` is a clean URL: Vite rewrites it in dev, and [vercel.json](vercel.json)
does the same in production. Both entries share `src/index.css` and the
`src/utils/` render engine, so the demo on the landing page is the same code the
app runs — not a mockup.

## Deploy

The build output is a plain static bundle in `dist/`. There is no backend,
environment variable or build step to configure.

### Vercel

[vercel.json](vercel.json) is already set up (framework preset, `dist` output,
the `/app` rewrite and cache headers), so the dashboard needs no configuration:

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

Or import the repository at [vercel.com/new](https://vercel.com/new) — it detects
Vite and builds with `npm run build`.

### GitHub Pages

Pages does not support rewrites, so point the landing page's "Open app" links at
`/app.html` instead of `/app`, or add a `404.html` that redirects `/app`. Build
with `bun run build` and publish `dist/` from the `gh-pages` branch.

Any other static host (Netlify, Cloudflare Pages) just needs `dist/` and the same
single rewrite rule.

## Design tokens

`src/theme.ts` holds the product's visual language — page surface, panel and inset
backgrounds, status chips, the blue icon tile, and every button and input style —
so the landing page and the tool cannot drift apart. Change a colour there and both
change together. Fonts are the system sans plus `font-mono` for labels and
metadata; no webfont is shipped.

## Tech stack

React 19 · TypeScript (strict) · Vite 6 · Tailwind CSS 4 · JSZip · lucide-react.
Motion is loaded through `LazyMotion` with only the DOM animation features the
landing page uses, and every effect respects `prefers-reduced-motion`.

```
src/
├── App.tsx                  # state machine + layout
├── types.ts                 # shared domain types
├── components/              # uploader, clip settings, overlay editor, modals
├── theme.ts                 # shared design tokens — surfaces, chips, controls
├── components/Brand.tsx     # wordmark, used by the app header and the landing page
├── landing/                 # marketing page (its own entry: /src/landing/main.tsx)
│   ├── site.ts              # all landing copy + links
│   └── components/          # nav, backdrop, hero, live demo, details, FAQ, footer
└── utils/
    ├── clipProcessor.ts     # render engine: seek → canvas → MediaRecorder
    ├── videoUtils.ts        # metadata, sample video, canvas text rendering
    └── zipUtils.ts          # ZIP packaging + download trigger
```

## Browser support

Chrome and Edge get the full experience. Firefox and Safari work but emit WebM
instead of MP4, since they lack an H.264 `MediaRecorder` encoder. Rendering
requires `canvas.captureStream()`, `MediaRecorder` and Web Audio.

## Known limitations

- Rendering is real-time; there is no faster-than-realtime mode.
- Renders at up to the source resolution — very large 4K sources are slow and
  memory-hungry, since all clips are held in memory until the ZIP is built.
- Codec support and bitrate control depend on the browser's `MediaRecorder`.

## Contributing

Issues and pull requests are welcome. Before opening one:

```bash
bun run typecheck
bun run build
```

## License

MIT © CLIPPRO