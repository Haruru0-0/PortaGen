# Screenshot corrections and reveals

User requests corrections to the footer, auth box, dashboard header, switches, editor actions, share field and text sizes, plus Motion and IntersectionObserver reveals. Continue the approved cyan/pink angled identity.

1. Fix footer stacking: final section background must end before the footer. Frame AuthScene controls and DashboardHeader. Replace remaining rounded switches and preview controls with scoped owner styles. Frame nested Drive sections and use a real readonly share input. Keep service behavior and published skins.
2. Add Motion dependency and a scoped IntersectionObserver reveal controller. Brief opacity/vertical-translate reveals, once per element; no layout changes or hero/video animation changes. Start from visible SSR content; respect global reduced motion, landing pause, keyboard focus and missing observer fallback. Exclude live portfolio preview, sticky chrome and portals. Cancel animations and disconnect observers on cleanup.
3. Verify screenshot symptoms, control/focus/selection behavior, reveal once/reduced/pause lifecycle and responsive bounds at 390 and 1440. Run TypeScript, targeted lint, eight policy tests and production build. Remove temporary fixtures, record QA and memory.

Completed: all three steps. Production build, scoped lint, eight policy tests, 45 responsive combinations and targeted reveal/control checks pass. Fresh review finding fixed; temporary fixture removed. See `docs/qa/2026-11-10-persona-polish-reveals.md`.
