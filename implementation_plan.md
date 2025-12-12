# 8-bit Sound Presets Library

Add a library of different 8-bit generated sound presets that users can browse, preview, and select in the sound effects tab of the editor.

## Proposed Changes

### Sound Preset Definitions
#### [NEW] [sound-presets.ts](file:///c:/Users/dell/Documents/GitHub/PortaGen/src/lib/constants/sound-presets.ts)

Create a constants file defining multiple sound presets with different characteristics:

| Preset | Style | Click | Hover | Window Open | Window Close |
|--------|-------|-------|-------|-------------|--------------|
| **Arcade** | Classic arcade games | Sharp blip | Soft beep | Power-up arpeggio | Game-over descend |
| **Nintendo** | 8-bit console style | Coin collect | Menu tick | Level start fanfare | Warp pipe |
| **Minimal** | Subtle, professional | Soft tick | Near silent | Quick swoop | Gentle fade |
| **Sci-Fi** | Space/futuristic | Laser blip | Scanner sweep | Warp sound | Teleport |
| **Retro Pop** | Cheerful, bouncy | Pop sound | Bubble | Celebration | Deflate |

Each preset defines frequency, duration, volume multiplier, oscillator type, and envelope (ADSR) for each sound type.

---

### Sound Context Update
#### [MODIFY] [sound-context.tsx](file:///c:/Users/dell/Documents/GitHub/PortaGen/src/contexts/sound-context.tsx)

- Import `SOUND_PRESETS` from the new constants file
- Add `currentPreset` state (string ID) and `setPreset(presetId)` function
- Update sound generation functions to use the selected preset's parameters
- Add `presetId` to localStorage persistence
- Expose `presets` list and `currentPreset` in context value

---

### Sound Effects Tab UI
#### [MODIFY] [sound-effects-tab.tsx](file:///c:/Users/dell/Documents/GitHub/PortaGen/src/components/editor/sound-effects-tab.tsx)

- Display grid of preset cards with name, description, and preview button
- Allow playing preview sounds for each preset
- Visual indicator for currently selected preset
- Save button to persist selection
- Clean pixel-art styled UI matching the editor aesthetic

---

## Verification Plan

### Manual Testing
1. Navigate to the editor page: `http://localhost:3000/dashboard/editor/{portfolioId}`
2. Go to the **SOUNDS** tab in the home screen section
3. Verify:
   - All 5 presets are displayed with names and descriptions
   - Clicking "Preview" on each preset plays the click sound for that preset
   - Clicking "Select" on a preset visually marks it as selected
   - Clicking "Save" persists the selection
   - Refreshing the page retains the selected preset
   - Interacting with the portfolio (clicking, opening windows) uses the selected preset's sounds
