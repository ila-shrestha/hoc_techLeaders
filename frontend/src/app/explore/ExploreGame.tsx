
"use client";

import Link from "next/link";
import { Gamepad2 } from "lucide-react";
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

        {/* Interactive game icon */}
        <div className="mt-4 flex max-w-2xl justify-end">
          <Link
            href="/explore"
            aria-label="Start interactive heritage exploration"
            title="Start interactive exploration"
            className="gamepad-pulse flex h-12 w-12 items-center justify-center rounded-full border-2 border-green-600 bg-green-50 text-yellow-500 transition-transform hover:scale-110"
          >
            <Gamepad2 size={25} strokeWidth={2.5} />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {heritageSites.map((site) => (
            <HeritageCard key={site.slug} site={site} />
          ))}
        </div>
      </div>
    </div>
  );
}
