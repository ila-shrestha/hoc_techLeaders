import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, CircleCheck } from "lucide-react";
import { HeritageCard } from "@/components/heritage-card";
import { SectionHeading } from "@/components/section-heading";
import { documentedSites, futureSites } from "@/lib/heritage-data";

export default function HomePage() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-image" src="/manus-storage/async-images/217bpi8hh9gCRZPXKR96Ca/image-1.webp" alt="Atmospheric editorial placeholder of carved timber, brick, and a brass lamp" />
        <div className="hero-content">
          <span className="eyebrow hero-kicker">Ward 16 · living archive</span>
          <h1 id="hero-title" className="display">Every place holds a story worth carrying forward.</h1>
          <p className="hero-lead">A growing digital field guide to the temples, shrines, practices, and memories that shape the cultural life of Ward 16.</p>
          <div className="hero-actions">
            <Link className="button-primary" href="#explore">Explore heritage <ArrowDownRight size={17} /></Link>
            <span className="hero-caption">Visuals shown are editorial placeholders until field photography is supplied.</span>
          </div>
        </div>
        <div className="hero-rail">Document · preserve · participate</div>
        <div className="hero-bottom-line"><span>Six places in the first collection</span><span>Stories gathered with source care</span></div>
      </section>

      <section className="intro-section" id="about">
        <div className="shell intro-grid">
          <div>
            <span className="eyebrow">01 · About the ward</span>
            <div className="note-card">
              <strong>Archive placeholder</strong>
              <p>The broader historical and geographical introduction to Ward 16 is waiting for verified community documentation. This space is designed to grow without guessing.</p>
            </div>
          </div>
          <div className="intro-copy">
            <h2 className="display">A heritage archive that knows the difference between memory and record.</h2>
            <p>Ward 16 holds places where worship, ritual, everyday life, and local knowledge meet. This first edition makes two documented stories easier to encounter while keeping room for the archive to become more complete.</p>
            <p>Read the accounts, follow the source notes, and return as the collection grows through community participation.</p>
          </div>
        </div>
      </section>

      <div className="pattern-band" aria-hidden="true" />

      <section className="collection-section" id="explore">
        <div className="shell">
          <SectionHeading index="02" eyebrow="Explore heritage" title="Six places. Many ways to remember." copy="Start with the two stories that have documentation today. The rest of the collection is ready for the next chapter." action={<Link className="text-link" href="#preserve">Why preservation matters <ArrowUpRight size={16} /></Link>} />
          <div className="collection-featured">
            {documentedSites.map((site) => <HeritageCard key={site.slug} site={site} featured />)}
          </div>
          <div className="collection-grid">
            {futureSites.map((site) => <HeritageCard key={site.slug} site={site} />)}
          </div>
        </div>
      </section>

      <section className="preservation-section" id="preserve">
        <div className="shell preservation-grid">
          <div className="preservation-heading">
            <span className="eyebrow">03 · Cultural preservation</span>
            <h2 className="display">What we keep, we can pass on.</h2>
            <p>Digital access is one part of preservation. The other part is listening carefully to the people who carry these practices forward.</p>
          </div>
          <div className="preservation-list">
            <div className="preservation-item"><span>01</span><div><h3>Traditional knowledge</h3><p>Make local practices, words, and memories easier to encounter without flattening their meaning.</p></div></div>
            <div className="preservation-item"><span>02</span><div><h3>Generational continuity</h3><p>Give younger generations a clear, respectful starting point for learning about the places around them.</p></div></div>
            <div className="preservation-item"><span>03</span><div><h3>Digital access</h3><p>Bring heritage into a format students, residents, visitors, and researchers can revisit from anywhere.</p></div></div>
            <div className="preservation-item"><span>04</span><div><h3>Community participation</h3><p>Keep the archive open to corrections, contributions, and stories that deserve to be documented next.</p></div></div>
          </div>
        </div>
      </section>

      <section className="pattern-band" aria-hidden="true" />
      <section className="intro-section" aria-label="Archive principles">
        <div className="shell intro-grid">
          <div><span className="eyebrow">A note on sources</span></div>
          <div className="intro-copy"><h2 className="display">Belief, folklore, and history can sit together—when they are named honestly.</h2><p>Throughout the documented stories, source labels separate interview accounts, community beliefs, folklore, and information still awaiting verification. That distinction is part of the design, not a footnote.</p><Link className="text-link" href="/heritage/siddhi-ganesh">Read the first story <ArrowUpRight size={16} /></Link></div>
        </div>
      </section>
    </main>
  );
}
