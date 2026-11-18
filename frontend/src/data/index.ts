import { heritageSites } from "./heritage";
import { siddhiGanesh } from "./siddhiGanesh";
import { konchaDyo } from "./konchaDyo";
import { siddhiGaneshNe } from "./siddhiGanesh.ne";
import { konchaDyoNe } from "./konchaDyo.ne";
import type { HeritageDetail, HeritageDetailNe } from "./types";

/**
 * Registry of fully documented heritage sites.
 * To document a new site: create a data file (+ optional .ne.ts
 * translation) and register it here.
 */

// The .ne.ts files mirror the English detail shape; pick the fields
// that make up HeritageDetailNe.
function toNe(src: {
  name: string;
  summary: string | null;
  introduction: string[];
  sections: HeritageDetail["sections"];
  gallery: { alt: string; caption?: string }[];
  videos: { title: string; description?: string }[];
  location: HeritageDetail["location"];
  references?: string[];
}): HeritageDetailNe {
  return {
    name: src.name,
    summary: src.summary,
    introduction: src.introduction,
    sections: src.sections,
    gallery: src.gallery,
    videos: src.videos,
    location: src.location,
    references: src.references,
    // Body paragraphs may still be English pending translation review
    reviewPending: src.sections.some((s) =>
      s.blocks.some((b) =>
        b.paragraphs.some((p) => /[A-Za-z]{4,}/.test(p) && !/[ऀ-ॿ]/.test(p)),
      ),
    ),
  };
}

const details: Record<string, HeritageDetail> = {
  "siddhi-ganesh": { ...siddhiGanesh, ne: toNe(siddhiGaneshNe) },
  "koncha-dyo": { ...konchaDyo, ne: toNe(konchaDyoNe) },
};

export function getHeritageDetail(slug: string): HeritageDetail | undefined {
  return details[slug];
}

export function getAllDetailSlugs(): string[] {
  return Object.keys(details);
}

export function getRelatedSites(slugs: string[]) {
  return slugs
    .map((slug) => heritageSites.find((site) => site.slug === slug))
    .filter((site): site is NonNullable<typeof site> => Boolean(site));
}
