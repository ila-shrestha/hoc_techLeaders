"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { heroSlides } from "@/data/heroSlides";

/**
 * Postcard-style heritage photo carousel for the hero.
 * The active photograph sits large in the centre; neighbouring photos
 * peek out behind it with paper frames, rotation and depth.
 *
 * Only renders slides whose image files actually exist — missing
 * photographs are filtered out silently so no broken URLs appear.
 *
 * Dispatches `hoc:hero-slide` on every slide change (manual or
 * automatic) so the navbar can replay its logo-first animation.
 */
export function HeroCarousel() {
  const [slides, setSlides] = useState<typeof heroSlides>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const mounted = useRef(false);
  const count = slides.length;

  useEffect(() => {
    let alive = true;
    Promise.all(
      heroSlides.map(
        (s) =>
          new Promise<typeof s | null>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(s);
            img.onerror = () => resolve(null);
            img.src = s.src;
          }),
      ),
    ).then((results) => {
      if (alive)
        setSlides(results.filter((s): s is NonNullable<typeof s> => s !== null));
    });
    return () => {
      alive = false;
    };
  }, []);

  // Notify listeners (navbar) whenever the visible slide actually changes
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.dispatchEvent(
      new CustomEvent("hoc:hero-slide", { detail: { index } }),
    );
  }, [index]);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );
  const goTo = useCallback((i: number) => setIndex(i), []);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [go, paused, count]);

  if (count === 0) return null;
  const single = count === 1;

  /** role of a slide relative to the active index: 0 centre, ±1 neighbours */
  function role(i: number): number {
    const diff = (i - index + count) % count;
    if (diff === 0) return 0;
    if (diff === 1) return 1; // next → right
    if (diff === count - 1) return -1; // prev → left
    return 99;
  }

  const cardClass =
    "absolute left-1/2 top-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

  return (
    <div
      className="relative mx-auto h-[380px] w-full max-w-[560px] sm:h-[460px]"
      role="region"
      aria-roledescription="carousel"
      aria-label="Ward 16 heritage photographs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null || single) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {slides.map((s, i) => {
        const r = role(i);
        if (r === 99) return null;
        const isCenter = r === 0;
        return (
          <figure
            key={s.src}
            aria-hidden={!isCenter}
            className={`${cardClass} ${
              isCenter
                ? "z-30 h-[340px] w-[270px] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] sm:h-[430px] sm:w-[340px]"
                : r === 1
                  ? "z-20 h-[300px] w-[235px] translate-x-[70px] -translate-y-1/2 rotate-[7deg] opacity-90 sm:translate-x-[120px] sm:h-[370px] sm:w-[290px]"
                  : "z-20 h-[300px] w-[235px] -translate-x-[calc(100%+70px)] -translate-y-1/2 -rotate-[7deg] opacity-90 sm:-translate-x-[calc(100%+120px)] sm:h-[370px] sm:w-[290px]"
            }`}
          >
            {/* paper frame */}
            <div className="flex h-full w-full flex-col rounded-md border border-[#E8DED2] bg-[#F6F1EA] p-2 pb-7 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55)] sm:p-2.5 sm:pb-8">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-sm bg-maroon-dark/40">
                <Image
                  src={s.src}
                  alt={isCenter ? s.alt : ""}
                  fill
                  sizes="(max-width: 640px) 280px, 360px"
                  className="object-cover"
                />
              </div>
            </div>
          </figure>
        );
      })}

      {!single && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute -left-2 top-1/2 z-40 -translate-y-1/2 rounded-full border border-[#E8DED2] bg-[#F6F1EA]/95 p-2 text-[#3D0000] shadow-md backdrop-blur transition-colors hover:bg-[#BC0202] hover:text-white sm:-left-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute -right-2 top-1/2 z-40 -translate-y-1/2 rounded-full border border-[#E8DED2] bg-[#F6F1EA]/95 p-2 text-[#3D0000] shadow-md backdrop-blur transition-colors hover:bg-[#BC0202] hover:text-white sm:-right-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          {/* indicators */}
          <div className="absolute -bottom-10 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.src}
                onClick={() => goTo(i)}
                aria-label={`Photo ${i + 1} of ${count}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${
                  i === index ? "w-5 bg-[#F6F1EA]" : "w-1.5 bg-[#F6F1EA]/50 hover:bg-[#F6F1EA]"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
