"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { useLanguage } from "@/i18n/language";

export function AboutWard() {
  const { t } = useLanguage();

  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading eyebrow={t.aboutWard.eyebrow} title={t.aboutWard.title} />
        </div>
        <div className="space-y-5 text-base leading-relaxed text-ink-soft md:text-lg">
          <p>{t.aboutWard.p1}</p>
          <p>{t.aboutWard.p2}</p>
          <p className="text-sm italic text-mute">{t.aboutWard.note}</p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 font-medium text-darkred hover:text-maroon"
          >
            {t.aboutWard.link} →
          </Link>
        </div>
      </div>
    </section>
  );
}
