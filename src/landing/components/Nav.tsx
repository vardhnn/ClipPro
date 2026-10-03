import { useEffect, useState } from 'react';
import { AnimatePresence, m, useScroll, useSpring } from 'motion/react';
import { Brand } from '../../components/Brand';
import { chip, control, surface, cx } from '../../theme';
import { navLinks, site } from '../site';

/**
 * The same header the app uses, plus the things a website needs: anchored
 * navigation, a reading-progress hairline, and a sheet on small screens.
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

  // Close the sheet once the viewport grows past the breakpoint it targets.
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
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled && cx('border-b border-[#222] bg-[#0a0a0c]/85 backdrop-blur-md')
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex-shrink-0">
          <Brand version={site.version} />
        </a>

        <ul className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded px-3 py-2 text-xs font-mono uppercase tracking-wider text-gray-400 transition-colors hover:bg-[#16161a] hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-shrink-0 items-center gap-2">
          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={cx(chip.base, chip.mono, 'hidden md:inline-flex')}
          >
            GitHub
          </a>
          <m.a
            href={site.appPath}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={cx(control.primary, 'inline-flex items-center gap-1.5')}
          >
            Open app
          </m.a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex size-8 flex-col items-center justify-center gap-[5px] rounded border border-[#333] bg-[#22222a] sm:hidden"
          >
            <m.span
              animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-px w-4 bg-gray-300"
            />
            <m.span
              animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-px w-4 bg-gray-300"
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
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={cx('overflow-hidden border-t border-[#222] sm:hidden', surface.footer)}
          >
            <ul className="px-4 py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-gray-400 hover:bg-[#16161a] hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>

      <m.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="h-px origin-left bg-blue-600"
      />
    </m.header>
  );
}