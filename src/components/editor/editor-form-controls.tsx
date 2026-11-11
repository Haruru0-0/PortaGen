"use client"

import { Button as BaseButton } from "@/components/ui/button"
import { Input as BaseInput } from "@/components/ui/input"
import { Textarea as BaseTextarea } from "@/components/ui/textarea"
import { WorkspaceControlFrame } from "@/components/workspace/workspace-frame"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

export function Button({ className, ...props }: ComponentProps<typeof BaseButton>) {
  return <BaseButton {...props} data-persona-variant={props.variant ?? "default"} className={cn(className, "workspace-editor-button ws-action", props.variant === "destructive" ? "ws-action--destructive" : props.variant && props.variant !== "default" ? "ws-action--secondary" : "ws-action--primary")} />
}

export function Input({ className, ...props }: ComponentProps<typeof BaseInput>) {
  if (["range", "color", "checkbox", "file", "hidden", "radio"].includes(props.type ?? "")) {
    return <BaseInput {...props} className={cn(className, "workspace-editor-input")} />
  }

  return (
    <WorkspaceControlFrame
      className={cn("ws-control-frame", className)}
      data-disabled={props.disabled || undefined}
      data-invalid={props["aria-invalid"]}
    >
      <BaseInput {...props} className={cn(className, "workspace-editor-input ws-native-control w-full")} />
    </WorkspaceControlFrame>
  )
}

export function Textarea({ className, ...props }: ComponentProps<typeof BaseTextarea>) {
  return (
    <WorkspaceControlFrame
      className={cn("ws-control-frame", className)}
      data-disabled={props.disabled || undefined}
      data-invalid={props["aria-invalid"]}
    >
      <BaseTextarea {...props} className={cn(className, "workspace-editor-input ws-native-control w-full")} />
    </WorkspaceControlFrame>
  )
}
