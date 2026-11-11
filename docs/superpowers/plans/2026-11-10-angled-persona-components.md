# Angled Persona components implementation plan

> Use subagent-driven-development or executing-plans task-by-task.

Goal: implement the approved persona-component-directions preview across landing, boxes, dialogs, controls, option lists, user menu and sidebar.
Architecture: owner-only layered frame primitives with a single slanted silhouette, cyan borders and pink backing. Native editable controls stay level; focus strengthens the same shape instead of drawing a rectangle. Radix/Vaul retain popup positioning, keyboard behavior and focus ownership. Published/preview interiors keep their own skins.
Tech: existing React/Next/Tailwind/Radix/Vaul; no dependency, schema, auth or API changes.
Spec: the user's approved conversation preview, including the screenshot correction for nested section fills and focus.

1. Shared frames and controls: add decorative frame layers, input/textarea/password wrappers, frame-aware focus, responsive cut sizes and border tokens. Keep ordinary native control props/ref/disabled/error states. Verify real keyboard focus and text entry.
2. Owner integration: frame dialogs/drawers/popovers/Select/Dropdown including all owner triggers and raw fields; sidebar right edge; section fills stay inside diagonal without clipping interactive descendants. Preserve Radix dismissal and nested portal scope.
3. Landing: stronger angled blue/white section changes, framed sample windows/cyan rails, coherent art and pointed actions. Keep exact video lifecycle and full source framing, native scrolling, product truth and motion settings.
4. Verify: types, scoped lint, existing policy tests/build, 320–1440px browser matrix, keyboard option/user menus, dialogs/focus return, focused outlines, content containment and preview isolation. Temporary illustrative fixtures may validate UI without service writes and must be removed before build. Fresh whole-change review; durable QA/memory notes.

Implementation runs on codex/angled-persona-components. Independent landing and editor field migration can be delegated; shared frame/CSS/overlay implementation stays with parent. No automatic push/deploy.

Status: all four implementation steps complete. Production build and eight tests pass; 45 responsive fixtures and targeted keyboard/menu/form contracts pass. See `docs/qa/2026-11-10-angled-persona-components.md` for evidence and limits. Temporary route removed. No push or deployment.
