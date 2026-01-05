
export interface TaskbarTemplate {
    id: string
    name: string
    classNames: {
        container: string
        item: string
        activeItem: string
    }
}

export interface MenubarTemplate {
    id: string
    name: string
    classNames: {
        container: string
        item: string
        dropdown: string
    }
}

export interface WindowTemplate {
    id: string
    name: string
    classNames: {
        container: string
        header: string
        content: string
        buttons: string
    }
}

export const TASKBAR_TEMPLATES: TaskbarTemplate[] = [
    {
        id: "liquid-glass",
        name: "Liquid Glass",
        classNames: { container: "", item: "", activeItem: "" },
    },
    {
        id: "windows-98",
        name: "Windows 98",
        classNames: { container: "", item: "", activeItem: "" },
    },
    {
        id: "windows-xp",
        name: "Windows XP",
        classNames: { container: "", item: "", activeItem: "" },
    },
    {
        id: "windows-7",
        name: "Windows 7",
        classNames: { container: "", item: "", activeItem: "" },
    },
    {
        id: "pixel",
        name: "Pixel Art",
        classNames: { container: "", item: "", activeItem: "" },
    },
    {
        id: "window",
        name: "Modern Window",
        classNames: { container: "", item: "", activeItem: "" },
    },
]

export const MENUBAR_TEMPLATES: MenubarTemplate[] = [
    {
        id: "liquid-glass",
        name: "Liquid Glass",
        classNames: { container: "", item: "", dropdown: "" },
    },
    {
        id: "windows-98",
        name: "Windows 98",
        classNames: { container: "", item: "", dropdown: "" },
    },
    {
        id: "windows-xp",
        name: "Windows XP",
        classNames: { container: "", item: "", dropdown: "" },
    },
    {
        id: "windows-7",
        name: "Windows 7",
        classNames: { container: "", item: "", dropdown: "" },
    },
    {
        id: "pixel",
        name: "Pixel Art",
        classNames: { container: "", item: "", dropdown: "" },
    },
    {
        id: "window",
        name: "Modern Window",
        classNames: { container: "", item: "", dropdown: "" },
    },
]

export const WINDOW_TEMPLATES: WindowTemplate[] = [
    {
        id: "liquid-glass",
        name: "Liquid Glass",
        classNames: { container: "", header: "", content: "", buttons: "" },
    },
    {
        id: "windows-98",
        name: "Windows 98",
        classNames: { container: "", header: "", content: "", buttons: "" },
    },
    {
        id: "windows-xp",
        name: "Windows XP",
        classNames: { container: "", header: "", content: "", buttons: "" },
    },
    {
        id: "windows-7",
        name: "Windows 7",
        classNames: { container: "", header: "", content: "", buttons: "" },
    },
    {
        id: "pixel",
        name: "Pixel Art",
        classNames: { container: "", header: "", content: "", buttons: "" },
    },
    {
        id: "window",
        name: "Modern Window",
        classNames: { container: "", header: "", content: "", buttons: "" },
    },
]

export interface MusicPlayerTemplate {
    id: string
    name: string
    classNames: {
        container: string
        collapsed: string
        expanded: string
        mobile: string
    }
}

export const MUSIC_PLAYER_TEMPLATES: MusicPlayerTemplate[] = [
    {
        id: "default",
        name: "Default",
        classNames: { container: "", collapsed: "", expanded: "", mobile: "" },
    },
    {
        id: "liquid-glass",
        name: "Liquid Glass",
        classNames: { container: "liquidGlass-wrapper", collapsed: "liquidGlass-collapsed", expanded: "liquidGlass-expanded", mobile: "liquidGlass-mobile" },
    },
    {
        id: "windows-98",
        name: "Windows 98",
        classNames: { container: "windows98-wrapper", collapsed: "windows98-collapsed", expanded: "windows98-expanded", mobile: "windows98-mobile" },
    },
    {
        id: "windows-xp",
        name: "Windows XP",
        classNames: { container: "windowsXP-wrapper", collapsed: "windowsXP-collapsed", expanded: "windowsXP-expanded", mobile: "windowsXP-mobile" },
    },
    {
        id: "windows-7",
        name: "Windows 7",
        classNames: { container: "windows7-wrapper", collapsed: "windows7-collapsed", expanded: "windows7-expanded", mobile: "windows7-mobile" },
    },
    {
        id: "pixel",
        name: "Pixel Art",
        classNames: { container: "pixel-wrapper", collapsed: "pixel-collapsed", expanded: "pixel-expanded", mobile: "pixel-mobile" },
    },
    {
        id: "modern-window",
        name: "Modern Window",
        classNames: { container: "modernWindow-wrapper", collapsed: "modernWindow-collapsed", expanded: "modernWindow-expanded", mobile: "modernWindow-mobile" },
    },
]

export const DEFAULT_THEME = {
    name: 'Default',
    colors: {
        primary: '#000080',
        secondary: '#c0c0c0',
        accent: '#ff0000',
        background: '#008080',
        text: '#000000',
    },
    font: 'Inter, sans-serif',
    taskbarStyleId: 'liquid-glass',
    menubarStyleId: 'liquid-glass',
    windowStyleId: 'liquid-glass',
    musicPlayerStyleId: 'default',
}
