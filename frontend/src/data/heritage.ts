import type { HeritageSite } from "./types";

/**
 * The six documented heritage locations of Ward 16.
 * Structured to map directly onto future Prisma models.
 */
export const heritageSites: HeritageSite[] = [
  {
    slug: "siddhi-ganesh",
    name: "Siddhi Ganesh Temple",
    nameNe: "सिद्धि गणेश मन्दिर",
    summary:
      "A beloved neighbourhood temple regarded by the community as the area's original and significant Ganesh idol.",
    summaryNe: "क्षेत्रको मूल र महत्त्वपूर्ण गणेश प्रतिमा मानिने मनपर्ने छिमेकी मन्दिर।",
    imageAlt: "Siddhi Ganesh Temple, Ward 16",
    status: "documented",
    featured: true,
  },
  {
    slug: "koncha-dyo",
    name: "Koncha Dyo",
    nameNe: "कोंचा द्यो",
    summary:
      "A traditional Newar heritage site whose vessel-like form recalls the Gagro once used in religious offerings.",
    summaryNe: "परम्परागत नेवार सम्पदा स्थान",
    imageAlt: "Koncha Dyo, Ward 16",
    status: "documented",
    featured: true,
  },
  {
    slug: "22-dhara",
    name: "22 Dhara",
    nameNe: "२२ धारा",
    summary: null,
    imageAlt: "22 Dhara, Ward 16",
    status: "pending",
  },
  {
    slug: "sitala-ajima",
    name: "Sitala Ajima",
    nameNe: "सिताला अजिमा",
    summary: null,
    imageAlt: "Sitala Ajima, Ward 16",
    status: "pending",
  },
  {
    slug: "mhepi-ajima",
    name: "Mhepi Ajima",
    nameNe: "मेपि अजिमा",
    summary: null,
    imageAlt: "Mhepi Ajima, Ward 16",
    status: "pending",
  },
  {
    slug: "gurunakak",
    name: "Gurunakak",
    nameNe: "गुरुनाक",
    summary: null,
    imageAlt: "Gurunakak, Ward 16",
    status: "pending",
  },
];

export function getSiteBySlug(slug: string): HeritageSite | undefined {
  return heritageSites.find((site) => site.slug === slug);
}

export function getFeaturedSites(): HeritageSite[] {
  return heritageSites.filter((site) => site.featured);
}

export function getOtherSites(): HeritageSite[] {
  return heritageSites.filter((site) => !site.featured);
}
