import { DEFAULT_THEME } from '../constants/theme-templates'

export interface ThemeColors {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
}

export interface ThemeFonts {
    primary: string
    secondary: string
}

export interface Theme {
    name: string
    colors: ThemeColors
    font: string
    taskbarStyleId?: string
    menubarStyleId?: string
    windowStyleId?: string
    musicPlayerStyleId?: string
}

export interface ThemeSettingsData {
    id: number
    portfolioId: number
    theme: Theme
}

export async function getTheme(portfolioId?: number): Promise<ThemeSettingsData | null> {
    const url = portfolioId ? `/api/theme/get?portfolioId=${portfolioId}` : '/api/theme/get'
    const res = await fetch(url)
    if (!res.ok) {
        if (res.status === 404) return null
        throw new Error('Failed to fetch theme')
    }
    return res.json()
}

export async function saveTheme(portfolioId: number, theme: Theme) {
    const res = await fetch('/api/theme/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId, theme }),
    })
    if (!res.ok) throw new Error('Failed to save theme')
    return res.json()
}

export async function getDisplayTheme(portfolioId?: number, username?: string): Promise<ThemeSettingsData | null> {
    const params = new URLSearchParams()
    if (portfolioId) params.append('portfolioId', portfolioId.toString())
    if (username) params.append('username', username)

    const res = await fetch(`/api/theme/display?${params.toString()}`)
    if (!res.ok) {
        if (res.status === 404) return null
        throw new Error('Failed to display theme')
    }
    return res.json()
}
