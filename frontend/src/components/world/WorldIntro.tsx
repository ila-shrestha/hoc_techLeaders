"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Landmark, Map as MapIcon, Search, X } from "lucide-react";
import { useLanguage } from "@/i18n/language";
import { heritageSites } from "@/data/heritage";
import { getHeritageDetail } from "@/data";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SITE_POSITIONS } from "./KathmanduScene";
import {
  HeritageModelViewer,
  type ViewerContext,
} from "./HeritageModelViewer";
import { buildKonchaDyo } from "@/components/game/heritage/models/KonchaDyoModel";
import {
  buildSiddhiGanesh,
  GANESH_VIEWS,
} from "@/components/game/heritage/models/SiddhiGaneshModel";

const KathmanduScene = dynamic(
  () => import("./KathmanduScene").then((m) => m.KathmanduScene),
  { ssr: false, loading: () => <WorldLoading /> },
);

function WorldLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#1a0d0d]">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F7F0E3]/20 border-t-[#F2C14E]" />
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#F7F0E3]/60">
        Loading Kathmandu Galli…
      </p>
    </div>
  );
}

/** Graceful failure state if the WebGL bundle fails to load/render */
class WorldErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#1a0d0d] p-6 text-center">
          <p className="font-display text-xl text-[#F7F0E3]">The world could not be loaded</p>
          <p className="max-w-sm text-sm text-[#F7F0E3]/60">
            Your device may not support WebGL, or the 3D assets failed to load. You can still browse all heritage sites.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { this.setState({ failed: false }); this.props.onRetry(); }}
              className="rounded-full bg-[#F7F0E3] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#830000]"
            >
              Retry
            </button>
            <Link
              href="/heritage"
              className="rounded-full border border-[#F7F0E3]/35 px-5 py-2.5 text-xs font-semibold text-[#F7F0E3]"
            >
              Browse heritage
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MODEL_SLUGS = new Set(["koncha-dyo", "siddhi-ganesh"]);

function SitePanel({ slug, onClose, onViewModel }: { slug: string; onClose: () => void; onViewModel?: (s: string) => void }) {
  const { lang } = useLanguage();
  const site = heritageSites.find((s) => s.slug === slug);
  const detail = getHeritageDetail(slug);
  const ne = detail?.ne;
  if (!site || !detail) return null;
  const name = lang === "ne" ? (ne?.name ?? site.nameNe ?? site.name) : site.name;
  const summary =
    lang === "ne" ? (ne?.summary ?? site.summaryNe ?? site.summary) : (detail.summary ?? site.summary);
  const intro = lang === "ne" ? ne?.introduction?.[0] : detail.introduction[0];
  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-30 max-h-[46vh] overflow-y-auto rounded-3xl border border-[#E8DED2] bg-[#F7F0E3]/97 p-5 shadow-2xl backdrop-blur-md sm:left-6 sm:right-auto sm:w-[26rem]">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#830000]/10 text-[#3D0000] hover:bg-[#830000]/20"
      >
        <X size={15} />
      </button>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#830000]">
        {lang === "ne" ? "सम्पदा स्थल" : "Heritage Site"}
      </p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-[#3D0000]">{name}</h3>
      {summary && <p className="mt-2 text-sm leading-relaxed text-[#4A2929]/85">{summary}</p>}
      {intro && <p className="mt-2 text-sm leading-relaxed text-[#4A2929]/70">{intro}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {MODEL_SLUGS.has(slug) && onViewModel && (
          <button
            onClick={() => onViewModel(slug)}
            className="rounded-full bg-[#F2C14E] px-4 py-2 text-xs font-bold text-[#3D0000] shadow hover:brightness-95"
          >
            {lang === "ne" ? "३डी मोडेल हेर्नुहोस्" : "View 3D model"}
          </button>
        )}
        <Link
          href={`/heritage/${slug}`}
          className="rounded-full bg-[#830000] px-4 py-2 text-xs font-semibold text-white hover:bg-[#BC0202]"
        >
          {lang === "ne" ? "पूरा कथा पढ्नुहोस्" : "Read full story"}
        </Link>
        <Link
          href="/heritage"
          className="rounded-full border border-[#830000]/30 px-4 py-2 text-xs font-semibold text-[#830000] hover:border-[#BC0202]"
        >
          {lang === "ne" ? "सबै स्थलहरू" : "All sites"}
        </Link>
      </div>
    </div>
  );
}

/** Fullscreen 3D destination popup — independent orbit camera, does not
    touch the world player/camera state. */
function ModelPopup({ slug, onClose }: { slug: string; onClose: () => void }) {
  const { lang } = useLanguage();
  const [ctx, setCtx] = useState<ViewerContext | null>(null);
  const [devotional, setDevotional] = useState(false);
  const [wire, setWire] = useState(false);
  const [preset, setPreset] = useState("golden");
  const isKoncha = slug === "koncha-dyo";
  const site = heritageSites.find((s) => s.slug === slug);
  const detail = getHeritageDetail(slug);
  const ne = detail?.ne;
  const name = lang === "ne" ? (ne?.name ?? site?.nameNe ?? site?.name) : site?.name;
  const summary = lang === "ne" ? (ne?.summary ?? site?.summaryNe ?? site?.summary) : site?.summary;

  const KONCHA_VIEWS = {
    orbit: { p: [5.5, 3.8, 7.5] as [number, number, number], t: [0, 1.2, 0] as [number, number, number] },
    sanctum: { p: [0.1, 1.0, 2.2] as [number, number, number], t: [0, 0.8, -0.2] as [number, number, number] },
    torana: { p: [0, 2.4, 2.6] as [number, number, number], t: [0, 2.0, 0.8] as [number, number, number] },
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#1a0d0d]">
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#F7F0E3]/10 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F2C14E]">
            {lang === "ne" ? "सम्पदा गन्तव्य" : "Heritage Destination"}
          </p>
          <h2 className="truncate font-display text-lg font-semibold text-[#F7F0E3] sm:text-xl">{name}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close model"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F0E3]/10 text-[#F7F0E3] hover:bg-[#F7F0E3]/20"
        >
          <X size={18} />
        </button>
      </div>

      {/* 3D viewer */}
      <div className="relative min-h-0 flex-1">
        <HeritageModelViewer
          build={isKoncha ? () => buildKonchaDyo() : () => buildSiddhiGanesh()}
          className="h-full w-full"
          onReady={setCtx}
        />
        {/* model controls */}
        <div className="absolute bottom-3 left-1/2 z-10 flex max-w-[94vw] -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#F7F0E3]/15 bg-[#241612]/90 px-3 py-2 backdrop-blur">
          {isKoncha ? (
            <>
              {(["orbit", "sanctum", "torana"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => ctx?.focus(KONCHA_VIEWS[v].p, KONCHA_VIEWS[v].t)}
                  className="rounded-full bg-[#F7F0E3]/10 px-3 py-1.5 text-[11px] font-semibold capitalize text-[#F7F0E3] hover:bg-[#F7F0E3]/20"
                >
                  {v === "orbit" ? (lang === "ne" ? "परिक्रमा" : "Orbit") : v === "sanctum" ? (lang === "ne" ? "गर्भगृह" : "Sanctum") : (lang === "ne" ? "तोरणा" : "Torana")}
                </button>
              ))}
              <span className="mx-1 h-4 w-px bg-[#F7F0E3]/20" />
              <button
                onClick={() => { const nv = !devotional; setDevotional(nv); ctx?.api?.setLighting?.(nv ? "devotional" : "day"); }}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${devotional ? "bg-[#F2C14E] text-[#3D0000]" : "bg-[#F7F0E3]/10 text-[#F7F0E3] hover:bg-[#F7F0E3]/20"}`}
              >
                {lang === "ne" ? "भक्तिपूर्ण प्रकाशित" : "Devotional Glow"}
              </button>
              <button
                onClick={() => { const nw = !wire; setWire(nw); ctx?.api?.setWireframe?.(nw); }}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${wire ? "bg-[#F7F0E3]/25 text-[#F7F0E3]" : "bg-[#F7F0E3]/10 text-[#F7F0E3] hover:bg-[#F7F0E3]/20"}`}
              >
                {lang === "ne" ? "तार" : "Wireframe"}
              </button>
            </>
          ) : (
            <>
              {(["golden", "day", "dusk", "night"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPreset(p); ctx?.api?.setLightingPreset?.(p); }}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize ${preset === p ? "bg-[#F2C14E] text-[#3D0000]" : "bg-[#F7F0E3]/10 text-[#F7F0E3] hover:bg-[#F7F0E3]/20"}`}
                >
                  {p}
                </button>
              ))}
              <span className="mx-1 h-4 w-px bg-[#F7F0E3]/20" />
              {(["full", "temple", "stupa"] as const).map((v) => {
                const view = GANESH_VIEWS[v];
                return (
                  <button
                    key={v}
                    onClick={() => ctx?.focus(view.position, view.target)}
                    className="rounded-full bg-[#F7F0E3]/10 px-3 py-1.5 text-[11px] font-semibold capitalize text-[#F7F0E3] hover:bg-[#F7F0E3]/20"
                  >
                    {v}
                  </button>
                );
              })}
              <button
                onClick={() => { const nw = !wire; setWire(nw); ctx?.api?.setWiresVisible?.(nw); }}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${wire ? "bg-[#F7F0E3]/25 text-[#F7F0E3]" : "bg-[#F7F0E3]/10 text-[#F7F0E3] hover:bg-[#F7F0E3]/20"}`}
              >
                {lang === "ne" ? "तार" : "Wires"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* info strip */}
      <div className="max-h-32 overflow-y-auto border-t border-[#F7F0E3]/10 px-4 py-3 sm:px-6">
        {summary && <p className="text-xs leading-relaxed text-[#F7F0E3]/70">{summary}</p>}
        <Link
          href={`/heritage/${slug}`}
          className="mt-2 inline-block text-[11px] font-semibold text-[#F2C14E] hover:underline"
        >
          {lang === "ne" ? "पूरा कथा पढ्नुहोस् →" : "Read full story →"}
        </Link>
      </div>
    </div>
  );
}

export function WorldIntro() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [mode, setMode] = useState<"welcome" | "explore">("welcome");
  const [selected, setSelected] = useState<string | null>(null);
  const [near, setNear] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [worldReady, setWorldReady] = useState(false);
  const [modelSlug, setModelSlug] = useState<string | null>(null);
  const [worldRetry, setWorldRetry] = useState(0);
  const [search, setSearch] = useState("");
  const inputRef = useRef({ x: 0, z: 0 });
  const keys = useRef<Set<string>>(new Set());
  const playerPos = useRef(new THREE.Vector3(0, 0, 30));
  const menuRef = useRef<HTMLDivElement>(null);

  // Keyboard movement
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
        keys.current.add(e.key.toLowerCase());
        if (e.key === " ") e.preventDefault();
      }
      if (e.key === "Escape") { setSelected(null); setMenuOpen(false); }
      if (e.key === "Enter" && near) setSelected(near);
      if (e.key.toLowerCase() === "m") setMenuOpen((v) => !v);
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [near]);

  // translate key set → input vector each frame-ish (cheap interval)
  useEffect(() => {
    const id = setInterval(() => {
      const k = keys.current;
      let x = 0, z = 0;
      if (k.has("w") || k.has("arrowup")) z -= 1;
      if (k.has("s") || k.has("arrowdown")) z += 1;
      if (k.has("a") || k.has("arrowleft")) x -= 1;
      if (k.has("d") || k.has("arrowright")) x += 1;
      const len = Math.hypot(x, z) || 1;
      inputRef.current.x = x / len;
      inputRef.current.z = z / len;
      // stop when no keys
      if (x === 0 && z === 0) { inputRef.current.x = 0; inputRef.current.z = 0; }
    }, 50);
    return () => clearInterval(id);
  }, []);

  // joystick writes into inputRef via custom event
  useEffect(() => {
    const onJoy = (e: Event) => {
      const d = (e as CustomEvent).detail as { x: number; z: number };
      inputRef.current.x = d.x;
      inputRef.current.z = d.z;
    };
    window.addEventListener("hoc:joystick", onJoy);
    return () => window.removeEventListener("hoc:joystick", onJoy);
  }, []);

  // outside click closes menu
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const explore = useCallback(() => router.push("/explore"), [router]);
  const q = search.trim().toLowerCase();
  const results = q
    ? heritageSites.filter((s) => {
        const n = `${s.name} ${s.nameNe ?? ""}`.toLowerCase();
        return n.includes(q);
      })
    : heritageSites;

  const isExplore = mode === "explore";

  return (
    <div className={isExplore ? "fixed inset-0 z-40 bg-[#1a0d0d]" : "relative min-h-[100svh] bg-[#1a0d0d]"}>
      {/* 3D world — always mounted; orbit view on welcome, playable in explore */}
      <div className={isExplore ? "absolute inset-0" : "absolute inset-y-0 right-0 w-full lg:w-[55%]"}>
        <WorldErrorBoundary onRetry={() => setWorldRetry((n) => n + 1)}>
          <KathmanduScene
            key={worldRetry}
            inputRef={inputRef}
            playerPos={playerPos}
            selected={selected}
            onSelect={setSelected}
            onNear={setNear}
            autoOrbit={!isExplore}
            onReady={() => setWorldReady(true)}
          />
        </WorldErrorBoundary>
        {/* loading veil until first frame renders */}
        {!worldReady && (
          <div className="pointer-events-none absolute inset-0 z-20 bg-[#1a0d0d] transition-opacity duration-700">
            <WorldLoading />
          </div>
        )}
        {/* legibility gradient on welcome */}
        {!isExplore && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1a0d0d]/70 via-transparent to-transparent" />
        )}
      </div>

      {/* ============ WELCOME PANEL ============ */}
      {!isExplore && (
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 py-10 sm:px-12 lg:w-[45%] lg:px-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/images/ward16-logo.png" alt="Ward 16" width={52} height={52} className="h-13 w-13 object-contain" priority />
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-[#F7F0E3]">Ward 16</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F7F0E3]/60">
                  {lang === "ne" ? "सांस्कृतिक सम्पदा" : "Cultural Heritage"}
                </p>
              </div>
            </div>
            <LanguageSwitcher className="border-[#F7F0E3]/25 bg-[#F7F0E3]/10" />
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#F2C14E]">
              {lang === "ne" ? "इन्टर्याक्टिभ सम्पदा संसार" : "An interactive heritage world"}
            </p>
            <h1 className="font-display text-5xl leading-[1.05] text-[#F7F0E3] sm:text-6xl">
              {lang === "ne" ? "काठमाडौंको कथाहरू पत्ता लगाउनुहोस्" : "Discover the Stories of Kathmandu"}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#F7F0E3]/75">
              {lang === "ne"
                ? "वार्ड १६ का मन्दिर, गली र परम्पराहरू अन्वेषण गर्नुहोस् — सिद्धि गणेश, कोंचा द्यो र छिमेकको जीवन्त सम्पदा, समुदायले अभिलेख गरिएका।"
                : "Walk the gallis of Ward 16 — explore Siddhi Ganesh, Koncha Dyo and the neighbourhood's living heritage, documented by the community."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={explore}
                className="rounded-full bg-[#F7F0E3] px-8 py-4 text-sm font-bold uppercase tracking-wide text-[#830000] shadow-xl transition-transform hover:scale-[1.03] active:scale-95"
              >
                {lang === "ne" ? "अन्वेषण सुरु गर्नुहोस्" : "Start Exploring"}
              </button>
              <button
                onClick={() => router.push("/heritage")}
                className="rounded-full border border-[#F7F0E3]/35 px-8 py-4 text-sm font-semibold text-[#F7F0E3] backdrop-blur transition-colors hover:border-[#F2C14E] hover:text-[#F2C14E]"
              >
                {lang === "ne" ? "खेल बिना हेर" : "Browse Without Playing"}
              </button>
            </div>
            <div className="mt-10 hidden gap-6 text-xs text-[#F7F0E3]/55 md:flex">
              <span><b className="text-[#F7F0E3]/80">W A S D</b> / {lang === "ne" ? "चल्नुहोस्" : "move"}</span>
              <span><b className="text-[#F7F0E3]/80">Enter</b> / {lang === "ne" ? "खोल्नुहोस्" : "open site"}</span>
              <span><b className="text-[#F7F0E3]/80">M</b> / {lang === "ne" ? "मेनु" : "menu"}</span>
              <span><b className="text-[#F7F0E3]/80">Esc</b> / {lang === "ne" ? "बन्द" : "close"}</span>
            </div>
          </div>

          <div className="flex items-end justify-between text-[11px] text-[#F7F0E3]/40">
            <span>Ward 16 · Kathmandu</span>
            <span>{heritageSites.length} {lang === "ne" ? "सम्पदा स्थलहरू" : "heritage sites"}</span>
          </div>
        </div>
      )}

      {/* ============ EXPLORE HUD ============ */}
      {isExplore && (
        <>
          {/* top-left menu */}
          <div ref={menuRef} className="absolute left-4 top-4 z-30">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8DED2] bg-[#F7F0E3]/95 text-[#3D0000] shadow-lg backdrop-blur"
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span className="flex flex-col gap-1"><span className="h-0.5 w-4 bg-current" /><span className="h-0.5 w-4 bg-current" /><span className="h-0.5 w-4 bg-current" /></span>
            </button>
            {menuOpen && (
              <div className="absolute left-0 top-14 w-64 rounded-3xl border border-[#E8DED2] bg-[#F7F0E3]/97 p-3 shadow-2xl backdrop-blur-md animate-[menuIn_.25s_ease-out_both]">
                <div className="px-2 pb-2">
                  <div className="flex items-center gap-2 rounded-full border border-[#E8DED2] bg-white/60 px-3 py-1.5">
                    <Search size={13} className="text-[#4A2929]/50" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={lang === "ne" ? "सम्पदा खोज्नुहोस्…" : "Search heritage…"}
                      className="w-full bg-transparent text-xs text-[#4A2929] outline-none"
                    />
                  </div>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {results.map((s) => {
                    const pos = SITE_POSITIONS[s.slug];
                    return (
                      <button
                        key={s.slug}
                        onClick={() => { setSelected(s.slug); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#3D0000] hover:bg-[#830000]/10"
                      >
                        <Landmark size={14} className="shrink-0 text-[#830000]" />
                        <span className="truncate">{lang === "ne" && s.nameNe ? s.nameNe : s.name}</span>
                        {pos && <span className="ml-auto text-[10px] text-[#4A2929]/40">{Math.round(pos[0])},{Math.round(pos[1])}</span>}
                      </button>
                    );
                  })}
                  {results.length === 0 && <p className="px-3 py-2 text-xs text-[#4A2929]/60">{lang === "ne" ? "फेला परेन" : "No sites found"}</p>}
                </div>
                <div className="my-1.5 h-px bg-[#E8DED2]" />
                {[
                  { label: lang === "ne" ? "गृहपृष्ठ" : "Home", fn: () => router.push("/") },
                  { label: lang === "ne" ? "वार्ड १६ बारे" : "About Ward 16", fn: () => router.push("/about") },
                  { label: lang === "ne" ? "नक्सा" : "Map", fn: () => router.push("/map") },
                ].map((item) => (
                  <button key={item.label} onClick={item.fn} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm text-[#3D0000] hover:bg-[#830000]/10">
                    {item.label}
                  </button>
                ))}
                <div className="mt-1 flex items-center justify-between px-2 py-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4A2929]/50">{t.nav.language}</span>
                  <LanguageSwitcher />
                </div>
              </div>
            )}
          </div>

          {/* top-right: exit to browse + near prompt */}
          <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
            {near && !selected && (
              <button
                onClick={() => setSelected(near)}
                className="flex items-center gap-2 rounded-full bg-[#830000] px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-[menuIn_.25s_ease-out_both]"
              >
                <MapIcon size={13} />
                {lang === "ne" ? "स्थल खोल्नुहोस्" : "Enter site"} · {heritageSites.find(s => s.slug === near)?.nameNe ?? heritageSites.find(s => s.slug === near)?.name}
              </button>
            )}
            <button
              onClick={() => setMode("welcome")}
              className="flex h-11 items-center gap-2 rounded-full border border-[#E8DED2] bg-[#F7F0E3]/95 px-4 text-xs font-semibold text-[#3D0000] shadow-lg backdrop-blur"
            >
              <X size={14} /> {lang === "ne" ? "बन्द" : "Exit"}
            </button>
          </div>

          {/* bottom hint + joystick (touch) */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-[#1a0d0d]/70 px-5 py-2 text-[11px] font-medium text-[#F7F0E3]/85 backdrop-blur">
            {lang === "ne" ? "हिँड्न WASD/तीर · मार्कर थिच्नुहोस् वा Enter" : "WASD / arrows to walk · click a marker or press Enter"}
          </div>
          <TouchJoystick />

          {/* site info panel */}
          {selected && <SitePanel slug={selected} onClose={() => setSelected(null)} onViewModel={setModelSlug} />}
          {/* 3D destination popup */}
          {modelSlug && <ModelPopup slug={modelSlug} onClose={() => setModelSlug(null)} />}
        </>
      )}
    </div>
  );
}

/** Minimal touch joystick — writes vector into the shared input via event */
function TouchJoystick() {
  const [active, setActive] = useState(false);
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const origin = useRef({ x: 0, y: 0 });

  const update = (clientX: number, clientY: number) => {
    const dx = clientX - origin.current.x;
    const dy = clientY - origin.current.y;
    const max = 48;
    const len = Math.hypot(dx, dy);
    const cl = len > max ? max / len : 1;
    const nx = (dx * cl) / max;
    const ny = (dy * cl) / max;
    if (knob.current) knob.current.style.transform = `translate(${nx * max}px, ${ny * max}px)`;
    window.dispatchEvent(new CustomEvent("hoc:joystick", { detail: { x: nx, z: ny } }));
  };
  const end = () => {
    setActive(false);
    if (knob.current) knob.current.style.transform = "translate(0,0)";
    window.dispatchEvent(new CustomEvent("hoc:joystick", { detail: { x: 0, z: 0 } }));
  };

  return (
    <div
      ref={base}
      className="absolute bottom-16 left-5 z-30 hidden h-28 w-28 touch-none items-center justify-center rounded-full border border-[#E8DED2]/40 bg-[#F7F0E3]/15 backdrop-blur-sm sm:flex"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        origin.current = { x: e.clientX, y: e.clientY };
        setActive(true);
      }}
      onPointerMove={(e) => active && update(e.clientX, e.clientY)}
      onPointerUp={end}
      onPointerCancel={end}
      role="application"
      aria-label="Movement joystick"
    >
      <div ref={knob} className="h-12 w-12 rounded-full bg-[#F7F0E3]/80 shadow-lg" />
    </div>
  );
}
