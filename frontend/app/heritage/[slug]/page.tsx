import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CircleCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { LocationPanel, PullQuote, VideoPlaceholder } from "@/components/story-support";
import { ImageFrame } from "@/components/image-frame";
import { SectionHeading } from "@/components/section-heading";
import { StorySection } from "@/components/story-section";
import { getHeritageSite, heritageSites } from "@/lib/heritage-data";

export function generateStaticParams() {
  return heritageSites.filter((site) => site.documented).map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const site = getHeritageSite(slug);
  if (!site) return { title: "Heritage story" };
  return { title: site.name, description: site.shortDescription };
}

export default async function HeritageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getHeritageSite(slug);
  if (!site || !site.documented) notFound();
  const relatedSites = site.related.map((relatedSlug) => getHeritageSite(relatedSlug)).filter((related): related is NonNullable<typeof related> => Boolean(related));

  return (
    <main>
      <section className="story-hero">
        <div className="shell">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Heritage stories</span><span>/</span><span>{site.name}</span></div>
          <div className="story-hero-grid">
            <div>
              <span className="eyebrow hero-kicker">{site.type}</span>
              <h1 className="display">{site.name}</h1>
              <p className="story-intro">{site.intro}</p>
            </div>
            <ImageFrame className="story-hero-image" src={site.image} alt={site.imageAlt} label="Editorial visual placeholder · field image to be added" />
          </div>
        </div>
      </section>

      <section className="story-body">
        <div className="shell story-layout">
          <aside className="story-aside">
            <span className="eyebrow">A considered record</span>
            <h2>Read with context.</h2>
            <p>This page keeps the documented account close to its source and marks community beliefs, interview recollections, and folklore as such.</p>
            <div className="aside-rule" />
            <div className="source-legend" aria-label="Source legend">
              <span><CircleCheck size={13} /> Interview account</span>
              <span><CircleCheck size={13} /> Community belief</span>
              <span><CircleCheck size={13} /> Local folklore</span>
            </div>
          </aside>
          <div className="story-content">
            {site.sections.map((section, index) => <StorySection key={section.title} section={section} index={index} />)}

            <div className="ritual-panel">
              <span className="eyebrow">Practice &amp; visitation</span>
              <h3>What the documentation names</h3>
              <ul className="ritual-list">{site.rituals.map((ritual) => <li key={ritual}>{ritual}</li>)}</ul>
            </div>

            <PullQuote>{site.slug === "siddhi-ganesh" ? "Preservation is not only the story of a structure. It is the story of the people who keep returning." : "A site's meaning can become quiet without disappearing. Documentation gives it another way to be heard."}</PullQuote>

            <div className="gallery-block">
              <SectionHeading index="Gallery" eyebrow="Visual notes" title="A place in details." copy="These visuals are editorial placeholders. Verified field photography and community-approved captions can be added without changing the story structure." />
              <div className="gallery-grid">{site.gallery.map((item) => <ImageFrame key={item.label} src={item.image} alt={item.alt} label={item.label} />)}</div>
            </div>

            <VideoPlaceholder siteName={site.name} />
            <LocationPanel site={site} />

            <div className="references-block">
              <span className="eyebrow">References &amp; sources</span>
              <h3>Where this story comes from</h3>
              <ul>{site.sources.map((source) => <li key={source}>{source}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="related-section">
        <div className="shell">
          <SectionHeading eyebrow="Continue exploring" title="More from the collection" copy="The archive is designed as a connected set of stories rather than a set of isolated pages." />
          <div className="related-grid">{relatedSites.map((related) => <Link className="related-link" key={related.slug} href={`/heritage/${related.slug}`}><span>{related.name}</span><ArrowUpRight size={20} /></Link>)}</div>
          <Link className="text-link" href="/#explore" style={{ marginTop: 35 }}>Back to all heritage locations <ArrowLeft size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
