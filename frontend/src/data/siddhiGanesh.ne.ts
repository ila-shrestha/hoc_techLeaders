import type { HeritageDetail } from './types';

/**
 * सिद्धि गणेश मन्दिर — नेपाली सामग्री।
 * सामग्री स्रोत: सिद्धि गणेश पूजा समितिका अध्यक्ष शान्ताराम महर्जीसँगको अन्तर्वार्ता।
 * ठूला वाक्यांशहरूको नेपाली अनुवाद बाँकी छ; त्यहाँ अंग्रेजी राखिएको छ।
 */
export const siddhiGaneshNe: Omit<
  HeritageDetail,
  'slug' | 'image' | 'imageAlt' | 'status' | 'featured' | 'references' | 'relatedSlugs'
> = {
  name: 'सिद्धि गणेश मन्दिर',
  summary:
    "A beloved neighbourhood temple regarded by the community as the area's original and significant Ganesh idol.",
  introduction: [
    "Siddhi Ganesh Temple stands as one of Ward 16's most cherished places of worship and community life. For local residents, it is more than a temple — it is a gathering point for festivals, family rituals, and shared memory.",
    'The account below is drawn from an interview with Shantaram Maharjan, President of the Siddhi Ganesh Puja Samiti, and reflects both documented history and the living traditions of the neighbourhood.',
  ],
  sections: [
    {
      id: 'history',
      title: 'ऐतिहासिक पृष्ठभूमि',
      eyebrow: 'अभिलेखित इतिहास',
      blocks: [
        {
          paragraphs: [
            'The area surrounding the temple was previously known as Sallaghari. In earlier times it had very few residential houses, and agricultural fields occupied much of the land.',
            'People used the Bishnumati River for bathing and relied on a local well as an important water source. Over time, the settlement gradually developed into the populated neighbourhood it is today.',
          ],
        },
      ],
    },
    {
      id: 'significance',
      title: 'धार्मिक महत्व',
      eyebrow: 'समुदायिक विश्वास',
      blocks: [
        {
          paragraphs: [
            'Local residents regard Siddhi Ganesh as the original and significant Ganesh idol of the area. According to community belief, worship here is associated with prosperity, happiness, and well-being.',
            'Newly married couples traditionally visit the temple after their marriage, and people come throughout the year to offer prayers and make wishes.',
          ],
        },
      ],
      note: 'The significance described here reflects the beliefs and practices of the local community, as shared in the interview.',
    },
    {
      id: 'folklore',
      title: 'स्थानीय लोककथा',
      eyebrow: 'लोककथा',
      blocks: [
        {
          paragraphs: [
            "A traditional story told in the community describes a giant snake believed to have lived near the temple well. The tale is part of the area's oral heritage and is shared here as local folklore — it is not a verified historical event.",
          ],
        },
      ],
      note: 'This story is presented as folklore shared during the interview, not as a documented historical fact.',
    },
    {
      id: 'festivals',
      title: 'चाडपर्व र अनुष्ठानहरू',
      eyebrow: 'जीवन्त परम्पराहरू',
      blocks: [
        {
          paragraphs: [
            'The temple comes alive throughout the year with festivals and regular worship. According to the interview documentation, the principal observances include:',
          ],
          list: [
            'Ganesh Chaturthi — the major festival honouring Lord Ganesh.',
            'Chyamma Puja — a traditional worship observance at the temple.',
            'Devali Puja — celebrated with special prayers and offerings.',
            'Dumbhe Puja — a community ritual observed at the site.',
            'Tisabicha — a regular worship day marking the twelfth tithi.',
          ],
        },
      ],
    },
    {
      id: 'structures',
      title: 'सांस्कृतिक संरचनाहरू',
      eyebrow: 'परिसरभित्र',
      blocks: [
        {
          paragraphs: [
            'The temple grounds hold several structures of cultural and religious importance:',
          ],
          list: [
            'The main Siddhi Ganesh idol — the focus of devotion.',
            "A Buddhist Chaitya within the temple premises, reflecting the neighbourhood's shared religious heritage.",
            'Patti — a traditional raised platform used in worship and gatherings.',
          ],
        },
      ],
    },
    {
      id: 'community',
      title: 'समुदायको सहभागिता',
      eyebrow: 'सामुदायिक जीवन',
      blocks: [
        {
          paragraphs: [
            'The temple is sustained by the Siddhi Ganesh Puja Samiti, a community organization that coordinates festivals, worship, and upkeep. Local residents contribute through donations and voluntary religious activities, and many take part in efforts to preserve the temple and its traditions.',
          ],
        },
      ],
    },
    {
      id: 'preservation',
      title: 'संरक्षणका चुनौतीहरू',
      eyebrow: 'अगाडि हेर्दा',
      blocks: [
        {
          paragraphs: [
            "The interview documentation notes ongoing drainage and water-blockage problems around the temple, particularly during the monsoon season. These issues affect the temple environment and are a concern for the community's preservation efforts.",
          ],
        },
      ],
    },
    {
      id: 'visit',
      title: 'आगन्तुक जानकारी',
      eyebrow: 'Plan your visit',
      blocks: [
        {
          paragraphs: [
            'Worship at the temple follows traditional practice, with regular activities on Tuesdays. The site is especially lively during major festivals such as Ganesh Chaturthi, Chyamma Puja, Devali Puja, Dumbhe Puja, and Tisabicha.',
          ],
        },
      ],
    },
  ],
  gallery: [
    { alt: 'सिद्धि गणेश मन्दिरको मुख्य हिरो', caption: 'मुख्य सिद्धि गणेश हिरो' },
    { alt: 'मन्दिर परिसरभित्रको बौद्ध चैति', caption: 'परिसरभित्रको बौद्ध चैति' },
    { alt: 'सिद्धि गणेश मन्दिरको पत्ति', caption: 'परम्परागत पत्ति' },
    {
      alt: 'Devotees during a festival at Siddhi Ganesh Temple',
      caption: 'Festival gatherings at the temple',
    },
  ],
  videos: [
    {
      title: 'सिद्धि गणेश मन्दिर — छिमेकी सम्पदा',
      description:
        'An introductory film about the temple, its festivals, and the community that sustains it. Video coming soon.',
    },
  ],
  location: {
    landmark: 'सल्लाघारी क्षेत्र, वार्ड १६',
    note: 'The surrounding area was historically known as Sallaghari.',
  },
};
