import type { HeritageDetail } from './types';

/**
 * कोंचा द्यो — नेपाली सामग्री।
 * ठूला वाक्यांशहरूको नेपाली अनुवाद बाँकी छ; त्यहाँ अंग्रेजी राखिएको छ।
 */
export const konchaDyoNe: Omit<
  HeritageDetail,
  'slug' | 'image' | 'imageAlt' | 'status' | 'featured' | 'references' | 'relatedSlugs'
> = {
  name: 'कोंचा द्यो',
  summary:
    'A traditional Newar heritage site whose vessel-like form recalls the Gagro once used in religious offerings.',
  introduction: [
    "Koncha Dyo is a distinctive heritage site in Ward 16, shaped by the traditions of the local Newar community. Its unique form and ritual associations make it an important part of the neighbourhood's living cultural identity.",
    'The account below is drawn from the provided interview notes and reflects community beliefs and practices as documented — not independently verified history.',
  ],
  sections: [
    {
      id: 'history',
      title: 'ऐतिहासिक पृष्ठभूमि',
      eyebrow: 'अभिलेखित इतिहास',
      blocks: [
        {
          paragraphs: [
            'Koncha Dyo is associated with the traditional Newar community of the area. The surrounding locality was previously known as Sallaghari, the same historic name associated with Siddhi Ganesh Temple.',
            'The structure resembles a traditional Gagro — a liquid storage vessel. In traditional practice, such vessels were associated with alcohol offerings during religious ceremonies. Amod Rajbhandari was mentioned in the interview notes in connection with the historical background of the area.',
          ],
        },
      ],
    },
    {
      id: 'significance',
      title: 'धार्मिक र सांस्कृतिक महत्व',
      eyebrow: 'समुदायिक विश्वास',
      blocks: [
        {
          paragraphs: [
            'According to local belief, Koncha Dyo is connected to traditional Newar religious practices. Alcohol offerings and their ritual significance are understood within the framework of these local beliefs, and the site maintains traditional connections with Samay Baje.',
            "The site is also associated with beliefs about newly married couples visiting for blessings — a practice shared across the neighbourhood's heritage sites.",
          ],
        },
      ],
      note: 'These practices are described as community beliefs from the interview notes, not as verified religious doctrine or documented history.',
    },
    {
      id: 'gagro',
      title: 'परम्परागत गाग्रो',
      eyebrow: 'सांस्कृतिक सन्दर्भ',
      blocks: [
        {
          paragraphs: [
            "The Gagro is a traditional Newar vessel used to store liquids. Koncha Dyo's form echoes this vessel, reflecting how everyday objects of the community became embedded in religious practice. Understanding the Gagro helps explain why the site's shape carries ritual meaning for local residents.",
          ],
        },
      ],
    },
    {
      id: 'marriage',
      title: 'विवाहसम्बन्धी विश्वासहरू',
      eyebrow: 'समुदायिक विश्वास',
      blocks: [
        {
          paragraphs: [
            'Local tradition holds that newly married couples who visit Koncha Dyo receive blessings for a happy, prosperous, and successful married life. This belief connects the site to one of the most important transitions in community life and helps explain its continued role in local custom.',
          ],
        },
      ],
      note: 'Presented as a community belief documented in the interview notes.',
    },
    {
      id: 'community',
      title: 'समुदायको सहभागिता',
      eyebrow: 'सामुदायिक जीवन',
      blocks: [
        {
          paragraphs: [
            "Like Siddhi Ganesh Temple, Koncha Dyo is sustained through community participation. A Puja Samiti coordinates worship and observances, residents contribute through local donations, and community members take part in the site's upkeep and cultural activities.",
          ],
        },
      ],
    },
    {
      id: 'preservation',
      title: 'सांस्कृतिक संरक्षण',
      eyebrow: 'अगाडि हेर्दा',
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
    { alt: 'कोंचा द्योको संरचना', caption: 'कोंचा द्योको भाँडोजस्तो रूप' },
    { alt: 'नेवार सम्पदामा प्रयोग हुने परम्परागत गाग्रो भाँडो', caption: 'परम्परागत गाग्रो भाँडो' },
    { alt: 'Devotees at Koncha Dyo', caption: 'Community visits and worship' },
    {
      alt: 'Koncha Dyo within the Ward 16 streetscape',
      caption: 'Koncha Dyo in its neighbourhood setting',
    },
  ],
  videos: [
    {
      title: 'कोंचा द्यो — नेवार समुदायको परम्परा',
      description:
        "A film exploring the site's history, the Gagro tradition, and its place in Ward 16's cultural life. Video coming soon.",
    },
  ],
  location: {
    landmark: 'सल्लाघारी क्षेत्र, वार्ड १६',
    note: 'The surrounding area was historically known as Sallaghari.',
  },
};
