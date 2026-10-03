import { m } from 'motion/react';
import { CheckCircle, Download, Github } from 'lucide-react';
import { Brand } from '../../components/Brand';
import { control, layout, surface, cx } from '../../theme';
import { footerLinks, site } from '../site';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Echoes the app's "clips ready" export banner. */
export function Cta() {
  return (
    <section className={layout.section}>
      <div className={layout.container}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-72px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className={cx(surface.panel, 'border-blue-600/40 p-5 shadow-xl sm:p-6')}
        >
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex size-10 items-center justify-center rounded bg-emerald-950/50 border border-emerald-800/50 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Drop in a video, pick a length, download the ZIP.
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Free, MIT licensed, and self-hostable — it builds to a static bundle.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
          <m.a
            href={site.appPath}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={cx(control.primary, 'flex items-center justify-center gap-2 px-5 py-2.5')}
          >
            <Download className="w-4 h-4" />
            Open CLIPPRO
          </m.a>
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={cx(
              control.secondary,
              'flex items-center justify-center gap-1.5 px-5 py-2.5'
            )}
          >
            <Github className="h-3.5 w-3.5" />
            Source
          </a>
          </div>
        </div>
        </m.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={cx(surface.footer, 'relative z-10 px-4 py-5 sm:px-6 lg:px-8')}>
      <div className={cx(layout.container, 'flex flex-col items-center gap-3 text-xs text-gray-400 sm:flex-row sm:justify-between')}>
        <Brand />
        <p className="font-mono text-[11px] text-gray-500">
          © {new Date().getFullYear()} CLIPPRO — Automatic Video Clip Splitter &amp;
          Sequential Overlay Engine
        </p>
        <nav className="flex items-center gap-4 font-mono text-[11px]">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}