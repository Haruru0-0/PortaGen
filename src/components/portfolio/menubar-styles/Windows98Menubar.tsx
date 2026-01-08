import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"

export function Windows98Menubar({ embedded, previewMode, currentTime, menubarIcon, menubarText }: MenubarStyleProps) {
    return (
        <div className={embedded ? "absolute top-0 left-0 right-0 z-50" : "fixed top-0 left-0 right-0 z-50"}>
            <div className="h-8 bg-[#c0c0c0] border-b-2 border-white shadow-[0_1px_0_#808080] flex items-center justify-between px-2 font-ms-sans select-none text-black">
                <div className="flex items-center gap-4">
                    <div className="font-bold flex items-center">
                        <div className="relative h-6 w-7 mr-2">
                            <Image
                                src={menubarIcon || HalloGif}
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-sm">{menubarText || "Ahmad kanaan"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <SoundSettings previewMode={previewMode} embedded={embedded} />
                    <ModeToggle previewMode={previewMode} embedded={embedded} />
                    <div className="px-2 py-0.5 border-2 border-l-[#808080] border-t-[#808080] border-r-white border-b-white inset shadow-inner bg-white">
                        <span className="text-xs">{format(currentTime, "h:mm a")}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
