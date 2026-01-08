import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"

export function Windows7Menubar({ embedded, previewMode, currentTime, menubarIcon, menubarText }: MenubarStyleProps) {
    return (
        <div className={embedded ? "absolute top-0 left-0 right-0 z-50" : "fixed top-0 left-0 right-0 z-50"}>
            <div
                className="h-8 flex items-center justify-between px-4 backdrop-blur-md text-white text-sm"
                style={{
                    backgroundImage: "linear-gradient(90deg,rgba(0,0,0,.1333333333) 50px,transparent 80px),linear-gradient(270deg,rgba(0,0,0,.1333333333) 200px,transparent 230px)",
                    backgroundColor: "rgba(170,209,251,0.65)",
                    backdropFilter: "blur(4px)",
                }}
            >
                <div className="flex items-center gap-4">
                    <div className="font-semibold flex items-center">
                        <div className="relative h-5 w-6 mr-2">
                            <Image
                                src={menubarIcon || HalloGif}
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="drop-shadow-sm">{menubarText || "Ahmad kanaan"}</span>
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
