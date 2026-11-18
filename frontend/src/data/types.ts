export type HeritageStatus = "documented" | "pending";

export interface HeritageSite {
  slug: string;
  name: string;
  /** Nepali name (Devanagari), e.g. सिद्धि गणेश मन्दिर */
  nameNe?: string;
  /** Short card description. Use null until verified info is available. */
  summary: string | null;
  /** Nepali summary for the card */
  summaryNe?: string | null;
  /** Optional real image path under /public. Falls back to placeholder. */
  image?: string;
  /** Alt text for the image / placeholder. */
  imageAlt: string;
  status: HeritageStatus;
  featured?: boolean;
}

export interface ContentBlock {
  /** Optional sub-heading within a section */
  heading?: string;
  paragraphs: string[];
  /** Bullet list items, if any */
  list?: string[];
}

export interface HeritageSection {
  id: string;
  title: string;
  /** Small label above the title, e.g. "Local folklore" */
  eyebrow?: string;
  blocks: ContentBlock[];
  /** Optional framing note, e.g. disclaimer for beliefs/folklore */
  note?: string;
}

export interface GalleryImage {
  src?: string;
  alt: string;
  caption?: string;
}

export interface HeritageVideo {
  title: string;
  description?: string;
  /** Embed URL when available; renders placeholder until then */
  url?: string;
}

export interface LocationInfo {
  address?: string;
  landmark?: string;
  note?: string;
}

/** Nepali translation of a documented heritage site's content.
 *  Same structure as the English fields; body paragraphs may be
 *  marked for review by leaving `reviewPending: true`. */
export interface HeritageDetailNe {
  name: string;
  summary: string | null;
  introduction: string[];
  sections: HeritageSection[];
  gallery: { alt: string; caption?: string }[];
  videos: { title: string; description?: string }[];
  location: LocationInfo;
  /** Nepali translations of the reference citations */
  references?: string[];
  /** True when some body text still awaits translation review */
  reviewPending?: boolean;
}

export interface HeritageDetail extends HeritageSite {
  introduction: string[];
  sections: HeritageSection[];
  gallery: GalleryImage[];
  videos: HeritageVideo[];
  location: LocationInfo;
  references: string[];
  relatedSlugs: string[];
  /** Optional Nepali translation of the content above */
  ne?: HeritageDetailNe;
}
