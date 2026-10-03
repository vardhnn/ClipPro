import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';

import { faqs } from '../site';
import { Reveal, SectionHead } from './ui';
import { cx, layout, surface, text } from '../../theme';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Single-open accordion in the app's modal-panel styling. */
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={layout.section}>
      <div className={layout.container}>
        <SectionHead label="FAQ" title="The short answers." />

        <div className="mt-6 grid gap-3 lg:grid-cols-2 lg:items-stretch">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <Reveal key={faq.question} delay={index * 0.05} y={10} className="h-full">
                <div
                  className={cx(
                    surface.panel,
                    'h-full overflow-hidden transition-colors',
                    isOpen && 'border-blue-800/50'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-gray-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cx(
                          text.body,
                          'font-semibold transition-colors',
                          isOpen ? 'text-white' : 'text-gray-200 hover:text-white'
                        )}
                      >
                        {faq.question}
                      </span>
                    </span>
                    <m.span
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="flex-shrink-0 font-mono text-sm text-gray-500"
                    >
                      +
                    </m.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className={cx('border-t border-[#222] px-4 py-3 leading-relaxed text-gray-400', text.body)}>
                          {faq.answer}
                        </p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}