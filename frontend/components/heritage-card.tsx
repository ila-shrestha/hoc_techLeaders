import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import type { HeritageSite } from "@/lib/heritage-data";

export function HeritageCard({ site, featured = false }: { site: HeritageSite; featured?: boolean }) {
  return (
    <article className={`heritage-card ${featured ? "heritage-card-featured" : ""} ${!site.documented ? "heritage-card-pending" : ""}`}>
      <div className="card-image-wrap">
        <img src={site.image} alt={site.imageAlt} loading="lazy" />
        <span className="card-status">{site.documented ? "Documented story" : "Coming soon"}</span>
      </div>
      <div className="card-content">
        <div className="card-meta"><span>{site.type}</span>{!site.documented ? <LockKeyhole size={14} aria-label="Documentation pending" /> : null}</div>
        <h3>{site.name}</h3>
        <p>{site.cardDescription}</p>
        {site.documented ? (
          <Link className="text-link" href={`/heritage/${site.slug}`}>Explore the story <ArrowUpRight size={16} /></Link>
        ) : (
          <span className="text-link text-link-muted">More information coming soon</span>
        )}
      </div>
    </article>
  );
}
