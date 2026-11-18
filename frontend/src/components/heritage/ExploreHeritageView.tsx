"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeritageCard } from "@/components/heritage/HeritageCard";
import { heritageSites } from "@/data/heritage";
import { useLanguage } from "@/i18n/language";

export function ExploreHeritageView() {
  const { t } = useLanguage();
  return (
    <div className="bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.explorePage.eyebrow}
          title={t.explorePage.title}
          description={t.explorePage.description}
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {heritageSites.map((site) => (
            <HeritageCard key={site.slug} site={site} />
          ))}
        </div>
      </div>
    </div>
  );
}
