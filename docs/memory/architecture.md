# Architecture

See [[features-built]] and [[gotchas]].

A portfolio generator: users build a desktop-OS-style portfolio in an editor and publish it at `/portfolio/[username]`. Next.js 16 (App Router), TypeScript, Drizzle ORM (`src/lib/db/schema.ts`), Supabase client libraries (`src/utils/supabase`), Vercel AI SDK with Google, GSAP, Sonner, shadcn UI, `7.css` for the retro themes.

- `src/app/`: `dashboard/` (`editor`, `portfolios`, `assets`, `settings`), `portfolio/[username]`, `auth/`, `privacy/`, and `api/` (`ai`, `assets`, `auth`, `contact`, `dashboard`, `desktop`, `icons`, `lock-screen`, `portfolio`, `sound-effects`, `theme`, `upload`, `user`, `windows`).
- `src/components/`: `editor/` (forms per window type, `window-content-editor.tsx`), `portfolio/` (the rendered desktop: `desktop.tsx`, windows, widgets), `window-templates/` (about-me, blog, contact, links, projects, resume), `ai/`, `common/`, `ui/`.
- `src/lib/`: `types.ts` (window content types), `services/` (desktop, portfolio, icons, sound effects, lock screen, Google Drive, Hashnode), `stores/`, `constants/`, `db/`. `src/contexts/`, `src/hooks/`, `src/utils/`.
- Window content is data: each window has a `type` and a `content` object saved as JSON, rendered by a matching component and edited by a matching form.
- Scripts: `yarn dev`, `yarn build`, `yarn lint`, `yarn db:generate`, `yarn db:push`, `yarn db:migrate`.
