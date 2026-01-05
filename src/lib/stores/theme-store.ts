import { create } from 'zustand'
import { Theme } from '@/lib/services/themeService'
import { DEFAULT_THEME } from '@/lib/constants/theme-templates'

interface ThemeStoreState extends Theme {
    setTheme: (theme: Partial<Theme>) => void
    setThemeState: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
    ...DEFAULT_THEME,

    setTheme: (theme) => set((prev) => ({ ...prev, ...theme })),
    setThemeState: (theme) => set(theme)
}))

export const useTheme = () => useThemeStore((state) => ({
    name: state.name,
    colors: state.colors,
    font: state.font,
    taskbarStyleId: state.taskbarStyleId,
    menubarStyleId: state.menubarStyleId,
    windowStyleId: state.windowStyleId,
    musicPlayerStyleId: state.musicPlayerStyleId,
}))