"use client"

import { Button as BaseButton } from "@/components/ui/button"
import { Input as BaseInput } from "@/components/ui/input"
import { Textarea as BaseTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export function Button({ className, ...props }: ComponentProps<typeof BaseButton>) {
  return <BaseButton {...props} data-persona-variant={props.variant ?? "default"} className={cn(className, "workspace-editor-button")} />
}

export function Input({ className, ...props }: ComponentProps<typeof BaseInput>) {
  return <BaseInput {...props} className={cn(className, "workspace-editor-input")} />
}

export function Textarea({ className, ...props }: ComponentProps<typeof BaseTextarea>) {
  return <BaseTextarea {...props} className={cn(className, "workspace-editor-input")} />
}
