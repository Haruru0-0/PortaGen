# PortaGen Blue Hour redesign

Status: reviewed with Superpowers, Impeccable and UI UX Pro Max; implemented locally after the user's instruction to proceed. See [implementation QA](../../qa/2026-11-09-blue-hour-redesign.md) for verified behavior and remaining authenticated/visual checks. This specification supersedes the earlier short landing and simulated account mockups.

## Author correction after first implementation (2026-11-09)

The Persona direction applies to **every PortaGen-owned page**, including auth, portfolio lists, assets, settings, editor controls and supporting dialogs. The first implementation made those pages too generic. This correction supersedes any earlier interpretation that expressive visual identity belongs only on the landing/dashboard root. Keep consistent water-world backgrounds, angled display headings, pointed selection treatments, cyan/white/red/pink hierarchy and character-art composition across the owner application. Scale composition to the task: editors still need compact controls and level readable fields, but their surrounding navigation and visual language must visibly belong to the same game. Preserve users' selected published/preview portfolio skins. Visual correction is pending implementation; prior QA captures represent the first pass.

## Intent and confirmed requirements

Make PortaGen's own application feel like an intentional anime game menu while explaining the product clearly to new visitors. The user explicitly selected the existing Shin entrance video, requested Superpowers planning, and wants a longer landing page with more information about the site.

Previously established direction: Persona-inspired blue water, large tilted condensed display type, cyan inactive navigation, pointed white selection with red type and pink offset shadow, Shin and Lena artwork in the clean Eighty-Six anime style. Sign in/sign up lead to a game-menu dashboard. Preserve the owners' published portfolio interiors and their selectable skins.

## Approaches and recommendation

1. **Continuous landing with an opening title scene — recommended.** The first viewport uses the video and account menu; scrolling reveals product details in the same visual world. No extra gateway or forced waiting. This fits the latest longer-page request while preserving the previously chosen opening.
2. **Separate cinematic splash before the marketing page.** More theatrical, but creates a second entry step and hides product information. Do not use this approach.
3. **Conventional marketing hero with an inset video.** Easy to explain, but weakens the requested game-menu identity. Do not use this approach.

The integrated approach is the planner's recommendation; it has not been separately approved by the user. Implementation awaits review of this concrete proposal.

## Scope and constraints

- Redesign `/`, `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/privacy`, `/dashboard`, `/dashboard/portfolios`, `/dashboard/assets`, `/dashboard/settings`, and the editor control shell under `/dashboard/editor/[id]`, including its window-content editor route.
- Retain existing Supabase handlers, OAuth redirects, form schemas, contexts, fetches, uploads, deletions, and ownership checks.
- Do not modify published portfolio renderers, `src/app/portfolio/**`, `src/components/portfolio/**`, global pixel component defaults, database schema, migrations, or secrets.
- No new animation dependency. Use existing GSAP and scoped CSS; use the existing Next.js router, React, Tailwind, Lucide and shadcn primitives.
- New workspace styles use `.workspace-theme` and `--workspace-*` variables. The pixel body font and global portfolio tokens remain available to published interiors and previews. The editor preview's outer wrapper explicitly restores the existing pixel family; avoid broad workspace descendant selectors that could restyle its internal controls or text.
- Keep defaults of shared UI components unchanged. New workspace modal wrappers put `.workspace-theme` on portaled dialog/drawer content, so portals receive the intended tokens without global body overrides.
- Owner-created portal content **and overlay roots** also receive explicit effective motion state. This includes display-options popovers, dropdowns, selects, tooltips, dialogs and drawers, including nested portals. Use narrow workspace wrappers over existing Radix/Vaul primitives where their current component API cannot theme an overlay; do not solve it with body-wide rules or changes to shared default behavior.
- No invented reviews, usage statistics, pricing, analytics, or saved/published/draft statuses unsupported by persisted data.
- This redesign preserves each existing save action and its actual pending/error state. A global save mechanism and unsaved-navigation guard are separate functional projects, not implied by this visual pass.

## Existing code and factual content

- `src/app/page.tsx` is a client landing with GSAP/ScrollTrigger, pixel hero, feature cards, steps, and final CTA. Replace its presentation, preserving useful product claims that the implementation supports.
- `src/app/layout.tsx` loads Press Start 2P and Pixelify Sans globally; add display/body font variables without replacing the global pixel class.
- `src/app/dashboard/layout.tsx` owns portfolio and AI chat providers plus sidebar/header/mobile navigation. Retain provider lifetimes and AI chat access.
- Login supports email **or username**, password, Google, and GitHub. Preserve all four entry mechanisms and their actual callbacks.
- Portfolio lists use `PortfolioProvider` to fetch/create/delete records; the editor takes a portfolio ID. There is no verified publish-state field or publish action to invent.
- The actual public routes are `/portfolio/[username]/[id]` and its `/home` child. Marketing examples must include both pieces; earlier mockups with username-only addresses were illustrative and incorrect.
- Window types in `src/lib/types.ts`: About, Projects, Contact, Resume, Blog, Links, Terminal, Achievements, and Blank. Explain core windows; keep Blog/Terminal/Achievements examples modest until their current integration is exercised. Gallery is not a verified standalone window type.
- Existing customization includes lock/home wallpaper, icons, window content/themes, music, sound effects, and widgets. Assets include wallpapers, icons, music, and sounds, with a Google Drive connection flow.
- Published interiors use their own theme system. A blue workspace does not force portfolios to use blue or anime artwork.

Graphify identified the landing/dashboard/editor dependencies; its broad query was truncated. Source inspection, not the truncated graph, verified the details above.

## Selected video and media behavior

Source: `C:/Users/ahmad/Desktop/video.mp4`.

- SHA-256: `AC61C5863C42C14DD381C2672B950E86F58B31AE83409210145BD0ADAB3874F3`.
- 4,025,477 bytes; about 10.03 seconds; 1280 × 720; 24 fps; H.264 plus an AAC audio track.
- Use this supplied clip as-is visually. It is the reviewed version with the larger water disturbance. The user accepted effects reaching the menu area. Do not regenerate or silently replace it.
- At implementation, copy a provenance source to `public/media/blue-hour/shin-entrance-source.mp4`; export an otherwise equivalent muted delivery clip `shin-entrance.mp4` by dropping audio without re-encoding video. Generate an empty-water poster at 0.0s and a settled-character poster at 9.5s. Keep the source untouched.
- First eligible home visit per browser tab session: muted, inline, non-looping playback. Store `portagen:blue-hour-intro:v1=settled` in guarded session storage once the scene settles, is skipped, or errors. Returning home within that session shows the settled poster immediately after hydration, without replaying the entrance.
- Server and initial client render use the same empty-water poster with visible title/account links. No hydration mismatch and no settled-character flash before the empty first frame. The media is decorative; account actions and scrolling work before, during, and after playback. A visible Skip intro control jumps to the settled poster.
- Begin playback once playable. If readiness is not reached within 2 seconds, autoplay rejects, the video errors/stalls for 2 seconds, or the tab returns from a visibility interruption, settle to the poster. Late events must not restart a settled scene. Storage being blocked must not prevent use.
- Once playback ends, retain the settled-character poster with a restrained CSS water-light overlay and sparse ambient bubbles. Do not loop the full entrance. No tail-video loop is promised: an independently checked seamless tail can be a later optimization.
- Effective reduced motion (resolved from the user setting below) or a reported save-data preference: do not attach/download the video source, show the settled poster immediately, and stop ambient motion. Provide a Pause background motion toggle for everyone; it pauses playback/ambient layers and selects the settled poster when paused during the entrance. This temporary pause is separate from the persistent Reduce animation preference.
- Pause media when the hero is outside the viewport. Resuming an interrupted entrance settles rather than jumping forward. Remove media listeners and animation timelines on unmount.
- On mobile retain the full 16:9 composition in a dedicated visual area and place the menu beneath it; do not use cover-cropping that cuts Shin's face or the source watermark. Desktop can fill a wider hero with complementary water-colored edges while retaining the source composition.
- Account and dashboard pages use the chosen static reference edits, not new generated entrance videos. Lazy-load below-fold art; only one hero video can be active.

## Longer landing structure and copy

Target: one opening scene followed by six substantial sections. At a typical desktop height the complete page spans roughly 4–5 viewports; do not fix the page height or pad it merely to hit that number. All sections reflow into a natural mobile document.

```text
OPENING SCENE   Shin entrance | PORTAGEN | Sign in / Sign up
               "Build a desktop. Share your work."
               short product sentence + "Explore below" anchor
       ↓
YOUR WORLD     Interactive sample desktop: About / Projects / Contact
       ↓
BUILD IT       Create a portfolio → customize → preview → share its link
       ↓
FILL IT        Window content: About, Projects, Resume, Contact, Links...
       ↓
MAKE IT YOURS  Wallpaper / icons / themes / music / sounds / widgets
       ↓
FROM EDITOR    Controls-and-preview explanation, mobile and desktop
TO YOUR LINK   Real example URL shape /portfolio/your-name/123
       ↓
FAQ + START    Plain answers and a final Sign up / Sign in menu
```

1. **Opening scene.** Keep the game-menu composition: character on the video's right, navigation on its left, white spear selection, red active lettering and pink shadow. Live title and text are HTML, never baked into the video. Exact headline: “Build a desktop. Share your work.” Supporting line: “Create a portfolio people can explore—with your projects, windows, wallpaper, and music.” Primary account choices remain Sign in and Sign up. Add “Explore below” linking to `#your-world`, never an animation-only navigation.
2. **Your world, open to explore.** A lightweight, local sample desktop illustrates About, Projects, and Contact windows. Switching one closes the previous sample window, works with keyboard/touch, and is clearly marked “Example portfolio.” No database fetch, real contact form, owner data, or change to published renderers. This is a marketing demonstration, not a second portfolio engine.
3. **Build, customize, preview, share.** Four concrete sequential steps using short copy. Use “Share” rather than suggesting a nonexistent Publish workflow. Account calls to action point to the real signup route.
4. **Give your work its own windows.** Show six verified core content examples with a compact note on extra window types. Explain that icons open windows; visitors browse the work as a desktop. Do not claim a dedicated Gallery type.
5. **Make it feel like you.** A few curated wallpaper/icon/theme compositions and a concise explanation of audio/widgets. Keep character art as page accents, not mandatory user portfolio content. Do not autoplay sound. Use known theme IDs from `src/lib/constants/theme-templates.ts` for any labeled real skin.
6. **From editor to your own link.** A clear controls/preview illustration and actual URL shape. Explain “Edit your content, check the preview, then share your portfolio link.” No custom domains, deployment promises, or unverified pricing.
7. **Questions, then start.** Four concise FAQ items: what a desktop portfolio is; whether it can be customized; what visitors can open; how sharing works. Native details/summary or existing accessible Accordion. Finish with Sign up, Sign in, Privacy and real repository/contact links only if already verified. No fake social icons.

### Composition and account hierarchy after UI/UX review

- For anonymous visitors, Sign up is the primary action and initial visual emphasis; Sign in is immediately visible as a secondary choice. Neither receives programmatic focus on load. Add one compact Sign up link after the four workflow steps, then the final account menu; do not repeat a large CTA menu in every section.
- Each section has one dominant visual argument: the interactive desktop in Your world; a compact four-step sequence in Build it; a single window arrangement with concise examples in Fill it; a few curated compositions in Make it yours; labeled controls/visitor preview plus the real URL format in From editor to your link; quiet text in FAQ. Do not turn the lower page into six equally weighted grids or full-height feature sections. Character art supports the explanation; it does not replace product demonstration.
- Keep ordinary labels such as Portfolios, Editor, Assets and Settings primary. Save slots/Inventory/Options can be secondary flavor, never the only wording users must decode.

## Visual and responsive system

### User-controlled Reduce animation setting (requested 2026-11-09)

- Add an accessible **Reduce animation** on/off switch in Dashboard → Settings → Appearance, and the same quick control in the landing page's display-options popover. It is available before sign-in. Both controls change the same browser-local preference immediately, without submitting the existing account form.
- On means the settled still is shown, ambient water stops, parallax is disabled/reset, page wipes and editor-tab entrance animations are skipped, and scroll/focus behavior remains native. Off enables the planned motion subject to separate media/loading/save-data and mobile parallax rules.
- Internal modes are `system`, `reduced`, and `full`. Initial mode is `system`, following the device's `prefers-reduced-motion` value. Flipping the switch stores an explicit `reduced` or `full` choice; an explicit Off choice may override the device's reduced-motion preference for PortaGen's own pages. A **Use device setting** reset clears that override. Show a short “Following your device” or “Your choice” helper rather than exposing three competing switches.
- Persist the mode in `localStorage['portagen:workspace-motion:v1']`; anonymous and authenticated owner-page visits share it in that browser. No database column, account-sync promise, new endpoint, or environment variable. Invalid/blocked storage falls back safely to device preference, with interactive changes retained in memory.
- Cross-tab reset is explicit: a storage event for this key with `newValue === null`, or a storage-clear event with `key === null`, returns to system mode using the current device preference. Malformed external values also fall back to system; unrelated keys are ignored. Update the initiating tab immediately. The switch/reset have non-submit semantics and must not submit any surrounding form.
- One root client motion provider resolves preference after hydration and feeds every owner-page animation. Server and initial client markup remain identical and static; do not start media before preference resolution. Respond to device preference changes only when mode is `system`, and to valid cross-tab storage changes. Owner motion CSS/JS consumes this resolved value rather than independently forcing the device setting back on.
- Switching On during an entrance stops it, settles the character, clears active wipes/timers, and reverts parallax transforms. Switching Off restores ambient/scroll-linked motion at the current state; it never automatically replays an already settled entrance. If navigation was pending under a wipe, complete the last intended navigation exactly once before clearing it.
- The temporary Pause background motion control remains useful independently: resuming it cannot defeat Reduce animation. Only the Reduce animation switch/reset changes that persistent mode. This preference affects PortaGen's own pages, never published portfolio interiors or the nested portfolio preview.

### Landing parallax (requested 2026-11-09)

Add scroll-linked depth to the longer landing using the existing GSAP ScrollTrigger dependency. This is a landing-only enhancement, independent of the character's recorded entrance.

- Water texture/light layers move more slowly than the document: translate from +16px to -16px across the section's viewport passage. Use an oversized decorative wrapper so its edges never become visible.
- Static decorative Shin/Lena artwork in product sections translates from +24px to -24px across its section's viewport passage, without rotation, scaling, pose changes or pinned layout.
- The hero title may translate at most 12px over the hero's exit; the account menu, navigation, explanatory text, demo controls and forms remain in normal stable document flow.
- The uploaded video is one flattened visual: do not claim to move its character separately from its water, modify its locked camera, translate/crop the video plane, or synthesize independently moving character parts. Apply hero depth to surrounding decorative water/light layers and the HTML title only. The settled poster retains the same framing.
- Enable parallax only at widths of at least 1024px with a fine pointer, no reduced-motion/save-data preference, and motion not paused. All other cases render the same complete composition with zero scroll-linked transforms. The shared Pause motion control stops parallax as well as video/ambient animation, resets decorative transforms to zero, and resumes parallax at the current scroll position without replaying the entrance.
- Use section-local triggers, transform-only updates and linear scrub; no raw unthrottled scroll listeners, smooth-scroll library, scroll locking, pinning or extra content-height spacers. Revert triggers/transforms when resizing, navigating away, changing preferences or pausing. Offscreen sections do not run independent animation loops.
- Preserve readable focus positions, unobstructed controls, normal anchor scrolling and no horizontal overflow at every breakpoint. No parallax layers inside published portfolio routes or the editor preview.

### Shared styling

- Surface modes: landing is Persuade; dashboard root is a task-entry game menu; auth, portfolio lists, assets, settings and editor controls are Operate; privacy is Read. Published portfolios retain their own Experience presentation. Reserve large tilted Barlow headings/spear navigation for the landing and dashboard root. Use level DM Sans for task buttons, editor tabs/categories, dropdowns, compact navigation, labels and data; task-page backgrounds stay static and subordinate.

- Colors: water cyan `#44e4ff`, electric blue `#0755d8`, deep blue `#071657`, ink `#061039`, white `#fffef5`, pink `#ff76ae`, selected red `#bc174c`.
- Explicit text pairings: cyan on electric blue measures approximately 4.18:1 and must not be used for normal-size essential text. Use white on electric blue (about 6.29:1), cyan on ink (about 12.08:1), and selected red on white (about 6.17:1). Verify text over actual video frames against a stable dark scrim or backing, not an average screenshot. Normal text targets at least 4.5:1; large display text at least 3:1.
- Define component states for default, hover, focus-visible, selected, disabled, pending, success, warning, error and destructive actions. Selected red/pink is navigation decoration, not the only error/delete signal. Pair selection with shape/text semantics, errors with a message/icon, and destructive actions with an explicit label and the existing confirmation. Use an independent focus outline distinguishable on both selected and unselected controls. Preserve readable pending/disabled labels; never fade an entire form to communicate loading.
- Barlow Condensed bold italic for display/menu, DM Sans for body/forms. Keep body text level, line length about 60–75 characters, and essential body size at least 16px.
- Tilt display headings and selection shapes, not form fields or long paragraphs. Use asymmetry and varied editorial sections rather than seven grids of identical cards.
- Use selected Shin/Lena reference edits with consistent linework. Suggested assignments: Shin video in hero, Lena reaching at customization, Lena bouquet near final invitation. Suggestions are planner choices; retain the rest as unused alternatives.
- Interactive controls are at least 44 × 44 CSS px on touch, have visible focus, and maintain contrast against actual video frames via an opaque/dark text scrim as needed. The water effect may cross the menu; it must not hide labels.
- At 320px and 390px: stack scene/menu and section columns; support long text without clipping. At 768px/1024px: keep menus and examples readable without a large blank spacer. At 1440px: use bounded content width with generous blue negative space. No scroll lock, scroll hijack, or fixed-height nested marketing content.
- Escape does not navigate away from a text field; arrow-key menu enhancement applies only while a menu has focus. Normal links/Tab/Enter work without custom keyboard shortcuts.
- Demo-window choices and save-slot selectors are ordinary named buttons with `aria-pressed` and a named content region; slots include the actual portfolio name in their accessible name. Route links use `aria-current="page"`, not tab roles. The editor's real tabs use connected tab/tabpanel IDs, `aria-controls`/`aria-labelledby`, orientation-aware roving focus, Home/End and manual Enter/Space activation. Focus stays on the activating control when content changes. Pause uses a stable label with `aria-pressed`, and Reduce animation exposes its effective checked state.
- Video is decorative; provide pause/skip, static fallback, reduced-motion support, semantic landmarks, labeled errors and dialogs, and focus restoration after panels close.

## Auth, dashboard, and editor behavior

- Auth pages reuse the world/background and quieter Lena/Shin stills; forms sit on level dark panels. Keep current identifier/password, Google/GitHub OAuth, signup confirmation, recovery states, and back-to-home links. Real forms remain routes, not mock modal logins.
- Dashboard `/dashboard` becomes a large main menu: Portfolios, Assets, Settings, and Continue editing only when a selected portfolio exists. If none is selected, Editor directs to portfolio selection. Retain real username, checklist, recent activity and stats in a supporting details area; never show sample player identity as real account data.
- Dashboard subsection navigation is compact and persistent, with Home/back access; the main menu treatment does not consume half the editor's usable width. Mobile navigation preserves access and safe-area spacing.
- Portfolio list uses roman-number save tabs and readable detail panels. Preserve create, loading, empty, failure, delete confirmation, and pending states. Labels reflect real data only.
- Assets use an inventory presentation; preserve filters, search, multi-select operations, upload/rename/delete/Drive dialogs, pending states, and the distinction between disconnected Drive and an empty library.
- Settings retain their actual form fields/actions and destructive confirmations. The requested Reduce animation switch adds only the local appearance preference defined above; no additional account capability is implied by the “Options” metaphor.
- Editor is last. Preserve its existing lock/home categories, all tabs, live preview, mobile/fullscreen options, window-content editors and per-section Save buttons. The 1400px sticky preview behavior remains. Apply workspace styling to controls only; the nested portfolio preview renders in its selected skin.
- Editor hierarchy is portfolio identity/return path → Lock screen or Home category → selected tab → subsection heading/fields/local Save action. Show current category/tab in text, not color alone. Keep each Save action attached to the fields it saves, with nearby scope heading and real pending/error feedback; no global “All changes saved” claim. At narrow widths keep every tab accessible via labeled wrapping/overflow and preserve the preview/back-to-controls affordances.
- Privacy gets readable shared presentation and navigation without changing policy text during a visual redesign.

## Page transitions

- Use code-driven diagonal cyan → dark-blue wipe, 450ms total, for ordinary same-origin workspace route links. Reverse on explicit back controls. Short editor-tab transitions use 160ms and no full-page wipe; same-page landing anchors use native scrolling.
- Root persistent client provider owns the wipe; it is inactive on published portfolio routes and API/auth callback routes. Decorate new workspace links, preserve modified/middle clicks, downloads, external links and browser history behavior. Do not monkey-patch router/history or intercept native browser back.
- Cover for at most 200ms before committing `router.push`; reveal when pathname changes or after a 700ms fail-safe from transition start. Route load errors and rapid repeated clicks must never leave an input-blocking layer. The overlay has `pointer-events:none`; native loading UI remains available if data is still loading.
- Do not key/remount the dashboard providers or editor preview on each animation. Auth redirects/callbacks remain native. Disable wipes under reduced motion, keeping focus/navigation functional.
- After ordinary client navigation focus the destination heading only after its content is ready; preserve native in-page anchor focus/scroll and dialog focus handling. Never move focus on background playback events.
- Native Back/Forward, hash navigation, page exit, observed pathname changes or a superseding unanimated owner navigation invalidate any uncommitted wipe push and stale focus callback. Observe history without preventing or patching it. Owner callbacks that initiate unanimated navigation cancel pending transition intent before their existing push. Focus only the current destination's page heading (temporarily programmatically focusable), not the persistent dashboard-header title; ensure sticky chrome does not hide it.

## Delivery order and validation

1. Verify/copy the chosen video and derive posters; implement scoped fonts/tokens, media policy, and route transition primitives.
2. Replace the landing with the longer structure and interactive sample; preserve working account links and metadata.
3. Restyle auth/privacy, then dashboard menu and navigation.
4. Restyle portfolio/assets/settings presentation with existing data/actions.
5. Restyle editor controls last; perform whole-app and published-portfolio regression checks.

Use deterministic unit tests only for new playback/navigation policies and meaningful media failures; do not snapshot CSS or test markup that merely mirrors implementation. This repository has no official test runner: the installed Node 26 can run isolated TypeScript node:test files through native type stripping. Browser QA covers the actual video lifecycle and route behavior.

Required QA: first/repeated visit, denied autoplay, video 404/stall, blocked storage, reduced motion, save-data, pause/skip, tab visibility, rapid route clicks, modified links, keyboard/touch, 320/390/768/1024/1440px, real auth/CRUD states when credentials work, and unchanged published interiors. For parallax, check scroll forward/back, anchor jumps, resizing across 1024px, coarse pointers, pause/resume, runtime reduced-motion changes, trigger cleanup after route changes and stable video framing. Public landing/video failure checks must work without a database. Document credential-dependent checks that could not run. Run `yarn lint`, TypeScript checking and `yarn build`; distinguish existing failures from changes introduced by this work.

No database migration or new environment variable is planned. Native implementation in this session is the planner's suggested execution method after design review; no execution method has been selected by the user yet.

Additional review QA: 200% text enlargement, desktop 400% browser zoom (about 320 CSS px), and a short landscape/mobile-keyboard viewport. Complete login error recovery, motion preference reset, modal editing and fullscreen-preview exit without clipped or unreachable actions. Use actual zoom/text settings, not only resized screenshots. Keep focused controls visible using appropriate scroll padding/margins and safe-area/keyboard-aware layout. Only the existing intentionally desktop-sized preview may pan internally; owner controls and marketing copy must reflow.
