"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeritageCarousel } from "@/components/heritage/HeritageCarousel";
import { useLanguage } from "@/i18n/language";

export function HeritageShowcase() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={t.showcase.eyebrow}
            title={t.showcase.title}
            description={t.showcase.description}
          />
          <Link
            href="/heritage"
            className="shrink-0 text-sm font-medium text-darkred hover:text-maroon"
          >
            {t.showcase.viewAll} →
          </Link>
        </div>

        <div className="mt-12">
          <HeritageCarousel />
        </div>
      </div>
    </section>
  );
}
