import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(({ className, label, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && <label className="block text-xs uppercase tracking-wider">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 text-xs bg-input border-4 border-border",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
    </div>
  )
})

PixelInput.displayName = "PixelInput"
