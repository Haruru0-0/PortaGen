import { type ButtonHTMLAttributes, forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent"
  /** Render the child (for example a Next.js Link) with the button styles instead of a nested <button>. */
  asChild?: boolean
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = "primary", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const variantStyles = {
      primary: "bg-primary text-primary-foreground border-primary",
      secondary: "bg-secondary text-secondary-foreground border-secondary",
      accent: "bg-accent text-accent-foreground border-accent",
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "dashboard-pixel-button inline-block min-h-10 text-center px-6 py-3 text-xs uppercase tracking-wider font-bold",
          "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)

PixelButton.displayName = "PixelButton"
