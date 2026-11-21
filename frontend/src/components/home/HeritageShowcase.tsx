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

        <div className="relative mt-12">
          {/* Decorative dhaka strips flanking the carousel (desktop) */}
          <div className="pattern-dhaka-light pointer-events-none absolute -left-5 top-0 hidden h-full w-2.5 rounded-full opacity-70 lg:block" />
          <div className="pattern-dhaka-dark pointer-events-none absolute -right-5 top-0 hidden h-full w-2.5 rounded-full opacity-70 lg:block" />

          <HeritageCarousel />

          {/* Ornamental divider below the carousel */}
          <div className="mt-8 flex items-center justify-center gap-3 text-darkred/50" aria-hidden="true">
            <span className="h-px w-16 bg-darkred/30 sm:w-24" />
            <svg width="14" height="14" viewBox="0 0 14 14" className="rotate-45">
              <rect x="2" y="2" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="h-px w-16 bg-darkred/30 sm:w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}
