"use client"

import { useEffect, useId } from "react"
import { Check, ChevronDown } from "lucide-react"
import { useParams } from "next/navigation"
import { WorkspaceAction, WorkspaceInput } from "@/components/workspace/workspace-primitives"
import { WorkspaceControlFrame } from "@/components/workspace/workspace-frame"
import { WorkspaceNativeSelect } from "@/components/workspace/workspace-native-select"
import { ThemeStyleChoices } from "@/components/editor/theme-style-choices"
import { THEME_PRESETS, type PortfolioTheme } from "@/lib/portfolio-theme"
import { DEFAULT_THEME, TASKBAR_TEMPLATES, MENUBAR_TEMPLATES, WINDOW_TEMPLATES, MUSIC_PLAYER_TEMPLATES } from "@/lib/constants/theme-templates"
import { PORTFOLIO_FONTS } from "@/lib/fonts"
import { useThemeStore } from "@/lib/stores/theme-store"
import { useTheme } from "@/contexts/theme-context"

export function ThemeEditor() {
  const { name, colors, font, taskbarStyleId, lockScreenStyleId, menubarStyleId, windowStyleId, musicPlayerStyleId, setTheme } = useThemeStore()
  const { updateTheme, loading, saving, getThemeData } = useTheme()
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const fontId = useId()
  const listedFont = font === DEFAULT_THEME.font || PORTFOLIO_FONTS.some(option => option.name === font)
  // Read the live store directly rather than mirroring a newly created object
  // into local state on every render, which repeatedly resets the draft.
  const customTheme: PortfolioTheme = { name, colors, font, taskbarStyleId, lockScreenStyleId, menubarStyleId, windowStyleId, musicPlayerStyleId }

  useEffect(() => {
    if (currentPortfolioId) void getThemeData(currentPortfolioId)
  }, [currentPortfolioId, getThemeData])

  const handleColorChange = (key: keyof PortfolioTheme["colors"], value: string) => {
    setTheme({ colors: { ...colors, [key]: value } })
  }

  return (
    <div className="workspace-theme-editor">
      <details open className="workspace-theme-section">
        <summary>THEME PRESETS <ChevronDown aria-hidden="true" /></summary>
        <div className="workspace-theme-section-body" role="group" aria-label="Theme presets">
          {THEME_PRESETS.map(preset => (
            <WorkspaceAction key={preset.name} type="button"
              variant={name === preset.name ? "primary" : "secondary"}
              aria-pressed={name === preset.name} className="workspace-theme-preset"
              onClick={() => setTheme(preset)}>
              <span className="workspace-theme-preset-heading">
                <span>{preset.name}</span>
                {name === preset.name && <Check className="size-4" aria-hidden="true" />}
              </span>
              <span className="workspace-theme-swatches" aria-hidden="true">
                {Object.values(preset.colors).slice(0, 5).map((color, index) => (
                  <span key={index} className="workspace-theme-swatch" style={{ backgroundColor: color }} />
                ))}
              </span>
            </WorkspaceAction>
          ))}
        </div>
      </details>

      <details className="workspace-theme-section">
        <summary>CUSTOM COLORS <ChevronDown aria-hidden="true" /></summary>
        <div className="workspace-theme-section-body">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="workspace-theme-color-row">
              <WorkspaceControlFrame className="workspace-theme-color">
                <input type="color" aria-label={`${key} color picker`}
                  value={/^#[\da-f]{6}$/i.test(value) ? value : "#000000"}
                  onChange={event => handleColorChange(key as keyof PortfolioTheme["colors"], event.target.value)} />
              </WorkspaceControlFrame>
              <WorkspaceInput label={key.toUpperCase()} value={value} spellCheck={false}
                onChange={event => handleColorChange(key as keyof PortfolioTheme["colors"], event.target.value)} />
            </div>
          ))}
        </div>
      </details>

      <div className="workspace-theme-font">
        <label htmlFor={fontId} className="ws-label">FONT</label>
        <WorkspaceNativeSelect id={fontId} value={font || DEFAULT_THEME.font} onChange={event => setTheme({ font: event.target.value })}>
          <option value={DEFAULT_THEME.font}>Default (Inter)</option>
          {font && !listedFont && <option value={font}>{font}</option>}
          {PORTFOLIO_FONTS.map(option => <option key={option.name} value={option.name}>{option.name}</option>)}
        </WorkspaceNativeSelect>
      </div>

      <ThemeStyleChoices label="TASKBAR STYLE" options={TASKBAR_TEMPLATES} value={taskbarStyleId} onChange={value => setTheme({ taskbarStyleId: value })} />
      <ThemeStyleChoices label="MENUBAR STYLE" options={MENUBAR_TEMPLATES} value={menubarStyleId} onChange={value => setTheme({ menubarStyleId: value })} />
      <ThemeStyleChoices label="WINDOW STYLE" options={WINDOW_TEMPLATES} value={windowStyleId} onChange={value => setTheme({ windowStyleId: value })} />
      <ThemeStyleChoices label="MUSIC PLAYER STYLE" options={MUSIC_PLAYER_TEMPLATES} value={musicPlayerStyleId} onChange={value => setTheme({ musicPlayerStyleId: value })} />

      <WorkspaceAction type="button" className="w-full" disabled={saving || loading} onClick={() => updateTheme(currentPortfolioId, customTheme)}>
        {saving ? "SAVING..." : "SAVE"}
      </WorkspaceAction>
    </div>
  )
}
