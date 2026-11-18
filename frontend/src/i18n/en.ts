/**
 * English dictionary — source of truth for all interface strings.
 * The Nepali dictionary (ne.ts) must match this shape exactly.
 */
export const en = {
  nav: {
    home: "Home",
    exploreHeritage: "Explore Heritage",
    aboutWard16: "About Ward 16",
    chatbot: "Chatbot",
    toggleMenu: "Toggle menu",
  },
  chatbot: {
    title: "Heritage Assistant",
    comingSoon:
      "The Ward 16 heritage chatbot is coming soon. It will answer questions about our documented sites using verified local records.",
    close: "Close chatbot",
  },
  hero: {
    badge: "Ward 16 · Cultural Heritage",
    heading: "Preserving the stories of our heritage",
    subheading:
      "Discover the temples, traditions, and living culture of Ward 16 — documented by the community, for the community.",
    ctaExplore: "Explore Heritage",
    ctaKoncha: "Discover Koncha Dyo",
  },
  aboutWard: {
    eyebrow: "About Ward 16",
    title: "A neighbourhood with stories written in stone and tradition",
    p1: "Ward 16 is a vibrant community with a rich cultural identity shaped by its temples, traditional practices, and the people who call it home. From the worship of Siddhi Ganesh to the rituals of Koncha Dyo, the ward carries traditions passed down through generations.",
    p2: "This website exists to document and share that heritage — so that younger generations, visitors, students, and researchers can discover the stories that make Ward 16 unique.",
    note: "More about Ward 16 — its geography, community, and history — is being prepared by local contributors.",
    link: "More about Ward 16",
  },
  showcase: {
    eyebrow: "Explore Heritage",
    title: "Six heritage sites of Ward 16",
    description:
      "From temple traditions to living rituals — explore the places that carry our community's story.",
    viewAll: "View all sites",
    featured: "Featured",
    exploreMore: "Explore More",
    learnMore: "Learn more",
    comingSoon: "More information coming soon.",
  },
  video: {
    eyebrow: "In Motion",
    title: "Ward 16 in moving images",
    description:
      "A short film introducing the temples, rituals, and streets of Ward 16 — produced with the community.",
    comingSoon: "Heritage film footage is being documented. Check back soon.",
  },
  footer: {
    tagline:
      "Documenting, preserving, and celebrating the cultural heritage sites of Ward 16 — one story at a time.",
    explore: "Explore",
    heritage: "Heritage Sites",
    community: "Community",
    communityText:
      "This project grows through community participation. If you know a heritage site, story, or tradition in Ward 16, we would love to hear from you.",
    rights: "Ward 16 Heritage. All rights reserved.",
    motto: "Preserving the past, inspiring the future.",
  },
  explorePage: {
    eyebrow: "Ward 16 Heritage",
    title: "Explore our heritage sites",
    description:
      "Six documented locations that carry the culture, beliefs, and history of Ward 16. New documentation is added as community research continues.",
  },
  aboutPage: {
    eyebrow: "About Ward 16",
    title: "The heart of our cultural heritage",
    p1: "Ward 16 is home to a community whose identity is woven from tradition: temple festivals, Newar cultural practices, and the everyday rituals that connect generations. This website is a community effort to preserve and share that identity.",
    p2: "Our heritage sites — from Siddhi Ganesh Temple to Koncha Dyo — are documented through interviews with local residents, puja samitis, and community members. We distinguish carefully between documented history, local beliefs, and folklore, so that every story is told with honesty and respect.",
    note: "Detailed information about Ward 16 — its location, history, and community — is being prepared with local contributors and will be published here soon.",
  },
  detail: {
    heritageBadge: "Ward 16 Heritage",
    documentationComingSoon: "Documentation coming soon",
    comingSoonBody:
      "is an important heritage site in Ward 16. Detailed historical documentation is being prepared through community research and will be published here.",
    exploreOthers: "Explore other heritage sites",
    location: "Location",
    references: "References & Sources",
    related: "Related heritage locations",
    viewAll: "View all heritage sites",
    videoEyebrow: "Watch",
    videoTitle: "Explanatory videos",
    videoComingSoon: "Video coming soon",
    listenToPage: "Listen to this page",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    listening: "Listening…",
    neVoiceUnavailable:
      "Nepali voice reading is not supported by this browser or device. You can still read the content below.",
    unsupported:
      "Voice reading is not supported by this browser. You can still read the content below.",
    voiceError: "Voice reading is unavailable right now. Please try again.",
  },
  search: {
    placeholder: "Search heritage sites…",
    ariaLabel: "Search heritage sites",
    noResults: "No heritage sites found for",
    go: "Search",
  },
  mapBtn: "Explore Map",
  carousel: {
    previous: "Previous slide",
    next: "Next slide",
    slide: "Slide",
    of: "of",
  },
  mapPage: {
    eyebrow: "Interactive Explorer",
    title: "Discover Ward 16, one marker at a time",
    description:
      "Tap a marker to meet a heritage site. Mark sites as explored, earn badges, and track your journey.",
    guideTitle: "How to explore",
    guideSteps: [
      "Tap any marker on the map to open a site card.",
      "Read the card, then choose View Details to learn more.",
      "Press “Mark as explored” to collect your discoveries.",
      "Watch your progress grow — badges unlock as you explore.",
    ],
    progress: "heritage sites explored",
    of: "of",
    markExplored: "Mark as explored",
    explored: "Explored",
    viewDetails: "View Details",
    exploreNext: "Explore next",
    allExplored: "Wonderful — you have explored every documented site!",
    markersNote:
      "Marker positions are approximate placeholders until verified coordinates are added. They do not mark exact site locations.",
    badgeFirst: "First Discovery",
    badgeFirstDesc: "You opened your first heritage site card.",
    badgeHalf: "Heritage Explorer",
    badgeHalfDesc: "You have explored 3 or more heritage sites.",
    badgeAll: "Ward 16 Explorer",
    badgeAllDesc: "You have explored all six heritage sites.",
    badgesTitle: "Badges",
  },
  chatWidget: {
    openLabel: "Ask Heritage Guide",
    closeLabel: "Close chat",
    greeting:
      "Hello! I'm your Ward 16 Heritage Guide. Ask me about our temples, traditions, and stories — or pick a suggestion below.",
    placeholder: "Type your question…",
    send: "Send",
    fallback:
      "That's a great question — that information isn't documented yet. Try asking about Siddhi Ganesh Temple or Koncha Dyo, or explore the heritage map!",
    suggestions: [
      "What is Siddhi Ganesh Temple?",
      "Tell me about Koncha Dyo",
      "What is the cultural significance of 22 Dhara?",
      "Where can I explore heritage sites?",
      "What traditional practices are associated with these places?",
    ],
    you: "You",
    guide: "Heritage Guide",
  },
};

export type Dictionary = typeof en;
