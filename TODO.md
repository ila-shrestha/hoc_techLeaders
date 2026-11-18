# Ward 16 Heritage — TODO

- [x] **Global design system and responsive shell**
  - Use a premium cultural storytelling visual language inspired by Newari architecture, Nepalese cultural patterns, traditional wood carvings, stone temples, and warm earthy colors.
  - Use crimson, maroon red, green, yellow, and white with elegant editorial layouts, readable typography, generous whitespace, subtle cultural decoration, smooth transitions, and responsive behavior.
  - Avoid generic dashboard aesthetics, excessive gradients, clutter, and unnecessary animations.
  - Keep frontend and backend separate, preserve TypeScript and ES module setup, and keep the backend on port 4000.

- [x] **Navigation and footer**
  - Include website name/logo, Home, Explore Heritage, About Ward 16, and a visible future chatbot access affordance.
  - Include website name, short description, navigation links, heritage exploration links, and copyright information in the footer.

- [x] **Homepage storytelling sections**
  - Introduce Ward 16 and its cultural heritage locations.
  - Include an attractive hero with a meaningful preservation heading, introductory statement, background visual, and Explore Heritage CTA.
  - Include an About Ward 16 section using an easy-to-update placeholder where information has not been provided; do not invent historical or geographical information.
  - Include a Cultural Preservation section covering traditional knowledge, younger generations, digital access, and community participation.

- [x] **Heritage collection**
  - Show Siddhi Ganesh Temple, Koncha Dyo, 22 Dhara, Sitala Ajima, Mhepi Ajima, and Gurunakak in reusable image-based cards.
  - Feature Siddhi Ganesh Temple and Koncha Dyo prominently.
  - Use “More information coming soon” for the four locations without supplied documentation, without inventing descriptions.
  - Keep the data structure ready for future detailed pages and API integration.

- [x] **Siddhi Ganesh detail page**
  - Provide hero, introduction, historical background, religious significance, local folklore, festivals and rituals, cultural structures, community involvement, current preservation challenges, visitor information, gallery, explanatory video placeholder, location information, references, and related locations.
  - Use the supplied interview with Shantaram Maharjan, President of Siddhi Ganesh Puja Samiti, as the primary source.
  - Distinguish historical information, interviewee accounts, local beliefs, and folklore; do not present beliefs or folklore as verified fact.

- [x] **Koncha Dyo detail page**
  - Provide hero, introduction, historical background, religious/cultural significance, traditional Gagro explanation, marriage-related beliefs, community involvement, cultural preservation, gallery, explanatory video placeholder, location information, references, and related locations.
  - Use the supplied Koncha Dyo notes as the primary source.
  - Present beliefs as community beliefs and interview-based accounts; do not invent dates, architectural origins, historical events, or ritual details.

- [x] **Backend foundation**
  - Provide an Express TypeScript REST foundation on port 4000 with a working health route and future-ready heritage content route.
  - Do not implement the database-powered chatbot or external AI API in this phase.

- [x] **SEO, route manifest, accessibility, and responsive refinement**
  - Use App Router metadata, semantic headings, keyboard-visible focus states, image alt text, responsive layouts, and a complete static `/manus-routes.json` manifest.
