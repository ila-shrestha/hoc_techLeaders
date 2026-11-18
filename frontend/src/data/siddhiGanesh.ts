import type { HeritageDetail } from "./types";

/**
 * Siddhi Ganesh Temple — content organized from the interview with
 * Shantaram Maharjan, President of the Siddhi Ganesh Puja Samiti.
 * Beliefs and folklore are labeled as such; they are community accounts,
 * not verified historical facts.
 */
export const siddhiGanesh: HeritageDetail = {
  slug: "siddhi-ganesh",
  name: "Siddhi Ganesh Temple",
  summary:
    "A beloved neighbourhood temple regarded by the community as the area's original and significant Ganesh idol.",
  imageAlt: "Siddhi Ganesh Temple, Ward 16",
  status: "documented",
  featured: true,
  introduction: [
    "Siddhi Ganesh Temple stands as one of Ward 16's most cherished places of worship and community life. For local residents, it is more than a temple — it is a gathering point for festivals, family rituals, and shared memory.",
    "The account below is drawn from an interview with Shantaram Maharjan, President of the Siddhi Ganesh Puja Samiti, and reflects both documented history and the living traditions of the neighbourhood.",
  ],
  sections: [
    {
      id: "history",
      title: "Historical Background",
      eyebrow: "Documented history",
      blocks: [
        {
          paragraphs: [
            "The area surrounding the temple was previously known as Sallaghari. In earlier times it had very few residential houses, and agricultural fields occupied much of the land.",
            "People used the Bishnumati River for bathing and relied on a local well as an important water source. Over time, the settlement gradually developed into the populated neighbourhood it is today.",
          ],
        },
      ],
    },
    {
      id: "significance",
      title: "Religious Significance",
      eyebrow: "Community belief",
      blocks: [
        {
          paragraphs: [
            "Local residents regard Siddhi Ganesh as the original and significant Ganesh idol of the area. According to community belief, worship here is associated with prosperity, happiness, and well-being.",
            "Newly married couples traditionally visit the temple after their marriage, and people come throughout the year to offer prayers and make wishes.",
          ],
        },
      ],
      note: "The significance described here reflects the beliefs and practices of the local community, as shared in the interview.",
    },
    {
      id: "folklore",
      title: "Local Folklore",
      eyebrow: "Folklore",
      blocks: [
        {
          paragraphs: [
            "A traditional story told in the community describes a giant snake believed to have lived near the temple well. The tale is part of the area's oral heritage and is shared here as local folklore — it is not a verified historical event.",
          ],
        },
      ],
      note: "This story is presented as folklore shared during the interview, not as a documented historical fact.",
    },
    {
      id: "festivals",
      title: "Festivals and Rituals",
      eyebrow: "Living traditions",
      blocks: [
        {
          paragraphs: [
            "The temple comes alive throughout the year with festivals and regular worship. According to the interview documentation, the principal observances include:",
          ],
          list: [
            "Ganesh Chaturthi — the major festival honouring Lord Ganesh.",
            "Chyamma Puja — a traditional worship observance at the temple.",
            "Devali Puja — celebrated with special prayers and offerings.",
            "Dumbhe Puja — a community ritual observed at the site.",
            "Tisabicha — a regular worship day marking the twelfth tithi.",
          ],
        },
      ],
    },
    {
      id: "structures",
      title: "Cultural Structures",
      eyebrow: "Within the premises",
      blocks: [
        {
          paragraphs: [
            "The temple grounds hold several structures of cultural and religious importance:",
          ],
          list: [
            "The main Siddhi Ganesh idol — the focus of devotion.",
            "A Buddhist Chaitya within the temple premises, reflecting the neighbourhood's shared religious heritage.",
            "Patti — a traditional raised platform used in worship and gatherings.",
          ],
        },
      ],
    },
    {
      id: "community",
      title: "Community Involvement",
      eyebrow: "Community life",
      blocks: [
        {
          paragraphs: [
            "The temple is sustained by the Siddhi Ganesh Puja Samiti, a community organization that coordinates festivals, worship, and upkeep. Local residents contribute through donations and voluntary religious activities, and many take part in efforts to preserve the temple and its traditions.",
          ],
        },
      ],
    },
    {
      id: "preservation",
      title: "Preservation Challenges",
      eyebrow: "Looking ahead",
      blocks: [
        {
          paragraphs: [
            "The interview documentation notes ongoing drainage and water-blockage problems around the temple, particularly during the monsoon season. These issues affect the temple environment and are a concern for the community's preservation efforts.",
          ],
        },
      ],
    },
    {
      id: "visit",
      title: "Visitor Information",
      eyebrow: "Plan your visit",
      blocks: [
        {
          paragraphs: [
            "Worship at the temple follows traditional practice, with regular activities on Tuesdays. The site is especially lively during major festivals such as Ganesh Chaturthi, Chyamma Puja, Devali Puja, Dumbhe Puja, and Tisabicha.",
          ],
        },
      ],
    },
  ],
  gallery: [
    { alt: "Siddhi Ganesh Temple main idol", caption: "The main Siddhi Ganesh idol" },
    { alt: "Buddhist Chaitya within the temple premises", caption: "The Buddhist Chaitya on the premises" },
    { alt: "Patti platform at Siddhi Ganesh Temple", caption: "The traditional Patti platform" },
    { alt: "Devotees during a festival at Siddhi Ganesh Temple", caption: "Festival gatherings at the temple" },
  ],
  videos: [
    {
      title: "Siddhi Ganesh Temple — a neighbourhood heritage",
      description:
        "An introductory film about the temple, its festivals, and the community that sustains it. Video coming soon.",
    },
  ],
  location: {
    landmark: "Sallaghari area, Ward 16",
    note: "The surrounding area was historically known as Sallaghari.",
  },
  references: [
    "Interview with Shantaram Maharjan, President of the Siddhi Ganesh Puja Samiti.",
  ],
  relatedSlugs: ["koncha-dyo", "22-dhara", "sitala-ajima", "mhepi-ajima", "gurunakak"],
};
