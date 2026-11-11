import { ArrowRight } from "lucide-react"
import type { LockScreenStyleProps } from "./types"

export function Windows7LockScreen({
  time, date, preview, showLogin, inputPassword, onInputChange, onSubmit, onCancel, onClickSound, hint,
  timeRef, dateRef, hintRef, overlayRef, cardRef, xButtonRef, inputRef,
}: LockScreenStyleProps) {
  return (
    <>
      {!showLogin && (
        <div className="relative z-10 flex flex-col items-center text-center px-4 select-none">
          <h1
            ref={timeRef}
            className={`font-light text-white mb-1 ${preview ? "text-4xl" : "text-6xl md:text-7xl"}`}
            style={{ textShadow: "0 2px 8px rgba(0,40,100,0.7)" }}
          >
            {time}
          </h1>
          <p ref={dateRef} className={`text-white/90 mb-4 ${preview ? "text-xs" : "text-lg"}`} style={{ textShadow: "0 1px 4px rgba(0,40,100,0.7)" }}>
            {date}
          </p>
          <p ref={hintRef} className={`text-white/80 ${preview ? "text-[9px]" : "text-xs"}`} style={{ textShadow: "0 1px 3px rgba(0,40,100,0.7)" }}>
            Click anywhere to sign in
          </p>
        </div>
      )}

      {showLogin && (
        <div ref={overlayRef} className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a3c78]/30 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div
            ref={cardRef}
            className="w-72 rounded-lg border border-white/50 bg-white/20 p-5 text-white shadow-[0_8px_30px_rgba(0,30,80,0.5),inset_0_1px_rgba(255,255,255,0.6)] backdrop-blur-md"
            style={{ opacity: 0 }}
          >
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-md border-2 border-white/70 bg-gradient-to-b from-[#7fb8f5] to-[#2a6fc4] text-2xl font-semibold shadow-[inset_0_1px_rgba(255,255,255,0.7)]">
              ME
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="password"
                  value={inputPassword}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Password"
                  className="flex-1 min-w-0 rounded-sm border border-[#4b7bb3] bg-white px-2 py-1.5 text-sm text-black outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  onClick={onClickSound}
                  aria-label="Unlock"
                  className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/70 text-white shadow-[inset_0_1px_rgba(255,255,255,0.5)]"
                  style={{ background: "linear-gradient(to bottom,#5aa0e8,#1c5fb8)" }}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {hint && <p className="text-center text-xs text-white/90">{hint}</p>}
            </form>
          </div>
          <button
            ref={xButtonRef}
            onClick={onCancel}
            className="mt-4 rounded-sm border border-white/60 bg-white/20 px-4 py-1 text-sm text-white backdrop-blur-md hover:bg-white/30"
            style={{ opacity: 0 }}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  )
}
