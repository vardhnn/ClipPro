import { site } from '../site';

/**
 * Minimal sticky header: brand, three anchors, source link. No scroll listener
 * and no mobile drawer — the anchor row collapses instead.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1c1c20] bg-[#0a0a0c]/90 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-white">
            CLIP<span className="text-blue-500">PRO</span>
          </span>
          <span className="font-mono text-[10px] text-gray-600">{site.version}</span>
        </a>

        <ul className="hidden items-center gap-6 sm:flex">
          {[
            { label: 'How it works', href: '#how' },
            { label: 'Details', href: '#details' },
            { label: 'FAQ', href: '#faq' },
          ].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-4">
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden text-sm text-gray-400 transition-colors hover:text-white md:inline"
          >
            GitHub
          </a>
          <a
            href={site.appPath}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Open app
          </a>
        </div>
      </nav>
    </header>
  );
}