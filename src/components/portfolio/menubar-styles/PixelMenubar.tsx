import { format } from "date-fns"
import { ModeToggle } from "../mode-toggle"
import { SoundSettings } from "../sound-settings"
import HalloGif from "@/assets/hallo.gif"
import Image from "next/image"
import { MenubarStyleProps } from "./types"
import { useThemeStore } from "@/lib/stores/theme-store"

export function PixelMenubar({ embedded, previewMode, currentTime, menubarIcon, menubarText }: MenubarStyleProps) {
    const { colors } = useThemeStore()

    return (
        <div
            className={`${embedded ? "absolute" : "fixed"} top-2 left-2 right-2 z-50 h-12 border-4 px-4 py-2 flex items-center justify-between font-pixel`}
            style={{
                backgroundColor: colors.background,
                borderColor: colors.accent,
                color: colors.text
            }}
        >
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
                    <p className="text-sm tracking-wider">{menubarText || "Ahmad kanaan"}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <SoundSettings previewMode={previewMode} embedded={embedded} />
                <ModeToggle previewMode={previewMode} embedded={embedded} />
                <span className="text-sm">{format(currentTime, "HH:mm")}</span>
            </div>
        </div>
    )
}
