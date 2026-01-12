import { type HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

type PixelCardProps = HTMLAttributes<HTMLDivElement>

export const PixelCard = forwardRef<HTMLDivElement, PixelCardProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("dashboard-pixel-card p-4 sm:p-6", className)} {...props}>
      {children}
    </div>
  )
})

PixelCard.displayName = "PixelCard"
