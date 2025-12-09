import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"

export function WindowMenubar({ embedded, previewMode, currentTime }: MenubarStyleProps) {
    return (
        <div className={embedded ? "absolute top-0 left-0 right-0 z-50" : "fixed top-0 left-0 right-0 z-50"}>
            <div className="h-10 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 text-sm font-medium text-white/90">
                <div className="flex items-center gap-4">
                    <div className="font-bold flex items-center">
                        <Image src={HalloGif} alt="Logo" className="h-6 w-7 mr-2" />
                        <p>Ahmad kanaan</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <SoundSettings previewMode={previewMode} embedded={embedded} />
                    <ModeToggle previewMode={previewMode} embedded={embedded} />
                    <span className="font-mono opacity-80">{format(currentTime, "EEE MMM d h:mm a")}</span>
                </div>
            </div>
        </div>
    )
}
