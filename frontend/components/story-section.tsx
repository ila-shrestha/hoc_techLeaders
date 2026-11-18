import type { StorySection } from "@/lib/heritage-data";
import { sourceLabel } from "@/lib/heritage-data";

export function StorySection({ section, index }: { section: StorySection; index: number }) {
  return (
    <section className="story-section">
      <div className="story-section-index">{String(index + 1).padStart(2, "0")}</div>
      <div className="story-section-copy">
        <span className="eyebrow">{section.eyebrow}</span>
        <h2>{section.title}</h2>
        {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <span className={`source-note source-${section.source}`}>{sourceLabel(section.source)}</span>
      </div>
    </section>
  );
}
