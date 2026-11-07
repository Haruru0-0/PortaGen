import type { AchievementsData, TerminalData } from "@/lib/types"

export const DEFAULT_TERMINAL_DATA: TerminalData = {
    username: "visitor",
    hostname: "my-portfolio",
    welcomeLines: [
        "Portfolio OS [Version 1.0.0]",
        "─────────────────────────────────────",
        'Type "help" for available commands.',
    ],
    whoami: "visitor — a curious explorer browsing this portfolio ✨",
    files: [
        { name: "about.txt", lines: ["Name:   Your Name", "Role:   Your Role", "Status: Open to opportunities ✅"] },
        { name: "skills.txt", lines: ["Frontend: React, TypeScript", "Backend:  Node.js", "Currently: Building cool things 🚀"] },
        { name: "contact.txt", lines: ["Email:  you@example.com", "GitHub: github.com/username"] },
    ],
    infoRows: [
        { label: "OS", value: "Portfolio OS 1.0" },
        { label: "Host", value: "Your Name" },
        { label: "Shell", value: "PortfolioSH 1.0" },
    ],
    commands: [],
}

export const DEFAULT_ACHIEVEMENTS_DATA: AchievementsData = {
    title: "ACHIEVEMENTS",
    subtitle: "EXPLORE THE PORTFOLIO TO UNLOCK THEM ALL",
    footer: "",
    achievements: [
        { id: "first_window", name: "Hello There!", description: "You opened your very first app ✨", icon: "👋", trigger: { type: "first_window" } },
        { id: "all_apps", name: "Full Stack Explorer", description: "You opened every single app! 🏆", icon: "🏆", trigger: { type: "all_windows" } },
        { id: "multitasker", name: "Multitasker", description: "You had 3 windows open at once — busy bee! 🐝", icon: "🪟", trigger: { type: "windows_open", count: 3 } },
        { id: "music_head", name: "Music Head", description: "You hit play! Great taste 🎶", icon: "🎵", trigger: { type: "music_play" } },
        { id: "night_owl", name: "Night Owl", description: "Browsing after midnight? Same 🦉", icon: "🦉", trigger: { type: "time_range", fromHour: 0, toHour: 5 } },
        { id: "early_bird", name: "Early Bird", description: "Up before 7am? You're dedicated! ☀️", icon: "🐦", trigger: { type: "time_range", fromHour: 5, toHour: 7 } },
        { id: "minimize", name: "Neat Freak", description: "You minimized a window — so tidy! 🧹", icon: "➖", trigger: { type: "minimize" } },
        { id: "terminal_open", name: "Hacker Mode", description: "You opened the terminal 💻", icon: "🖥️", trigger: { type: "terminal_open" } },
    ],
}

export const DEFAULT_CONTENT_BY_TYPE: Partial<Record<string, unknown>> = {
    terminal: DEFAULT_TERMINAL_DATA,
    achievements: DEFAULT_ACHIEVEMENTS_DATA,
}
