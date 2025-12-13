
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
        id: "retro",
        name: "Windows 95",
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
        id: "retro",
        name: "Windows 95",
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
        id: "retro",
        name: "Windows 95",
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
    taskbarStyleId: 'retro',
    menubarStyleId: 'retro',
    windowStyleId: 'retro',
}
