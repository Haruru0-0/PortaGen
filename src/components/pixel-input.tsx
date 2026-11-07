import { type InputHTMLAttributes, forwardRef, useId } from "react"
import { cn } from "@/lib/utils"

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const PixelInput = forwardRef<HTMLInputElement, PixelInputProps>(({ className, label, id, ...props }, ref) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-xs uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          "w-full px-4 py-3 text-xs bg-input border-4 border-border",
          "focus:outline-none focus:ring-2 focus:ring-ring aria-[invalid=true]:border-red-700",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted",
          "placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
    </div>
  )
})

PixelInput.displayName = "PixelInput"
