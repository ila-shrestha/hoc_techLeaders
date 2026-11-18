"use client";

import Link from "next/link";
import { HeritageCard } from "@/components/heritage/HeritageCard";
import { getRelatedSites } from "@/data";
import { useLanguage } from "@/i18n/language";

export function RelatedSites({ slugs }: { slugs: string[] }) {
  const { t } = useLanguage();
  const sites = getRelatedSites(slugs);
  if (sites.length === 0) return null;
  return (
    <section className="bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
          {t.detail.related}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sites.map((site) => (
            <HeritageCard key={site.slug} site={site} />
          ))}
        </div>
        <Link
          href="/heritage"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-darkred hover:text-maroon"
        >
          {t.detail.viewAll} →
        </Link>
      </div>
    </section>
  );
}
