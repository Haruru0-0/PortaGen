# Remove PortaGen AI and animate menus — 2026-11-10

Removed the dashboard AI provider, floating button and chat panel, the dedicated `/api/ai/chat` endpoint, and the unused `ai`, `@ai-sdk/react` and `@ai-sdk/google` packages. Source searches find no remaining chat imports or SDK usage. Historical QA notes remain historical; current architecture/features memory is updated.

Owner select and account/dropdown menus now enter with a 280ms fade/12px slide and leave with a 160ms fade/8px slide, respecting popup side and origin. Dropdown uses Radix Presence and ignores pointer input after dismissal. Radix Select normally removes its popup immediately; the real menu still closes and restores focus immediately, while an inert, aria-hidden, pointer-free snapshot finishes its decorative exit. Snapshot IDs are stripped, viewport scroll is preserved, and snapshots are removed on animation end/fallback, reopening, unmount or reduced motion. Editor blog/properties selectors now use the shared Select root too. Published portfolio controls are outside this styling scope.

## Verification

- Reproduced the absent account-menu animation with a failing browser assertion; the same check passes after implementation.
- Browser checks pass at 390 and 1440px: no AI button, select/dropdown entrance and exit, viewport bounds, Escape, focus return, selection, rapid reopening, inert snapshot cleanup, and immediate reduced-motion behavior. No browser page errors.
- Removed AI endpoint returns 404.
- Existing browser contracts pass: native onChange/FormData, ref.focus, uncontrolled reset, autofocus/tabIndex/focus callback, and nested dialog menu/focus restoration.
- Eight policy/geometry tests pass. Targeted ESLint passes for overlays, exit helper and dashboard layout.
- Initial standalone type check found only stale generated `.next` references to the removed API route. Production build regenerated them successfully. Final `yarn build --webpack` passed in 153.59s, including TypeScript and all 60 static pages. Existing Next configuration/deprecation warnings remain; webpack is used because of the previously recorded Turbopack Roboto font issue.
- Fresh source review found no blockers; its closed-dropdown pointer suggestion was applied. There are no current controlled-open Select callsites; externally controlled closes preserve normal Radix behavior but skip the decorative snapshot.

Temporary illustrative owner fixture removed before final build. Tests blocked API writes except the local removed-endpoint 404 check. Live account/logout/save/publishing flows were not exercised. No DB or environment changes. Screenshots: `persona-polish/smooth-select-390.png` and `smooth-select-1440.png`. No push or deployment.
