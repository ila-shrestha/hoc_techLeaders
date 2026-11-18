"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/i18n/language";

export function AboutView() {
  const { t } = useLanguage();
  return (
    <div className="bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.aboutPage.eyebrow} title={t.aboutPage.title} />
        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink-soft md:text-lg">
          <p>{t.aboutPage.p1}</p>
          <p>{t.aboutPage.p2}</p>
          <p className="rounded-lg border-l-4 border-darkred bg-mist px-4 py-3 text-sm italic">
            {t.aboutPage.note}
          </p>
        </div>
      </div>
    </div>
  );
}
