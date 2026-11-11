# Smooth control motion and signup artwork

User asks for smoother switches, better tab-content entrance, another Lena signup image with the character clear of the form, and pointer cursors where appropriate.

1. Scope switch transitions to 320ms thumb glide plus track/color transitions. Reduced animation remains immediate, including pseudo-elements. Add enabled clickable cursor rules without affecting text fields, disabled controls or published preview skins.
2. Replace editor TabContent's 160ms/4px entrance with Motion opacity + 24px upward travel over 420ms. Keep tab IDs, keyboard behavior, conditional forms and save logic. Stop and restore styles on changes/unmount or reduced motion.
3. Signup uses existing 03-lena-wind artwork (including verification state), with an explicit left artwork panel on desktop and artwork above the form on mobile. Other auth screens keep their existing compositions.
4. Browser-check real switch travel at intermediate time and after rapid toggles; tab animation and semantics; reduced-motion behavior; signup at 390/768/1440; enabled/disabled pointer behavior. Run types/lint/policy tests and production build. Temporary fixture removed before final build.

Completed. Browser motion/keyboard/geometry/cursor checks and 390/768/1440 signup captures pass; fresh review tablet-crop finding corrected. Targeted lint, TypeScript and eight tests pass. Production webpack build passes; default Turbopack fails in unchanged Roboto font resolution. Temporary fixture removed. See `docs/qa/2026-11-10-control-motion-signup.md`.
