import { site } from '../site';

export function Cta() {
  return (
    <section className="border-t border-[#1c1c20] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Drop in a video, pick a length, download the ZIP.
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Free, MIT licensed, and self-hostable — it builds to a static bundle.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <a
            href={site.appPath}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Open CLIPPRO
          </a>
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg border border-[#26262c] px-5 py-2.5 text-sm text-gray-300 transition-colors hover:border-[#3a3a44] hover:text-white"
          >
            Source
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#1c1c20] px-5 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          CLIPPRO {site.version} · MIT · React, Canvas &amp; MediaRecorder
        </p>
        <nav className="flex items-center gap-5">
          <a href="#how" className="transition-colors hover:text-gray-300">
            How it works
          </a>
          <a href="#faq" className="transition-colors hover:text-gray-300">
            FAQ
          </a>
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-gray-300"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}