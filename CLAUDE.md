# PortaGen

Portfolio generator: build a desktop-OS-style portfolio in an editor and publish it at `/portfolio/[username]`. Next.js 16, TypeScript, Drizzle, Supabase libraries, Vercel AI SDK. See `README.md` (generic) and `docs/memory/`.

## Commands
- `yarn install`, `yarn dev` (use `-p 3001` if 3000 is busy), `yarn build`, `yarn lint`.
- `yarn db:generate`, `yarn db:push`, `yarn db:migrate`: Drizzle against `DATABASE_URL`.

## Conventions
- Default branch is `main`. Commit messages are plain, with no `Co-Authored-By` trailer.
- Window content is data (`src/lib/types.ts`, `src/lib/portfolio-extras.ts`); add a window type by adding its type, default content, renderer and editor form together.
- Respect `prefers-reduced-motion`.

## Memory and code map
- At session start read `docs/memory/index.md`. Save durable decisions there as Markdown.
- `graphify-out/GRAPH_REPORT.md` summarizes code structure; refresh with `python -m graphify update .` (the `.exe` is blocked on this machine).
