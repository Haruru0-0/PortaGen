# Blue Hour plan review — independent technical UX evidence

Date: 2026-11-09. Assessment B. Reviewed the proposed specification and implementation plan, with narrow source inspection to validate integration risks. No application implementation, UI edit, browser operation, or target-page rendering occurred.

## Verdict and evidence limits

The proposal is technically thoughtful and covers the major media, routing and motion failure paths. Tighten the five contracts below before execution. These are plan gaps or ambiguities, **not defects observed in a future Blue Hour implementation**. None requires widening the visual redesign into a new account or portfolio feature.

Rendered accessibility, contrast over video frames, actual target sizes, responsive layout and motion quality remain **pending implementation and visual validation**. No WCAG conformance claim or numerical audit-health score is justified for a page that does not exist yet.

## Material plan changes

### B1 — P2: Cancel pending wipe navigation when native navigation supersedes it

**Location:** plan Task 4, lines 135–140; specification Page transitions.

The latest-click token and timer replacement protect A→B→C workspace clicks. The plan also promises native Back, but does not explicitly say that browser Back/Forward or a native/unanimated navigation invalidates a pending 200ms push. A user can request B, then press Back before B is committed; an uncancelled delayed push could send them to B after the browser already went back. The 700ms reveal timer only removes the visual cover; it does not resolve this ordering problem.

**Add to Task 4:** cancel uncommitted transition timers and invalidate their request token on native history traversal and any superseding native navigation. Observe browser history without preventing it or patching it. Key destination-focus work to the same active navigation intent; wait for its actual destination content, avoid the persistent dashboard-header heading, and do not run stale focus callbacks after Back or a newer navigation. A non-tabbable destination heading can use `tabIndex={-1}` and must remain visible below sticky navigation.

**Acceptance scenario:** trigger B and press Back within 200ms; wait beyond 700ms and verify B is not pushed late. Repeat with A→B→C, a failed/slow destination, and a dialog-triggered redirect. Only the current completed ordinary navigation receives heading focus; anchors and dialog restoration retain their specified behavior.

### B2 — P2: Specify motion/theme propagation for every workspace portal, including its overlay

**Location:** plan Task 1 lines 73, 80 and 88; Tasks 6–7; global theme boundary rules.

`WorkspaceModal` explicitly themes portaled **content**, but the plan does not fully define where the resolved motion attribute goes on portal siblings or on non-modal portals. Current `DialogContent` creates `DialogOverlay` separately, with its own animation classes (`src/components/ui/dialog.tsx`, lines 32–73). Current Popover, DropdownMenu, Select and Tooltip content also portal away from the page wrapper and have animation classes. The new landing display-options popover is itself a consumer of the motion preference.

If the implementation relies on an inherited owner-page DOM attribute, putting it only on the page or modal content will leave these other portal roots outside the motion boundary. Conversely, solving this with a body-wide animation rule would violate the explicit preview/published-interior isolation requirement.

**Add to Tasks 1/6/7:** explicitly apply workspace tokens and the resolved motion state to owner-created portaled content **and overlay roots**, including display options, dropdown/select/popover/tooltip and dialog/drawer layers. Keep shared primitive defaults and body-wide rules unchanged. State which wrapper or narrowly scoped caller supplies those properties. New control wrappers may use the underlying Radix primitives where necessary rather than changing their global defaults.

**Acceptance scenario:** toggle Reduce animation while an owner dialog/popover is open; verify its entry/exit and overlay motion honor the effective preference. Open a nested Select inside a dialog, close both, and check focus restoration. Compare nested preview and direct public skins with the preference both On and Off, including a preview window interaction that creates a portal. Their existing appearance/motion policy must remain independent.

This is supported by incumbent integration structure, not evidence that future workspace portals currently fail.

### B3 — P2: Treat removal of the stored override as an actionable cross-tab update

**Location:** plan Task 1 lines 72–74 and 88; specification Reduce animation setting.

The parser correctly maps `null` to `system`, reset clears the override, and cross-tab synchronization is required. The phrase “listens for valid storage events” can nevertheless be implemented as accepting only string enum values and ignoring `newValue === null`. Then “Use device setting” in one tab would not reset another tab until reload. The currently listed unit cases test parser resolution but not this provider event behavior.

**Add to Task 1:** for the preference key, handle `newValue === null` as `system`; define whether a storage-clear event (`key === null`) also re-resolves device mode. Read fresh device preference on reset, update the local tab immediately, and ignore unrelated storage keys. Specify malformed external values consistently with the documented safe system fallback. Retain in-memory changes when storage is unavailable.

**Acceptance scenario:** two same-origin tabs; choose On in A, reset to device in B, change the device preference, and verify A and B follow it. Repeat with explicit Off under a reduced device setting, malformed stored data and denied storage. Neither control submits an account form; switch/reset buttons have explicit non-submit semantics.

### B4 — P2: Define selected-state and keyboard semantics for the new tab-like controls

**Location:** Task 2 line 104, Task 5 lines 149–151, Task 7 line 172; `MotionPreferenceControl` interface.

The spec requires keyboard/touch operability and an accessible switch, but “keyboard selection” does not identify the expected semantics of the marketing sample and roman-number save slots. Current editor tabs already use `role="tab"` and `aria-selected`, but do not define tab-to-panel IDs, roving tab stops or arrow-key handling (`src/components/editor/TabsNavigation.tsx`; `TabContent.tsx` has no tabpanel relationship). Merely preserving those semantics would carry an incomplete tab pattern into the redesigned control surface.

**Add to Tasks 2/5/7:** select an explicit interaction pattern. For simple demo choices, ordinary labeled buttons with `aria-pressed` and a named content region are sufficient. If presenting controls as tabs, provide an identified tabpanel, `aria-controls`/`aria-labelledby`, correct orientation, roving focus and matching arrow/Home/End behavior; keep focus on the selected control when replacing its content. Save-slot controls need the real portfolio name in their accessible name, not only “I / II / III”. Define the current workspace route with `aria-current="page"`. Motion/skip controls need state-accurate accessible names; a persistent pause button can use `aria-pressed`, or a changing Pause/Resume label, with consistent meaning.

**Acceptance scenario:** screen-reader/keyboard check distinguishes selected state from focus, reaches each choice and its content, and does not leave focus on a removed sample window. Display options expose the effective Reduce animation state and reset explanation without nested interactive elements.

These are modest semantics within the stated accessibility scope, not a request to add new keyboard shortcuts globally.

### B5 — P2: Add zoom and short-height reflow to the verification matrix

**Location:** Task 2 line 107, Task 3 line 121, Task 7 lines 171/175, Task 8 line 186.

The width matrix is good, but it does not explicitly exercise text-only enlargement, browser zoom or the short visual viewport caused by a mobile keyboard. Fixed full-screen preview controls, sticky dashboard chrome, long forms and dialog content can pass a 390px screenshot while losing controls at enlarged text or reduced height.

**Add to Tasks 3/7/8:** verify 200% text enlargement and desktop 400% browser zoom (about a 320 CSS-pixel viewport), plus one short landscape/mobile-keyboard case. Check that dialog titles/actions/close controls remain reachable, forms scroll into view above the keyboard, headings/focused fields are not covered by sticky chrome, and preview exit/back-to-controls stays reachable. Allow intrinsic desktop-preview panning only within its existing intentional preview surface; owner controls and marketing copy still reflow.

**Acceptance scenario:** perform login error recovery, adjust the motion switch/reset, edit a field in a modal and exit fullscreen preview at these settings without clipping or loss of actions. Use actual zoom/text settings, not only resized screenshots.

## Requirements already covered adequately

- **Media fallback and slow connections:** both readiness/stall timeouts, rejected `play()`, terminal settlement, late-event rejection, blocked storage, no-source reduced-motion/save-data behavior, visibility/offscreen interruption and usable links before playback are explicit in Task 1. Task 8 inspects requests, posters and return visits. Keep these requirements; no generic “add a loading spinner” work is needed.
- **Motion persistence and reset model:** a single root provider, pre-hydration static markup, explicit full/reduced override, system reset, anonymous access, immediate controls and separation from temporary pause are already sound. B3 only closes a synchronization ambiguity.
- **Parallax disabled cases:** desktop width, fine pointer, pause, save-data and effective motion preference are explicit; transform reset, resize teardown and route cleanup are testable in Task 2. The effective shared preference must win over raw device queries when an explicit full-motion choice exists, as Task 1 already specifies.
- **Navigation timing:** 200ms maximum pre-push delay, 450ms visual duration, a 700ms cover fail-safe, modified-link preservation and content-ready focus are already bounded. B1 extends the supersession check to native navigation rather than changing the visual timing.
- **Nested preview isolation:** preserving shared pixel defaults, avoiding descendant-wide element selectors, restoring pixel font at the preview boundary and comparing multiple actual skins are strong protections. B2 adds missing portal/motion coverage rather than proposing a renderer rewrite.

## Deterministic detector — incumbent baseline only

Ran exactly one source scan against the requested incumbent targets:

```text
C:/Users/ahmad/.codex/skills/impeccable/scripts/impeccable.cmd detect --json src/app/page.tsx src/components/dashboard-header.tsx
```

Raw output is saved at `docs/superpowers/reviews/2026-11-09-blue-hour-incumbent-detector.json` and contains `[]` (no findings emitted for these two source targets). No browser/CDP scan ran. This is a static detector result for the **old pixel UI**, not proof of its rendered accessibility, and not verification of the proposed Blue Hour design. No deterministic finding is being promoted into a future implementation defect.

## Handoff

Incorporate B1–B5 into the indicated task acceptance checks before implementation. Target visual judgment remains pending the implemented page, real video-frame contrast inspection and the planned route/viewport checks. The changes can be handled within the existing task boundaries; no DB/env work, published renderer edits or new animation dependency is indicated.
