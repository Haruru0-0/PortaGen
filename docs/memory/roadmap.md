# Roadmap

Open items only; what exists is in [[features-built]].

- The generic Terminal and Achievements slice (types, forms, renderers, achievement context, animations) was committed as-is on 2026-11-07 along with the rest of the port work-in-progress; it has not been built or run yet (see the next item).
- Run the app and build it to check the new window types (nothing from the port has been built).
- Port the page redesigns and styles, and the Window, Desktop, Taskbar and Icon rework from AOS.
- Check whether the Hashnode integration still works.
- Replace the generic README (real env variables, `.env.example`, correct clone URL).
- Refresh the code map with `python -m graphify update .` after larger changes.
- **Design review of every page is done (score 22/40, 2026-11-05).** Blockers are committed in 7e0ca6a and pushed. The accessibility, landing/content, editor-layout and dashboard-consistency passes are committed in 4d06d45 and pushed on `feat/port-aos-changes` (see [[features-built]]); the unfinished port stays uncommitted. The second critique's fixes (type floor, loading skeletons, sticky side preview, 40px targets, tab titles) are committed in d0b5233, not pushed (see [[features-built]]). Still open: one global SAVE with a saved indicator, unsaved-changes guard and template-switch confirm (in `window-content-editor.tsx`), solid pixel shadows and square corners, a live check of the editor forms once a window exists.
- **Apply the migrations to the new Supabase project** (`yarn db:migrate` with the pooler `DATABASE_URL`), then view the dashboard, editor and published desktop live and fix the design critique gaps (see the critique entry above).
- `feat/port-aos-changes` was merged into `main` on 2026-11-07 (merge commit dcbd0dc) and pushed. Run `yarn build` soon: the merged port code and design passes have not been built together.
