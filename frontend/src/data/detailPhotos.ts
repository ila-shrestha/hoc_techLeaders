/**
 * Contextual photographs for heritage detail pages.
 *
 * Photos are placed beside the section they relate to — not in a
 * single bottom gallery. Captions describe only what the photograph
 * shows; no cultural or historical claims are added here.
 *
 * To add a photo: add an entry keyed by site slug, then either an
 * `introduction` photo or a `sections` entry keyed by section id
 * (see siddhiGanesh.ts / konchaDyo.ts for the ids). Alt/caption have
 * optional Nepali (`*Ne`) variants; English is the fallback.
 */

export interface DetailPhoto {
  src: string;
  alt: string;
  altNe?: string;
  caption: string;
  captionNe?: string;
}

export interface DetailPhotos {
  /** Photo shown beside the page introduction. */
  introduction?: DetailPhoto;
  /** Photos keyed by HeritageSection.id. */
  sections: Record<string, DetailPhoto>;
}

export const detailPhotos: Record<string, DetailPhotos> = {
  "siddhi-ganesh": {
    introduction: {
      src: "/images/hero/siddhiGaneshoutside.JPG",
      alt: "Siddhi Ganesh Temple exterior",
      altNe: "सिद्धि गणेश मन्दिरको बाहिरी दृश्य",
      caption: "Siddhi Ganesh Temple, viewed from outside.",
      captionNe: "बाहिरबाट लिएको सिद्धि गणेश मन्दिरको दृश्य।",
    },
    sections: {
      history: {
        src: "/images/hero/siddhiGaneshdhara.PNG",
        alt: "Stone water spout at Siddhi Ganesh Temple",
        altNe: "सिद्धि गणेश मन्दिरको ढुङ्गाको धारा",
        caption: "A stone water spout (dhara) at the temple.",
        captionNe: "मन्दिरमा भएको ढुङ्गाको धारा।",
      },
      significance: {
        src: "/images/hero/insideSiddhiGanesh.PNG",
        alt: "Interior of Siddhi Ganesh Temple",
        altNe: "सिद्धि गणेश मन्दिरको भित्री भाग",
        caption: "The interior of Siddhi Ganesh Temple.",
        captionNe: "सिद्धि गणेश मन्दिरको भित्री भाग।",
      },
      structures: {
        src: "/images/hero/chaitiyaoutside siddhiganesh.PNG",
        alt: "Buddhist chaitya on the Siddhi Ganesh Temple premises",
        altNe: "सिद्धि गणेश मन्दिरभित्रको बौद्ध चैत्य",
        caption: "A Buddhist chaitya within the temple premises.",
        captionNe: "मन्दिरभित्रको बौद्ध चैत्य।",
      },
      community: {
        src: "/images/hero/siddhiGaneshNearbyMahadev.PNG",
        alt: "A shrine near Siddhi Ganesh Temple",
        altNe: "सिद्धि गणेश मन्दिर नजिकको मन्दिर",
        caption: "A shrine in the neighbourhood of Siddhi Ganesh Temple.",
        captionNe: "सिद्धि गणेश मन्दिर नजिकको मन्दिर।",
      },
      visit: {
        src: "/images/hero/entrance point fromsorakhutte.PNG",
        alt: "Entrance to the temple area from the Sorakhutte side",
        altNe: "सोराखोटेतर्फबाट मन्दिर क्षेत्रको प्रवेशद्वार",
        caption: "The entrance to the temple area from the Sorakhutte side.",
        captionNe: "सोराखोटेतर्फबाट मन्दिर क्षेत्रको प्रवेशद्वार।",
      },
    },
  },
  "koncha-dyo": {
    introduction: {
      src: "/images/hero/outsidekonchaDyo.jpeg",
      alt: "Koncha Dyo exterior",
      altNe: "कोंचा द्योको बाहिरी दृश्य",
      caption: "Koncha Dyo, viewed from outside.",
    },
    sections: {
      history: {
        src: "/images/hero/nearbykonchadyotemple.PNG",
        alt: "Koncha Dyo within its Ward 16 neighbourhood",
        caption: "Koncha Dyo within its Ward 16 neighbourhood.",
      },
      significance: {
        src: "/images/hero/konchadyo_inside.PNG",
        alt: "Interior of Koncha Dyo",
        altNe: "कोंचा द्योको भित्री भाग",
        caption: "The interior of Koncha Dyo.",
        captionNe: "कोंचा द्योको भित्री भाग।",
      },
    },
  },
};
