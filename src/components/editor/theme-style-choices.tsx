"use client"

import { Check } from "lucide-react"
import { WorkspaceAction } from "@/components/workspace/workspace-primitives"
import "./theme-controls.css"

export function ThemeStyleChoices({ label, description, options, value, onChange }: {
  label: string
  description?: string
  options: readonly { id: string; name: string }[]
  value?: string
  onChange: (value: string) => void
}) {
  return (
    <fieldset className="workspace-theme-choices">
      <legend className="ws-label">{label}</legend>
      {description && <p className="mb-4 font-dialogue text-sm text-muted-foreground">{description}</p>}
      <div className="workspace-theme-choice-grid">
        {options.map(option => (
          <WorkspaceAction key={option.id} type="button"
            variant={value === option.id ? "primary" : "secondary"}
            aria-pressed={value === option.id} className="workspace-theme-choice"
            onClick={() => onChange(option.id)}>
            <span>{option.name}</span>
            {value === option.id && <Check className="size-4" aria-hidden="true" />}
          </WorkspaceAction>
        ))}
      </div>
    </fieldset>
  )
}
