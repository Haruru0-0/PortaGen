export type CategoryType = 'lockScreen' | 'homeScreen'
export type LockScreenTab = 'settings' | 'wallpaper'
export type HomeScreenTab = 'wallpaper' | 'icons' | 'music' | 'windows' | 'theme' | 'sounds' | 'mobile widgets' | 'desktop widget'


export const lockScreenTabs: { id: LockScreenTab; label: string }[] = [
    { id: "settings", label: "SETTINGS" },
    { id: "wallpaper", label: "WALLPAPER" },
]

export const homeScreenTabs: { id: HomeScreenTab; label: string }[] = [
    { id: "wallpaper", label: "WALLPAPER" },
    { id: "mobile widgets", label: "MOBILE WIDGETS" },
    { id: "desktop widget", label: "DESKTOP WIDGET" },
    { id: "icons", label: "ICONS" },
    { id: "music", label: "MUSIC" },
    { id: "windows", label: "WINDOWS" },
    { id: "sounds", label: "SOUNDS" },
    { id: "theme", label: "THEME" },
]