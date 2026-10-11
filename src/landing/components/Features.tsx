
import { capabilities } from '../site';
import { RevealGroup, RevealItem, SectionHead } from './ui';
import { cx, layout, surface, text } from '../../theme';

/**
 * One panel per capability, in the app's card idiom — same surface, same border,
 * same hover treatment the generated-clip cards use.
 */
export function Features() {
  return (
    <section id="details" className={layout.section}>
      <div className={layout.container}>
        <SectionHead

          label="Details"
          title="Clip duration, overlay and export settings."
        />

        <RevealGroup className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {capabilities.map((item) => (
            <RevealItem key={item.label}>
              <article
                className={cx(
                  surface.panel,
                  'flex h-full flex-col items-center gap-2 p-4 text-center transition hover:border-blue-500/50'
                )}
              >
                <p className={cx(text.cardTitle, 'text-blue-400')}>{item.label}</p>
                <p className={text.cardBody}>{item.detail}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}