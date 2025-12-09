import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"

export function LiquidGlassMenubar({ embedded, previewMode, currentTime }: MenubarStyleProps) {
    return (
        <div className={embedded ? "absolute top-0 left-0 right-0 z-50" : "fixed top-0 left-0 right-0 z-50"}>
            <div className="liquidGlass-wrapper menubar h-12 flex items-center justify-between px-4 text-lg font-medium transition-none">
                <div className="liquidGlass-effect"></div>
                <div className="liquidGlass-tint"></div>
                <div className="liquidGlass-shine"></div>
                <div className="liquidGlass-content w-full flex items-center justify-between" style={{ color: "var(--cute-text)" }}>
                    <div className="flex items-center gap-4">
                        <div className="font-bold flex items-center">
                            <Image src={HalloGif} alt="Logo" className="h-7 w-8 mr-2" />
                            <p>Ahmad kanaan</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <SoundSettings previewMode={previewMode} embedded={embedded} />
                        <ModeToggle previewMode={previewMode} embedded={embedded} />
                        <span>{format(currentTime, "EEE d MMM h:mm a")}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
