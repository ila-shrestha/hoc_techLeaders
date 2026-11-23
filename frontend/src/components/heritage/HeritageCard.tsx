"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { HeritageSite } from "@/data/types";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useLanguage } from "@/i18n/language";

export function HeritageCard({ site }: { site: HeritageSite }) {
  const { lang, t } = useLanguage();
  const documented = site.status === "documented";
  const name = lang === "ne" && site.nameNe ? site.nameNe : site.name;
  const summary = lang === "ne" ? site.summaryNe : site.summary;
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -16, y: px * 20 });
  }

  return (
    <Link
      ref={cardRef}
      href={`/heritage/${site.slug}`}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="card-3d group perspective-1000 block overflow-hidden rounded-2xl border border-line bg-paper"
      style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="window-frame absolute inset-3 z-10 rounded-sm border-[6px] border-maroon-dark/70" />
        <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
          <PlaceholderImage site={{ ...site, name }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {site.featured && (
          <span className="absolute left-4 top-4 z-20 rounded-full bg-bright px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-paper shadow-lg">
            {t.showcase.featured}
          </span>
        )}
        <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-sm font-semibold text-paper">
            {documented ? t.showcase.exploreMore : t.showcase.learnMore} →
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-darkred">
          {name}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-ink-soft">
          {summary ?? t.showcase.comingSoon}
        </p>
      </div>
    </Link>
  );
}
