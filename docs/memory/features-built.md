# Features built

Structure: [[architecture]].

- Dashboard with a portfolio editor, asset manager, settings and AI chat (commit "add AI chat functionality to dashboard"); image-URL support for wallpapers, icons and widgets.
- Published portfolios at `/portfolio/[username]` as a themed desktop with draggable windows, a lock screen, sound effects and widgets (including a music player).
- Window types: about me, blog, contact, links, projects, resume.
- GitHub Actions mirrors the repo to GitLab on every push.

## Unfinished: port from aesthetic-portfolio-os (branch `feat/port-aos-changes`, uncommitted)
- Added generic `terminal` and `achievements` window types: types in `src/lib/types.ts` (`TerminalData`, `AchievementsData` and related), defaults in `src/lib/portfolio-extras.ts`, renderers `portfolio/terminal.tsx` and `portfolio/achievements.tsx`, an achievement system (`achievement-context.tsx`) wired into `desktop.tsx` and the music widget, editor forms for both, scroll animation helpers (`AnimatedContent.tsx`, `src/lib/animations.ts`).
- Not run in the app or built yet. Not ported: the page redesigns and styles, and the Window, Desktop, Taskbar and Icon rework.
- **Readability pass on PortaGen's own pages (committed in 7e0ca6a on `feat/port-aos-changes`, not pushed, 2026-11-05):** `src/app/globals.css` gained a `.readable` scope (navy-grey muted text, about 7:1 on white instead of 2.7:1), a `.font-dialogue` class (Pixelify Sans loaded in `src/app/layout.tsx` as `--font-dialogue`) and a defined `.pixel-text-shadow`. `readable` is applied to the landing page, the three auth pages, privacy and the dashboard layout; body text on those pages uses the dialogue face, red form errors use red-700, and the dashboard blue stat tile uses `text-primary-foreground`. Nothing under `src/components/portfolio/` or `src/app/portfolio/` was touched. A full read-only review of every page was started after this.
- **Three blocker fixes from the full design review (committed in 7e0ca6a, not pushed, 2026-11-05):** (1) on phones the AI chat button sits above the bottom bar (`bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-4`) so it no longer covers the Settings tab, and the mobile chat sheet has a visible 40px close button and uses `bg-card readable` (subtitle contrast 2.7 to 7.22:1, follows dark mode); (2) the editor's Windows tab explains that windows are created by adding an icon with "Link to Window" (the `api/icons/add` route creates the window) and has an ADD AN ICON button that switches to the Icons tab; (3) add and remove controls in the editor forms are visible at 70% opacity and show fully on hover or keyboard focus (touch overlays use `[@media(hover:none)]`), add buttons are 32px. Checked live for 1 and 2; 3 was checked from source only because no window exists to open.

## Design pass 2 (accessibility, landing, editor, dashboard)
- Accessibility: PixelInput/PixelPasswordInput link labels to inputs (`useId`), `aria-invalid` red border, forms use `noValidate` with `role="alert"` errors; icon-only buttons have `aria-label`; 40px+ targets; `.readable :focus-visible` solid 3px ring; `.dashboard-pixel-button` hover/active press states.
- `PixelButton asChild` (Radix Slot) lets a `Link` be the button (no `<a><button>`); landing uses it everywhere.
- Landing/privacy: one brand name (PORTAGEN), no fake social tiles, deterministic skyline heights (no `Math.random` hydration errors), back-to-home links on auth and privacy.
- Editor: tab strip scrolls horizontally below `lg` with tablist roles, "Preview ↓" floating jump button + "Back to the controls" link, mobile starts in mobile preview, Theme tab sections are collapsible `<details>`.
- Dashboard: header title follows the page, no fake "PLAYER_ONE"/example.com identity, checklist rows are links, pages share `max-w-5xl`, Edit is primary and Delete red outline, Assets empty state has a Connect/Upload action and a single Drive status.
