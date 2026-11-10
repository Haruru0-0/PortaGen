# Persona identity across every owner page

User approved the correction and requested implementation on 2026-11-09. This supplements the Blue Hour plan; it does not reopen its product or backend scope.

1. Add a scoped owner scene and shared visual treatments: blue-water compositions, character artwork, angled display titles, white pointed selection with red/pink accents, compact readable forms.
2. Recompose auth pages and apply distinct scene art/titles to portfolio slots, inventory, options, editor and privacy. Extend the same identity to nav, tabs, buttons and dialogs without masking focused controls or preview content.
3. Run types, policy tests, scoped lint, build and responsive visual QA. Preserve service handlers and owner-selected portfolio themes. No new runtime dependency or animation behavior.

Implementation in the existing feature branch; preserve all earlier work. Browser checks use ignored local tooling. Test styling through rendered pages and interaction checks; no CSS-mirroring tests.

Status 2026-11-10: presentation changes and responsive/keyboard/dialog checks implemented; see [QA evidence](../../qa/2026-11-10-persona-correction.md). Temporary fixture removed before production validation. Live authenticated operations remain unverified.
