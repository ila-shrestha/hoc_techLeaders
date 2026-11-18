import type { HeritageDetail } from "./types";

/**
 * Koncha Dyo — content organized from the provided interview notes.
 * Religious beliefs are presented as community beliefs and
 * interview-based accounts, not verified historical facts.
 */
export const konchaDyo: HeritageDetail = {
  slug: "koncha-dyo",
  name: "Koncha Dyo",
  summary:
    "A traditional Newar heritage site whose vessel-like form recalls the Gagro once used in religious offerings.",
  imageAlt: "Koncha Dyo, Ward 16",
  status: "documented",
  featured: true,
  introduction: [
    "Koncha Dyo is a distinctive heritage site in Ward 16, shaped by the traditions of the local Newar community. Its unique form and ritual associations make it an important part of the neighbourhood's living cultural identity.",
    "The account below is drawn from the provided interview notes and reflects community beliefs and practices as documented — not independently verified history.",
  ],
  sections: [
    {
      id: "history",
      title: "Historical Background",
      eyebrow: "Documented history",
      blocks: [
        {
          paragraphs: [
            "Koncha Dyo is associated with the traditional Newar community of the area. The surrounding locality was previously known as Sallaghari, the same historic name associated with Siddhi Ganesh Temple.",
            "The structure resembles a traditional Gagro — a liquid storage vessel. In traditional practice, such vessels were associated with alcohol offerings during religious ceremonies. Amod Rajbhandari was mentioned in the interview notes in connection with the historical background of the area.",
          ],
        },
      ],
    },
    {
      id: "significance",
      title: "Religious and Cultural Significance",
      eyebrow: "Community belief",
      blocks: [
        {
          paragraphs: [
            "According to local belief, Koncha Dyo is connected to traditional Newar religious practices. Alcohol offerings and their ritual significance are understood within the framework of these local beliefs, and the site maintains traditional connections with Samay Baje.",
            "The site is also associated with beliefs about newly married couples visiting for blessings — a practice shared across the neighbourhood's heritage sites.",
          ],
        },
      ],
      note: "These practices are described as community beliefs from the interview notes, not as verified religious doctrine or documented history.",
    },
    {
      id: "gagro",
      title: "The Traditional Gagro",
      eyebrow: "Cultural context",
      blocks: [
        {
          paragraphs: [
            "The Gagro is a traditional Newar vessel used to store liquids. Koncha Dyo's form echoes this vessel, reflecting how everyday objects of the community became embedded in religious practice. Understanding the Gagro helps explain why the site's shape carries ritual meaning for local residents.",
          ],
        },
      ],
    },
    {
      id: "marriage",
      title: "Marriage-Related Beliefs",
      eyebrow: "Community belief",
      blocks: [
        {
          paragraphs: [
            "Local tradition holds that newly married couples who visit Koncha Dyo receive blessings for a happy, prosperous, and successful married life. This belief connects the site to one of the most important transitions in community life and helps explain its continued role in local custom.",
          ],
        },
      ],
      note: "Presented as a community belief documented in the interview notes.",
    },
    {
      id: "community",
      title: "Community Involvement",
      eyebrow: "Community life",
      blocks: [
        {
          paragraphs: [
            "Like Siddhi Ganesh Temple, Koncha Dyo is sustained through community participation. A Puja Samiti coordinates worship and observances, residents contribute through local donations, and community members take part in the site's upkeep and cultural activities.",
          ],
        },
      ],
    },
    {
      id: "preservation",
      title: "Cultural Preservation",
      eyebrow: "Looking ahead",
      blocks: [
        {
          paragraphs: [
            "The interview notes highlight a growing concern: awareness of Koncha Dyo's traditional significance is declining, especially among younger generations and people outside the local community. Documenting sites like this — their forms, rituals, and stories — is an important step toward keeping that knowledge alive.",
          ],
        },
      ],
    },
  ],
  gallery: [
    { src: "/images/hero/konchadyo.jpeg", alt: "Koncha Dyo structure", caption: "The vessel-like form of Koncha Dyo" },
    { alt: "Traditional Gagro vessel used in Newar practice", caption: "A traditional Gagro vessel" },
    { alt: "Devotees at Koncha Dyo", caption: "Community visits and worship" },
    { alt: "Koncha Dyo within the Ward 16 streetscape", caption: "Koncha Dyo in its neighbourhood setting" },
  ],
  videos: [
    {
      title: "Koncha Dyo — traditions of the Newar community",
      description:
        "A film exploring the site's history, the Gagro tradition, and its place in Ward 16's cultural life. Video coming soon.",
    },
  ],
  location: {
    landmark: "Sallaghari area, Ward 16",
    note: "The surrounding area was historically known as Sallaghari.",
  },
  references: [
    "Koncha Dyo interview notes (community documentation).",
  ],
  relatedSlugs: ["siddhi-ganesh", "22-dhara", "sitala-ajima", "mhepi-ajima", "gurunakak"],
};
