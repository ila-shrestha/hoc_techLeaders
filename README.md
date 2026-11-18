# Ward 16 Heritage

A premium, source-conscious cultural heritage storytelling website for Ward 16.

## Structure

- `frontend/` — Next.js 16 App Router frontend with typed mock content and reusable editorial components.
- `backend/` — Express + TypeScript API foundation on port `4000`.
- `plan.md` — Product and design decisions.
- `TODO.md` — Implemented outcomes and requirements.

## Run locally

```bash
npm install --prefix frontend
npm install --prefix backend
npm run dev
```

The frontend listens on port `3000`. Run the backend separately with:

```bash
npm run backend:dev
```

The documented content is intentionally limited to the supplied interview material. Generated imagery is labeled as editorial placeholder material until verified field photography is supplied.
