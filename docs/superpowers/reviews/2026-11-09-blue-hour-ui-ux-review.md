# Blue Hour design-plan review

Date: 2026-11-09. Reviewed with **Impeccable** and **UI UX Pro Max**, using independent design and technical UX assessments. This reviews the specification and implementation plan; the proposed interface has not been implemented or rendered.

## Outcome

Keep the approved creative direction: Shin's entrance video, blue water, the pointed game menu, a longer product landing, restrained parallax and user-controlled animation reduction. Refine hierarchy and interaction contracts within the existing eight tasks. The following findings have been incorporated into the specification and plan.

| Finding | Plan coverage |
| --- | --- |
| Reserve expressive tilted type and spear selections for the landing and dashboard entrance. Use level, readable task controls in auth, settings, lists and the editor. | Tasks 1, 3, 5–7 |
| Give anonymous visitors clear Sign up priority while keeping Sign in immediately visible; repeat the account action after meaningful product explanation. | Task 2 |
| Give landing sections distinct compositions: a sample desktop, compact workflow, window arrangement, curated customization examples, labeled editor/visitor comparison and quiet FAQ. | Task 2 |
| Define default, hover, focus, selected, disabled, pending, success, warning, error and destructive states. Keep selection separate from validation and provide an independent focus indicator. | Tasks 1, 6 |
| Preserve editor hierarchy and local save ownership. Show portfolio identity, category, tab and subsection clearly; label what each Save action saves. | Task 7 |
| Cancel delayed transition pushes and focus callbacks when browser history or another navigation supersedes them. Focus the actual destination content. | Task 4 |
| Pass workspace tokens and effective motion state to owner portal content and overlay roots, including nested portals. Preserve preview and public skin boundaries. | Tasks 1, 6–7 |
| Synchronize reset/removal and storage-clear events across tabs; handle malformed or blocked storage consistently. Motion controls must not submit surrounding forms. | Task 1 |
| Specify pressed-state demo/slot buttons, real portfolio names, current-route semantics and complete keyboard editor tabs. | Tasks 2, 5, 7 |
| Test actual text enlargement, browser zoom, short landscape height and mobile keyboard layouts, including dialog actions and preview exit. | Tasks 3, 7–8 |

## Contrast evidence

Calculated using the WCAG relative-luminance formula for solid sRGB colors:

| Foreground / background | Ratio | Decision |
| --- | --- | --- |
| Cyan `#44e4ff` / bright blue `#0755d8` | 4.18:1 | Avoid for normal-sized essential text; below 4.5:1. |
| Cyan `#44e4ff` / deep ink `#061039` | 12.08:1 | Suitable planned normal-text pairing. |
| Red `#bc174c` / warm white `#fffef5` | 6.17:1 | Suitable planned selected-label pairing. |
| Warm white `#fffef5` / bright blue `#0755d8` | 6.29:1 | Suitable planned normal-text pairing. |

These measurements do not validate text over moving footage, opacity, gradients or actual rendered sizes. Provide stable backing where necessary and inspect real frames during implementation.

## Skill evidence and limits

Impeccable context inspection identified the incumbent pixel design and no existing PRODUCT.md or DESIGN.md. The confirmed brief and current specification remain the authority for this focused review. Its surface-mode guidance supports expressive landing persuasion and restrained task operation. No additional product discovery or design-system rewrite is needed to review this plan.

UI UX Pro Max searches covered reduced-motion preferences, product demonstration, animation interruption and feedback, focus visibility and Next.js client/server boundaries. Product-demo guidance supports showing what PortaGen builds before expanding into features. Keep server-rendered structure with small interactive client leaves. Generic corporate funnel and trust-section suggestions did not fit the pinned game-menu brief and were not adopted. No framework upgrade is proposed.

The independent technical assessment and source references are in [the evidence report](2026-11-09-blue-hour-evidence.md). One deterministic source scan of the incumbent landing and dashboard header returned `[]`, saved in [the raw baseline](2026-11-09-blue-hour-incumbent-detector.json). This is not validation of the future redesign.

No application source changed during this review. No rendered UI scores, browser QA or accessibility-conformance claims are made. Implementation still needs the plan's route, media, motion, keyboard, responsive and visual checks.
