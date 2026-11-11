# Screenshot corrections and reveals — 2026-11-10

Corrected the specific gaps in the seven supplied screenshots while keeping the approved Persona identity.

- Footer: final landing backing ends at its section boundary; footer has its own content plane and padding.
- Login/signup/recovery box: AuthScene now uses the shared diagonal panel, with fitted padding on mobile.
- Dashboard header: shared cyan/pink frame, smaller title and room for the account control; sticky behavior retained.
- Switches: scoped angular track/thumb with a 72×44px target and visible keyboard focus. Reset Tailwind's independent translate to avoid applying thumb movement twice. Native checked/disabled semantics remain.
- Editor: preview controls and back/jump actions use pointed buttons, readable labels and explicit pressed states. Live desktop contents keep the chosen portfolio skin.
- Drive integration: nested status/explanation sections use shared frames.
- Share link: real readonly, focus-selectable input; responsive copy row, smaller action text. Copy/Open wait for an actual account URL, avoiding the previous temporary undefined URL. Removed the unsupported blanket claim that the portfolio is live.
- Motion 14.12.0 plus IntersectionObserver: 18px/450ms opacity/translate reveals for below-fold content, once per element. Initial server markup remains visible. Above-fold content, sticky chrome, portals and the live preview are excluded. Reduced animation, landing pause, keyboard focus and cleanup settle content immediately; missing IntersectionObserver leaves content visible.

## Evidence

- Reproduced the footer overlap in a failing browser assertion, then passed the same assertion and the missing-auth-frame check.
- Full responsive matrix: 45 screen/width combinations at 320, 390, 768, 1024 and 1440px pass, with no overflow or page errors.
- Mobile and desktop browser checks at 390 and 1440px pass for footer, login, header, switch bounds, share selection and preview Lock/Home controls, without page errors or horizontal overflow.
- Reveal checks pass: observer entry, completion, once-only behavior, live Reduce animation change, landing Pause, JavaScript-disabled content and missing-observer fallback.
- Targeted ESLint passes for the new controller, auth/header/motion controls and share component. Existing repository-wide lint findings remain outside this correction.
- Eight existing policy/geometry tests pass.
- TypeScript passed during implementation. Final `yarn build` passed in 103.76s after the fixture route was removed. Existing Next config/middleware and dependency deprecation warnings remain.
- Fresh review found the switch double-translate issue; corrected and verified in the browser. No remaining concrete blockers reported.

Screenshots are in [persona-polish](persona-polish/). Owner screens use illustrative fixtures with writes blocked. Real authenticated login/save/upload/publish flows and physical devices were not exercised. No database or environment changes. Motion adds a dependency and the corresponding Yarn lockfile entries. No push or deployment.

Motion implementation reference: [official animation API](https://motion.dev/docs/animate).

## Follow-up: clicked switch and preview bar

Rechecked both switch states after actual clicks: thumb bounds remain inset within the track. Reproduced the full-width bar behind Back to the controls with a failing computed-background assertion. Limited preview background styling to the actual panel and made the link background transparent with content-sized width; the same assertion now passes. Screenshot: `persona-polish/preview-wrapper-fixed.png`. Temporary fixture removed again; `git diff --check` passes. This follow-up changes CSS only; the earlier production build predates these two CSS corrections.

## Follow-up: stronger reveals and Display options

Replaced the remaining rounded Display options trigger with the shared angled cyan/pink frame, including open/focus states and an icon-only 52px mobile target. User requested more noticeable reveals: current travel is 56px desktop / 32px mobile over 0.8s, with 0.1s stagger capped at 0.3s and an 80px viewport inset. These supersede the earlier 18px/450ms values. Browser assertions pass for open/close, 390/1440px overflow, a reveal still running after 500ms, settled visibility and immediate reduced-motion cleanup. Screenshots: `persona-polish/display-options-390.png` and `display-options-1440.png`.

Stronger-reveal follow-up validation: targeted ESLint passed (16.78s), TypeScript passed (50.32s), and git diff whitespace checks passed. No production rebuild was run for this follow-up.
