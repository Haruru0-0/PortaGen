---
target: PortaGen landing, auth and dashboard
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\ahmad\\Documents\\Github\\PortaGen\\src\\app\\page.tsx"
target_fingerprint: "sha256:6d403909198b8c056e28ecf7843b9b63391eb686d9a5b46ad9b17ab447e0a3a0"
target_path: "C:\\Users\\ahmad\\Documents\\Github\\PortaGen\\src\\app\\page.tsx"
timestamp: 2026-11-05T16-30-20Z
slug: src-app-page-tsx
---
# PortaGen critique (2026-11-05)

Method: dual-agent (design review and detector/browser evidence run separately). Theme to keep: pixel retro (Press Start 2P, Luna palette).
Viewed live: landing, login, signup, forgot-password, privacy. Source review only: dashboard, editor, published desktop.

Score: 22/40 (Acceptable). Heuristic 7 scored 2 on the editor from source; 10 scored 1.

Priority issues
- P1 Muted text fails contrast: #9E9E9E is 2.68:1 on white and 2.02:1 on the cyan sky. Fix tokens. (/colorize, /audit)
- P1 Typography: Press Start 2P uppercase at 8-10px everywhere; 20 of 46 landing text nodes under 12px. Keep it for headings and buttons at 8px multiples, use a pixel dialogue face for body. (/typeset)
- P1 Pixel craft approximate: .pixel-text-shadow and .pixelated are used but never defined; translucent shadows; rounded taskbar; default published desktop is liquid glass; overshoot easing (5 detector hits). (/polish, /bolder)
- P2 Landing never shows the product; PortaGen vs AETHER PORTFOLIO; fake social tiles. (/shape, /delight)
- P2 Accessibility and robustness: unbound labels, no autocomplete, unnamed buttons, GSAP vs reduced motion, small tap targets, hydration mismatch from Math.random on five pages. (/harden, /animate)
- P3 Dashboard and editor hierarchy (source): checklist rows link nowhere, preview below the controls. (/layout, /onboard)

Detector: 14 findings (bounce-easing 5, border-accent-on-rounded 8 probably false positives, side-tab 1 probably false positive).
