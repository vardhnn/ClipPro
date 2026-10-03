import { m } from 'motion/react';
import { site } from '../site';
import { Reveal } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Cta() {
  return (
    <section className="border-t border-[#1c1c20] px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="mx-auto flex w-full max-w-5xl flex-col gap-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Drop in a video, pick a length, download the ZIP.
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Free, MIT licensed, and self-hostable — it builds to a static bundle.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <m.a
            href={site.appPath}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
          >
            Open CLIPPRO
          </m.a>
          <m.a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="rounded-lg border border-[#26262c] px-5 py-3 text-sm text-gray-300 hover:border-[#3a3a44] hover:text-white"
          >
            Source
          </m.a>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#1c1c20] px-5 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono">
          CLIPPRO {site.version} · MIT · React, Canvas &amp; MediaRecorder
        </p>
        <nav className="flex items-center gap-5">
          {[
            { label: 'How it works', href: '#how' },
            { label: 'Details', href: '#details' },
            { label: 'FAQ', href: '#faq' },
          ].map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-gray-300">
              {link.label}
            </a>
          ))}
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