import { useEffect, useState } from 'react';
import { AnimatePresence, m, useScroll, useSpring } from 'motion/react';
import { navLinks, site } from '../site';

/**
 * A website header, not an app bar: thin, transparent until you scroll, with a
 * reading-progress hairline pinned to its bottom edge. The mobile menu is a
 * spring-driven sheet instead of a state swap.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the sheet if the viewport grows past the breakpoint it targets.
  useEffect(() => {
    if (!open) return;
    const onResize = () => window.innerWidth >= 640 && setOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  return (
    <m.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-[#1c1c20] bg-[#0a0a0c]/80 backdrop-blur-xl' : ''
      }`}
    >
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <m.span
            whileHover={{ rotate: -90 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid size-6 place-items-center rounded-[5px] bg-blue-600 text-[10px] font-bold text-white"
          >
            C
          </m.span>
          <span className="text-sm font-semibold tracking-tight text-white">
            CLIP<span className="text-blue-500">PRO</span>
          </span>
          <span className="hidden font-mono text-[10px] text-gray-600 sm:inline">
            {site.version}
          </span>
        </a>

        <ul className="hidden items-center gap-7 sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative py-1 text-sm text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-5">
          <m.a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
            className="hidden text-sm text-gray-400 transition-colors hover:text-white md:inline"
          >
            GitHub
          </m.a>
          <m.a
            href={site.appPath}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white"
          >
            Open app
          </m.a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-1 flex size-9 flex-col items-center justify-center gap-[5px] sm:hidden"
          >
            <m.span
              animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-px w-5 bg-gray-300"
            />
            <m.span
              animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-px w-5 bg-gray-300"
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#1c1c20] bg-[#0a0a0c]/95 backdrop-blur-xl sm:hidden"
          >
            <ul className="flex flex-col px-5 py-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base text-gray-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.repositoryUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-gray-300"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>

      <m.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="h-px origin-left bg-blue-500"
      />
    </m.header>
  );
}