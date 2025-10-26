import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent"
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const variantStyles = {
      primary: "bg-primary text-primary-foreground border-primary",
      secondary: "bg-secondary text-secondary-foreground border-secondary",
      accent: "bg-accent text-accent-foreground border-accent",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "pixel-button px-6 py-3 text-xs uppercase tracking-wider font-bold",
          "hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

PixelButton.displayName = "PixelButton"
