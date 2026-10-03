import { capabilities } from '../site';
import { RevealGroup, RevealItem, SectionHead } from './ui';

export function Features() {
  return (
    <section id="details" className="border-t border-[#1c1c20] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <SectionHead label="Details" title="What it actually does." />

        <RevealGroup className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {capabilities.map((item) => (
            <RevealItem key={item.label}>
              <div className="border-t border-[#1c1c20] pt-4">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500">
                  {item.label}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-400">{item.detail}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}