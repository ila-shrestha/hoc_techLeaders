"use client";

import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useLanguage } from "@/i18n/language";
import type { HeritageDetail, HeritageSite } from "@/data/types";

export function DetailHero({
  site,
  detail,
}: {
  site: HeritageSite;
  detail?: HeritageDetail;
}) {
  const { lang } = useLanguage();
  const name =
    lang === "ne" && detail?.ne ? detail.ne.name : site.name;
  const summary =
    lang === "ne" && detail?.ne ? detail.ne.summary : site.summary;

  return (
    <section className="relative bg-ink">
      <div className="absolute inset-0 opacity-30">
        <PlaceholderImage site={{ ...site, name }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 md:pb-28 md:pt-32">
        <span className="mb-4 inline-block rounded-full border border-bright/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-paper/90">
          Ward 16 Heritage
        </span>
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-paper sm:text-5xl md:text-6xl">
          {name}
        </h1>
        {summary && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/80">
            {summary}
          </p>
        )}
      </div>
    </section>
  );
}
