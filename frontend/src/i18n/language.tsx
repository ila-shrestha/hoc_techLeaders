"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { en, type Dictionary } from "./en";
import { ne as neDictionary } from "./ne";

export type Language = "en" | "ne";

const STORAGE_KEY = "ward16-lang";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Restore saved preference after mount (avoids hydration mismatch).
  // Deferred so it doesn't set state synchronously inside the effect.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ne") setLangState(saved);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: lang === "ne" ? neDictionary : en,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
