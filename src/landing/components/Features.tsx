import { Settings2 } from 'lucide-react';
import { capabilities } from '../site';
import { RevealGroup, RevealItem, SectionHead } from './ui';
import { cx, surface } from '../../theme';

/**
 * One panel per capability, in the app's card idiom — same surface, same border,
 * same hover treatment the generated-clip cards use.
 */
export function Features() {
  return (
    <section id="details" className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHead
          icon={Settings2}
          label="Details"
          title="Clip duration, overlay and export settings."
        />

        <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((item) => (
            <RevealItem key={item.label}>
              <article
                className={cx(
                  surface.panel,
                  'flex h-full flex-col gap-2 p-4 transition hover:border-blue-500/50'
                )}
              >
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400">
                  {item.label}
                </p>
                <p className="text-xs leading-relaxed text-gray-400">{item.detail}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}