"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import { heritageSites } from "@/data/heritage";
import { getHeritageDetail } from "@/data";
import { useLanguage } from "@/i18n/language";
import {
  getExplored,
  hasSeenSite,
  markSiteSeen,
  toggleExplored,
} from "@/lib/exploration";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

// Approximate placeholder positions around Ward 16 — NOT verified coordinates.
// Each site gets a distinct offset so markers don't overlap.
const MARKER_POSITIONS: Record<string, [number, number]> = {
  "siddhi-ganesh": [27.7175, 85.3245],
  "koncha-dyo": [27.7168, 85.3228],
  "22-dhara": [27.7190, 85.3260],
  "sitala-ajima": [27.7155, 85.3255],
  "mhepi-ajima": [27.7182, 85.3215],
  gurunakak: [27.7145, 85.3238],
};

const TOTAL = heritageSites.length;

export function HeritageMap() {
  const { lang, t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<Leaflet.Map | null>(null);
  const [explored, setExplored] = useState<string[]>([]);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);

  // Load progress after mount (deferred to avoid sync setState in effect)
  useEffect(() => {
    const id = window.setTimeout(() => {
      setExplored(getExplored());
      setSeen(
        new Set(
          heritageSites.filter((s) => hasSeenSite(s.slug)).map((s) => s.slug),
        ),
      );
    }, 0);
    const onProgress = () => {
      setExplored(getExplored());
      setSeen(new Set(heritageSites.filter((s) => hasSeenSite(s.slug)).map((s) => s.slug)));
    };
    window.addEventListener("ward16-progress", onProgress);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("ward16-progress", onProgress);
    };
  }, []);

  // Init Leaflet (dynamically imported — Leaflet needs `window`)
  useEffect(() => {
    if (!mapRef.current || mapObj.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current || mapObj.current) return;

      const map = L.map(mapRef.current, {
        center: [27.7168, 85.3238],
        zoom: 15,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapObj.current = map;

      heritageSites.forEach((site, i) => {
        const pos = MARKER_POSITIONS[site.slug] ?? [27.7168, 85.3238];
        const isExplored = getExplored().includes(site.slug);

        const icon = L.divIcon({
          className: "heritage-marker",
          html: `<div style="
            width:44px;height:44px;border-radius:50% 50% 50% 4px;
            transform:rotate(-45deg);
            background:${isExplored ? "#FF0000" : "#830000"};
            border:3px solid #fff;
            box-shadow:0 4px 12px rgba(0,0,0,.45);
            display:flex;align-items:center;justify-content:center;
          "><span style="transform:rotate(45deg);color:#fff;font-size:15px;font-weight:700;font-family:Georgia,serif">${i + 1}</span></div>`,
          iconSize: [44, 44],
          iconAnchor: [22, 40],
        });

        const marker = L.marker(pos, { icon }).addTo(map);
        marker.on("click", () => {
          markSiteSeen(site.slug);
          setSelected(site.slug);
        });
      });
    })();

    return () => {
      cancelled = true;
      mapObj.current?.remove();
      mapObj.current = null;
    };
  }, []);

  const selectedSite = selected ? heritageSites.find((s) => s.slug === selected) : null;
  const selectedDetail = selected ? getHeritageDetail(selected) : undefined;
  const unexplored = heritageSites.filter((s) => !explored.includes(s.slug));
  const nextSite = unexplored[0] ?? heritageSites[0];

  const badges = [
    {
      id: "first",
      unlocked: seen.size > 0,
      title: t.mapPage.badgeFirst,
      desc: t.mapPage.badgeFirstDesc,
    },
    {
      id: "half",
      unlocked: explored.length >= 3,
      title: t.mapPage.badgeHalf,
      desc: t.mapPage.badgeHalfDesc,
    },
    {
      id: "all",
      unlocked: explored.length >= TOTAL,
      title: t.mapPage.badgeAll,
      desc: t.mapPage.badgeAllDesc,
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-mist">
      {/* Header */}
      <div className="border-b border-line bg-paper px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-darkred">
            {t.mapPage.eyebrow}
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
            {t.mapPage.title}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-ink-soft">{t.mapPage.description}</p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_340px]">
        {/* Map */}
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-line shadow-lg lg:min-h-[560px]">
          <div ref={mapRef} className="h-full min-h-[420px] w-full lg:min-h-[560px]" />
          <p className="absolute bottom-2 left-2 z-[500] max-w-xs rounded-lg bg-paper/90 px-3 py-1.5 text-[11px] text-mute backdrop-blur">
            {t.mapPage.markersNote}
          </p>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-5">
          {/* Progress */}
          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                {t.mapPage.progress}
              </h2>
              <span className="font-display text-2xl font-bold text-darkred">
                {explored.length} {t.mapPage.of} {TOTAL}
              </span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-gradient-to-r from-maroon to-bright transition-all duration-700"
                style={{ width: `${(explored.length / TOTAL) * 100}%` }}
              />
            </div>
            {explored.length === TOTAL && (
              <p className="mt-3 text-sm font-medium text-darkred">{t.mapPage.allExplored}</p>
            )}
            {explored.length < TOTAL && (
              <p className="mt-3 text-sm text-ink-soft">
                {t.mapPage.exploreNext}:{" "}
                <button
                  onClick={() => {
                    const pos = MARKER_POSITIONS[nextSite.slug];
                    if (pos && mapObj.current) {
                      mapObj.current.flyTo(pos, 16, { duration: 1 });
                      markSiteSeen(nextSite.slug);
                      setSelected(nextSite.slug);
                    }
                  }}
                  className="font-medium text-darkred underline underline-offset-2"
                >
                  {lang === "ne" && nextSite.nameNe ? nextSite.nameNe : nextSite.name}
                </button>
              </p>
            )}
          </div>

          {/* Selected site card */}
          {selectedSite && (
            <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-lg">
              <div className="relative aspect-[16/9]">
                <PlaceholderImage
                  site={{
                    ...selectedSite,
                    name: lang === "ne" && selectedSite.nameNe ? selectedSite.nameNe : selectedSite.name,
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {lang === "ne" && selectedSite.nameNe ? selectedSite.nameNe : selectedSite.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {selectedDetail?.ne && lang === "ne"
                    ? selectedDetail.ne.summary ?? selectedSite.summary
                    : selectedDetail?.summary ?? selectedSite.summary ?? t.showcase.comingSoon}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/heritage/${selectedSite.slug}`}
                    className="rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-darkred"
                  >
                    {t.mapPage.viewDetails}
                  </Link>
                  <button
                    onClick={() => setExplored(toggleExplored(selectedSite.slug))}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      explored.includes(selectedSite.slug)
                        ? "border-bright bg-bright/10 text-bright"
                        : "border-line text-ink-soft hover:border-darkred hover:text-darkred"
                    }`}
                  >
                    {explored.includes(selectedSite.slug)
                      ? `✓ ${t.mapPage.explored}`
                      : t.mapPage.markExplored}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-lg font-semibold text-ink">{t.mapPage.badgesTitle}</h2>
            <div className="mt-3 space-y-2.5">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`flex items-start gap-3 rounded-xl border p-3 transition-opacity ${
                    b.unlocked
                      ? "border-bright/40 bg-bright/5"
                      : "border-line opacity-50"
                  }`}
                >
                  <span className={`text-xl ${b.unlocked ? "" : "grayscale"}`}>
                    {b.unlocked ? "🏅" : "🔒"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{b.title}</p>
                    <p className="text-xs text-mute">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guide */}
          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-display text-lg font-semibold text-ink">{t.mapPage.guideTitle}</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
              {t.mapPage.guideSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
