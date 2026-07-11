# Tooling Basics — Before We Start React

A reference for the tools underneath every React project scaffolded with Vite.

## Node.js

**What it is:** A JavaScript runtime that executes JS outside a browser.

**Why it's used:** Tools like npm and Vite are themselves JS programs — Node is what runs them on your machine.

**Alternatives:** Deno, Bun.

## npm & package.json

**What it is:** npm (Node Package Manager) installs and manages external code packages. `package.json` is the project manifest, listing:

- **`dependencies`** — packages required at runtime (e.g. `react`, `react-dom`)
- **`devDependencies`** — packages only needed during development (e.g. `vite`, linters)
- **`scripts`** — named commands run via `npm run <name>` (e.g. `dev`, `build`)

**Why it's used:** Standardizes how a project declares, installs, and shares its dependencies.

**Alternatives:** Yarn, pnpm.

## package-lock.json

**What it is:** A file that records the exact resolved version of every installed package, including nested dependencies.

**Why it's used:** Guarantees that every install (any machine, any server) produces an identical dependency tree. Should be committed to version control and not hand-edited.

**Alternatives:** `yarn.lock` (Yarn), `pnpm-lock.yaml` (pnpm) — same purpose, different package manager.

## node_modules

**What it is:** The folder where installed package code physically lives on disk.

**Why it's used:** It's where the JS engine and build tools actually look up dependency code at runtime/build time. It's excluded from version control (`.gitignore`) and fully regenerable from `package.json` + the lockfile via a fresh install.

**Alternatives:** pnpm uses a content-addressable store with symlinks instead of duplicating files per project, reducing disk usage.

## Vite

**What it is:** A build tool providing a dev server with Hot Module Replacement (HMR) and a production bundler (`npm run build` outputs an optimized `dist/` folder).

**Why it's used:** Faster dev-server startup and rebuild times than older bundler-based tooling, by serving source files over native ES modules during development.

**Alternatives:** Create React App (deprecated), Webpack, Parcel, Rspack.

## TypeScript & tsconfig files

**What it is:** TypeScript is JavaScript with an added static type system, checked before code runs. Source files use `.ts`/`.tsx` instead of `.js`/`.jsx`. `tsc` (the TypeScript compiler) reads one or more `tsconfig.json`-style files to know how to type-check a project.

**Why it's used:** Catches a class of bugs (wrong types, typos in object shapes, missing null checks) before the code ever runs, and powers editor autocomplete/refactoring.

This project splits its configuration into three files rather than one, using TypeScript's **project references**:

- **`tsconfig.json`** — the root file. Holds no compiler options itself; it just references the other two configs, so tools that look for "the" tsconfig find this entry point first.
- **`tsconfig.app.json`** — configures the application code in `src/` that runs in the browser: includes the DOM library, `jsx: "react-jsx"`, and `noEmit: true` (TypeScript only type-checks here — Vite is what actually bundles the code).
- **`tsconfig.node.json`** — configures tooling code that runs in Node instead of the browser, such as `vite.config.ts`: includes Node's types instead of the DOM, and no JSX/React settings.

**Why split into three:** Browser code and Node-context tooling code need different type libraries (DOM vs. Node) and module settings. Trying to satisfy both with one shared config leads to either missing types or incorrectly available ones (e.g. browser code being able to "see" Node-only APIs that don't actually exist in the browser).

**Alternatives:** Flow (largely inactive now), JSDoc type annotations in plain JS (lighter-weight, no separate compile step, but weaker tooling support).

## Linting vs. Formatting

Two distinct tools with different jobs:

- **Linting** — analyzes code for bugs and enforces code-quality rules (e.g. unused variables, missing hook dependencies). This project uses **Oxlint**.
- **Formatting** — rewrites whitespace, quotes, and semicolons for consistent style, without checking for bugs. Common tool: **Prettier**.

**Alternatives:** ESLint (linting), dprint (formatting), Biome (combined linter + formatter in one tool).

## Quick recap

| Tool / File | What it's for | Alternatives |
|---|---|---|
| Node.js | JS runtime outside the browser | Deno, Bun |
| npm | Installs and manages packages | Yarn, pnpm |
| package.json | Project manifest — dependencies, scripts | — |
| package-lock.json | Locks exact dependency versions | yarn.lock, pnpm-lock.yaml |
| node_modules | Installed package code on disk | pnpm's symlinked store |
| Vite | Dev server (HMR) + production bundler | CRA, Webpack, Parcel, Rspack |
| TypeScript | Static types, checked before runtime | Flow, JSDoc annotations |
| tsconfig.json | Root config — references app/node configs | — |
| tsconfig.app.json | Type-checks browser/src code (DOM, JSX) | — |
| tsconfig.node.json | Type-checks Node-context tooling (vite.config.ts) | — |
| Oxlint | Linting (bugs/rules) | ESLint, Biome |
| Prettier | Formatting (style consistency) | dprint, Biome |
