export type SourceKind = "documented" | "interview" | "community-belief" | "folklore" | "placeholder";

export type StorySection = {
  eyebrow: string;
  title: string;
  body: string[];
  source: SourceKind;
};

export type GalleryItem = {
  label: string;
  image: string;
  alt: string;
};

export type HeritageSite = {
  slug: string;
  name: string;
  type: string;
  shortDescription: string;
  cardDescription: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  documented: boolean;
  sourceLabel: string;
  intro: string;
  sections: StorySection[];
  rituals: string[];
  gallery: GalleryItem[];
  location: string;
  visitorNote: string;
  sources: string[];
  related: string[];
};

const visualPlaceholders = {
  hero: "/manus-storage/async-images/217bpi8hh9gCRZPXKR96Ca/image-1.webp",
  siddhi: "/manus-storage/async-images/217bpi8hh9gCRZPXKR96Ca/image-2.webp",
  koncha: "/manus-storage/async-images/217bpi8hh9gCRZPXKR96Ca/image-3.webp",
};

export const heritageSites: HeritageSite[] = [
  {
    slug: "siddhi-ganesh",
    name: "Siddhi Ganesh Temple",
    type: "Temple · documented story",
    shortDescription: "A living account of worship, memory, and the community keeping a neighborhood temple present.",
    cardDescription: "Interview-based documentation from Siddhi Ganesh Puja Samiti, shared with care and clear source notes.",
    image: visualPlaceholders.siddhi,
    imageAlt: "Warm editorial placeholder image of carved timber, a stone threshold, and ritual cloth",
    featured: true,
    documented: true,
    sourceLabel: "Interview-led story",
    intro: "The Siddhi Ganesh story is rooted in recollection: a once sparsely settled landscape, a neighborhood that grew around it, and a temple whose meaning continues through everyday acts of worship.",
    sections: [
      {
        eyebrow: "Historical background",
        title: "From fields and water to a growing settlement",
        body: [
          "According to the interview documentation, the surrounding area was previously known as Sallaghari. At that time, there were few residential houses and much of the land was occupied by agricultural fields.",
          "People used the Bishnumati River for bathing, while a well served as an important water source. The area gradually developed into a more populated settlement, changing the context around the temple while retaining the memory of what came before."
        ],
        source: "interview",
      },
      {
        eyebrow: "Religious significance",
        title: "A place people return to with hope",
        body: [
          "The local community regards Siddhi Ganesh as the original and significant Ganesh idol in the area. Community beliefs associate worship with prosperity, happiness, and well-being.",
          "Newly married couples traditionally visit the temple after marriage. People also come to offer prayers and make wishes, giving the temple a continuing role in everyday and life-cycle moments."
        ],
        source: "community-belief",
      },
      {
        eyebrow: "Local folklore",
        title: "A giant snake near the well",
        body: [
          "A traditional story shared during the interview tells of a giant snake believed to have lived near the well. It is presented here as local folklore and an interviewee account, not as a scientifically verified historical event."
        ],
        source: "folklore",
      },
      {
        eyebrow: "Cultural structures",
        title: "A shared temple space",
        body: [
          "The temple premises include the main Siddhi Ganesh idol, a Buddhist Chaitya, and a Patti. Together, these structures point to the layered cultural life held within a single neighborhood setting."
        ],
        source: "interview",
      },
      {
        eyebrow: "Community involvement",
        title: "Preservation happens through participation",
        body: [
          "The Siddhi Ganesh Puja Samiti helps organize religious activity and care for the site. Community donations, voluntary religious activities, and local participation all contribute to keeping the temple active and maintained."
        ],
        source: "interview",
      },
      {
        eyebrow: "Current preservation challenges",
        title: "Care also means making the site safer",
        body: [
          "The interview documentation notes drainage and water blockage issues around the temple, particularly during the monsoon season. Recording these challenges makes preservation practical as well as symbolic."
        ],
        source: "interview",
      },
    ],
    rituals: ["Ganesh Chaturthi", "Chyamma Puja", "Devali Puja", "Dumbhe Puja", "Tisabicha"],
    gallery: [
      { label: "Carved timber / visual placeholder", image: visualPlaceholders.siddhi, alt: "Carved timber and warm temple courtyard details" },
      { label: "Stone threshold / visual placeholder", image: visualPlaceholders.hero, alt: "Stone threshold and warm brass lamp details" },
      { label: "Future field photograph", image: visualPlaceholders.siddhi, alt: "Placeholder for a future verified field photograph" },
    ],
    location: "Ward 16 · exact visitor directions to be added after community verification",
    visitorNote: "Traditional Tuesday worship activities and major festival occasions are the most relevant visitor moments noted in the documentation. Please be respectful of ongoing religious activity.",
    sources: ["Interview documentation with Shantaram Maharjan, President of Siddhi Ganesh Puja Samiti", "Community accounts recorded for the Ward 16 heritage documentation project"],
    related: ["koncha-dyo", "22-dhara"],
  },
  {
    slug: "koncha-dyo",
    name: "Koncha Dyo",
    type: "Shrine · interview-led story",
    shortDescription: "A vessel-shaped shrine whose traditional meaning is carried through Newar community practice and memory.",
    cardDescription: "A careful introduction to the traditional Gagro form, ritual association, and the work of keeping its meaning visible.",
    image: visualPlaceholders.koncha,
    imageAlt: "Editorial placeholder image of a vessel-like stone shrine form and brass vessel",
    featured: true,
    documented: true,
    sourceLabel: "Interview-led story",
    intro: "Koncha Dyo is described through community memory: a vessel-like form, traditional Newar religious associations, and a cultural meaning that local people want younger generations to recognize.",
    sections: [
      {
        eyebrow: "Historical background",
        title: "A form remembered through its associations",
        body: [
          "The interview notes associate Koncha Dyo with the traditional Newar community. The structure is described as resembling a traditional Gagro, a vessel used for storing liquid.",
          "The surrounding area was previously known as Sallaghari. Amod Rajbhandari is mentioned in connection with the historical background of the area; the notes do not establish dates or a complete architectural history."
        ],
        source: "interview",
      },
      {
        eyebrow: "Traditional Gagro",
        title: "A vessel-like structure with ritual meaning",
        body: [
          "The vessel-like structure is traditionally associated with alcohol offerings during religious practices. This explanation is kept close to the interview notes and does not add ritual details that were not documented."
        ],
        source: "interview",
      },
      {
        eyebrow: "Religious and cultural significance",
        title: "A living connection to Newar practice",
        body: [
          "The site is connected in the notes to traditional Newar religious practices, alcohol offerings, and traditional connections with Samay Baje. These meanings are presented as community beliefs and interview-based accounts rather than as independently verified historical facts."
        ],
        source: "community-belief",
      },
      {
        eyebrow: "Marriage-related beliefs",
        title: "Blessings for a shared life",
        body: [
          "A community belief holds that newly married couples who visit Koncha Dyo receive blessings for a happy, prosperous, and successful married life. It is a belief shared through local tradition and recorded as such here."
        ],
        source: "community-belief",
      },
      {
        eyebrow: "Community involvement",
        title: "The Puja Samiti and local care",
        body: [
          "The Puja Samiti, local donations, and community participation help keep the site present. This kind of collective care is part of the cultural preservation story even when the physical site is modest."
        ],
        source: "interview",
      },
      {
        eyebrow: "Cultural preservation",
        title: "Making the meaning visible again",
        body: [
          "The notes highlight declining awareness of the site's traditional significance, especially among younger generations and people outside the local community. Documentation can help create a bridge between inherited practice and future understanding."
        ],
        source: "interview",
      },
    ],
    rituals: ["Traditional alcohol offerings", "Connections with Samay Baje", "Marriage-related visits described in community belief"],
    gallery: [
      { label: "Gagro form / visual placeholder", image: visualPlaceholders.koncha, alt: "Vessel-like shrine form and brass vessel details" },
      { label: "Brick platform / visual placeholder", image: visualPlaceholders.hero, alt: "Warm brick and carved timber editorial detail" },
      { label: "Future field photograph", image: visualPlaceholders.koncha, alt: "Placeholder for a future verified field photograph" },
    ],
    location: "Ward 16 · exact visitor directions to be added after community verification",
    visitorNote: "Please approach the site as an active place of cultural and religious meaning. Further visiting guidance will be added with community input.",
    sources: ["Koncha Dyo interview notes", "Community accounts recorded for the Ward 16 heritage documentation project"],
    related: ["siddhi-ganesh", "sitala-ajima"],
  },
  {
    slug: "22-dhara",
    name: "22 Dhara",
    type: "Water heritage · documentation pending",
    shortDescription: "A Ward 16 heritage location waiting for its documented story to be added.",
    cardDescription: "More information coming soon. This card is ready for future community-verified documentation.",
    image: visualPlaceholders.hero,
    imageAlt: "Warm editorial placeholder image awaiting verified site photography",
    featured: false,
    documented: false,
    sourceLabel: "Documentation pending",
    intro: "This heritage location is part of the Ward 16 collection. Its historical and cultural description will be added when documentation is available.",
    sections: [], rituals: [], gallery: [], location: "Ward 16 · visitor information to be added", visitorNote: "Documentation pending.", sources: [], related: ["siddhi-ganesh"],
  },
  {
    slug: "sitala-ajima",
    name: "Sitala Ajima",
    type: "Shrine · documentation pending",
    shortDescription: "A Ward 16 heritage location waiting for its documented story to be added.",
    cardDescription: "More information coming soon. This card is ready for future community-verified documentation.",
    image: visualPlaceholders.hero,
    imageAlt: "Warm editorial placeholder image awaiting verified site photography",
    featured: false,
    documented: false,
    sourceLabel: "Documentation pending",
    intro: "This heritage location is part of the Ward 16 collection. Its historical and cultural description will be added when documentation is available.",
    sections: [], rituals: [], gallery: [], location: "Ward 16 · visitor information to be added", visitorNote: "Documentation pending.", sources: [], related: ["koncha-dyo"],
  },
  {
    slug: "mhepi-ajima",
    name: "Mhepi Ajima",
    type: "Shrine · documentation pending",
    shortDescription: "A Ward 16 heritage location waiting for its documented story to be added.",
    cardDescription: "More information coming soon. This card is ready for future community-verified documentation.",
    image: visualPlaceholders.hero,
    imageAlt: "Warm editorial placeholder image awaiting verified site photography",
    featured: false,
    documented: false,
    sourceLabel: "Documentation pending",
    intro: "This heritage location is part of the Ward 16 collection. Its historical and cultural description will be added when documentation is available.",
    sections: [], rituals: [], gallery: [], location: "Ward 16 · visitor information to be added", visitorNote: "Documentation pending.", sources: [], related: ["siddhi-ganesh"],
  },
  {
    slug: "gurunakak",
    name: "Gurunakak",
    type: "Heritage location · documentation pending",
    shortDescription: "A Ward 16 heritage location waiting for its documented story to be added.",
    cardDescription: "More information coming soon. This card is ready for future community-verified documentation.",
    image: visualPlaceholders.hero,
    imageAlt: "Warm editorial placeholder image awaiting verified site photography",
    featured: false,
    documented: false,
    sourceLabel: "Documentation pending",
    intro: "This heritage location is part of the Ward 16 collection. Its historical and cultural description will be added when documentation is available.",
    sections: [], rituals: [], gallery: [], location: "Ward 16 · visitor information to be added", visitorNote: "Documentation pending.", sources: [], related: ["koncha-dyo"],
  },
];

export const documentedSites = heritageSites.filter((site) => site.documented);
export const futureSites = heritageSites.filter((site) => !site.documented);

export function getHeritageSite(slug: string) {
  return heritageSites.find((site) => site.slug === slug);
}

export function sourceLabel(source: SourceKind) {
  return {
    documented: "Documented",
    interview: "Interview account",
    "community-belief": "Community belief",
    folklore: "Local folklore",
    placeholder: "Documentation pending",
  }[source];
}
