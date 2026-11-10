# Persona workspace proposal

Status: interactive mockups created on 2026-11-07; awaiting design feedback. Application implementation has not started.

## Current implementation proposal (2026-11-09)

The user requested Superpowers planning using their supplied entrance video and a longer explanatory landing. The current source-verified proposal supersedes earlier short-landing/mock-account sketches: [design specification](superpowers/specs/2026-11-09-blue-hour-redesign-design.md) and [implementation plan](superpowers/plans/2026-11-09-blue-hour-redesign.md). The builder check reported no important gaps. User review remains pending. No app code, runtime dependencies, environment values, database schema, or published interiors were changed during planning.

## Blue Hour refinement (2026-11-08)

### Artwork follow-up

Latest feedback: the author likes the first two Shin pictures but rejects the third/dashboard image, and explicitly chose a drawing style closer to the anime. Keep the accepted title/account pictures. Revise only the third with cleaner outlines, restrained two-tone cel shading, more accurate facial proportions, and a natural three-quarter pose. Add two separate Lena illustrations: a left-side cap-touching composition with right-side menu space, and a right-side portrait looking back with left-side form space. Use her classic navy officer uniform and cap, gold trim, long silver hair, and violet-silver eyes. The Lena pair expands the art set; it does not replace the accepted Shin images.

References inspected: [Shin anime portrait on Pinterest](https://www.pinterest.com/pin/295759900538214085/) and [Lena anime frame on Pinterest](https://www.pinterest.com/pin/anime-scifi--19210735900420271/). These are character/style references for new generated fan art, not source artwork embedded in the mockup. They are stored locally as `shin-anime-reference.jpg` and `lena-anime-reference.jpg` in the preview directory. Three image-tool calls use those character references plus the prior underwater compositions; prompts ask for TV-anime linework and flat cel shadows, preserve empty interface space, and exclude cursor props, words, UI, and weapons.

Those three outputs are complete and saved in the preview directory as `shin-dashboard-anime-v2.png`, `lena-left.png`, and `lena-right.png`. They were displayed for review but are not yet assigned to the mockup. During generation, the author proposed providing their own Pinterest images for direct editing: preserve the chosen faces/poses, add the background, and extend cropped anatomy/clothing. Await those images before doing that new edit; missing regions will be generated rather than recovered from an original source.

Latest character direction: replace the original character with Shinei Nozen (Shin) from *86 EIGHTY-SIX* throughout the title, account, and dashboard art. The built-in image tool uses each prior composition as an edit target, with prompts specifying Shin's short tousled black hair, red eyes, reserved expression, olive military field jacket, beige scarf, and dark undershirt. Remove the previous white-haired character's headphones, piercings, and technical jacket. Preserve blue underwater backgrounds and open menu/form space; keep hands empty and exclude pointers, arrows, lettering, logos, and props. These are generated fan-art depictions, not official anime assets. Preserve previous artwork files when saving the new set.

Completed: all three Shin illustrations are now embedded in the Blue Hour mockup. Display copies beside it are `blue-hour-shin-title-v2.webp`, `blue-hour-shin-account.webp`, and `blue-hour-shin-dashboard.webp`; earlier character artwork is retained separately. Image outputs were inspected for character appearance, composition, and cursor removal. Script syntax and inline file size passed after replacement; browser rendering has not been rechecked.

The author requested more matching artwork and explicitly rejected the luminous mouse cursor beneath the character's fingertips as unnecessary. Remove cursor/pointer props from the artwork going forward.

Three built-in image-generation outputs now form the preview art set: a minimally edited title image with the cursor and its glow removed, a matching right-side upper-body account portrait, and a right-side mid-thigh dashboard composition. The original reference supplies character identity and style for the two new compositions. No UI text or icons are baked into them. The title, account, and dashboard screens use their respective images; the account form moves left to leave the portrait visible on the right. Other control-heavy screens keep subdued art for readability.

Preview assets live beside the inline mockup as `blue-hour-title-v2.webp`, `blue-hour-account.webp`, and `blue-hour-dashboard.webp`. These are compressed display copies; full PNG originals remain in the generated-images folder. The previous title art is retained for history. Prompt set: (1) remove only the cursor and its glow, preserve the rest; (2) preserve character identity and cel-shaded underwater style, create a right-side upper-body portrait with clean left-side space; (3) preserve identity/style, create an upright right-side mid-thigh pose with a diagonal light shaft and empty left-side menu space. New scenes explicitly exclude pointers, arrows, symbols, lettering, and props.

The author asked for a professional design after reviewing the game-menu studies. The new proposed mockup is `portagen-blue-hour.html` in this chat's visualization directory. It preserves title menu → sign in/sign up → dashboard and adds interactive portfolio selection, a new portfolio slot, profile/bio/palette preview, local save feedback, asset empty state, workspace preferences, and an About screen. Authentication, uploads, Drive connection, and saving are simulations. No application code was changed.

Art direction: a single original character illustration anchors the title screen, with white cel shading, cyan accents, headphones, and underwater light. Large tilted Barlow Condensed menu text uses the white spear/red text/pink shadow treatment. DM Sans keeps forms legible; dashboard detail screens use dark blue panels. Keyboard selection, Escape/back navigation, responsive stacking, and reduced motion are included. Generated artwork is still subject to the author's approval; it is not an Atlus character.

Artwork was generated with the built-in image tool. The preview copy is `blue-hour-key-art.webp` alongside the mockup and is embedded in it for portability. The original PNG remains in this chat's generated-images folder. The compressed copy preserves the composition. Prompt: “Original young adult creative with white hair and headphones, oversized white technical jacket with black seams and cyan lining, drifting diagonally underwater toward a luminous cursor-shaped shard; large figure on the left, empty cobalt water on the right, cyan caustics at the top, crisp black ink linework and white cel shading; premium editorial anime game-menu key art, no existing characters, logos, text, or UI.”

Validation: JavaScript syntax, unique IDs, queried ID references, navigation targets, embedded artwork, and file-size limit checked. The full mockup has not been visually checked in a browser; source checks do not verify responsive rendering or runtime interactions.

## Latest correction: game-menu flow

The author reiterated `https://vmelonn.github.io/persona3-website/` as the visual reference. Inspected live on 2026-11-07: the main menu pairs a large cropped illustration and black/grey tilted title on the left with a compact cyan menu on the right; selection uses red type over a long white triangular point and pink offset shadow. The background goes from bright cyan water at the top to saturated deep blue below. The About submenu uses black, ranked horizontal rows, a white selected row, red accent, and bottom-right key hints. The revised mockup moves toward that composition using original desktop graphic art. It does not reproduce the reference's character illustration. A short screen-entry transition respects reduced motion; the reference's full transitions have not been reproduced.

The author rejected the first pass's website-style landing and top navigation. The requested sequence is a game title menu first, with Sign in and Sign up, followed by the dashboard after account entry.

The revised proposal uses a large tilted PORTAGEN title, a vertical pointed-wedge menu, and a separate account-entry screen. After entry, a dashboard main menu offers Portfolios, Editor, Assets, Settings, and Sign out, with a contextual description panel. Arrow keys select, Enter confirms, and Escape goes back. The revised inline mockup is `portagen-game-menu.html` in this chat's visualization directory. Authentication is simulated; detailed editor, assets, and settings screens remain for a later pass. The earlier screen descriptions below are historical proposals and are superseded where they conflict with this flow.

## Visual system

- Water cyan `#44e4ff`, electric blue `#0755d8`, deep blue `#071657`, ink `#061039`, warm white `#fffef5`, pink `#ff76ae`. Selected menu text uses red `#bc174c`.
- Barlow Condensed, heavy italic, for tilted display titles and menu actions. Barlow for readable forms, descriptions, and navigation.
- Left-aligned titles, pointed white selection wedges, pink offset shadows, cyan section bars, dark detail panels, and restrained ripple geometry.
- Keep everyday labels understandable: Portfolios, Editor, Assets, Settings. Express the game-menu metaphor through layout and selection behavior.
- Preserve keyboard focus, readable form text, touch targets, responsive stacking, and reduced motion. Tilt titles and decorative elements rather than form controls or body copy.

## Mockup screens

- Landing: product explanation, a desktop example, Create your portfolio, and the Build / Make it yours / Publish sequence.
- Portfolios: roman-numbered save slots with selected-state styling and a corresponding detail panel. The primary action continues editing.
- Editor: readable controls beside a desktop preview, Profile / Windows / Theme sections, and one save action with an unsaved/saved indicator. Name and bio changes update the mock preview.
- Sign in: a quiet dark form under the tilted title, with conventional email/password fields and recovery action.

Example identities, portfolio records, and desktop content are illustrative. Save and sign-in actions operate only inside the mockup.

## Implementation sequence after feedback

1. Shared workspace tokens, typography, navigation, selection wedges, panels, and responsive behavior.
2. Landing, sign in, sign up, recovery, and privacy.
3. Dashboard overview and portfolio list, including loading, empty, error, and delete-confirmation states.
4. Assets as inventory and Settings as options, keeping upload and account controls conventional.
5. Editor last: real data and saving, an unsaved-changes guard, template-switch confirmation, and mobile preview behavior.

Published portfolio interiors retain their owner's chosen themes. The desktop shown in the mockup is illustrative, not a redesign of that interior. All graphics and styling are original; no third-party character art or logos are used.

## Review priorities

- Does the title and selection treatment feel close enough to the approved Persona direction?
- Does the landing page explain the product immediately?
- Can forms remain calm and legible inside the expressive workspace?
- Next mockup pass: assets, settings, mobile editor, and edge states after feedback on the shared direction.
