# Decisions

See [[architecture]]. Reasons marked (inferred) were not stated.

- **Window content is generic, saved data,** so the new terminal and achievements windows carry their text, commands and achievements as editable content instead of hard-coded copy from the author's own portfolio (chosen by the author when porting, "generic types").
- **Direction of the port is AOS to PortaGen:** the author's personal portfolio (`aesthetic-portfolio-os`) got improvements that should be generalised here.
- **Mirrored to GitLab** on every push (script in the dev-tools repo).
- **2026-11-05: the design pass covers PortaGen's own pages only** (landing, auth, privacy, dashboard, editor). The inside of a published portfolio (lock screen, desktop, windows, skins, music players) is left alone because its owners edit it themselves (author's instruction). The pixel retro theme stays.

## Game-menu redesign direction (2026-11-07)

Status: explored as mockups only; no app code changed, nothing committed.

- The author wants a game-menu look, not a website look. They rejected the pixel title screen and the smooth gradient version ("ugly"), liked a bold blue tilted Persona-style menu, and then asked to match the Persona 3 site `vmelonn.github.io/persona3-website` more closely.
- Layout to match (from that site, seen live): cyan-to-deep-blue vertical gradient with water ripples; big tilted italic title; main menu where the selected item is a white pointed wedge with red text and a pink shadow; list screen of ranked cards (roman numeral tab, big title, count, cyan subtitle bar; selected card white with black text); dark detail panel with cyan header and status chips; small key hints bottom right.
- Mapping: Portfolios = save slots, Editor = character sheet, Assets = inventory, Settings = options. A fuller landing page that explains the product (build, preview, publish; window types; own link) was approved ("damn, that's cool").
- Rules: write all code and art ourselves. `vmelonn/persona3-website` and most Persona repos on GitHub have no license (all rights reserved); the art and logos belong to Atlus. Only study layout and animation. Open-licensed ones: `skyventuree/p5cc` (MIT).
- Character art: code-drawn sprites look weak. Real art needs an image generator (the connected Higgsfield account had 0 credits) or a pixel artist. A placeholder silhouette is used until then.
- Unverified guesses in the mockup copy: window names (About, Projects, Resume, Gallery, Contact, Links) and the domain `portagen.app`; check against the real app before building.
- Plan if approved: new branch, shared look first (colors, fonts, tilt, skewed buttons), then landing, login and sign up, then dashboard pages; the editor last because of its many forms and the live preview.
