import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"

export function WindowsXPMenubar({ embedded, previewMode, currentTime, menubarIcon, menubarText }: MenubarStyleProps) {
    return (
        <div
            className={embedded ? "absolute top-0 left-0 right-0 z-50 flex justify-between items-center pl-2 h-[30px]" : "fixed top-0 left-0 right-0 z-50 flex justify-between items-center pl-2 h-[30px]"}
            style={{
                background: "linear-gradient(to bottom,#3168d5 2%,#4993e6 8%,#245dd7 17%,#2257d5 30%,#2663e0 89%,#1941a5 98%)",
            }}
        >
            <div className="flex items-center gap-4">
                <div className="font-bold flex items-center">
                    <div className="relative h-5 w-6 mr-2">
                        <Image
                            src={menubarIcon || HalloGif}
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }} className="text-white text-xs">{menubarText || "Ahmad kanaan"}</span>
                </div>
            </div>
            <div
                className="flex items-center gap-1 h-[30px] pr-2"
                style={{
                    background: "linear-gradient(to bottom,#095bc9 2%,#19b8f3 8%,#1290e8 17%,#1290e9 30%,#0f9eef 89%,#095bc9 98%),linear-gradient(to left,#0f83e0ff 0,#0f83e000 15%)",
                    boxShadow: "inset 2px 0 0 #00c5ff88,-1px 0 0 #0b3051",
                }}
            >
                <SoundSettings previewMode={previewMode} embedded={embedded} />
                <ModeToggle previewMode={previewMode} embedded={embedded} />
                <span style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }} className="text-white text-xs">
                    {format(currentTime, "EEE d MMM h:mm a")}
                </span>
            </div>
        </div>
    )
}
