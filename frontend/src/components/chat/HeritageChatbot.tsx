"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/language";
import { heritageSites } from "@/data/heritage";
import { getHeritageDetail } from "@/data";

interface Msg {
  role: "user" | "guide";
  text: string;
}

export function HeritageChatbot() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const greeted = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Greeting on first open
  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true;
      setMessages([{ role: "guide", text: t.chatWidget.greeting }]);
    }
  }, [open, t]);

  // Open when triggered from the navbar (single shared instance)
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("hoc:open-chatbot", onOpen);
    return () => window.removeEventListener("hoc:open-chatbot", onOpen);
  }, []);

  function answer(question: string): string {
    const q = question.toLowerCase();

    // 1. Direct site-name match → return its summary
    for (const site of heritageSites) {
      const names = [site.name.toLowerCase(), (site.nameNe ?? "").toLowerCase()];
      if (names.some((n) => n && q.includes(n))) {
        const detail = getHeritageDetail(site.slug);
        const summary =
          lang === "ne" && detail?.ne?.summary
            ? detail.ne.summary
            : detail?.summary ?? site.summary;
        if (summary) {
          return lang === "ne"
            ? `${site.nameNe ?? site.name}: ${summary}`
            : `${site.name}: ${summary}`;
        }
        return lang === "ne"
          ? `${site.nameNe ?? site.name} को विस्तृत विवरण हाम्रा सम्पदा पृष्ठमा छ।`
          : `${site.name} is documented on our heritage pages — tap a marker on the Explore Map or visit its page for the full story.`;
      }
    }

    // 2. Keyword matching over documented content
    const keywords: { keys: string[]; site: string }[] = [
      { keys: ["ganesh", "ganesha", "siddhi"], site: "siddhi-ganesh" },
      { keys: ["koncha", "dyo", "gagro", "newar"], site: "koncha-dyo" },
      { keys: ["22", "dhara"], site: "22-dhara" },
      { keys: ["sitala", "ajima"], site: "sitala-ajima" },
      { keys: ["mhepi"], site: "mhepi-ajima" },
      { keys: ["gurun", "gurunakak", "guru"], site: "gurunakak" },
      { keys: ["map", " explore map", "location", "where"], site: "__map__" },
      { keys: ["heritage", "sites", "temple", "temples"], site: "__heritage__" },
      { keys: ["practice", "ritual", "festival", "puja", "worship", "tradition"], site: "__practices__" },
      { keys: ["significance", "important", "believe", "belief"], site: "__beliefs__" },
      { keys: ["hello", "hi", "hey", "namaste"], site: "__greeting__" },
    ];

    for (const k of keywords) {
      if (k.keys.some((key) => q.includes(key))) {
        switch (k.site) {
          case "__map__":
            return lang === "ne"
              ? t.chatWidget.fallback
              : "You can explore all six heritage sites on our interactive map — tap the 'Explore Map' button in the navigation or visit /map. Markers show approximate positions until verified coordinates are added.";
          case "__heritage__":
            return lang === "ne"
              ? t.chatWidget.fallback
              : "Ward 16 has six documented heritage sites: Siddhi Ganesh Temple, Koncha Dyo, 22 Dhara, Sitala Ajima, Mhepi Ajima, and Gurunakak. Two have full documentation; the rest are being researched by the community.";
          case "__practices__":
            return lang === "ne"
              ? t.chatWidget.fallback
              : "Documented practices include temple worship on Tuesdays at Siddhi Ganesh, festivals like Ganesh Chaturthi and Chyamma Puja, and traditional Newar rituals at Koncha Dyo. These are community traditions — visit each site's page for details.";
          case "__beliefs__":
            return lang === "ne"
              ? t.chatWidget.fallback
              : "Local beliefs include newly married couples visiting Siddhi Ganesh and Koncha Dyo for blessings, and the community regard for Siddhi Ganesh as the area's original Ganesh idol. These are community beliefs, documented as such — not verified history.";
          case "__greeting__":
            return lang === "ne"
              ? "नमस्ते! वार्ड १६ सम्पदामा स्वागत छ।"
              : "Namaste! Welcome to Ward 16 Heritage. Ask me about any of our six heritage sites, or try one of the suggested questions.";
        }
      }
    }

    // 3. Suggestion-style questions
    if (q.includes("22 dhara") || q.includes("22धारा")) {
      const s = heritageSites.find((x) => x.slug === "22-dhara");
      return lang === "ne"
        ? `${s?.nameNe}: ${t.showcase.comingSoon}`
        : "22 Dhara is an important heritage site in Ward 16. Detailed documentation is being prepared through community research — check back soon or explore it on the map.";
    }

    return t.chatWidget.fallback;
  }

  function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    // Small delay for a natural feel
    setTimeout(() => {
      setMessages((m) => [...m, { role: "guide", text: answer(msg) }]);
    }, 450);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.chatWidget.closeLabel : t.chatWidget.openLabel}
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-maroon text-paper shadow-[0_4px_20px_rgba(131,0,0,0.5)] transition-all duration-300 hover:bg-darkred hover:shadow-[0_0_28px_rgba(188,2,2,0.6)] active:scale-90"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-bright/30 [animation-duration:2.5s]" />
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
        {!open && (
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper opacity-0 transition-opacity group-hover:opacity-100 md:block">
            {t.chatWidget.openLabel}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[480px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl sm:right-6">
          {/* Header */}
          <div className="flex items-center gap-3 bg-maroon px-4 py-3.5 text-paper">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/15 text-lg">🪔</span>
            <div>
              <p className="text-sm font-semibold">{t.chatWidget.guide}</p>
              <p className="text-[11px] text-paper/70">Ward 16 Heritage</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-mist p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-darkred text-paper"
                      : "rounded-bl-sm border border-line bg-paper text-ink"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="border-t border-line bg-paper px-3 py-2.5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-mute">
                {lang === "ne" ? "सुझावहरू" : "Try asking"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {t.chatWidget.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="rounded-full border border-line bg-mist px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-darkred hover:text-darkred"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-line bg-paper p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatWidget.placeholder}
              aria-label={t.chatWidget.placeholder}
              className="flex-1 rounded-full border border-line bg-mist px-4 py-2 text-sm text-ink outline-none placeholder:text-mute focus:border-darkred"
            />
            <button
              type="submit"
              aria-label={t.chatWidget.send}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-darkred text-paper transition-colors hover:bg-maroon"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
