"use client"
import { SoundSettings } from "./sound-settings"
import { ModeToggle } from "./mode-toggle"
import { useThemeStore } from "@/lib/stores/theme-store"

// Style configurations for each theme
const STYLE_CONFIGS = {
    "liquid-glass": {
        wrapper: "liquidGlass-wrapper rounded-2xl",
        hasGlassLayers: true
    },
    "windows-98": {
        wrapper: "bg-[#c0c0c0] border-2 border-l-white border-t-white border-r-black border-b-black shadow-md rounded-sm",
        hasGlassLayers: false
    },
    "windows-xp": {
        wrapper: "border border-[#1a3a8a] shadow-lg rounded-sm bg-gradient-to-b from-[#3168d5] to-[#2252b7]",
        hasGlassLayers: false
    },
    "windows-7": {
        wrapper: "backdrop-blur-md border border-white/20 rounded-lg shadow-xl bg-gradient-to-b from-[rgba(80,120,180,0.9)] to-[rgba(40,70,130,0.95)]",
        hasGlassLayers: false
    },
    "pixel": {
        wrapper: "bg-[#0f380f] border-4 border-[#8bac0f] rounded-none",
        hasGlassLayers: false
    },
    "window": {
        wrapper: "bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl",
        hasGlassLayers: false
    }
};

function getStyleConfig(styleId: string) {
    return STYLE_CONFIGS[styleId as keyof typeof STYLE_CONFIGS] || STYLE_CONFIGS["liquid-glass"];
}

export function MobileSettingsBar({ previewMode, embedded = false }: { previewMode?: "desktop" | "mobile"; embedded?: boolean }) {
    const menubarStyleId = useThemeStore((state) => (state as any).menubarStyleId);
    const { colors } = useThemeStore();
    const styleConfig = getStyleConfig(menubarStyleId || "liquid-glass");

    return (
        <div className="flex items-center justify-center h-full">
            <div
                className={menubarStyleId === "pixel" ? "border-4 rounded-none" : styleConfig.wrapper}
                style={menubarStyleId === "pixel" ? {
                    backgroundColor: colors.background,
                    borderColor: colors.accent
                } : {}}
            >
                {styleConfig.hasGlassLayers && (
                    <>
                        <div className="liquidGlass-effect"></div>
                        <div className="liquidGlass-tint"></div>
                        <div className="liquidGlass-shine"></div>
                    </>
                )}
                <div className="liquidGlass-content relative z-10">
                    <div
                        className="flex items-center gap-3 p-4"
                        style={menubarStyleId === "pixel" ? { color: colors.text } : {}}
                    >
                        <SoundSettings previewMode={previewMode} embedded={embedded} />
                        <div
                            className={`w-px h-8 ${menubarStyleId === "pixel" ? "" : menubarStyleId === "windows-98" ? "bg-black/20" : "bg-white/30"}`}
                            style={menubarStyleId === "pixel" ? {
                                backgroundColor: colors.accent,
                                width: "4px"
                            } : {}}
                        /> {/* Divider */}
                        <ModeToggle previewMode={previewMode} embedded={embedded} />
                    </div>
                </div>
            </div>
        </div>
    )
}
