"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react"
import { toast } from "sonner"
import { Theme, getTheme, saveTheme, getDisplayTheme } from "@/lib/services/themeService"
import {
    TASKBAR_TEMPLATES,
    MENUBAR_TEMPLATES,
    WINDOW_TEMPLATES,
    MUSIC_PLAYER_TEMPLATES,
    DEFAULT_THEME,
    TaskbarTemplate,
    MenubarTemplate,
    WindowTemplate,
    MusicPlayerTemplate,
} from "@/lib/constants/theme-templates"
import { useThemeStore, useTheme as useThemeStoreSelector } from "@/lib/stores/theme-store"

interface ThemeContextType {
    taskbarTemplate: TaskbarTemplate
    menubarTemplate: MenubarTemplate
    windowTemplate: WindowTemplate
    musicPlayerTemplate: MusicPlayerTemplate
    loading: boolean
    saving: boolean
    getThemeData: (portfolioId: number) => Promise<void>
    displayThemeData: (username: string, portfolioId: number) => Promise<void>
    updateTheme: (portfolioId: number, newTheme: Partial<Theme>) => Promise<void>
    setActiveTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { name, colors, font, taskbarStyleId, menubarStyleId, windowStyleId, musicPlayerStyleId, setTheme, setThemeState } = useThemeStore()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    // We can store loaded Portfolio ID if needed, but for now we rely on the component passing it.

    const activeThemeRef = useRef<Theme>({ name, colors, font, taskbarStyleId, menubarStyleId, windowStyleId, musicPlayerStyleId })
    const activeTheme = activeThemeRef.current

    useEffect(() => {
        activeThemeRef.current = { name, colors, font, taskbarStyleId, menubarStyleId, windowStyleId, musicPlayerStyleId }
    }, [name, colors.primary, colors.secondary, colors.accent, colors.background, colors.text, font, taskbarStyleId, menubarStyleId, windowStyleId, musicPlayerStyleId])

    // Auth mode fetch
    const getThemeData = useCallback(async (portfolioId: number) => {
        setLoading(true)
        try {
            const data = await getTheme(portfolioId)
            if (data && data.theme) {
                setThemeState({ ...DEFAULT_THEME, ...data.theme })
            }
        } catch (e) {
            console.error("Failed to load theme:", e)
        } finally {
            setLoading(false)
        }
    }, [setThemeState])

    // Public display fetch
    const displayThemeData = useCallback(async (username: string, portfolioId: number) => {
        setLoading(true)
        try {
            const data = await getDisplayTheme(portfolioId, username)
            if (data && data.theme) {
                setThemeState({ ...DEFAULT_THEME, ...data.theme })
            }
        } catch (e) {
            console.error("Failed to display theme:", e)
        } finally {
            setLoading(false)
        }
    }, [setThemeState])

    const updateTheme = async (portfolioId: number, newTheme: Partial<Theme>) => {
        setSaving(true)
        try {
            const merged: Theme = { ...activeTheme, ...newTheme }
            // Optimistic update
            setTheme(merged)

            await saveTheme(portfolioId, merged)
            toast.success("Theme saved successfully!")
        } catch (e) {
            console.error("Failed to save theme:", e)
            toast.error("Failed to save theme")
            // Ideally revert optimistic update here if needed, but keeping simple for now
        } finally {
            setSaving(false)
        }
    }

    const setActiveThemeLocal = (theme: Theme) => {
        setTheme(theme)
    }

    // Resolve templates
    const taskbarTemplate =
        TASKBAR_TEMPLATES.find((t) => t.id === activeTheme.taskbarStyleId) || TASKBAR_TEMPLATES[0]
    const menubarTemplate =
        MENUBAR_TEMPLATES.find((t) => t.id === activeTheme.menubarStyleId) || MENUBAR_TEMPLATES[0]
    const windowTemplate =
        WINDOW_TEMPLATES.find((t) => t.id === activeTheme.windowStyleId) || WINDOW_TEMPLATES[0]
    const musicPlayerTemplate =
        MUSIC_PLAYER_TEMPLATES.find((t) => t.id === activeTheme.musicPlayerStyleId) || MUSIC_PLAYER_TEMPLATES[0]

    return (
        <ThemeContext.Provider
            value={{
                taskbarTemplate,
                menubarTemplate,
                windowTemplate,
                musicPlayerTemplate,
                loading,
                saving,
                getThemeData,
                displayThemeData,
                updateTheme,
                setActiveTheme: setActiveThemeLocal,
            }}
        >
            <style jsx global>{`
        :root {
          --theme-primary: ${activeTheme.colors.primary};
          --theme-secondary: ${activeTheme.colors.secondary};
          --theme-accent: ${activeTheme.colors.accent};
          --theme-background: ${activeTheme.colors.background};
          --theme-text: ${activeTheme.colors.text};
          --font: ${activeTheme.font};
        }
      `}</style>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
