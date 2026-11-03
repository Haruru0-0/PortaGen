# Gotchas

See [[architecture]].

- **Hashnode:** `src/lib/services/hashnode.ts` talks to Hashnode. Their GraphQL API required a paid plan from 2026-05-13 (this broke the author's AOS site); portfolio blogs here may be affected. Not checked in this repo.
- **The README is generic:** it lists an old clone URL (`AhmadKanaan0/PortaGen`), example environment variables that may not match the code and no `.env.example`. Read the code for the variables the app needs.
- **The working tree holds uncommitted port work** on `feat/port-aos-changes` (about 13 files). `main` does not have it.
- **A past history rewrite removed a leaked Supabase database password;** that password should be rotated if it was real (noted in the jalter memory by another session).
- **Port 3000 may clash with another project;** use `next dev -p 3001`.
- **`graphify.exe` is blocked on this machine;** use `python -m graphify update .`.
