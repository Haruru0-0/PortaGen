import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"

export function PixelMenubar({ embedded, previewMode, currentTime }: MenubarStyleProps) {
    return (
        <div className={embedded ? "absolute top-2 left-2 right-2 z-50" : "fixed top-2 left-2 right-2 z-50"}>
            <div className="bg-[#0f380f] border-4 border-[#8bac0f] px-4 py-2 flex items-center justify-between text-[#9bbc0f] font-pixel">
                <div className="flex items-center gap-4">
                    <div className="font-bold flex items-center">
                        <Image src={HalloGif} alt="Logo" className="h-6 w-7 mr-2" />
                        <p className="text-sm tracking-wider">Ahmad kanaan</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <SoundSettings previewMode={previewMode} embedded={embedded} />
                    <ModeToggle previewMode={previewMode} embedded={embedded} />
                    <span className="text-sm">{format(currentTime, "HH:mm")}</span>
                </div>
            </div>
        </div>
    )
}
