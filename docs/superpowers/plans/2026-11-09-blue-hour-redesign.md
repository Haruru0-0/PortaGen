# Blue Hour Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign PortaGen's own pages around the supplied Shin entrance video, a longer informative landing, and a coherent Persona-inspired workspace.

**Architecture:** Preserve the existing Next.js App Router routes, Supabase handlers, contexts and data operations. Add a persistent, route-aware workspace presentation provider, scoped theme primitives, an isolated hero playback controller, and new marketing sections. Published portfolios and editor preview interiors retain their existing renderer/themes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, existing GSAP, shadcn/Radix and Lucide; installed Node 26 for small native node:test TypeScript policy tests. No new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-11-09-blue-hour-redesign-design.md`.

**Status:** Tasks 1–7 implemented in the local working tree following user instruction to proceed. Task 8 public browser and code verification completed; authenticated flows, actual zoom/text enlargement and published-skin visual regression remain pending access/manual QA. See [implementation evidence](../../qa/2026-11-09-blue-hour-redesign.md). The checklists below retain the detailed acceptance scenarios; unchecked credential-dependent steps are not claims of verified behavior. No deployment or merge performed.

## Global Constraints

- New workspace styles use `.workspace-theme` and `--workspace-*` variables. The pixel body font and global portfolio tokens remain available to published interiors and previews.
- Do not modify published portfolio renderers, `src/app/portfolio/**`, `src/components/portfolio/**`, global pixel component defaults, database schema, migrations, or secrets.
- No new animation dependency. Use existing GSAP and scoped CSS; use the existing Next.js router, React, Tailwind, Lucide and shadcn primitives.
- No invented reviews, usage statistics, pricing, analytics, or saved/published/draft statuses unsupported by persisted data.
- This redesign preserves each existing save action and its actual pending/error state. A global save mechanism and unsaved-navigation guard are separate functional projects, not implied by this visual pass.
- Preserve all current auth/CRUD/upload/Drive/AI-chat capabilities and the real `/portfolio/[username]/[id]` public route format. No new env or DB migration.
- Scope motion: 450ms full-page diagonal wipe, 160ms editor tabs; reduced motion disables both. The entrance is once per tab session, never a full-video loop.
- Start implementation in an isolated `codex/blue-hour-redesign` worktree using the git-worktrees skill. Carry this plan, spec and existing uncommitted artwork into that worktree through the skill's safe handoff; do not reset/stash or sweep unrelated local changes into commits. If using another machine, first copy the user-authorized video source into the worktree and verify its hash.

## Review Focus

1. Autoplay denial, missing/stalled media, late media events and blocked session storage: poster and working account controls remain available. Tests and browser scenarios belong to Task 1.
2. Root font/CSS/portal leakage into published desktops and nested editor previews: original skins remain unchanged. Direct-route and portal checks belong to Tasks 1, 4 and 7.
3. Rapid navigation, failed route loads, modified link clicks and history/back behavior: no stuck wipe or broken native navigation. Policy tests and browser checks belong to Task 4.
4. Missing account/portfolio selection, no assets, failed CRUD and long user text: truthful empty/error states and valid routes. Checks belong to Tasks 3, 5 and 6.
5. Keyboard-only, reduced motion, 320px layouts and interrupted scrolling/video: controls and content remain operable without waiting for animation. Checks belong to Tasks 1, 2, 4 and 7.

## Planned file boundaries

| File/group | Responsibility |
| --- | --- |
| `public/media/blue-hour/` | Verified source, audio-free entrance, empty/settled posters. |
| `src/lib/blue-hour/entrance-policy.ts` | Pure playback eligibility and terminal-state policy. |
| `src/lib/blue-hour/motion-preference.ts` | Resolve device/default and explicit animation choices; validate stored modes. |
| `src/components/workspace/workspace-motion-provider.tsx` | Shared effective reduced-motion preference, safe browser-local persistence and cross-tab/device updates. |
| `src/components/workspace/motion-preference-control.tsx` | Accessible Reduce animation switch and Use device setting reset, used before and after sign-in. |
| `src/lib/blue-hour/media.ts` | Media paths, intro storage key, 2-second fail-safe values. |
| `src/lib/blue-hour/navigation-policy.ts` | Route allowlist and ordinary-link transition policy. |
| `src/components/workspace/workspace-theme.css` | Owner-page typography/tokens/layout and explicit themed portal classes. |
| `src/components/workspace/workspace-primitives.tsx` | Heading, panel, field and action presentation shared by owner pages. |
| `src/components/workspace/workspace-modal.tsx` | Existing Dialog/Drawer primitives with scoped themed content and preserved accessibility. |
| `src/components/workspace/workspace-overlays.tsx` | Narrow owner-only portal-content/overlay adapters carrying workspace tokens and effective motion, including nested select/popover/dropdown/tooltip surfaces. |
| `src/components/workspace/workspace-experience-provider.tsx` | Persistent transition context and owner-only theme boundary. |
| `src/components/workspace/workspace-link.tsx` | Next Link enhancement for eligible owner-page transitions. |
| `src/components/landing/use-entrance-scene.ts` | Browser playback, storage, visibility/intersection and pause/skip orchestration. |
| `src/components/landing/landing-motion-provider.tsx` | Landing-only temporary background pause and parallax eligibility, consuming the shared workspace preference. |
| `src/components/landing/use-landing-parallax.ts` | Section-local ScrollTrigger depth; teardown and transform reset on pause/preferences/navigation. |
| `src/components/landing/entrance-hero.tsx` | Video/posters, HTML brand/account menu, overlay contrast and controls. |
| `src/components/landing/portfolio-showcase.tsx` | Isolated local-data desktop example. |
| `src/components/landing/product-story.tsx` | Workflow, window library, customization and editor/share explanation. |
| `src/components/landing/landing-faq.tsx` | Four truthful accessible FAQ entries and final CTA. |
| `src/components/workspace/dashboard-main-menu.tsx` | Main menu with real identity and supporting activity/checklist. |
| `src/components/workspace/dashboard-section-nav.tsx` | Compact dashboard subsection navigation. |
| Existing auth/dashboard/editor files | Presentation migration while retaining their existing functions and data dependencies. |
| `src/__tests__/blue-hour-*.test.ts` | Small pure policy tests; no UI snapshots. |

## Task 1: Scoped presentation and reliable entrance scene

**Files:**
- Create the media directory, `media.ts`, `entrance-policy.ts`, `motion-preference.ts`, workspace motion provider/control, theme/primitives/modal files, entrance hook and hero listed above.
- Modify `src/app/layout.tsx` to add Barlow Condensed and DM Sans **variables only**, including the existing Press Start 2P variable so the preview boundary can explicitly restore that family; preserve the pixel font class, providers, analytics, existing metadata and published-page inheritance.
- Test: `src/__tests__/blue-hour-entrance.test.ts` and `src/__tests__/blue-hour-motion-preference.test.ts`.

**Interfaces:**
- `HeroMedia = { entranceSrc: string; emptyPoster: string; settledPoster: string }`; export `HERO_MEDIA` and `INTRO_STORAGE_KEY = 'portagen:blue-hour-intro:v1'` from `media.ts`.
- `canLoadEntrance(input: { seen: boolean; reducedMotion: boolean; saveData: boolean }): boolean`.
- `MotionPreference = 'system' | 'reduced' | 'full'`; `parseMotionPreference(value: string | null): MotionPreference`; `resolveReducedMotion(preference: MotionPreference, systemReduced: boolean): boolean` in `motion-preference.ts`.
- `WorkspaceMotionProvider({children})` and `useWorkspaceMotion(): { preference: MotionPreference; reducedMotion: boolean; ready: boolean; setPreference(value: MotionPreference): void }`. The provider wraps root children without adding a theme/motion DOM boundary around published routes. It stores `portagen:workspace-motion:v1` locally with guarded reads/writes, validates modes, follows media-query updates only in system mode, and listens for valid storage events. Owner-page consumers alone apply the result; published renderers/previews remain unaffected.
- Storage-event contract: matching key plus `newValue === null` resets to system; `key === null` also re-resolves system after storage clear; malformed external values fall back to system; unrelated keys are ignored. Use current device preference on reset and update the local tab immediately. Retain in-memory choices when persistence is blocked.
- `MotionPreferenceControl(): React.JSX.Element` renders one labeled Reduce animation switch reflecting effective `reducedMotion`, a Use device setting button, and mode helper text. On stores `reduced`, Off stores `full`, reset clears the override. Use the same component in landing display options and Settings → Appearance.
- `EntrancePhase = 'waiting' | 'playing' | 'settled'`; `EntranceEvent = 'ready' | 'skip' | 'ended' | 'error' | 'timeout' | 'autoplay-rejected' | 'interrupted' | 'pause'`; `advanceEntrance(phase: EntrancePhase, event: EntranceEvent): EntrancePhase`. Settled is terminal; only ready can change waiting to playing, and ready cannot restart settled.
- `useEntranceScene(media: HeroMedia): { phase: EntrancePhase; videoRef: React.RefObject<HTMLVideoElement | null>; motionPaused: boolean; skipIntro(): void; toggleMotion(): void }`.
- `LandingMotionProvider({children})` and `useLandingMotion(): { paused: boolean; togglePaused(): void; parallaxAllowed: boolean }`. The entrance hook uses this temporary pause state; eligibility consumes the central effective reduced-motion value plus viewport/pointer/save-data. A full-motion override may override the device preference but not media/save-data or desktop/fine-pointer eligibility. The provider wraps the landing only, with deterministic static initial markup.
- `EntranceHero({ media }: { media: HeroMedia }): React.JSX.Element`.
- Presentation components: `WorkspaceHeading({children, id?})`, `WorkspacePanel({children, className?})`, `WorkspaceField` accepting ordinary native input props plus `label`, and `WorkspaceAction` supporting button/link composition. Do not change PixelButton/Input/Card defaults.
- `WorkspaceModal({open, onOpenChange, title, children})`: keyboard-accessible existing Dialog/Drawer behavior, `.workspace-theme` on portaled content, at least 44px close control, no global primitive changes.
- Workspace portal wrappers carry `.workspace-theme` and effective `data-workspace-motion="reduced|full"` on both content and overlay roots. Export content adapters for owner-used Popover, Select, DropdownMenu and Tooltip from `workspace-overlays.tsx`, retaining their existing primitive prop interfaces. When existing wrappers do not expose overlay styling, use underlying installed Radix/Vaul primitives within the owner wrapper; never alter global defaults or apply a body-wide motion rule. Every nested portal reads the shared preference separately.

- [ ] Record the current baseline: `git status --short`, `yarn lint`, `yarn tsc --noEmit`, `yarn build`. Capture existing failures separately; do not fix unrelated issues or print env values. Verify that authenticated QA has usable local credentials without exposing them.
- [ ] Add failing node:test cases asserting: every true eligibility restriction returns false; eligible fresh visit returns true; late ready after error/skip/timeout stays settled; ready from waiting plays; ended/autoplay rejection/interruption/pause settle. Import the pure module with `await import(new URL('../lib/blue-hour/entrance-policy.ts', import.meta.url).href)` so native Node type stripping needs no package/config change.
- [ ] Run `node --experimental-strip-types --test src/__tests__/blue-hour-entrance.test.ts`; expect failure before the module exists.
- [ ] Add and run failing motion-preference tests: system mode follows true/false device preference; reduced resolves true regardless of device; full resolves false regardless of device; invalid/null stored values parse as system. Run `node --experimental-strip-types --test src/__tests__/blue-hour-motion-preference.test.ts` before implementing that module.
- [ ] Verify source SHA-256 equals `AC61C5863C42C14DD381C2672B950E86F58B31AE83409210145BD0ADAB3874F3`. Copy from `C:/Users/ahmad/Desktop/video.mp4` to `shin-entrance-source.mp4`. With the installed Python `imageio_ffmpeg` binary, export `shin-entrance.mp4` using stream-copy video and `-an`; extract `empty-water.webp` at 0s and `settled-shin.webp` at 9.5s. Do not crop/retouch the source or remove its watermark. Use the existing Sharp package for WebP conversion if necessary.
- [ ] Implement the specified policies, scoped presentation, hook and hero. Attach video source only after motion/save-data/session checks. Initial markup uses the empty-water poster; all account links work immediately. Keep media decorative, muted, playsInline and non-looping. Guard storage and `play()`; apply both 2-second readiness/stall fail-safes; discard late events; clean up observers, listeners and timers.
- [ ] Implement mode-specific primitives: tilted display/menu treatments for landing and dashboard root; level DM Sans for all task controls/navigation/labels/data. Define default/hover/focus/selected/disabled/pending/success/warning/error/destructive styles. Keep selection, focus and destructive meaning distinct in shape/text semantics. Use normal text pairs white-on-blue, cyan-on-ink or selected-red-on-white; do not use cyan-on-electric-blue for essential small text. Check contrast over worst-case video frames, with stable backing where needed.
- [ ] Implement the root motion preference provider and reusable control. Resolve preferences only after hydration; all animation consumers wait for `ready`. Add the landing display-options control with helper/reset. Verify keyboard switch activation, explicit Off overriding a device reduction request, reset following the device again, localStorage denial/invalid values, reload persistence and cross-tab changes.
- [ ] Test two tabs: choose reduced in A, reset to device in B, then change the device preference; both tabs follow it. Repeat with explicit full, malformed stored values, storage clear and denied storage. Switch/reset buttons use `type="button"` or an ordinary labeled checkbox with switch semantics, and never submit account forms.
- [ ] Theme both owner portal content and overlays with the resolved motion state; check the display-options popover while toggling Reduce animation, then a Select nested in a dialog and its focus restoration. Portal motion in published/preview interiors must remain independent.
- [ ] Implement settled poster plus subtle ambient water overlay; the landing motion provider shares Pause motion state across video, ambient layers and later parallax. Skip intro settles without globally pausing motion. Reduced-motion/save-data attach no video source. Hidden/offscreen interruption settles before returning to the hero. Preserve full source composition on mobile.
- [ ] Test enabling Reduce animation during playback: stop and settle; disable again: ambient motion may resume but the entrance stays settled. Pause background motion remains independent and cannot enable animation while Reduce animation is On. Rerun both new policy test files and the Task 1 browser scenarios.
- [ ] Rerun the policy tests; expect pass. In a temporary local render of the hero, force video 404, rejected autoplay, blocked storage, delayed canplay, tab hide/return, offscreen/return, session revisit, reduced motion, save-data and pause/skip. Expect a usable static scene/account links in every case. Check root font additions do not change a direct published portfolio route.
- [ ] Commit only this task's verified files with `landing: add scoped blue-hour scene and media fallback`.

## Task 2: Long landing with meaningful product details

**Files:** modify `src/app/page.tsx`; create `portfolio-showcase.tsx`, `product-story.tsx`, `landing-faq.tsx`, `use-landing-parallax.ts`; consume Task 1's `landing-motion-provider.tsx`.

**Interfaces:** consumes `EntranceHero`, `HERO_MEDIA`, workspace primitives. Produces `PortfolioShowcase(): React.JSX.Element`, `ProductStory(): React.JSX.Element`, `LandingFaq(): React.JSX.Element`. The showcase uses its own local `activeWindow: 'about' | 'projects' | 'contact'`, default About, and never imports published renderers or fetches account data.

Parallax interface: `useLandingParallax(sectionRef: React.RefObject<HTMLElement | null>): void` consumes `useLandingMotion()`. It targets only explicit decorative `[data-parallax="water"]`, `[data-parallax="artwork"]`, and `[data-parallax="title"]` elements inside that section. Water translates +16px → -16px, static artwork +24px → -24px, and hero title 0px → -12px over the section's viewport passage. No transform is applied to the video/poster, account menu, body copy, sample-window controls, forms, or navigation.

- [ ] Replace the client landing container with a server page exporting landing-only metadata. Render the hero plus six sections in the exact spec order; remove obsolete pixel cityscape/character/GSAP effects from this route only. Never hide core copy pending JavaScript.
- [ ] Use exact hero headline “Build a desktop. Share your work.” and supporting line from the spec. Link Sign in to `/auth/login`, Sign up to `/auth/signup`, Explore below to `#your-world`; anchors use native behavior and do not trigger route wipes.
- [ ] Give anonymous visitors Sign up as initial visual emphasis, while keeping Sign in visible and avoiding programmatic focus on load. Add one compact Sign up link after workflow steps; retain the final account menu without duplicating large CTAs in every section.
- [ ] Implement the local-data sample desktop with About/Projects/Contact controls. Changing control replaces the active sample window. Mark the demo as “Example portfolio”; no real message submission or synthetic user statistics. Manually verify pointer, keyboard and touch activation.
- [ ] Use ordinary named demo buttons with `aria-pressed` and a named content region, not an incomplete tab pattern. Keep focus on the activating button when replacing its content. Check the selected state with a screen reader.
- [ ] Implement four workflow steps; six core window examples plus modest extra-types note; customization and audio/widgets explanation; editor/preview illustration; a sharing example `/portfolio/your-name/123`; four truthful FAQ items and final account CTA. No Gallery/custom-domain/pricing/publish-state claims. Use local supplied-reference WebP art sparingly and lazy-load non-hero imagery.
- [ ] Give the lower sections distinct compositions per the spec: dominant interactive desktop, compact sequential workflow, one window arrangement, curated customization compositions, labeled editor/visitor comparison, then quiet FAQ. Keep product examples larger/more explanatory than decorative character art. Ordinary feature labels stay primary; game metaphors are optional subtitles.
- [ ] Add section-local GSAP ScrollTrigger parallax with linear scrub and the exact transform ranges above, enabled only with width ≥1024px, fine pointer, no reduced-motion/save-data preference, and motion unpaused. Revert transforms/triggers when disabled/unmounted. Oversize only decorative water wrappers so edges do not appear; no pinning, scroll hijacking, extra spacers, video-plane movement or new motion dependency.
- [ ] Check 320/390/768/1024/1440px layouts and long copy. Expect a naturally scrolling document, level body copy, no clipped menu, no nested scroll trap, and stable hero aspect ratio. At desktop the content should read as roughly 4–5 viewports, not a padded blank page.
- [ ] Verify parallax forward/back scrolling, native anchor jumps, resizing across the 1024px threshold, coarse pointers and runtime preference changes. Pause motion must reset all decorative transforms to zero and stop ambient motion; resume tracks the current scroll position without replaying the entrance. Navigate away/back and confirm no duplicate triggers or residual transforms. Expect zero parallax in all disabled cases and no video cropping or movement.
- [ ] Disable JavaScript and block video: account anchors, heading, product copy and FAQ remain usable. Run the existing lint/type commands for changed files and verify landing metadata; no new snapshot tests.
- [ ] Commit with `landing: explain the product in a longer game-style page`.

## Task 3: Auth and privacy in the same visual world

**Files:** modify `src/app/auth/login/page.tsx`, `src/app/auth/signup/page.tsx`, `src/app/auth/forgot-password/page.tsx`, `src/app/privacy/page.tsx`; add narrowly shared `src/components/workspace/auth-scene.tsx` if the three forms otherwise repeat the same layout.

**Interfaces:** `AuthScene({title, description, artwork, children})` supplies presentation only. Existing form values, callbacks, loading flags and error messages remain owned by the original pages. Consume Task 1 fields/actions and scoped modal behavior where needed.

- [ ] Restyle each form with level dark panels, restrained static art, visible labels and links. Preserve login email-or-username semantics and Google/GitHub OAuth; preserve `/auth/sso-callback`, signup and recovery semantics. Do not replace real routes with mock dialogs.
- [ ] Exercise existing validation errors, pending submit, provider failure, recovery response, and back-to-home behavior. If real credentials are unavailable, mock only the browser network response for presentation QA and record that real auth remains unverified.
- [ ] Restyle privacy without rewriting legal copy. Check every paragraph and link survives; use readable body size and width.
- [ ] Verify no entrance autoplay on direct auth loads, no video redownload on route changes, keyboard access, 390px panel stacking, and light/dark app preferences without losing contrast.
- [ ] Run lint/type checking and commit with `auth: apply blue-hour forms and readable privacy layout`.

## Task 4: Route transitions and real dashboard main menu

**Files:** create `navigation-policy.ts`, `workspace-experience-provider.tsx`, `workspace-link.tsx`, `dashboard-main-menu.tsx`, `dashboard-section-nav.tsx`; modify `src/app/layout.tsx`, `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx`, `src/components/dashboard-header.tsx`, `src/components/dashboard-sidebar.tsx`, `src/components/mobile-nav.tsx`; migrate new landing/auth links to `WorkspaceLink`. Test `src/__tests__/blue-hour-navigation.test.ts`.

**Interfaces:**
- `isWorkspacePath(pathname: string): boolean`: exact `/`, `/privacy`, `/auth/login`, `/auth/signup`, `/auth/forgot-password`; `/dashboard` and descendants. Excludes published portfolio paths, APIs, auth callbacks and unrelated paths.
- `shouldTransition(input: { href: string; origin: string; currentPath: string; button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; target?: string; download: boolean; reducedMotion: boolean }): boolean`.
- `WorkspaceExperienceProvider({children})` provides `navigate(href: string, direction?: 'forward' | 'back'): void` and persistent transition state.
- The same context exposes `cancelPendingTransition(): void` for existing unanimated owner navigation callbacks. Invalidate pending push/focus tokens and timers on `popstate`, `hashchange`, `pagehide`, superseding unanimated intent and observed pathname changes without intercepting or patching native browser history.
- `WorkspaceLink` extends ordinary Next Link props with `transition?: 'forward' | 'back' | 'none'`; browser behavior remains native when policy returns false.
- `DashboardMainMenu` consumes actual user identity, selected portfolio ID when present, checklist/activity/stats from the existing dashboard loader; missing selection links Editor to `/dashboard/portfolios`. `DashboardSectionNav` consumes only current pathname.

- [ ] Add failing tests for ordinary owner links, hash-only/current-page anchors, modified/middle clicks, `_blank`, downloads, external URLs, published routes, auth callbacks and reduced motion. Assert dashboard/editor paths match but similarly named unrelated prefixes do not. Run `node --experimental-strip-types --test src/__tests__/blue-hour-navigation.test.ts`; expect failure before implementation.
- [ ] Implement the policy and persistent root provider. A scope boundary exists only on allowed owner pages; route overlay and new typography are absent on published/callback pages. Do not key/remount dashboard contexts or the preview. Keep shared theme defaults intact.
- [ ] Implement the 450ms diagonal wipe; commit eligible `router.push` after at most 200ms of cover; reveal on pathname change or at 700ms fail-safe. Repeated clicks cancel/replace previous timers so the latest requested route wins; stale completions cannot re-cover a newer route. The overlay never captures pointer input. Explicit back links reverse the wipe; native browser Back stays native. Clean up on unmount and reduced-motion changes.
- [ ] Read reduced motion from `useWorkspaceMotion()`, not separate media-query logic. If Reduce animation is enabled while a wipe has a pending navigation, commit the latest intended destination once, cancel old timers/cover, and prevent duplicate pushes. Browser-check both toggle directions and ensure new transitions honor the updated preference immediately.
- [ ] Keep real dashboard auth/getOrCreateUser/getDashboardStats code. Render the game main menu and supporting real account/activity/checklist content; use compact subsection navigation while viewing lists/settings/editor. Preserve AI chat providers/button/panel and mobile safe-area spacing; no fake `Alex` account or sample Published counters.
- [ ] Rerun policy tests. Browser-test slow/error routes, rapid A→B→C clicks, native history, keyboard activation, anchors and modified clicks; after 700ms no visual cover remains. Check destination heading focus after ordinary navigation, while dialogs and in-page anchors retain their normal focus behavior. Directly load callback/published routes and verify no wipe/theme wrapper appears.
- [ ] Request route B, then press native Back within the 200ms pre-push window; after 700ms B must not be pushed late. Repeat with rapid A→B→C and an existing unanimated redirect that calls `cancelPendingTransition`. Focus work is keyed to the current completed intent and destination content, never a stale heading or the persistent dashboard title. Use `tabIndex={-1}` only for programmatic page-heading focus and appropriate scroll offsets below sticky chrome.
- [ ] Commit with `dashboard: add game-menu navigation and bounded page wipes`.

## Task 5: Portfolio save-slot presentation

**Files:** modify `src/app/dashboard/portfolios/page.tsx` and `src/components/portfolio-selector.tsx` only where its owner-page presentation needs to match.

**Interfaces:** consumes the existing `usePortfolioContext()` operations and Task 1/4 primitives. Retains record IDs, create name/bio payload, delete confirmation target, first-fetch skeleton and context refresh behavior.

- [ ] Replace the generic card-grid presentation with numbered save slots and a selected detail panel. Use `portfolioName`, `bio` and actual supported timestamps; no fabricated Draft/Published flags. Edit routes retain `/dashboard/editor/${id}`.
- [ ] Preserve create/delete modal behavior, pending disable states and real error feedback. Use the workspace modal wrapper so portal content receives tokens without changing shared Dialog/Drawer defaults. Keep empty selection/list behavior explicit and usable.
- [ ] Verify no portfolios, one record, many records, long names, fetch failure, create success/failure, cancelled delete, pending delete, delete success/failure, and keyboard selection. Confirm real account data is never replaced by illustrative save records.
- [ ] Save-slot selectors are ordinary buttons with `aria-pressed`; accessible names contain actual portfolio names as well as optional roman numerals. Place Edit/Delete actions in the separate detail area, never nested inside a selector button. Current navigation links expose `aria-current="page"`.
- [ ] Run lint/types and commit with `portfolios: present real records as selectable save slots`.

## Task 6: Inventory, options and supporting AI surfaces

**Files:** modify `src/app/dashboard/assets/page.tsx`, `src/components/asset-card.tsx`, `src/components/delete-confirmation-modal.tsx`, `src/app/dashboard/settings/page.tsx`, `src/components/user-dropdown.tsx`, `src/components/ai/ai-chat-panel.tsx`, `src/components/ai/ai-chat-button.tsx` only for owner-facing theme/spacing/accessibility.

**Interfaces:** retain existing asset types (`wallpaper`, `icon`, `music`, `sound`), upload/rename/delete hooks, Drive state, settings handlers and AI conversation provider. Consume workspace fields/actions/modal wrappers; no replacement service APIs.

- [ ] Apply inventory layout while preserving filters, search, multi-select, preview/rename/upload/delete dialogs and all current pending/error states. Keep disconnected Drive distinct from empty connected inventory; preserve connect/upload actions and source labels.
- [ ] Check selection versus focus versus error/destructive states using the Task 1 semantic treatments. Non-color labels/messages identify selected assets, upload errors, pending operations and delete actions; ordinary inventory controls remain level/readable rather than large tilted menu wedges.
- [ ] Apply Options presentation to the settings form and identity dropdown; add Task 1's `MotionPreferenceControl` in an Appearance section. This is a local immediate preference, separate from account Save/pending/error state and requiring no backend field. Preserve all other existing destructive confirmations and success/error semantics. Verify the control stays synchronized with the landing display-options control and the Use device setting reset.
- [ ] Match AI chat colors/typography and portal scope; retain a visible mobile close button and ensure the floating trigger does not cover bottom navigation. Keep actual conversation behavior unchanged.
- [ ] Exercise empty/search-no-results/disconnected/loading/error inventory, upload/rename/delete flow, settings validation/saving/failure, dropdown keyboard navigation, and AI chat on mobile. Record credential-dependent failures rather than invent success. Run lint/types and commit with `workspace: restyle inventory options and assistant surfaces`.

## Task 7: Editor control presentation, preserving portfolio previews

**Files:** modify `src/app/dashboard/editor/[id]/page.tsx`, `src/app/dashboard/editor/[id]/windows/[windowId]/page.tsx`, `src/components/editor/portfolio-settings.tsx`, `CategorySelection.tsx`, `TabsNavigation.tsx`, `TabContent.tsx`, `window-content-editor.tsx`; update control surfaces in `icons-tab.tsx`, `windows-tab.tsx`, wallpaper/music/sounds/widget tabs and `modals/AddIconModal.tsx`, `EditIconModal.tsx`, `DeleteModal.tsx` as required. For `forms/about-me-form.tsx`, `projects-form.tsx`, `resume-form.tsx`, `contact-form.tsx`, `links-form.tsx`, `blog-form.tsx`, `terminal-form.tsx`, `achievements-form.tsx`, `blank-template-editor.tsx` and `blank-template/` controls, migrate presentation imports/wrappers only. Modify preview-panel outer toolbar only if needed; never its portfolio renderer.

**Interfaces:** existing editor context/store state and APIs remain the interface. Workspace fields/actions replace owner controls locally, with no global Pixel component changes. Preserve current lock/home category IDs and tab IDs in `src/lib/constants/tabs.ts`; all existing per-section save actions remain visible.

- [ ] Apply a scoped `.workspace-controls` boundary to editor controls only. Keep the nested preview outside that control-style boundary, and set the preview's outer wrapper font to the existing `--font-pixel` family so it does not inherit the workspace body font. Use new component classes, never broad `.workspace-theme p/button/input` selectors that spill into the nested preview. Retain the 1400px sticky 440px preview and mobile jump/fullscreen/back-to-controls affordances.
- [ ] Establish portfolio identity/return path → Lock screen/Home category → selected tab → subsection heading/fields/local Save order on desktop and mobile. Keep a textual category/tab indicator. Each Save action stays visibly attached to its own fields and feedback; do not introduce a page-wide “All changes saved” label. Keep all tabs reachable via labeled wrapping or accessible overflow at narrow widths.
- [ ] Migrate categories, tabs, settings fields and owner dialogs to the new appearance. Use 160ms content changes with cleanup; disable animation/scroll smoothing under effective reduced motion from the workspace provider. Remove independent OS-only motion decisions from migrated owner controls so explicit Off works; do not alter published renderer motion rules. Preserve focus/selected-tab behavior and the icon-to-window creation explanation.
- [ ] Complete the editor tab pattern with unique tab/panel IDs, `aria-controls`/`aria-labelledby`, orientation-aware roving focus and Home/End. Use manual Enter/Space activation so moving focus alone does not fetch/switch a network-backed panel. Keep focus on the selected control on activation and preserve ordinary Tab order through panel fields. Check horizontal/mobile and vertical/desktop layouts with keyboard and screen reader.
- [ ] Migrate window-content forms and blank-template control UI without touching renderer components, content schemas, templates, autosave semantics or state persistence. Keep Save Info and each current Save action with its real pending/error state; do not label everything saved when only one subsection saved.
- [ ] With usable test records, edit every available content type and each editor tab; verify switching/loading/saving/validation and template selection retain previous semantics. Show long text and missing-window states; exercise touch add/remove controls and nested dialogs. Do not create a broad new global-save or navigation-guard subsystem in this task.
- [ ] Compare the editor preview and direct public lock/home routes before/after across at least pixel, Windows XP and liquid-glass themes. Expected: only owner controls change, and no new font/color/transition leaks into portfolio content. Confirm AI chat and full-screen preview remain reachable at 320/390/1024/1440px.
- [ ] Run policy tests, lint, type check and build; commit with `editor: apply workspace controls without changing portfolio skins`.

## Task 8: Whole-flow verification and review handoff

**Files:** add `docs/qa/2026-11-09-blue-hour-redesign.md`; update memory/index notes with final verified state. No new application behavior in this task.

**Interfaces:** consumes all completed tasks; produces a reproducible QA record, screenshots, known limitations and clean scoped commits ready for review.

- [ ] Run `node --experimental-strip-types --test src/__tests__/blue-hour-entrance.test.ts src/__tests__/blue-hour-motion-preference.test.ts src/__tests__/blue-hour-navigation.test.ts`, `yarn lint`, `yarn tsc --noEmit`, `yarn build`, and `git diff --check`. Expect passing new checks; explicitly isolate any pre-existing failures observed in Task 1.
- [ ] Run the real landing→signup/login→dashboard→portfolio→editor flow; separately verify recovery, privacy, inventory/settings and native signout. Recheck autoplay-denied, missing video, blocked storage, reduced motion, save-data and rapid navigation cases. A video or transition must never gate signup/account access or leave the screen covered.
- [ ] Capture desktop and mobile landing/auth/dashboard/editor plus published-interior regression screenshots. Check long-page hierarchy, focus contrast over the actual video, scrims, keyboard-only controls, 44px touch targets, reduced motion and all specified breakpoints. Include parallax enabled, paused, disabled on touch/mobile, and resized states; verify no scroll-trigger leak after route changes.
- [ ] At actual 200% text enlargement, 400% desktop browser zoom and one short landscape/mobile-keyboard viewport, complete login recovery, motion switch/reset, modal editing and fullscreen-preview exit. Focus, dialog headings/actions and close controls stay reachable; marketing/owner controls reflow without horizontal scrolling, except the existing intentional desktop-preview panning surface. These checks apply to Tasks 3 and 7 as well as final QA.
- [ ] Verify media requests: one muted entrance source on a fresh eligible home session, no video under save-data/reduced motion, no whole-clip replay when returning home, lazy non-hero images, no dashboard video running behind forms/editor. Inspect first/last entrance frames against posters and confirm no character flash at startup.
- [ ] Summarize actual authenticated checks that could/could not run and environment blockers without exposing keys or changing DB configuration. Request a whole-change review through the requesting-code-review skill, resolve actionable findings, then use finishing-a-development-branch for integration options. Do not push, publish, or merge by assumption.
- [ ] Update durable memory, prepare reviewable final changes and hand back the result with media provenance, screenshots and test evidence.

## Plan self-review

- Spec coverage: Tasks 1/2 cover media and every landing section; Task 3 auth/privacy; Task 4 transitions/dashboard; Tasks 5/6 owner data pages; Task 7 all editor controls; Task 8 cross-route and published-interior regression.
- Interfaces: shared media/policy names are defined once in Task 1; route policy/provider/link names in Task 4; later tasks consume existing contexts rather than inventing APIs.
- Validation: the five Review Focus classes each have explicit owner tasks/checks. New unit tests cover policy decisions, while reversible styling and real browser behavior receive scenario QA rather than implementation-mirroring snapshots.
- Scope: no DB/env change, no published renderer change, no synthetic publishing system, and no global save refactor. Product code/media changes begin only after user review.
