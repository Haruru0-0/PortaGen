# Persona theme controls — 2026-11-11

Completed the remaining owner-editor Theme surfaces on `main`: Home Theme presets, collapsible section headers, color pickers/hex fields, font dropdown, taskbar/menubar/window/music style choices and Save action; Lock Screen Theme uses the same shared style choices. Cyan inactive controls, cream/pink selected controls and fitted focus outlines follow the existing Persona primitives. Decorative shapes leave native hit areas and focus targets intact. Choice buttons expose `aria-pressed`; fields have associated labels. The font menu uses the existing animated workspace select.

Home Theme now derives its draft directly from the existing theme store. The previous local-state synchronization depended on a new object each render, causing repeated updates. Existing theme fields, including `lockScreenStyleId`, remain in the save payload. The work preserves the other uncommitted liquid-glass/mobile-wallpaper changes already present in this checkout.

Verification:

- Focused ESLint passed for ThemeEditor, LockScreenThemeTab and ThemeStyleChoices.
- Full `yarn tsc --noEmit` passed.
- Isolated Chromium checks at widths 390, 768 and 1440 passed: no horizontal overflow or page errors; preset changes, hex/picker synchronization, font menu selection, every style group, keyboard activation and cyan fitted keyboard focus work.
- Two mocked save payloads confirmed that Home Theme saves edited color/font values and Lock Screen Theme preserves those values while updating its own style. No real database write was performed.
- The temporary review route was removed. Screenshots: [mobile](theme-controls/theme-390.png), [tablet](theme-controls/theme-768.png), [desktop](theme-controls/theme-1440.png).

Changes remain uncommitted on `main` for review.

## Default font and save spacing follow-up

The initial fixture used a named preset and missed the actual default font stack. Reproduced both reported defects: `Inter, sans-serif` had no matching font-menu option (blank label), and the Lock Screen choice fieldset's margin reset canceled the sibling spacing (0px gap above Save). Added an explicit `Default (Inter)` option using the unchanged stored stack and retained labels for other saved font values. Replaced the lock-screen wrapper's sibling margins with a grid and 24px gap. Browser regression now passes with actual default data, changing fonts and selecting Default again, preserving the saved font value, 24px save separation and no overflow/page errors at 390/768/1440. Persistence was mocked; fixture removed.
