"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { siddhiGanesh } from "@/data/siddhiGanesh";
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
  const ref = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  }

  const parallax = Math.min(scrollY * 0.25, 120);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mx = reduced ? 0 : mouse.x;
  const my = reduced ? 0 : mouse.y;

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      className="surface-maroon pattern-dhaka relative flex min-h-[100svh] items-center overflow-hidden"
    >
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
        <div className="absolute inset-0 bg-gradient-to-b from-maroon-deep/40 via-maroon-deep/30 to-maroon-deep/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-deep/40 via-transparent to-transparent" />
        <div className="pattern-dhaka absolute inset-0 opacity-60" />
      </div>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-darkred/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-bright/15 blur-[100px]" />

      {/* Decorative Newari window motifs at the side margins (wide screens only) */}
      <NewariWindow className="pointer-events-none absolute left-10 top-2/4 hidden h-56 w-40 opacity-30 2xl:block" />
      <NewariWindow className="pointer-events-none absolute bottom-2/4 right-16 hidden h-56 w-40 opacity-30 2xl:block" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Copy */}
        <div style={{ transform: `translateY(${parallax * 0.4}px)` }}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-paper/90 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-bright" />
            {t.hero.badge}
          </span>
          <h1 className="font-display text-4xl leading-[1.08] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {t.hero.heading}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
            {t.hero.subheading}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/heritage"
              className="rounded-full bg-paper px-8 py-4 text-sm font-bold uppercase tracking-wide text-maroon shadow-xl transition-all duration-300 hover:bg-bright hover:text-paper hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] active:scale-95"
            >
              {t.hero.ctaExplore}
            </Link>
            <Link
              href="/map"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-paper backdrop-blur transition-all duration-300 hover:border-bright hover:bg-bright/20 active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t.mapBtn}
            </Link>
          </div>
        </div>

        {/* 3D architectural composition — cursor parallax per layer */}
        <div
          className="perspective-1200 relative hidden lg:block"
          style={{
            transform: `translate(${mx * -8}px, ${parallax + my * -6}px)`,
            transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="card-3d relative" style={{ transform: `rotateY(${mx * 4}deg) rotateX(${my * -3}deg)` }}>
            {/* Back window — offset layer for depth */}
            {/* <NewariWindow
              className="floaty absolute -left-14 top-4 h-72 w-52 opacity-50"
              eslint-disable-next-line

            /> */}
            {/* Middle layer — large tilted frame */}
            <div style={{ transform: `translateZ(-60px) rotateY(${-8 + mx * 2}deg)` }}>
              <NewariWindow className="relative h-[500px] w-[400px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]">
                <div className="absolute inset-3 overflow-hidden">
                  <div style={{ transform: `translateZ(40px) scale(1.08)` }} className="h-full w-full">
                    <PlaceholderImage site={siddhiGanesh} priority />
                  </div>
                  <HeroCarousel />
                </div>
              </NewariWindow>
            </div>
            {/* Foreground floating card — moves independently */}
            {/* <div
              className="card-3d-inner floaty absolute -bottom-10 -right-12 w-56 rounded-2xl border border-white/15 bg-maroon-deep/85 p-5 shadow-[0_35px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md"
              style={{
                ["--rot" as string]: "3deg",
                animationDelay: "1.2s",
                transform: `translate(${mx * 14}px, ${my * 10}px) translateZ(80px)`,
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
              }}
            > */}
            {/* <p className="font-display text-xl text-paper">{siddhiGanesh.name}</p> */}
            {/* <p className="mt-1.5 text-xs leading-relaxed text-paper/70">
                {t.showcase.featured}
              </p> */}
            {/* <div className="mt-3 h-1 w-10 rounded-full bg-bright" /> */}
            {/* </div> */}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-paper/50">
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-paper/60 to-transparent" />
      </div>
    </section>
  );
}
