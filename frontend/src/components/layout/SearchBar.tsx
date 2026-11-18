"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { heritageSites } from "@/data/heritage";
import { useLanguage } from "@/i18n/language";

export function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const results = q
    ? heritageSites.filter((s) => {
        const name = s.name.toLowerCase();
        const nameNe = (s.nameNe ?? "").toLowerCase();
        return name.includes(q) || nameNe.includes(q);
      })
    : [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(slug: string) {
    setOpen(false);
    setQuery("");
    setExpanded(false);
    onNavigate?.();
    router.push(`/heritage/${slug}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) go(results[0].slug);
    else if (q) {
      setOpen(true); // show empty state
    }
  }

  const showPanel = open && q.length > 0;

  return (
    <div ref={boxRef} className="relative">
      {/* Collapsed icon on small screens */}
      {!expanded && (
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DED2] text-[#3D0000] transition-colors hover:border-[#BC0202] hover:text-[#BC0202] md:hidden"
          onClick={() => setExpanded(true)}
          aria-label={t.search.ariaLabel}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      )}

      <form
        onSubmit={onSubmit}
        className={`${
          expanded ? "absolute right-0 top-12 z-50 w-72 bg-paper p-2 shadow-lg md:static md:w-auto md:bg-transparent md:p-0 md:shadow-none" : "hidden md:block"
        }`}
        role="search"
      >
        <div className="flex items-center gap-2 rounded-full border border-[#E8DED2] bg-white/70 px-3 py-1.5 md:w-52 lg:w-60 backdrop-blur">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-[#4A2929]/60">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={t.search.placeholder}
            aria-label={t.search.ariaLabel}
            className="w-full bg-transparent text-sm text-[#4A2929] outline-none placeholder:text-[#4A2929]/50"
          />
          {expanded && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-[#4A2929]/50 hover:text-[#4A2929]"
              aria-label="Close search"
            >
              ✕
            </button>
          )}
        </div>

        {showPanel && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border-[#E8DED2] bg-white shadow-xl backdrop-blur md:left-auto md:w-80">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#4A2929]/60">
                {t.search.noResults} “{query}”
              </p>
            ) : (
              <ul>
                {results.map((site) => (
                  <li key={site.slug}>
                    <button
                      onClick={() => go(site.slug)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-mist"
                    >
                      <span className="font-medium text-[#3D0000]">
                        {lang === "ne" && site.nameNe ? site.nameNe : site.name}
                      </span>
                      <span className="text-xs text-[#4A2929]/60">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
