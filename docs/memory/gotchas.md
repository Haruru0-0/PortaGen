# Gotchas

See [[architecture]].

- **Hashnode:** `src/lib/services/hashnode.ts` talks to Hashnode. Their GraphQL API required a paid plan from 2026-05-13 (this broke the author's AOS site); portfolio blogs here may be affected. Not checked in this repo.
- **The README is generic:** it lists an old clone URL (`AhmadKanaan0/PortaGen`), example environment variables that may not match the code and no `.env.example`. Read the code for the variables the app needs.
- **A past history rewrite removed a leaked Supabase database password;** that password should be rotated if it was real (noted in the jalter memory by another session).
- **Port 3000 may clash with another project;** use `next dev -p 3001`.
- **`graphify.exe` is blocked on this machine;** use `python -m graphify update .`.
- **PortaGen starts locally with placeholder values** in a git-ignored `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `DATABASE_URL`, `ENCRYPTION_KEY`). With them `yarn dev -p 3002` serves `/`, `/auth/*` and `/privacy` (all 200, checked 2026-11-05, with the unfinished port in the working tree), but sign-in does not work, `/dashboard` redirects to login, and `/portfolio/[username]` and the editor need a real Supabase project and database.
- **`.env.example` now exists** (all variables the code reads, with comments) and `.gitignore` has `!.env.example` so it can be committed; `.env` (for drizzle-kit) and `.env.local` (for `yarn dev`) are git-ignored local copies. Real values are still needed for sign-in, the editor and published portfolios.
- **Supabase's direct database host (`db.<ref>.supabase.co`) is IPv6 only and failed to resolve here (`ENOTFOUND`) when running `yarn db:migrate` (2026-11-05).** Use the Session pooler string (`postgres.<ref>` user, `aws-0-<region>.pooler.supabase.com:5432`) as `DATABASE_URL` for migrations; the Transaction pooler (6543) suits the deployed app and may need prepared statements off. URL-encode special characters in the password. The migrations (6 files in `drizzle/`) had not been applied to the new Supabase project yet. `.env` now holds the real Supabase URL, anon key and `DATABASE_URL` (git-ignored); `ENCRYPTION_KEY` is still empty and `.env.local` was removed.
- **After editing `globals.css` the PortaGen dev server kept serving the old stylesheet** (new classes had no effect until `yarn dev` was restarted), the same quirk as in the other projects. The published portfolio shows a lock screen with a password hint (`1234`) and, by default, an empty desktop with no icons; that interior is out of scope for the design work.

- After editing `globals.css`, restart `yarn dev`; the old CSS is served otherwise.
- Do not use `Math.random()` in render (skylines, etc.); it breaks hydration. Use a deterministic formula.
