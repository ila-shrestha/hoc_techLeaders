
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/language";

export function Hero() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative mx-4 my-4 flex min-h-[85vh] items-center overflow-hidden rounded-2xl border-x-4 border-[#456B50]/50 bg-[#E9E1D4]"
    >
      {/* Full background image - no cropping */}
      <img
        src="/images/homepage-bg.jpeg"
        alt="Heritage architecture of Ward 16"
        className="absolute inset-0 h-full w-full object-fill"
      />

      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-white/40" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-16">
        <div
          className={`max-w-3xl transition-all duration-1000 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          {/* Badge */}
          <p className="mb-6 inline-block rounded-full border border-[#174D35]/40 bg-white/60 px-5 py-2 text-sm font-semibold tracking-wider text-[#174D35] shadow-md">
            {t.hero.badge}
          </p>

          {/* Main heading */}
          <h1
              className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl md:text-7xl"
  style={{
    color: "#00D9FF",
   
  }}
>
          
            {t.hero.heading}
          </h1>

          {/* Description */}
          <p
            className="mb-10 max-w-2xl text-base font-medium leading-relaxed text-[#183D2B] sm:text-lg md:text-xl"
            style={{
              textShadow: "0 1px 8px rgba(255,255,255,0.8)",
            }}
          >
            {t.hero.subheading}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/heritage"
              className="rounded-lg bg-[#174D35] px-7 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#103B28] hover:shadow-xl"
            >
              {t.hero.ctaExplore}
            </Link>

            <Link
              href="/map"
              className="rounded-lg border-2 border-[#456B50] bg-white/70 px-7 py-3.5 font-semibold text-[#123B2A] shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
            >
              {t.mapBtn}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
