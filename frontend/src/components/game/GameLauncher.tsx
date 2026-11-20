"use client";

import { useCallback, useEffect, useState } from "react";
import { Gamepad2, Loader2, X } from "lucide-react";
import { useLanguage } from "@/i18n/language";

const GAME_URL = "/game/index.html";

export function GameLauncher() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setLoaded(false);
  }, []);

  // Lock body scroll + Escape to close while the console is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const label =
    lang === "ne"
      ? "इंटर्याक्टिभ खेल"
      : "Play the heritage game";
  const tooltip =
    lang === "ne"
      ? "इन्टर्याक्टिभ खेलबाट सम्पदा स्थलहरू अन्वेषण गर्नुहोस्!"
      : "Explore heritage sites through an interactive game!";

  return (
    <>
      {/* Floating game button — sits directly above the chatbot button */}
      <button
        onClick={() => setOpen(true)}
        aria-label={label}
        className="group fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-maroon text-paper shadow-[0_4px_20px_rgba(131,0,0,0.5)] transition-colors duration-300 hover:bg-darkred hover:shadow-[0_0_28px_rgba(188,2,2,0.6)] active:scale-90 animate-[gameHeartbeat_2.2s_ease-in-out_infinite]"      >
        <Gamepad2 size={24} strokeWidth={2} />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 md:block">
          {tooltip}
        </span>
      </button>

      {/* Game console overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/85 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-paper/15 bg-maroon shadow-2xl sm:h-[88vh]">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 bg-maroon px-4 py-3 text-paper sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/15">
                  <Gamepad2 size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {lang === "ne" ? "काठमाडौं गली" : "Kathmandu Galli"}
                  </p>
                  <p className="text-[11px] text-paper/70">
                    {lang === "ne"
                      ? "वार्ड १६ सम्पदा अन्वेषण खेल"
                      : "Ward 16 Heritage Exploration Game"}
                  </p>
                </div>
              </div>
              <button
                onClick={close}
                aria-label={lang === "ne" ? "बन्द गर्नुहोस्" : "Close game"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/10 text-paper transition-colors hover:bg-paper/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* Game viewport */}
            <div className="relative flex-1 bg-[#1a0d0d]">
              {!loaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-paper">
                  <Loader2 size={28} className="animate-spin text-bright" />
                  <p className="text-sm text-paper/80">
                    {lang === "ne" ? "खेल लोड हुँदैछ…" : "Loading the game…"}
                  </p>
                </div>
              )}
              <iframe
                src={GAME_URL}
                title={lang === "ne" ? "काठमाडौं गली खेल" : "Kathmandu Galli game"}
                className="h-full w-full border-0"
                onLoad={() => setLoaded(true)}
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
