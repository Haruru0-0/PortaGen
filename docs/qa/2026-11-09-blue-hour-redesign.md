# Blue Hour redesign verification

Date: 2026-11-09. Branch: `codex/blue-hour-redesign`. Implementation is in the local working tree; nothing pushed, merged or deployed.

## Implemented

- Supplied Shin entrance video, one play per eligible session, audio removed, full-frame empty/settled WebP posters and bounded failure fallback.
- Longer game-menu landing: interactive illustrative desktop, workflow, window types, customization, editor/sharing explanation, FAQ and account actions.
- Desktop decorative water/artwork parallax; mobile, pause, save-data and effective reduced-motion states disable/reset it.
- Local Reduce animation switch with device default, explicit overrides, reset and cross-tab updates, shared by landing and Settings → Appearance.
- Scoped owner typography/tokens and portals, bounded route wipes, real dashboard menu and account statistics, real portfolio save slots, inventory/settings/AI presentation and editor controls with connected keyboard tabs.
- Existing auth, CRUD and save handlers retained. Published route/renderer and shared UI primitive files have no changes. Preview token reset is placed at its rendering stage, retaining owner toolbar styling and selected portfolio font classes.

## Browser evidence

Headless installed Chromium, local Next server on port 3001. The in-app browser failed to connect, so the browser matrix used Playwright installed only in ignored QA scratch; no dependency/lockfile change.

[Viewport and scenario results](blue-hour/browser-results.json): **25 route/width combinations**, five public pages at 320/390/768/1024/1440px, all without horizontal overflow; zero captured JavaScript page errors.

[Additional scenario results](blue-hour/browser-extra-results.json): fresh entrance completion and remembered session, desktop parallax/reset, repeated stalled-event deadline, denied storage, save-data, short 390×350 viewport and destination heading focus.

Also passed: cross-tab device reset; explicit full motion overriding the device preference; interactive sample windows; login empty-form validation without sending credentials; native Back superseding a delayed navigation; blocked video fallback; account links and product copy without JavaScript.

Visual captures inspected include the settled desktop hero and mobile landing/account layout. [Desktop hero](blue-hour/landing-settled-1440.png), [mobile landing](blue-hour/landing-390.png), [mobile sign-in](blue-hour/login-390.png). The folder also includes desktop/mobile signup, recovery and privacy captures. Example portfolio data is explicitly illustrative and does not replace real records.

## Code checks

- Six native Node policy tests pass: eligibility/terminal states, motion preference parsing/resolution/storage events and ordinary/native route policy.
- Targeted ESLint for new landing/workspace/policy files and dashboard shell passes without warnings. Auth/inventory/settings targets pass with six existing warning categories. Editor comparison found no introduced lint messages (41 existing errors before/after across changed tracked editor targets).
- Final TypeScript check passes (`yarn tsc --noEmit`, 25.08s). Final production build passes (`yarn build`, 114.22s). Full repository lint remains failing with 147 errors / 182 warnings, compared with baseline 155 errors / 191 warnings; the new targeted surface check passes. Existing repository lint debt is not a clean lint result.
- Impeccable source detector for new landing/workspace plus landing/dashboard pages returned `[]`; this is supplemental source evidence, not accessibility conformance.
- `git diff --check` passes.

## Review corrections

A fresh independent review found no Critical issue. Corrected: portal menus inheriting full-viewport minimum height, repeated stalled events extending the media timeout, heading focus selecting an earlier share-widget heading, an unconditional editor-share GSAP entrance, incorrect artwork parallax ranges/missing surrounding-water depth, and corrupted checklist characters. The share panel now uses static owner presentation. Preview reset was tightened to the renderer container to preserve selected font classes and owner toolbar tokens.

## Remaining validation limits

No authenticated local account was available to the test browser. Real OAuth/recovery delivery, account save/delete, Drive upload/rename/delete, AI provider responses and every editor content-type save remain unverified. No fake successful service response or database migration was introduced. Pixel, Windows XP and liquid-glass published/preview screenshots still need a usable test portfolio/account; source boundaries are preserved, but rendered regression verification is pending.

The 320 CSS-pixel width and short viewport were exercised. Actual 200% text enlargement, browser UI 400% zoom and a physical mobile keyboard/device were not exercised. Screen-reader checks and authenticated nested portal interactions remain pending. These limits should be checked before deployment.

## Execution decisions

- Used a local feature branch in the existing checkout to preserve earlier uncommitted artwork/docs; no separate worktree or destructive cleanup.
- Delegated independent editor, auth/data-page and overlay migrations; integrated shared interfaces and requested a fresh whole-change review.
- Kept changes reviewable and uncommitted rather than making eight task commits over a checkout already containing user-approved uncommitted files. This costs commit-level task history; source changes remain visible in the diff.
- Added `.superpowers/` to Git/ESLint ignores for local QA packages and scratch output. No application runtime dependency was added.
