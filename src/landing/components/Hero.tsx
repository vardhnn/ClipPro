import { site } from '../site';

/**
 * Deliberately one column and left-aligned: the live demo below is the only
 * visual on the page, so the headline does not have to compete with a mockup.
 */
export function Hero() {
  return (
    <section id="top" className="px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
      <div className="mx-auto w-full max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-600">
          Automatic video clip generator
        </p>

        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Cut one long video into numbered clips, in your browser.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
          CLIPPRO splits a video into fixed-length segments, burns an
          auto-incrementing overlay into each one, and hands back a single ZIP.
          Rendering happens on your machine with Canvas and MediaRecorder — no
          upload, no ffmpeg, no API key.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={site.appPath}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Start clipping
          </a>
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm text-gray-400 underline decoration-gray-700 underline-offset-4 transition-colors hover:text-white hover:decoration-gray-500"
          >
            View source on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}