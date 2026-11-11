import { ArrowRight } from "lucide-react"
import type { LockScreenStyleProps } from "./types"

export function WindowsXPLockScreen({
  time, date, preview, showLogin, inputPassword, onInputChange, onSubmit, onCancel, onClickSound, hint,
  timeRef, dateRef, hintRef, overlayRef, cardRef, xButtonRef, inputRef,
}: LockScreenStyleProps) {
  return (
    <>
      {!showLogin && (
        <div className="relative z-10 flex flex-col items-center text-center px-4 select-none">
          <h1
            ref={timeRef}
            className={`font-bold text-white mb-1 ${preview ? "text-3xl" : "text-5xl md:text-6xl"}`}
            style={{ textShadow: "2px 2px 3px rgba(0,0,0,0.6)" }}
          >
            {time}
          </h1>
          <p ref={dateRef} className={`text-white mb-4 ${preview ? "text-xs" : "text-lg"}`} style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}>
            {date}
          </p>
          <p
            ref={hintRef}
            className={`rounded-full px-4 py-1 text-white font-bold border border-white/60 ${preview ? "text-[9px]" : "text-xs"}`}
            style={{ background: "linear-gradient(to bottom,#5ab946,#2f8f23)", textShadow: "1px 1px 1px rgba(0,0,0,0.4)" }}
          >
            Click to begin
          </p>
        </div>
      )}

      {showLogin && (
        <div ref={overlayRef} className="absolute inset-0 flex items-center justify-center bg-[#003399]/55" onClick={(e) => e.stopPropagation()}>
          <div
            ref={cardRef}
            className="w-72 overflow-hidden rounded-t-lg border-2 border-[#0831d9] shadow-[3px_3px_8px_rgba(0,0,0,0.5)]"
            style={{ opacity: 0 }}
          >
            <div
              className="flex items-center justify-between px-2 py-1 text-white"
              style={{ background: "linear-gradient(to bottom,#3168d5 2%,#4993e6 8%,#245dd7 17%,#2257d5 30%,#2663e0 89%,#1941a5 98%)" }}
            >
              <span className="text-sm font-bold" style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>Log On to PortaGen</span>
              <button
                ref={xButtonRef}
                onClick={onCancel}
                aria-label="Cancel"
                className="h-5 w-5 rounded-[3px] border border-white text-xs font-bold leading-none text-white"
                style={{ opacity: 0, background: "linear-gradient(to bottom,#e8957c,#c4401b)" }}
              >
                ×
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-3 bg-[#ece9d8] p-4 text-black">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 rounded-md border-2 border-white bg-gradient-to-b from-[#f7c34a] to-[#e48a12] shadow flex items-center justify-center text-xl font-bold text-white">
                  ME
                </div>
                <p className="text-sm font-bold">Type your password</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="password"
                  value={inputPassword}
                  onChange={(e) => onInputChange(e.target.value)}
                  placeholder="Password"
                  className="flex-1 min-w-0 rounded-sm border border-[#7f9db9] bg-white px-2 py-1 text-sm outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  onClick={onClickSound}
                  aria-label="Unlock"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white text-white shadow"
                  style={{ background: "linear-gradient(to bottom,#5ab946,#2f8f23)" }}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {hint && <p className="text-xs text-[#333]">{hint}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
