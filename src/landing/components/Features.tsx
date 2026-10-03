import { capabilities } from '../site';
import { Section, SectionLabel, SectionTitle } from './ui';

export function Features() {
  return (
    <Section id="details" className="border-t border-[#1c1c20]">
      <SectionLabel>Details</SectionLabel>
      <SectionTitle>What it actually does.</SectionTitle>

      <dl className="mt-10 grid gap-x-12 gap-y-7 sm:grid-cols-2">
        {capabilities.map((item) => (
          <div key={item.label} className="border-t border-[#1c1c20] pt-4">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500">
              {item.label}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-gray-400">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}