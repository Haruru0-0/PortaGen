"use client"

import { useState, useEffect } from "react"
import { PixelInput } from "./pixel-input"
import { THEME_PRESETS, type PortfolioTheme } from "@/lib/portfolio-theme"
import { Check } from "lucide-react"
import { PixelButton } from "@/components/pixel-button"
import { TASKBAR_TEMPLATES, MENUBAR_TEMPLATES, WINDOW_TEMPLATES } from "@/lib/constants/theme-templates"
import { useThemeStore } from "@/lib/stores/theme-store"
import { useTheme } from "@/contexts/theme-context"
import { useParams } from "next/navigation"

export function ThemeEditor() {
  const [customTheme, setCustomTheme] = useState<PortfolioTheme>(THEME_PRESETS[0])
  const { name, colors, font, taskbarStyleId, menubarStyleId, windowStyleId, setTheme, setThemeState } = useThemeStore()
  const { updateTheme, loading, saving, getThemeData } = useTheme()
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)

  const activeTheme = { name, colors, font, taskbarStyleId, menubarStyleId, windowStyleId }

  // Fetch theme data when component mounts
  useEffect(() => {
    if (currentPortfolioId) {
      getThemeData(currentPortfolioId)
    }
  }, [currentPortfolioId, getThemeData])

  // Update customTheme when activeTheme changes
  useEffect(() => {
    setCustomTheme(activeTheme)
  }, [activeTheme])

  const handlePresetSelect = (preset: PortfolioTheme) => {
    setCustomTheme(preset)
    setTheme(preset)
  }

  const handleTaskbarStyleChange = (styleId: string) => {
    const updated = {
      ...customTheme,
      taskbarStyleId: styleId,
    }
    setCustomTheme(updated)
    setTheme(updated)
  }

  const handleMenubarStyleChange = (styleId: string) => {
    const updated = {
      ...customTheme,
      menubarStyleId: styleId,
    }
    setCustomTheme(updated)
    setTheme(updated)
  }

  const handleWindowStyleChange = (styleId: string) => {
    const updated = {
      ...customTheme,
      windowStyleId: styleId,
    }
    setCustomTheme(updated)
    setTheme(updated)
  }

  const handleColorChange = (key: keyof PortfolioTheme["colors"], value: string) => {
    const updated = {
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [key]: value,
      },
    }
    setCustomTheme(updated)
    setTheme(updated)
  }

  const handleFontChange = (value: string) => {
    const updated = {
      ...customTheme,
      font: value,
    }
    setCustomTheme(updated)
    setTheme(updated)
  }


  return (
    <div className="space-y-4">
      {/* Theme Presets */}
      <div className="space-y-3">
        <h4 className="text-[10px] pixel-text-shadow">THEME PRESETS</h4>
        <div className="grid grid-cols-1 gap-2">
          {THEME_PRESETS.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetSelect(preset)}
              className={`p-3 border-2 border-border text-left transition-all hover:scale-[1.02] ${customTheme.name === preset.name ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold">{preset.name}</p>
                </div>
                {customTheme.name === preset.name && <Check className="w-4 h-4" />}
              </div>
              <div className="flex gap-1 mt-2">
                {Object.values(preset.colors)
                  .slice(0, 5)
                  .map((color, i) => (
                    <div key={i} className="w-6 h-6 border-2 border-border" style={{ backgroundColor: color }} />
                  ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-3">
        <h4 className="text-[10px] pixel-text-shadow">CUSTOM COLORS</h4>
        {Object.entries(customTheme.colors).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <label className="text-[8px] uppercase">{key}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(key as keyof PortfolioTheme["colors"], e.target.value)}
                className="w-12 h-10 border-2 border-border cursor-pointer"
              />
              <PixelInput
                value={value}
                onChange={(e) => handleColorChange(key as keyof PortfolioTheme["colors"], e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Font */}
      <div className="space-y-2">
        <label className="text-[8px] uppercase">FONT</label>
        <select
          value={customTheme.font}
          onChange={(e) => handleFontChange(e.target.value)}
          className="w-full px-3 py-2 text-[10px] bg-input border-2 border-border focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Press Start 2P">Press Start 2P</option>
          <option value="Orbitron">Orbitron</option>
          <option value="Inter">Inter</option>
          <option value="Poppins">Poppins</option>
          <option value="Space Grotesk">Space Grotesk</option>
          <option value="Rajdhani">Rajdhani</option>
        </select>
      </div>

      {/* Taskbar and Menubar Styles */}
      <div className="space-y-3">
        {/* Taskbar Style */}
        <div className="space-y-2">
          <label className="text-[8px] uppercase">TASKBAR STYLE</label>
          <div className="grid grid-cols-2 gap-2">
            {TASKBAR_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTaskbarStyleChange(template.id)}
                className={`px-3 py-2 text-[8px] border-2 border-border ${customTheme.taskbarStyleId === template.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted"
                  }`}
              >
                {template.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {/* Menubar Style */}
        <div className="space-y-2">
          <label className="text-[8px] uppercase">MENUBAR STYLE</label>
          <div className="grid grid-cols-2 gap-2">
            {MENUBAR_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleMenubarStyleChange(template.id)}
                className={`px-3 py-2 text-[8px] border-2 border-border ${customTheme.menubarStyleId === template.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted"
                  }`}
              >
                {template.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Window Style */}
      <div className="space-y-2">
        <label className="text-[8px] uppercase">WINDOW STYLE</label>
        <div className="grid grid-cols-2 gap-2">
          {WINDOW_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleWindowStyleChange(template.id)}
              className={`px-3 py-2 text-[8px] border-2 border-border ${customTheme.windowStyleId === template.id
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
                }`}
            >
              {template.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <PixelButton
          className="w-full text-[10px]"
          onClick={() => {
            updateTheme(currentPortfolioId, customTheme)
          }}
          disabled={saving || loading}
        >
          {saving ? 'SAVING...' : 'SAVE'}
        </PixelButton>
      </div>
    </div>
  )
}
