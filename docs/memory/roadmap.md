# Roadmap

Open items only; what exists is in [[features-built]].

- Decide whether to commit the generic Terminal and Achievements slice or keep porting first (the author has not answered).
- Run the app and build it to check the new window types (nothing from the port has been built).
- Port the page redesigns and styles, and the Window, Desktop, Taskbar and Icon rework from AOS.
- Check whether the Hashnode integration still works.
- Replace the generic README (real env variables, `.env.example`, correct clone URL).
- Refresh the code map with `python -m graphify update .` after larger changes.
- **Design review of every page is done (score 22/40, 2026-11-05).** Blockers are committed locally in 7e0ca6a (not pushed). The accessibility, landing/content, editor-layout and dashboard-consistency passes are done but uncommitted (see [[features-built]]); the unfinished port stays uncommitted. Still open: unsaved-changes guard and template-switch confirm (in `window-content-editor.tsx`), a sticky side-by-side editor preview, solid pixel shadows and square corners, a live check of the editor forms once a window exists.
- **Apply the migrations to the new Supabase project** (`yarn db:migrate` with the pooler `DATABASE_URL`), then view the dashboard, editor and published desktop live and fix the design critique gaps (see the critique entry above).
