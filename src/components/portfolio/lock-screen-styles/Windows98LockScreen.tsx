import type { LockScreenStyleProps } from "./types"

const raised = "border-2 border-l-white border-t-white border-r-black border-b-black"
const sunken = "border-2 border-l-[#808080] border-t-[#808080] border-r-white border-b-white"

export function Windows98LockScreen({
  time, date, preview, showLogin, inputPassword, onInputChange, onSubmit, onCancel, onClickSound, hint,
  timeRef, dateRef, hintRef, overlayRef, cardRef, xButtonRef, inputRef,
}: LockScreenStyleProps) {
  return (
    <>
      {!showLogin && (
        <div className="relative z-10 flex flex-col items-center text-center px-4 font-ms-sans select-none">
          <h1
            ref={timeRef}
            className={`font-bold text-white mb-1 ${preview ? "text-3xl" : "text-5xl md:text-6xl"}`}
            style={{ textShadow: "2px 2px 0 #000080" }}
          >
            {time}
          </h1>
          <p ref={dateRef} className={`text-white mb-4 ${preview ? "text-xs" : "text-lg"}`} style={{ textShadow: "1px 1px 0 #000" }}>
            {date}
          </p>
          <p ref={hintRef} className={`bg-[#c0c0c0] text-black px-3 py-1 ${raised} ${preview ? "text-[9px]" : "text-xs"}`}>
            Click anywhere to log on
          </p>
        </div>
      )}

      {showLogin && (
        <div ref={overlayRef} className="absolute inset-0 flex items-center justify-center bg-[#008080]/60" onClick={(e) => e.stopPropagation()}>
          <div ref={cardRef} className={`w-72 bg-[#c0c0c0] font-ms-sans text-black ${raised} shadow-[2px_2px_0_#000]`} style={{ opacity: 0 }}>
            <div className="flex items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] px-1 py-0.5 text-white">
              <span className="text-sm font-bold">Welcome to PortaGen</span>
              <button
                ref={xButtonRef}
                onClick={onCancel}
                aria-label="Cancel"
                className={`h-4 w-4 bg-[#c0c0c0] text-black text-[10px] leading-none font-bold ${raised} active:border-l-black active:border-t-black active:border-r-white active:border-b-white`}
                style={{ opacity: 0 }}
              >
                ×
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-3 space-y-3">
              <p className="text-sm">Type a password to log on.</p>
              <label className="flex items-center gap-2 text-sm">
                <span className="w-20">Password:</span>
                <input
                  ref={inputRef}
                  type="password"
                  value={inputPassword}
                  onChange={(e) => onInputChange(e.target.value)}
                  className={`flex-1 min-w-0 bg-white px-1 py-0.5 text-sm outline-none ${sunken}`}
                  autoFocus
                />
              </label>
              {hint && <p className="text-xs">{hint}</p>}
              <div className="flex justify-end gap-2">
                <button type="submit" onClick={onClickSound} className={`min-w-[72px] bg-[#c0c0c0] px-3 py-0.5 text-sm ${raised} active:border-l-black active:border-t-black active:border-r-white active:border-b-white`}>
                  OK
                </button>
                <button type="button" onClick={onCancel} className={`min-w-[72px] bg-[#c0c0c0] px-3 py-0.5 text-sm ${raised} active:border-l-black active:border-t-black active:border-r-white active:border-b-white`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
