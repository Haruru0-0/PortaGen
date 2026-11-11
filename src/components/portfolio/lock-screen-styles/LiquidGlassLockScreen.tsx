import { ArrowRight, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { LockScreenStyleProps } from "./types"

export function LiquidGlassLockScreen({
  time, date, preview, showLogin, inputPassword, onInputChange, onSubmit, onCancel, onClickSound, hint,
  timeRef, dateRef, hintRef, overlayRef, cardRef, xButtonRef, inputRef,
}: LockScreenStyleProps) {
  return (
    <>
      {!showLogin && (
        <div className="flex flex-col items-center justify-center relative z-10 w-full px-4 text-center">
          <h1
            ref={timeRef}
            className={cn(
              "font-bold mb-2 tracking-tight transition-all duration-300",
              preview ? "text-3xl sm:text-4xl md:text-5xl" : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            )}
            style={{ color: "var(--theme-text)" }}
          >
            {time}
          </h1>
          <p
            ref={dateRef}
            className={cn(
              "font-medium transition-all duration-300 opacity-90",
              preview ? "text-xs mb-4" : "text-sm sm:text-lg md:text-xl mb-8 sm:mb-12"
            )}
            style={{ color: "var(--theme-text)" }}
          >
            {date}
          </p>
          <p
            ref={hintRef}
            className={cn(
              "uppercase tracking-widest animate-pulse font-bold opacity-80",
              preview ? "text-[8px]" : "text-[10px] sm:text-xs"
            )}
            style={{ color: "var(--theme-primary)" }}
          >
            CLICK ANYWHERE TO UNLOCK
          </p>
        </div>
      )}

      {showLogin && (
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div ref={cardRef} className="liquidGlass-wrapper lockscreen-card w-64" style={{ opacity: 0 }}>
            <div className="liquidGlass-effect" />
            <div className="liquidGlass-tint" />
            <div className="liquidGlass-shine" />
            <div className="liquidGlass-content w-full flex flex-col items-center">
              <Avatar className="w-20 h-20 mb-4 border-4" style={{ borderColor: "var(--theme-primary)", opacity: 0.5 }}>
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
                <AvatarFallback className="text-xl" style={{ backgroundColor: "var(--theme-secondary)", color: "var(--theme-text)" }}>
                  ME
                </AvatarFallback>
              </Avatar>

              <form onSubmit={onSubmit} className="w-full flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    type="password"
                    placeholder="Enter password"
                    value={inputPassword}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="pr-12 bg-white/30 rounded-xl"
                    style={{ borderColor: "var(--theme-primary)", color: "var(--theme-text)" }}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-white rounded-lg transition-colors"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                    onClick={onClickSound}
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">Unlock</span>
                  </Button>
                </div>
                {hint && (
                  <p className="text-xs text-center opacity-80" style={{ color: "var(--theme-text)" }}>
                    {hint}
                  </p>
                )}
              </form>
            </div>
          </div>

          <button
            ref={xButtonRef}
            className="liquidGlass-wrapper lockscreen-cancel mt-4 cursor-pointer p-0"
            style={{ opacity: 0 }}
            onClick={onCancel}
          >
            <div className="liquidGlass-effect" />
            <div className="liquidGlass-tint" />
            <div className="liquidGlass-shine" />
            <div className="liquidGlass-content">
              <X className="h-5 w-5 text-white" />
              <span className="sr-only">Cancel</span>
            </div>
          </button>
        </div>
      )}
    </>
  )
}
