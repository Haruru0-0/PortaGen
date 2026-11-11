# Angled Persona components — 2026-11-10

Implemented the approved component previews on `codex/angled-persona-components`.

## Result

- Shared cyan diagonal frames with pink offset backing across owner panels, sidebar, dialogs, drawers, fields, selects, account menus, popovers and uploads.
- Input focus thickens the existing silhouette inward, without a rectangular ring or moving text. Disabled, invalid, open, selected and keyboard states are styled.
- Decorative title rails and image/section fills follow the enclosing diagonal. Interactive descendants remain unclipped.
- Custom option menus replace owner native single selects while retaining change handlers, native FormData, refs, reset and autofocus behavior. Published portfolio skins are outside this styling scope.
- Longer landing uses stronger blue/paper section changes, framed demo windows, cyan rails and pointed actions. Existing entrance video, parallax and motion preferences remain wired.
- Mobile drawers keep their backing inside the viewport; content scrolls independently of the frame.

## Verification

- Production `yarn build`: passed (139.59s), after removing the fixture route. Existing Next configuration/middleware and dependency deprecation warnings remain.
- TypeScript `yarn tsc --noEmit`: passed.
- Scoped ESLint: shared frames/overlays and landing have no errors. Broader scope reports two existing portfolio-share errors (confirmed against HEAD) and one existing avatar `<img>` warning. Editor migration baseline comparison found no introduced diagnostics; repository-wide lint is not clean.
- `node --test src/__tests__/*.test.ts`: 8 passed, including actual section-position geometry and existing entrance/motion/navigation policies.
- Browser responsive matrix: 45 combinations across 320, 390, 768, 1024 and 1440px; landing, login, signup, recovery, privacy, portfolios, assets, settings and editor. No horizontal overflow or page errors.
- Browser controls at 390 and 1440px: focus does not shift input geometry; native outline removed; select changes reach existing callbacks and FormData; ref.focus targets visible trigger; account menu Escape restores focus; nested dialog fits viewport and restores focus.
- Browser form contracts: uncontrolled select reset, native FormData after reset, autofocus, tabIndex and onFocus currentTarget passed.
- Browser upload: keyboard focus uses the shaped frame and clicking opens the native file chooser.
- Fresh whole-change review completed; reproduced and fixed form-reset/focus bridging findings. Also corrected modal positioning, artwork spacing and old demo-window rotation found during verification.
- Temporary review route removed before production build. Screenshots and matrix JSON are in [angled-frames](angled-frames/).

Authenticated owner views used illustrative UI fixtures with API writes blocked. Real login, database/Drive writes, uploads and publishing were not exercised. Physical mobile devices and real browser zoom were not tested. No DB migrations, environment changes, dependency or lockfile changes, push or deployment.
