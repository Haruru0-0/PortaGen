# Roadmap

Open items only; what exists is in [[features-built]].

- Exercise Terminal/Achievements forms and published renderers against real saved portfolio data. The full current application now builds successfully (2026-11-11); build success does not replace these functional checks.
- Owner pages now use the Persona/Blue Hour redesign. Any further AOS Window/Desktop/Taskbar/Icon port remains a separate published-portfolio task; do not overwrite the approved owner-page design.
- Check whether the Hashnode integration still works.
- Replace the generic README (real env variables, `.env.example`, correct clone URL).
- Refresh the code map with `python -m graphify update .` after larger changes.
- **Design review of every page is done (score 22/40, 2026-11-05).** Blockers are committed in 7e0ca6a and pushed. The accessibility, landing/content, editor-layout and dashboard-consistency passes are committed in 4d06d45 and pushed on `feat/port-aos-changes` (see [[features-built]]); the unfinished port stays uncommitted. The second critique's fixes (type floor, loading skeletons, sticky side preview, 40px targets, tab titles) are committed in d0b5233, not pushed (see [[features-built]]). Still open: one global SAVE with a saved indicator, unsaved-changes guard and template-switch confirm (in `window-content-editor.tsx`), solid pixel shadows and square corners, a live check of the editor forms once a window exists.
- **Apply the migrations to the new Supabase project** (`yarn db:migrate` with the pooler `DATABASE_URL`), then view the dashboard, editor and published desktop live and fix the design critique gaps (see the critique entry above).
- Verify [[youtube-music]] save/remove with a real authenticated owner and check playback after deployment. Local persistence UI tests were mocked, and some tracks remain blocked upstream. Google login is outside the current link-only scope.
