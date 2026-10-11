import { Upload, Scissors, Package } from 'lucide-react';
import { steps } from '../site';
import { RevealGroup, RevealItem, SectionHead } from './ui';
import { cx, layout, numeral, surface, text } from '../../theme';

const ICONS = [Upload, Scissors, Package];

/**
 * The same three-step workflow bar the app opens with, so the landing page
 * shows the reader the actual sequence rather than a paraphrase of it.
 */
export function Workflow() {
  return (
    <section id="how" className={layout.section}>
      <div className={layout.container}>
        <SectionHead label="How it works" title="Three steps, no setup." />

        <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = ICONS[index];
            const active = index === 0;

            return (
              <RevealItem key={step.title}>
                <article
                  className={cx(
                    surface.panel,
                    'flex h-full flex-col items-center gap-2.5 p-3 text-center transition',
                    active ? 'border-blue-800/50' : 'hover:border-[#333]'
                  )}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span
                      className={cx(
                        numeral.base,
                        active ? numeral.active : numeral.idle
                      )}
                    >
                      {index + 1}
                    </span>
                    <p
                      className={cx(
                        text.cardTitle,
                        'flex items-center gap-1.5',
                        active ? 'text-blue-400' : 'text-gray-400'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {step.title}
                    </p>
                  </div>

                  <p className={cx('text-center', text.cardBody)}>{step.body}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}