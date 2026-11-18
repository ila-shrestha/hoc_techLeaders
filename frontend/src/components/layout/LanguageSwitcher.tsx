"use client";

import { useLanguage, type Language } from "@/i18n/language";

const languages: { code: Language; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ne", label: "नेपाली", short: "ने" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Select language / भाषा छान्नुहोस्"
      className={`flex items-center rounded-full border border-line bg-paper p-0.5 ${className}`}
    >
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            lang === l.code
              ? "bg-darkred text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
