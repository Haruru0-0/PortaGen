import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"

export function Windows7Menubar({ embedded, previewMode, currentTime }: MenubarStyleProps) {
    return (
        <div className={embedded ? "absolute top-0 left-0 right-0 z-50" : "fixed top-0 left-0 right-0 z-50"}>
            <div
                className="h-8 flex items-center justify-between px-4 backdrop-blur-md text-white text-sm"
                style={{
                    background: "linear-gradient(to bottom, rgba(80,120,180,0.75) 0%, rgba(40,70,130,0.85) 50%, rgba(20,45,100,0.9) 100%)",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)"
                }}
            >
                <div className="flex items-center gap-4">
                    <div className="font-semibold flex items-center">
                        <Image src={HalloGif} alt="Logo" className="h-5 w-6 mr-2" />
                        <span className="drop-shadow-sm">Ahmad kanaan</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <SoundSettings previewMode={previewMode} embedded={embedded} />
                    <ModeToggle previewMode={previewMode} embedded={embedded} />
                    <div className="text-xs opacity-90">
                        <span>{format(currentTime, "EEE d MMM h:mm a")}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
