# Remove PortaGen AI and smooth menus

User requests complete removal of PortaGen AI and smoother select/account menu animation.

1. Remove the dashboard chat provider/button/panel, dedicated /api/ai/chat endpoint and unused AI SDK packages. Search source for dangling imports and calls. Leave unrelated integrations and saved portfolio data.
2. Add 280ms fade/12px-slide opening and 160ms closing to owner select and dropdown surfaces, using Radix transform origins and side-aware travel. Dropdown Presence owns its exit. Radix Select unmounts immediately, so a pointer-inert aria-hidden decorative snapshot may finish its exit without delaying dismissal, selection or focus return. Clean snapshots on reopen/unmount/reduced motion. Keep published skins and reduced motion outside these animations.
3. Browser verify no AI UI/API route, menu geometry and animation at 390/1440, keyboard selection/Escape/focus return, rapid reopen and reduced-motion cleanup. Types/scoped lint/eight policy tests, remove fixture and run production webpack build (known Turbopack font resolver failure).

Completed all steps. Menu and native form-contract browser checks pass, targeted lint and eight tests pass, and webpack production build passes (153.59s). Fixture removed; stale generated AI-route types regenerated. Fresh review complete and closed-menu pointer improvement applied. QA: `docs/qa/2026-11-10-remove-ai-menu-motion.md`.
