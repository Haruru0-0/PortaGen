# PortaGen

PortaGen is a modern portfolio application built with Next.js (App Router) and TypeScript. It provides a modular UI for creating and presenting developer portfolios, includes an editor surface and portfolio components, and uses Drizzle for database schema and migrations.

> Built with Next.js, TypeScript, Drizzle, and a component-first design.

---

## Table of contents

- [Features](#features)
- [Demo / Screenshots](#demo--screenshots)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment variables](#environment-variables)
  - [Available scripts](#available-scripts)
- [Database & Migrations (Drizzle)](#database--migrations-drizzle)
- [Project structure](#project-structure)
- [Coding style & testing](#coding-style--testing)
- [Contributing & pull request guide](#contributing--pull-request-guide)
- [Deployment](#deployment)
- [License & contact](#license--contact)

---

## Features

- Next.js App Router-based architecture (routes, layouts, API routes).
- TypeScript with strict mode.
- Component-first UI: editor, portfolio, window-content, and shared UI components.
- Drizzle for schema, migrations, and DB helpers.
- Path alias `@/*` for tidy imports.
- Scripts for local development, production builds, linting, and Drizzle workflows.

---

## Demo / Screenshots

Add screenshots or an animated GIF here showing the editor and generated portfolio. Example:

- `public/screenshots/editor.png`
- `public/screenshots/portfolio.png`

(Replace with real images, or add a live demo link if deployed.)

---

## Getting started

### Prerequisites

- Node 18+ or recommended LTS
- Yarn (preferred) or npm / pnpm / bun
- A database (Postgres / MySQL / SQLite depending on your Drizzle setup) for migrations and runtime (if the app uses server-side DB)

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/AhmadKanaan0/PortaGen.git
cd PortaGen
yarn install
```

### Environment variables

Create a `.env` (or `.env.local`) file in the repo root and add values used by your app. Example variables:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portagen"

# Next.js
NEXT_PUBLIC_APP_NAME="PortaGen"
# Add other API keys your app needs (do NOT commit secrets)
```

Add a `.env.example` (without secrets) to show required variables to contributors.

### Available scripts

The project follows the repository guidelines. Use the yarn scripts below:

- `yarn dev` — Run the app locally with hot reload (Next.js dev server).
- `yarn build` — Create an optimized production build.
- `yarn start` — Start the production server (after build).
- `yarn lint` — Lint code with Next + ESLint config.
- `yarn db:generate` — Generate Drizzle migrations from `src/lib/db/schema.ts`.
- `yarn db:push` — Push schema to the target database.
- `yarn db:migrate` — Apply migrations in `drizzle/` to the target DB.

Example development flow:

```bash
yarn dev
# open http://localhost:3000
```

---

## Database & Migrations (Drizzle)

This repo uses Drizzle for schema management. Typical workflow:

- Update `src/lib/db/schema.ts` (Drizzle schema).
- Generate migrations:
  ```bash
  yarn db:generate
  ```
- Inspect and commit generated files in the `drizzle/` folder.
- Apply migrations to the target DB:
  ```bash
  yarn db:migrate
  ```
- To push the current schema to the DB (non-reversible):
  ```bash
  yarn db:push
  ```

Note: follow your team's migration review process—commit migration snapshots into version control (`drizzle/`) and include migration impact notes in PRs.

---

## Project structure

High-level layout (see repo for exact files):

- `src/app` — Next.js App Router (routes, layouts, API routes).
- `src/components` — UI components, editor, portfolio components, window content.
- `src/lib` — Shared utilities; `db/` (Drizzle schema & helpers), `services/` (API integrations).
- `src/hooks` — Reusable React hooks.
- `src/assets`, `public` — Static media and public assets.
- `drizzle/` — Generated Drizzle migrations and snapshots.
- Config and tooling: `next.config.ts`, `tsconfig.json` (alias `@/* -> src/*`), `eslint.config.mjs`

---

## Coding style & testing

- TypeScript with strict mode; prefer 2-space indentation.
- Components: PascalCase (e.g., `PortfolioWindow.tsx`). Files: kebab-case where it improves readability (e.g., `menu-bar.tsx`).
- Hooks: `useThing.ts`.
- API route handlers under App Router: `route.ts` inside the route folder.
- Use path alias imports: `import { cn } from '@/lib/utils'`.

Lint before pushing:

```bash
yarn lint
```

Testing: There is no official test runner configured yet. If you add tests, place them under `src/__tests__` using `*.test.ts(x)`. Prefer small, deterministic unit tests for `src/lib` and focused UI tests for `src/components`.

---

## Contributing & pull request guide

Thanks for contributing! To keep the repo healthy:

- Commit message style: imperative mood, concise (≤72 chars), include scope when helpful (e.g., `editor: add toolbar`).
- PRs should include:
  - A short description of the change and motivation.
  - Linked issues (if any).
  - Test/QA steps and screenshots for UI changes.
  - Any DB migration impact (include `drizzle/` changes and migration notes).
  - Note any required env changes.
- Run `yarn lint` and address warnings (or explain in PR).

If you want a PR template or contributing docs, I can add them.

---

## Deployment

Recommended: Vercel (native Next.js support).

- Connect the repository to Vercel and set environment variables in the project settings.
- Build command: `yarn build`
- Output directory: not required (Next.js handles it)

For other hosts (Docker, custom server), follow Next.js deployment docs: https://nextjs.org/docs/app/building-your-application/deploying

---

## License & contact

Add a LICENSE file to specify the license for this project (MIT is common). For now, this repo does not include a license file — add one if you’d like to allow reuse.

Maintainer: AhmadKanaan0 — https://github.com/AhmadKanaan0

---

If you'd like, I can:
- Commit this README.md to the `main` branch,
- Add a `.env.example`,
- Add a PR template or CONTRIBUTING.md,
- Or scaffold basic screenshots and a license file.
Tell me which and I’ll proceed.
