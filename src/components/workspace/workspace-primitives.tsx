"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
export interface WorkspaceActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "destructive";
    asChild?: boolean;
}
export const WorkspaceAction = React.forwardRef<HTMLButtonElement, WorkspaceActionProps>(({ className, variant = "primary", asChild = false, children, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return <Component ref={ref} className={cn("ws-action", `ws-action--${variant}`, className)} data-variant={variant} {...props}>{children}</Component>;
});
WorkspaceAction.displayName = "WorkspaceAction";
export const WorkspacePanel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn("ws-panel", className)} {...props}/>);
WorkspacePanel.displayName = "WorkspacePanel";
export function WorkspaceHeading({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h1 className={cn("ws-heading", className)} {...props}/>;
}
export interface WorkspaceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}
export const WorkspaceInput = React.forwardRef<HTMLInputElement, WorkspaceInputProps>(({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return <div className="ws-field">
      {label && <label htmlFor={inputId} className="ws-label">{label}</label>}
      <input ref={ref} id={inputId} className={cn("ws-input", className)} {...props}/>
    </div>;
});
WorkspaceInput.displayName = "WorkspaceInput";
export const WorkspaceField = WorkspaceInput;
export const WorkspacePasswordInput = React.forwardRef<HTMLInputElement, WorkspaceInputProps>(({ className, label, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = React.useState(false);
    return <div className="ws-field">
      {label && <label htmlFor={inputId} className="ws-label">{label}</label>}
      <div className="relative">
        <input {...props} ref={ref} id={inputId} disabled={disabled} type={visible ? "text" : "password"} className={cn("ws-input pr-14", className)}/>
        <button type="button" className="ws-password-toggle absolute right-0 top-0 flex h-full min-h-11 min-w-11 items-center justify-center" disabled={disabled} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} aria-controls={inputId} onClick={() => setVisible((value) => !value)}>
          {visible ? <EyeOff className="size-5" aria-hidden="true"/> : <Eye className="size-5" aria-hidden="true"/>}
        </button>
      </div>
    </div>;
});
WorkspacePasswordInput.displayName = "WorkspacePasswordInput";
export interface WorkspaceTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}
export const WorkspaceTextarea = React.forwardRef<HTMLTextAreaElement, WorkspaceTextareaProps>(({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    return <div className="ws-field">
      {label && <label htmlFor={textareaId} className="ws-label">{label}</label>}
      <textarea ref={ref} id={textareaId} className={cn("ws-input min-h-28 resize-y", className)} {...props}/>
    </div>;
});
WorkspaceTextarea.displayName = "WorkspaceTextarea";
