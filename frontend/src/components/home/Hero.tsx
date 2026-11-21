"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { useLanguage } from "@/i18n/language";

/** Ornamental Newari window — layered frame with lattice */
function NewariWindow({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`window-frame relative overflow-hidden rounded-sm bg-maroon-dark/60 ${className}`}>
      <div className="pattern-dhaka absolute inset-0" />
      {children}
      {/* inner lattice bars */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
      <div className="absolute inset-3 grid grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border border-white/10" />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const raf = requestAnimationFrame(() =>
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches),
    );
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const parallax = reduced ? 0 : Math.min(scrollY * 0.2, 90);

  return (
    <section className="surface-maroon pattern-dhaka relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Background photograph with readability overlays */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero/heropage.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/50 via-maroon-deep/35 to-maroon-deep/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-deep/45 via-transparent to-maroon-deep/20" />
        <div className="pattern-dhaka absolute inset-0 opacity-50" />
      </div>

      {/* Thin decorative geometric lines */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-paper/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />

      {/* Decorative Newari window motifs at the side margins (wide screens only) */}
      <NewariWindow className="pointer-events-none absolute left-10 top-2/4 hidden h-56 w-40 -translate-y-1/2 opacity-25 2xl:block" />
      <NewariWindow className="pointer-events-none absolute bottom-2/4 right-16 hidden h-56 w-40 translate-y-1/2 opacity-25 2xl:block" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-4 pb-28 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        {/* Copy */}
        <div
          className="transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateY(${parallax * 0.4}px)` }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-paper/25 bg-paper/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-paper/90 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-bright" />
            {t.hero.badge}
          </span>
          <h1 className="font-display text-4xl leading-[1.08] text-paper sm:text-5xl md:text-6xl xl:text-[4.4rem]">
            {t.hero.heading}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/80">
            {t.hero.subheading}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/heritage"
              className="rounded-full bg-paper px-8 py-4 text-sm font-bold uppercase tracking-wide text-maroon shadow-xl transition-all duration-300 hover:bg-bright hover:text-paper active:scale-95"
            >
              {t.hero.ctaExplore}
            </Link>
            <Link
              href="/map"
              className="group inline-flex items-center gap-2 rounded-full border border-paper/35 bg-paper/5 px-8 py-4 text-sm font-semibold text-paper backdrop-blur transition-all duration-300 hover:border-bright hover:bg-bright/15 active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t.mapBtn}
            </Link>
          </div>
        </div>

        {/* Layered postcard carousel */}
        <div className="pb-10 lg:pb-0">
          <HeroCarousel />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-paper/50 md:block">
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-paper/60 to-transparent" />
      </div>
    </section>
  );
}
