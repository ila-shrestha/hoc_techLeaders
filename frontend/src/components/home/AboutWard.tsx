
"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { useLanguage } from "@/i18n/language";

export function AboutWard() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28">

      {/* Background image */}
      <img
        src="/images/dhaka.jpeg"
        alt="Traditional Dhaka heritage architecture"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-white/65" />

      {/* Content */}
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">

        <div>
          <SectionHeading
            eyebrow={t.aboutWard.eyebrow}
            title={t.aboutWard.title}
          />
        </div>

        <div className="space-y-5 text-base font-medium leading-relaxed text-[#183D2B] md:text-lg">

          <p>{t.aboutWard.p1}</p>

          <p>{t.aboutWard.p2}</p>

          <p className="text-sm italic text-[#31543C]">
            {t.aboutWard.note}
          </p>

          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 font-bold text-[#174D35] transition-colors hover:text-[#00A6C7]"
          >
            {t.aboutWard.link} →
          </Link>

        </div>
      </div>
    </section>
  );
}
