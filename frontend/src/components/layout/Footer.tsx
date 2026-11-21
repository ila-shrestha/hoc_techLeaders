"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/language";
import { heritageSites } from "@/data/heritage";

export function Footer() {
  const pathname = usePathname();
  const yearRef = useRef<HTMLSpanElement>(null);
  const { lang, t } = useLanguage();

  // Set the year via DOM (external system) to stay prerender-safe
  useEffect(() => {
    if (yearRef.current) {
      yearRef.current.textContent = String(new Date().getFullYear());
    }
  }, []);

  if (pathname === "/explore") return null;

  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper font-display text-lg text-ink">
              १६
            </span>
            <span className="font-display text-lg font-semibold">Ward 16 Heritage</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">{t.footer.tagline}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-bright">
            {t.footer.explore}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="text-paper/70 hover:text-paper">{t.nav.home}</Link></li>
            <li><Link href="/heritage" className="text-paper/70 hover:text-paper">{t.nav.exploreHeritage}</Link></li>
            <li><Link href="/about" className="text-paper/70 hover:text-paper">{t.nav.aboutWard16}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-bright">
            {t.footer.heritage}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {heritageSites.map((site) => (
              <li key={site.slug}>
                <Link
                  href={`/heritage/${site.slug}`}
                  className="text-paper/70 hover:text-paper"
                >
                  {lang === "ne" && site.nameNe ? site.nameNe : site.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-bright">
            {t.footer.community}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">{t.footer.communityText}</p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-paper/50 sm:flex-row sm:px-6">
          <p>© <span ref={yearRef}>…</span> {t.footer.rights}</p>
          <p>{t.footer.motto}</p>
        </div>
      </div>
    </footer>
  );
}
