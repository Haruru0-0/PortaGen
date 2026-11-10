import type { ReactNode } from "react"

// Forms stay stable while editing. The containing tab owns its single 160ms entrance.
// Presentation props remain accepted so the original form layout/state stays intact.
export function AnimatedSection({ children, className }: {
  children: ReactNode
  className?: string
  variant?: string
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  staggerChildren?: number
  priority?: boolean
}) {
  return <div className={className}>{children}</div>
}

export const AnimatedItem = AnimatedSection
