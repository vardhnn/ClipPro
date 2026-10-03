import { faqs } from '../site';
import { Section, SectionLabel, SectionTitle } from './ui';

/** Native <details> keeps this accessible and needs no client state. */
export function Faq() {
  return (
    <Section id="faq" className="border-t border-[#1c1c20]">
      <SectionLabel>FAQ</SectionLabel>
      <SectionTitle>The short answers.</SectionTitle>

      <div className="mt-10 max-w-3xl">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group border-t border-[#1c1c20] py-4 last:border-b"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-medium text-white marker:hidden">
              {faq.question}
              <span
                aria-hidden="true"
                className="font-mono text-gray-600 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}