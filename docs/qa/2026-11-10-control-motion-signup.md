# Control motion and signup artwork — 2026-11-10

- Switch thumbs now glide over 320ms with eased track/thumb color changes. Reduced animation makes both the thumb and track pseudo-elements immediate. FormControl was overwriting the Switch data-slot marker; preserving the Switch marker fixes editor track/checked styling as well as the animation.
- Editor section tab contents now enter with Motion: 24px upward travel and fade over 420ms. Active tab IDs, keyboard semantics and existing form/save logic remain. Cleanup stops playback and restores styles for rapid changes, unmount and reduced motion.
- Signup and email verification now use the existing flowing-hair Lena artwork (03-lena-wind), in a separate left panel at desktop/tablet sizes and above the form on mobile. Tablet crop shifted to keep her face visible; paired form fields stack below 1024px.
- Enabled buttons, tabs, switches, menu/option rows, links, summaries and relevant native inputs have pointer cursors. Text fields retain the text cursor, disabled controls retain their disabled cues, and portfolio preview descendants are excluded.

## Verification

Browser checks pass for intermediate switch movement, checked bounds after rapid toggles, tab animation, rapid tab changes, one active tabpanel, reduced-motion cleanup (including switch pseudo-elements), and pointer/text cursors. At 390, 768 and 1440px signup artwork is clear of the form and there is no horizontal overflow. Tablet crop was corrected after visual inspection and independent review. Screenshots: `persona-polish/signup-lena-{390,768,1440}.png`.

Targeted ESLint passes for Switch, TabContent and AuthScene. Eight policy/geometry tests pass. TypeScript passed during implementation. Temporary fixture removed before final production build; final build result recorded below.

Editor checks used illustrative fixtures with API writes blocked. Real login, signup, account verification, saves and uploads were not exercised. Existing repository lint issues and Next configuration/deprecation warnings remain. No DB/env/dependency changes for this follow-up; no push/deployment. The current existing dev server is on port 3000.

Build note: default `yarn build` failed inside the existing Roboto `next/font/google` Turbopack resolver (`next/font/google queries have exactly one entry`). The font setup was not changed by this task. Production `yarn build --webpack` passed in 130.86s, including TypeScript and static page generation. Default Turbopack remains affected by that font resolver error.

## Follow-up recording: Reduce animation switch

The supplied recording showed the Reduce animation control snapping when enabled. Reproduced with a failing intermediate-position assertion: the page-level reduced-motion rule disabled the very switch transition already in progress. MotionPreferenceControl now marks only a toggle started with motion enabled as settling for 360ms, allowing its 320ms thumb glide and color change to finish. The page preference, animation cancellation and persisted setting still change immediately. Toggles started while already reduced do not arm this exception. Cleanup clears the timer on unmount, and rapid toggles replace it. Browser checks pass for smooth movement both ways, immediate page reduction, rapid toggles and reset while the device is already reduced. Targeted lint passed; follow-up type result follows. No production rebuild for this small follow-up.

Reduce-switch follow-up: TypeScript passed; targeted browser regression and lint passed.
