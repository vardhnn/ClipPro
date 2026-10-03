import { m, useReducedMotion } from 'motion/react';
import { steps } from '../site';
import { RevealGroup, RevealItem, SectionHead } from './ui';

export function Workflow() {
  const reduce = useReducedMotion();

  return (
    <section id="how" className="border-t border-[#1c1c20] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <SectionHead label="How it works" title="Three steps, no setup." />

        <RevealGroup className="mt-12 max-w-4xl">
          {steps.map((step, index) => (
            <RevealItem key={step.title}>
              <div className="grid grid-cols-[2.25rem_1fr] gap-x-4 border-t border-[#1c1c20] py-7 sm:grid-cols-[3rem_1fr] sm:gap-x-6">
                <m.span
                  initial={{ opacity: 0, x: reduce ? 0 : -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="font-mono text-xs leading-6 text-gray-600"
                >
                  {String(index + 1).padStart(2, '0')}
                </m.span>
                <div>
                  <h3 className="text-sm font-medium text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}