# Decisions

See [[architecture]]. Reasons marked (inferred) were not stated.

- **Window content is generic, saved data,** so the new terminal and achievements windows carry their text, commands and achievements as editable content instead of hard-coded copy from the author's own portfolio (chosen by the author when porting, "generic types").
- **Direction of the port is AOS to PortaGen:** the author's personal portfolio (`aesthetic-portfolio-os`) got improvements that should be generalised here.
- **Mirrored to GitLab** on every push (script in the dev-tools repo).
- **2026-11-05: the design pass covers PortaGen's own pages only** (landing, auth, privacy, dashboard, editor). The inside of a published portfolio (lock screen, desktop, windows, skins, music players) is left alone because its owners edit it themselves (author's instruction). The pixel retro theme stays.
