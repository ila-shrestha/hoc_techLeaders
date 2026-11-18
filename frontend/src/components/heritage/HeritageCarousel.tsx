"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heritageSites } from "@/data/heritage";
import { useLanguage } from "@/i18n/language";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function HeritageCarousel() {
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = heritageSites.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  // Autoplay
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [go, paused]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const site = heritageSites[index];
  const name = lang === "ne" && site.nameNe ? site.nameNe : site.name;
  const summary =
    lang === "ne"
      ? site.summaryNe
      : site.summary;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink shadow-xl md:aspect-[21/9]">
        <div
          key={site.slug}
          className="absolute inset-0 transition-opacity duration-700"
        >
          <PlaceholderImage site={{ ...site, name }} priority={index === 0} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

        {/* Caption card */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-6 sm:flex-row sm:items-end sm:justify-between md:p-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bright">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} — {t.carousel.slide} {t.carousel.of} {count}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-paper md:text-3xl">
              {name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper/80 md:text-base">
              {summary ?? t.showcase.comingSoon}
            </p>
          </div>
          <Link
            href={`/heritage/${site.slug}`}
            className="shrink-0 rounded-full bg-paper px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-mist"
          >
            {site.status === "documented" ? t.showcase.exploreMore : t.showcase.learnMore} →
          </Link>
        </div>

        {/* Arrows */}
        <button
          onClick={() => go(-1)}
          aria-label={t.carousel.previous}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-paper/30 bg-ink/50 p-2.5 text-paper backdrop-blur transition-all hover:bg-darkred hover:border-darkred"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          onClick={() => go(1)}
          aria-label={t.carousel.next}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-paper/30 bg-ink/50 p-2.5 text-paper backdrop-blur transition-all hover:bg-darkred hover:border-darkred"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Indicators */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {heritageSites.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => setIndex(i)}
            aria-label={`${t.carousel.slide} ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-darkred" : "w-2 bg-line hover:bg-mute"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
