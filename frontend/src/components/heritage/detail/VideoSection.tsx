"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/i18n/language";
import type { HeritageVideo } from "@/data/types";

export function VideoSection({ videos }: { videos: HeritageVideo[] }) {
  const { t } = useLanguage();
  if (videos.length === 0) return null;
  return (
    <section className="bg-paper py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.detail.videoEyebrow} title={t.detail.videoTitle} />
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {videos.map((video, i) => (
            <div key={i}>
              <div className="flex aspect-video items-center justify-center rounded-xl border border-line bg-ink text-center">
                {video.url ? (
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="h-full w-full rounded-xl"
                    allowFullScreen
                  />
                ) : (
                  <div className="px-6">
                    <span className="text-3xl text-bright">▶</span>
                    <p className="mt-3 text-sm text-paper/70">
                      {t.detail.videoComingSoon}
                    </p>
                  </div>
                )}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {video.title}
              </h3>
              {video.description && (
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {video.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
