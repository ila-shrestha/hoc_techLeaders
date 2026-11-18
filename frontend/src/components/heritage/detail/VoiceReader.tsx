"use client";

/**
 * VoiceReader — reads the main content of a heritage detail page aloud
 * using the browser's Web Speech API.
 *
 * - Follows the selected site language (en → English voice, ne → Nepali voice).
 * - Never falls back to the wrong language: if no suitable voice exists
 *   for the selected language, it shows a friendly notice instead.
 * - Reads only the element identified by `targetId` (headings + paragraphs,
 *   in DOM order) — never nav, footer, or decorative labels.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/language";

type Status = "idle" | "playing" | "paused" | "error";

const LANG_TAG: Record<string, string> = { en: "en-US", ne: "ne-NP" };

export function VoiceReader({ targetId }: { targetId: string }) {
  const { lang, t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Cancel speech — touches only the external speechSynthesis API
  const cancelSpeech = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    utteranceRef.current = null;
  }, [supported]);

  // Stop speech when language changes or component unmounts.
  // State reset is deferred so it doesn't run synchronously in the effect.
  useEffect(() => {
    cancelSpeech();
    const id = window.setTimeout(() => {
      setStatus("idle");
      setMessage(null);
    }, 0);
    return () => {
      window.clearTimeout(id);
      cancelSpeech();
    };
  }, [lang, cancelSpeech]);

  // Prime the async voice list on mount
  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (synth.getVoices().length === 0) {
      synth.addEventListener("voiceschanged", () => synth.getVoices());
    }
  }, [supported]);

  const collectText = useCallback((): string[] => {
    const root = document.getElementById(targetId);
    if (!root) return [];
    const nodes = root.querySelectorAll("h1, h2, h3, p, li");
    return Array.from(nodes)
      .map((el) => el.textContent?.trim() ?? "")
      .filter((text) => text.length > 0);
  }, [targetId]);

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!supported) return null;
    const voices = window.speechSynthesis.getVoices();
    const prefix = LANG_TAG[lang];
    const match =
      voices.find((v) => v.lang === prefix) ??
      voices.find((v) =>
        v.lang.toLowerCase().startsWith(prefix.toLowerCase().slice(0, 2)),
      );
    // Never accept a voice whose language doesn't match the content language
    if (match && !match.lang.toLowerCase().startsWith(prefix.slice(0, 2))) {
      return null;
    }
    return match ?? null;
  }, [lang, supported]);

  function speak() {
    if (!supported) {
      setStatus("error");
      setMessage(t.detail.unsupported);
      return;
    }

    const voice = pickVoice();
    if (!voice) {
      // Voice list may not be loaded yet — retry once when it arrives
      if (window.speechSynthesis.getVoices().length === 0) {
        const handler = () => {
          window.speechSynthesis.removeEventListener("voiceschanged", handler);
          speak();
        };
        window.speechSynthesis.addEventListener("voiceschanged", handler);
        return;
      }
      // No voice for the selected language — do NOT read with a wrong voice
      setStatus("error");
      setMessage(
        lang === "ne" ? t.detail.neVoiceUnavailable : t.detail.voiceError,
      );
      return;
    }

    const texts = collectText();
    if (texts.length === 0) {
      setStatus("error");
      setMessage(t.detail.voiceError);
      return;
    }

    window.speechSynthesis.cancel();
    setMessage(null);

    let index = 0;
    const speakNext = () => {
      if (index >= texts.length) {
        setStatus("idle");
        return;
      }
      const utterance = new SpeechSynthesisUtterance(texts[index]);
      utterance.voice = voice;
      utterance.lang = LANG_TAG[lang];
      utterance.rate = 0.95;
      utterance.onend = () => {
        index += 1;
        speakNext();
      };
      utterance.onerror = () => {
        setStatus("error");
        setMessage(t.detail.voiceError);
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setStatus("playing");
    };
    speakNext();
  }

  function toggle() {
    if (!supported) {
      setStatus("error");
      setMessage(t.detail.unsupported);
      return;
    }
    if (status === "playing") {
      window.speechSynthesis.pause();
      setStatus("paused");
    } else if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
    } else {
      speak();
    }
  }

  function stop() {
    cancelSpeech();
    setStatus("idle");
  }

  const buttonClass =
    "inline-flex items-center gap-2 rounded-full border border-darkred bg-darkred px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-maroon";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {status === "playing" ? (
          <button onClick={toggle} className={buttonClass} aria-label={t.detail.pause}>
            ⏸ {t.detail.pause}
          </button>
        ) : status === "paused" ? (
          <button onClick={toggle} className={buttonClass} aria-label={t.detail.resume}>
            ▶ {t.detail.resume}
          </button>
        ) : (
          <button onClick={toggle} className={buttonClass} aria-label={t.detail.listenToPage}>
            🔊 {t.detail.listenToPage}
          </button>
        )}
        {(status === "playing" || status === "paused") && (
          <button
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-darkred hover:text-darkred"
            aria-label={t.detail.stop}
          >
            ⏹ {t.detail.stop}
          </button>
        )}
        {status === "playing" && (
          <span className="text-sm text-mute" role="status">
            {t.detail.listening}
          </span>
        )}
      </div>
      {message && (
        <p
          className="max-w-md rounded-lg border border-line bg-mist px-4 py-2.5 text-sm text-ink-soft"
          role="alert"
        >
          {message}
        </p>
      )}
    </div>
  );
}
