"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { heroVideo } from "@/data/heroSlides";
import { useLanguage } from "@/i18n/language";

/**
 * Homepage heritage video section.
 * Shows a clear placeholder state until the video asset exists —
 * never a broken player.
 */
export function HeritageVideo() {
  const { t } = useLanguage();
  const [available, setAvailable] = useState<boolean | null>(null);

  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow={t.video.eyebrow}
          title={t.video.title}
          description={t.video.description}
        />

        <div className="relative mt-12 aspect-video overflow-hidden rounded-2xl border border-line bg-ink shadow-[0_30px_60px_-20px_rgba(61,0,0,0.4)]">
          {available === false ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-maroon-deep via-maroon to-maroon-dark p-8 text-center">
              <div className="pattern-dhaka absolute inset-0 opacity-60" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 text-2xl text-paper">
                ▶
              </span>
              <p className="relative font-display text-xl text-paper">{t.video.title}</p>
              <p className="relative max-w-md text-sm leading-relaxed text-paper/70">
                {t.video.comingSoon}
              </p>
            </div>
          ) : (
            <video
              className="h-full w-full object-cover"
              poster={heroVideo.poster}
              controls
              playsInline
              preload="metadata"
              onError={() => setAvailable(false)}
              onLoadedMetadata={() => setAvailable(true)}
            >
              <source src={heroVideo.src} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </section>
  );
}
