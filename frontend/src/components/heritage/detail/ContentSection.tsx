import type { HeritageSection } from "@/data/types";

/**
 * Renders one documented section. The parent passes already-localized
 * content (English or Nepali) so this component stays language-agnostic.
 */
export function ContentSection({ section }: { section: HeritageSection }) {
  return (
    <section id={section.id} className="scroll-mt-24 border-b border-line/70 py-10 last:border-b-0 md:py-14">
      <div className="max-w-3xl">
        {section.eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-darkred">
            {section.eyebrow}
          </span>
        )}
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          {section.title}
        </h2>
        <div className="mt-5 space-y-4">
          {section.blocks.map((block, i) => (
            <div key={i}>
              {block.heading && (
                <h3 className="mb-2 font-display text-lg font-medium text-ink">
                  {block.heading}
                </h3>
              )}
              {block.paragraphs.map((p, j) => (
                <p key={j} className="text-base leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
              {block.list && (
                <ul className="mt-3 space-y-2">
                  {block.list.map((item, k) => (
                    <li key={k} className="flex gap-3 text-base leading-relaxed text-ink-soft">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-darkred" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        {section.note && (
          <p className="mt-5 rounded-lg border-l-4 border-darkred bg-mist px-4 py-3 text-sm italic leading-relaxed text-ink-soft">
            {section.note}
          </p>
        )}
      </div>
    </section>
  );
}
