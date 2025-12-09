"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { Theme, getTheme, saveTheme, getDisplayTheme } from "@/lib/services/themeService"
import {
    TASKBAR_TEMPLATES,
    MENUBAR_TEMPLATES,
    DEFAULT_THEME,
    TaskbarTemplate,
    MenubarTemplate,
} from "@/lib/constants/theme-templates"

interface ThemeContextType {
    activeTheme: Theme
    taskbarTemplate: TaskbarTemplate
    menubarTemplate: MenubarTemplate
    loading: boolean
    saving: boolean
    getThemeData: (portfolioId: number) => Promise<void>
    displayThemeData: (username: string, portfolioId: number) => Promise<void>
    updateTheme: (portfolioId: number, newTheme: Partial<Theme>) => Promise<void>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [activeTheme, setActiveTheme] = useState<Theme>(DEFAULT_THEME)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    // We can store loaded Portfolio ID if needed, but for now we rely on the component passing it.

    // Auth mode fetch
    const getThemeData = useCallback(async (portfolioId: number) => {
        setLoading(true)
        try {
            const data = await getTheme(portfolioId)
            if (data && data.theme) {
                setActiveTheme({ ...DEFAULT_THEME, ...data.theme })
            }
        } catch (e) {
            console.error("Failed to load theme:", e)
        } finally {
            setLoading(false)
        }
    }, [])

    // Public display fetch
    const displayThemeData = useCallback(async (username: string, portfolioId: number) => {
        setLoading(true)
        try {
            const data = await getDisplayTheme(portfolioId, username)
            if (data && data.theme) {
                setActiveTheme({ ...DEFAULT_THEME, ...data.theme })
            }
        } catch (e) {
            console.error("Failed to display theme:", e)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateTheme = async (portfolioId: number, newTheme: Partial<Theme>) => {
        setSaving(true)
        try {
            const merged: Theme = { ...activeTheme, ...newTheme }
            // Optimistic update
            setActiveTheme(merged)

            await saveTheme(portfolioId, merged)
        } catch (e) {
            console.error("Failed to save theme:", e)
            // Ideally revert optimistic update here if needed, but keeping simple for now
        } finally {
            setSaving(false)
        }
    }

    // Resolve templates
    const taskbarTemplate =
        TASKBAR_TEMPLATES.find((t) => t.id === activeTheme.taskbarStyleId) || TASKBAR_TEMPLATES[0]
    const menubarTemplate =
        MENUBAR_TEMPLATES.find((t) => t.id === activeTheme.menubarStyleId) || MENUBAR_TEMPLATES[0]

    return (
        <ThemeContext.Provider
            value={{
                activeTheme,
                taskbarTemplate,
                menubarTemplate,
                loading,
                saving,
                getThemeData,
                displayThemeData,
                updateTheme,
            }}
        >
            <style jsx global>{`
        :root {
          --theme-primary: ${activeTheme.colors.primary};
          --theme-secondary: ${activeTheme.colors.secondary};
          --theme-accent: ${activeTheme.colors.accent};
          --theme-background: ${activeTheme.colors.background};
          --theme-text: ${activeTheme.colors.text};
          --font-primary: ${activeTheme.fonts.primary};
          --font-secondary: ${activeTheme.fonts.secondary};
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
