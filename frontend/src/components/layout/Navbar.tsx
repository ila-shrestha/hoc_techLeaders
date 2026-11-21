"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Gamepad2, Home, Landmark, Map as MapIcon, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/language";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchBar } from "./SearchBar";

/** Stage timings (ms) */
const LOGO_HOLD_MS = 650;   // stage 1 — centred logo only
const DOTS_MS = 750;        // stage 2 — loading dots beneath the logo

type Stage = "logo" | "dots" | "expanded";

export function Navbar() {
  const [stage, setStage] = useState<Stage>("logo");
  const [entered, setEntered] = useState(false);
  const [logoFrom, setLogoFrom] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const timers = useRef<number[]>([]);
  const logoSlotRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const expand = useCallback(() => {
    setStage("expanded");
    // paint the closed pill first, then open it next frame
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  }, []);

  /** Full intro sequence: centred logo → dots → expanding pill */
  const runIntro = useCallback(() => {
    clearTimers();
    setMenuOpen(false);
    setEntered(false);
    setStage("logo");
    later(() => setStage("dots"), LOGO_HOLD_MS);
    later(expand, LOGO_HOLD_MS + DOTS_MS);
  }, [expand]);

  // Initial entrance — skipped for reduced motion
  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion.current) {
      expand();
      return;
    }
    runIntro();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure how far the logo must travel: from viewport centre to its
  // final slot at the left of the pill. Applied as a transform so the
  // logo itself is never scaled or distorted.
  useLayoutEffect(() => {
    if (stage !== "expanded" || !logoSlotRef.current) return;
    const slot = logoSlotRef.current.getBoundingClientRect();
    const slotCenter = slot.left + slot.width / 2;
    setLogoFrom(window.innerWidth / 2 - slotCenter);
  }, [stage]);

  // Close menu on route change (render-time adjustment — no effect needed)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  // Outside click + Escape close
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const openChat = () => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("hoc:open-chatbot"));
  };
  const openGame = () => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("hoc:open-game"));
  };

  const menuItems = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/about", label: t.nav.aboutWard16, icon: null },
    { href: "/heritage", label: t.nav.exploreHeritage, icon: Landmark },
    { href: "/map", label: t.mapBtn, icon: MapIcon },
  ];

  const itemIn = entered
    ? "translate-y-0 opacity-100"
    : "translate-y-1.5 opacity-0";
  const itemTransition =
    "transition-all duration-500 ease-out motion-reduce:transition-none";

  const logoImg = (
    <Image
      src="/images/ward16-logo.png"
      alt="Ward 16 Logo"
      width={44}
      height={44}
      className="h-11 w-11 shrink-0 object-contain"
      priority
    />
  );

  const centred = stage !== "expanded";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 sm:top-5">
      {/* Stage 1–2: centred logo (+ loading dots). Fades out as the
          pill's own logo glides in from the same centre position. */}
      <div
        className={`absolute left-1/2 top-1.5 flex -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-300 motion-reduce:transition-none ${
          centred ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Link
          href="/"
          aria-label="Ward 16 Heritage — home"
          className="pointer-events-auto flex items-center justify-center rounded-full p-1.5"
        >
          {logoImg}
        </Link>
        {stage === "dots" && (
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#F6F1EA] motion-safe:animate-[navDot_1.2s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stage 3: pill expands from centre via scaleX on the background
          layer only — contents are never distorted. */}
      {stage === "expanded" && (
        <div className="pointer-events-auto relative mx-auto h-14 max-w-6xl">
          {/* Cream pill background — the animated element itself stays
              fully rounded (rounded-full) at every scaleX value. */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 rounded-full border border-[#E8DED2] bg-[#F6F1EA]/95 shadow-[0_14px_44px_rgba(61,0,0,0.22)] backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              entered ? "scale-x-100" : "scale-x-0"
            }`}
            style={{ transformOrigin: "center" }}
          />

          {/* Content layer — final layout, undistorted */}
          <div className="relative flex h-14 items-center justify-between gap-3 px-4 sm:px-5">
            {/* Logo slot — reserves space so links never collide */}
            <div ref={logoSlotRef} className="flex items-center">
              <span
                className="flex items-center gap-2.5 will-change-transform"
                style={{
                  transform: `translateX(${entered ? 0 : logoFrom}px)`,
                  transition:
                    "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 400ms ease-out",
                }}
              >
                <Link
                  href="/"
                  aria-label="Ward 16 Heritage — home"
                  className="flex items-center gap-2.5"
                >
                  {logoImg}
                  <span className="hidden flex-col leading-none sm:flex">
                    <span className="font-display text-base font-semibold tracking-tight text-[#830000]">
                      Ward 16
                    </span>
                    <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#4A2929]/70">
                      Cultural Heritage
                    </span>
                  </span>
                </Link>
              </span>
            </div>

            {/* Right-side actions — two pill CTAs + language + hamburger.
                Search lives inside the hamburger menu. */}
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <div
                className={`hidden items-center gap-2 sm:flex ${itemIn}`}
                style={{ transitionDelay: entered ? "220ms" : "0ms" }}
              >
                <Link
                  href="/heritage"
                  className={`${itemTransition} rounded-full bg-[#830000] px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#BC0202]`}
                >
                  {t.nav.exploreSites}
                </Link>
                <Link
                  href="/map"
                  className={`${itemTransition} rounded-full border border-[#830000]/30 bg-transparent px-4 py-2 text-sm font-semibold text-[#830000] transition-colors hover:border-[#BC0202] hover:text-[#BC0202]`}
                >
                  {t.nav.exploreMap}
                </Link>
              </div>
              <div
                className={`${itemTransition} ${itemIn} hidden sm:block`}
                style={{ transitionDelay: entered ? "300ms" : "0ms" }}
              >
                <LanguageSwitcher />
              </div>
            </div>

            {/* Hamburger — always visible in the pill */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={t.nav.toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="hoc-nav-menu"
              className={`${itemTransition} ${itemIn} flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-[#830000]/10 transition-colors hover:bg-[#830000]/15`}
              style={{ transitionDelay: entered ? "380ms" : "0ms" }}
            >
              <span
                className={`h-0.5 w-6 bg-[#3D0000] transition-transform duration-300 ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-[#3D0000] transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-6 bg-[#3D0000] transition-transform duration-300 ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>

          {/* Hamburger dropdown */}
          {menuOpen && (
            <div
              id="hoc-nav-menu"
              ref={menuRef}
              className="absolute left-1/2 top-full z-50 mt-2 w-[min(92vw,26rem)] -translate-x-1/2 rounded-3xl border border-[#E8DED2] bg-[#F6F1EA]/97 p-3 shadow-2xl backdrop-blur-md animate-[menuIn_.28s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none"
            >
              <nav className="flex flex-col">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#BC0202] text-white"
                          : "text-[#3D0000] hover:bg-[#830000]/10 hover:text-[#BC0202]"
                      }`}
                    >
                      {Icon && <Icon size={16} className="shrink-0" />}
                      {item.label}
                    </Link>
                  );
                })}

                <div className="my-1.5 h-px bg-[#E8DED2]" />

                <div className="px-2 pb-1 pt-1">
                  <SearchBar onNavigate={() => setMenuOpen(false)} />
                </div>
                <div className="flex items-center justify-between gap-3 px-2 py-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4A2929]/60">
                    {t.nav.language}
                  </span>
                  <LanguageSwitcher />
                </div>

                <div className="my-1.5 h-px bg-[#E8DED2]" />

                <button
                  onClick={openChat}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-[#3D0000] transition-colors hover:bg-[#830000]/10 hover:text-[#BC0202]"
                >
                  <MessageCircle size={16} className="shrink-0" />
                  {t.nav.chatbot}
                </button>
                <button
                  onClick={openGame}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-[#3D0000] transition-colors hover:bg-[#830000]/10 hover:text-[#BC0202]"
                >
                  <Gamepad2 size={16} className="shrink-0" />
                  {t.nav.game}
                </button>
              </nav>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
