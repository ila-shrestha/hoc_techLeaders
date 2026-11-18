"use client";

/** Local exploration progress — stored in the browser only. */

const EXPLORED_KEY = "ward16-explored";
const SEEN_KEY = "ward16-seen-sites";

export function getExplored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(EXPLORED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function setExplored(slugs: string[]) {
  window.localStorage.setItem(EXPLORED_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event("ward16-progress"));
}

export function toggleExplored(slug: string): string[] {
  const current = getExplored();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  setExplored(next);
  return next;
}

export function hasSeenSite(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const seen: string[] = JSON.parse(
      window.localStorage.getItem(SEEN_KEY) ?? "[]",
    );
    return seen.includes(slug);
  } catch {
    return false;
  }
}

export function markSiteSeen(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const seen: string[] = JSON.parse(
      window.localStorage.getItem(SEEN_KEY) ?? "[]",
    );
    if (!seen.includes(slug)) {
      seen.push(slug);
      window.localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
      window.dispatchEvent(new Event("ward16-progress"));
    }
  } catch {
    /* ignore */
  }
}
