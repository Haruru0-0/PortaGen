import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"

export function WindowsXPMenubar({ embedded, previewMode, currentTime }: MenubarStyleProps) {
    return (
        <div className={embedded ? "absolute top-0 left-0 right-0 z-50" : "fixed top-0 left-0 right-0 z-50"}>
            <div
                className="h-8 flex items-center justify-between px-3 text-white text-sm"
                style={{
                    background: "linear-gradient(to bottom, #3168d5 0%, #4285f4 3%, #2a5dc8 5%, #2252b7 50%, #1941a5 51%, #1941a5 100%)",
                    borderBottom: "1px solid #1a3a8a"
                }}
            >
                <div className="flex items-center gap-4">
                    <div className="font-bold flex items-center">
                        <Image src={HalloGif} alt="Logo" className="h-5 w-6 mr-2" />
                        <span style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>Ahmad kanaan</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <SoundSettings previewMode={previewMode} embedded={embedded} />
                    <ModeToggle previewMode={previewMode} embedded={embedded} />
                    <span style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>
                        {format(currentTime, "EEE d MMM h:mm a")}
                    </span>
                </div>
            </div>
        </div>
    )
}
