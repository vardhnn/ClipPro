import { steps } from '../site';
import { Section, SectionLabel, SectionTitle } from './ui';

export function Workflow() {
  return (
    <Section id="how" className="border-t border-[#1c1c20]">
      <SectionLabel>How it works</SectionLabel>
      <SectionTitle>Three steps, no setup.</SectionTitle>

      <ol className="mt-10 max-w-3xl">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col gap-2 border-t border-[#1c1c20] py-6 sm:flex-row sm:gap-8"
          >
            <span className="font-mono text-xs text-gray-600 sm:w-8 sm:shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-sm font-medium text-white">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}