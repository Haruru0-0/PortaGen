# Features built

Structure: [[architecture]].

- Dashboard with a portfolio editor, asset manager, settings and AI chat (commit "add AI chat functionality to dashboard"); image-URL support for wallpapers, icons and widgets.
- Published portfolios at `/portfolio/[username]` as a themed desktop with draggable windows, a lock screen, sound effects and widgets (including a music player).
- Window types: about me, blog, contact, links, projects, resume.
- GitHub Actions mirrors the repo to GitLab on every push.

## Unfinished: port from aesthetic-portfolio-os (branch `feat/port-aos-changes`, uncommitted)
- Added generic `terminal` and `achievements` window types: types in `src/lib/types.ts` (`TerminalData`, `AchievementsData` and related), defaults in `src/lib/portfolio-extras.ts`, renderers `portfolio/terminal.tsx` and `portfolio/achievements.tsx`, an achievement system (`achievement-context.tsx`) wired into `desktop.tsx` and the music widget, editor forms for both, scroll animation helpers (`AnimatedContent.tsx`, `src/lib/animations.ts`).
- Not run in the app or built yet. Not ported: the page redesigns and styles, and the Window, Desktop, Taskbar and Icon rework.
