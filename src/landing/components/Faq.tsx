import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { faqs } from '../site';
import { Reveal, SectionHead } from './ui';

const EASE = [0.22, 1, 0.36, 1] as const;

/** A single-open accordion; the panel animates its own height. */
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-[#1c1c20] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <SectionHead label="FAQ" title="The short answers." />

        <div className="mt-12 max-w-3xl">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <Reveal key={faq.question} delay={index * 0.05} y={10}>
                <div className="border-t border-[#1c1c20]">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={`text-sm font-medium transition-colors sm:text-base ${
                        isOpen ? 'text-white' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {faq.question}
                    </span>
                    <m.span
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="shrink-0 font-mono text-gray-600"
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
                        transition={{ duration: 0.36, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-6 text-sm leading-relaxed text-gray-400">
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