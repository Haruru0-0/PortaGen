import { ArrowRight, X } from "lucide-react"
import type { LockScreenStyleProps } from "./types"

export function ModernWindowLockScreen({
  time, date, preview, showLogin, inputPassword, onInputChange, onSubmit, onCancel, onClickSound, hint,
  timeRef, dateRef, hintRef, overlayRef, cardRef, xButtonRef, inputRef,
}: LockScreenStyleProps) {
  return (
    <>
      {!showLogin && (
        <div className="relative z-10 flex flex-col items-center text-center px-4 select-none">
          <h1 ref={timeRef} className={`font-semibold tracking-tight text-white mb-1 ${preview ? "text-4xl" : "text-6xl md:text-8xl"}`}>
            {time}
          </h1>
          <p ref={dateRef} className={`font-medium text-white/80 mb-6 ${preview ? "text-xs" : "text-lg md:text-xl"}`}>
            {date}
          </p>
          <p ref={hintRef} className={`rounded-full bg-black/40 px-4 py-1.5 text-white/80 backdrop-blur-xl border border-white/10 ${preview ? "text-[9px]" : "text-xs"}`}>
            Click to unlock
          </p>
        </div>
      )}

      {showLogin && (
        <div ref={overlayRef} className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
          <div ref={cardRef} className="w-72 rounded-xl border border-white/10 bg-black/60 p-6 text-white shadow-2xl backdrop-blur-xl" style={{ opacity: 0 }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-lg font-semibold">ME</div>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="password"
                  value={inputPassword}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/30"
                  autoFocus
                />
                <button
                  type="submit"
                  onClick={onClickSound}
                  aria-label="Unlock"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 hover:bg-white/25"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {hint && <p className="text-center text-xs text-white/60">{hint}</p>}
            </form>
          </div>
          <button
            ref={xButtonRef}
            onClick={onCancel}
            aria-label="Cancel"
            className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xl hover:bg-black/60"
            style={{ opacity: 0 }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
