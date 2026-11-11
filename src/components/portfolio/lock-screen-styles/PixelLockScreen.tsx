import type { LockScreenStyleProps } from "./types"

export function PixelLockScreen({
  time, date, preview, showLogin, inputPassword, onInputChange, onSubmit, onCancel, onClickSound, hint, colors,
  timeRef, dateRef, hintRef, overlayRef, cardRef, xButtonRef, inputRef,
}: LockScreenStyleProps) {
  const frame = { backgroundColor: colors.background, borderColor: colors.accent, color: colors.text }

  return (
    <>
      {!showLogin && (
        <div className="relative z-10 flex flex-col items-center text-center px-4 font-pixel select-none">
          <h1
            ref={timeRef}
            className={`mb-3 border-4 px-4 py-2 tracking-wider ${preview ? "text-2xl" : "text-4xl md:text-5xl"}`}
            style={frame}
          >
            {time}
          </h1>
          <p ref={dateRef} className={`mb-4 border-4 px-3 py-1 ${preview ? "text-[9px]" : "text-sm"}`} style={frame}>
            {date}
          </p>
          <p ref={hintRef} className={`animate-pulse uppercase tracking-widest ${preview ? "text-[8px]" : "text-xs"}`} style={{ color: colors.accent, textShadow: "2px 2px 0 #000" }}>
            ▶ PRESS ANY KEY / CLICK
          </p>
        </div>
      )}

      {showLogin && (
        <div ref={overlayRef} className="absolute inset-0 flex items-center justify-center bg-black/50" onClick={(e) => e.stopPropagation()}>
          <div ref={cardRef} className="w-72 border-4 p-4 font-pixel shadow-[6px_6px_0_rgba(0,0,0,0.6)]" style={{ ...frame, opacity: 0 }}>
            <div className="mb-3 flex items-center justify-between border-b-4 pb-2" style={{ borderColor: colors.accent }}>
              <span className="text-xs tracking-wider">PLAYER LOGIN</span>
              <button
                ref={xButtonRef}
                onClick={onCancel}
                aria-label="Cancel"
                className="h-6 w-6 border-4 text-xs leading-none"
                style={{ borderColor: colors.accent, opacity: 0 }}
              >
                X
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                ref={inputRef}
                type="password"
                value={inputPassword}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="PASSWORD"
                className="w-full border-4 bg-transparent px-2 py-1 text-xs outline-none placeholder:opacity-50"
                style={{ borderColor: colors.accent }}
                autoFocus
              />
              {hint && <p className="text-[10px] leading-relaxed">{hint}</p>}
              <button
                type="submit"
                onClick={onClickSound}
                className="w-full border-4 px-2 py-1 text-xs tracking-widest active:translate-x-[2px] active:translate-y-[2px]"
                style={{ borderColor: colors.accent, backgroundColor: colors.primary, color: "#fff" }}
              >
                START
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
