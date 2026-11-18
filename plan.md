# Ward 16 Heritage — Implementation Plan

## Product approach

Build a responsive cultural heritage storytelling website for Ward 16 with a Next.js App Router frontend and a separate Express TypeScript backend. The initial frontend uses typed mock data shaped like future API responses; the backend exposes a health endpoint and a small read-only content surface without introducing the chatbot or external AI integration.

The information architecture is intentionally editorial: the homepage introduces the preservation mission and lets visitors move into a curated collection, while the two documented stories use reusable sections that make source status visible. The four undocumented locations remain present in the collection as future-ready cards with neutral copy.

## Design direction

Three possible styles considered:

- **Archive House** (0.08): Quiet editorial layouts, paper tones, and carefully framed documentary imagery.
- **Crimson Courtyard** (0.06): Warm, ceremonial color blocks and architectural rhythm inspired by Newari façades.
- **Field Notes / Living Heritage** (0.05): Layered annotations, route markers, and tactile documentation cues.

Chosen style: **Archive House** with a ceremonial crimson accent. The site should feel like a premium cultural archive rather than a dashboard or tourism brochure.

- **Design movement:** Contemporary editorial heritage archive with Newari-inspired pattern language.
- **Core principles:** Let the stories breathe; show what is known and what is still being documented; pair warm materiality with crisp navigation; make every route feel like a considered page in an archive.
- **Color philosophy:** Bone and warm parchment create room for reading, deep maroon signals care and continuity, moss green carries the idea of living practice, and saffron yellow appears sparingly like a ritual marker.
- **Layout paradigm:** Offset editorial compositions with a persistent reading rail, asymmetrical image frames, oversized section numbers, and generous vertical pacing rather than a uniform card grid.
- **Signature elements:** Fine ruled lines, a small “source status” pill, and a repeating geometric border motif drawn with CSS rather than decorative image assets.
- **Interaction philosophy:** Hover and focus states should feel like turning a page or bringing a detail into focus: subtle lift, underline expansion, and color shifts only.
- **Animation:** Use restrained fade/translate reveals and image scale on hover; never animate continuously or distract from reading.
- **Typography system:** Use a serif display face for cultural/story headlines and a neutral sans-serif for navigation, labels, body text, and metadata. `Fraunces`/`DM Sans` are loaded from Google Fonts with system fallbacks.
- **Brand essence:** A living digital field guide to the places, practices, and memories of Ward 16; observant, warm, accountable.
- **Brand voice:** Precise, welcoming, and transparent about uncertainty. Example lines: “Every place holds a story worth carrying forward.” “Read what is documented—and see where the archive is still growing.”
- **Wordmark & logo:** A stacked wordmark with a simple square “16” seal and a small corner notch that echoes a carved timber joint.
- **Signature brand color:** `#8E2D2C`, a deep brick crimson that feels ceremonial without becoming ornamental.

## Project structure

- `frontend/app/`: App Router routes, metadata, global styles, and route manifest.
- `frontend/components/`: Shared header/footer, cards, section headings, story sections, image frame, and small UI primitives.
- `frontend/lib/heritage-data.ts`: Typed API-ready mock models and sourced content for the two documented sites.
- `frontend/public/`: Generated editorial placeholder imagery and static route manifest.
- `backend/src/index.ts`: Express TypeScript server on port 4000 with health check and future-ready content endpoints.
- Root `package.json`: Convenience scripts for frontend development and builds while preserving frontend/backend separation.

## Implementation sequence

1. Establish project manifests and the global visual system.
2. Add the shared navigation, footer, homepage hero, About, collection, and preservation sections.
3. Add reusable detail-page storytelling components and the Siddhi Ganesh and Koncha Dyo routes.
4. Add the Express backend skeleton and API-ready content route.
5. Add responsive refinements, route manifest, metadata, and validation.

## Material constraints

No historical or geographical facts beyond the supplied brief should be added. The generated images are editorial visual placeholders until verified field photography is provided. Religious beliefs are labeled as community beliefs, interview-based accounts, or folklore where appropriate. The chatbot and external AI API remain intentionally out of scope for this implementation.
