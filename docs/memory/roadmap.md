# Roadmap

Open items only; what exists is in [[features-built]].

- Decide whether to commit the generic Terminal and Achievements slice or keep porting first (the author has not answered).
- Run the app and build it to check the new window types (nothing from the port has been built).
- Port the page redesigns and styles, and the Window, Desktop, Taskbar and Icon rework from AOS.
- Check whether the Hashnode integration still works.
- Replace the generic README (real env variables, `.env.example`, correct clone URL).
- Refresh the code map with `python -m graphify update .` after larger changes.
- **Design review of every page is done (score 22/40, 2026-11-05).** Blockers are fixed but uncommitted (see [[features-built]]). Next, in order: accessibility sweep (a solid `:focus-visible` ring, label association and `autocomplete` on all forms, names for icon-only buttons and the mobile user button, the Danger Zone red and dark-mode error contrast); editor layout (sticky preview, fewer or grouped tabs, calmer Theme tab, unsaved-changes guard, confirm before a template switch wipes content); landing and content (one brand name instead of PortaGen vs Aether Portfolio, the privacy page's "(not yet created)" placeholder and missing contact, real footer links, press states and `<Button asChild>` instead of `<a><button>`, hamburger name); dashboard consistency (container widths, Delete vs Edit emphasis, actionable checklist, Assets empty state action, the fake identity flash on load). Verify the editor forms live once a window exists.
- **Apply the migrations to the new Supabase project** (`yarn db:migrate` with the pooler `DATABASE_URL`), then view the dashboard, editor and published desktop live and fix the design critique gaps (see the critique entry above).
