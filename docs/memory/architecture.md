# Architecture

See [[features-built]] and [[gotchas]].

A portfolio generator: users build a desktop-OS-style portfolio in an editor and publish it at `/portfolio/[username]`. Next.js 16 (App Router), TypeScript, Drizzle ORM (`src/lib/db/schema.ts`), Supabase client libraries (`src/utils/supabase`), GSAP, Sonner, shadcn UI, `7.css` for the retro themes.

- `src/app/`: `dashboard/` (`editor`, `portfolios`, `assets`, `settings`), `portfolio/[username]`, `auth/`, `privacy/`, and `api/` (`assets`, `auth`, `contact`, `dashboard`, `desktop`, `icons`, `lock-screen`, `music`, `portfolio`, `sound-effects`, `theme`, `upload`, `user`, `windows`). PortaGen AI's dedicated UI/API and SDK dependencies were removed on 2026-11-10.
- `src/components/`: `editor/` (forms per window type, `window-content-editor.tsx`), `portfolio/` (the rendered desktop: `desktop.tsx`, windows, widgets), `window-templates/` (about-me, blog, contact, links, projects, resume), `common/`, `ui/`, and `workspace/` (shared owner-page Persona frames, controls, overlays and motion preferences).
- `src/lib/`: `types.ts` (window content types), `services/` (desktop, portfolio, icons, sound effects, lock screen, Hashnode; file storage is UploadThing, see [[decisions]]), `stores/`, `constants/`, `db/`. `src/contexts/`, `src/hooks/`, `src/utils/`.
- Window content is data: each window has a `type` and a `content` object saved as JSON, rendered by a matching component and edited by a matching form.
- Music: anonymous YouTube playlist metadata and audio proxy feed existing portfolio skins; save/remove checks account and ownership. General music source URLs reuse the legacy Spotify column. Existing Spotify sources remain supported. See [[youtube-music]] for the route map and upstream restrictions.
- Scripts: `yarn dev`, `yarn build`, `yarn lint`, `yarn db:generate`, `yarn db:push`, `yarn db:migrate`.
