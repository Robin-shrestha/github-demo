# React Day 1 — Scaffold & JSX

React + TypeScript application, built with Vite.

## Structure

- `src/App.tsx` — composes Header, CardGrid, Footer
- `src/components/` — Header, CardGrid, StudentCard, Footer (all static/hard-coded)

Rebuilds the "Student Cards" pattern from Week 1's Flexbox lesson as React components — no forms, no props/state yet (that's Day 2).

## Tooling

- **Vite** — dev server + build
- **TypeScript** — `npm run build` runs `tsc -b` before bundling
- **Oxlint** — linting (`npm run lint`)
- **Prettier** — formatting (`npm run format`, `npm run format:check`)

## Run it

```bash
npm install
npm run dev
```
