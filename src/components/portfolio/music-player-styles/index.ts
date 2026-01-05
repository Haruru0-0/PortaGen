import React from "react"
import { MusicPlayerStyleProps } from "./types"
import { DefaultMusicPlayer } from "./DefaultMusicPlayer"
import { LiquidGlassMusicPlayer } from "./LiquidGlassMusicPlayer"
import { Windows98MusicPlayer } from "./Windows98MusicPlayer"
import { WindowsXPMusicPlayer } from "./WindowsXPMusicPlayer"
import { Windows7MusicPlayer } from "./Windows7MusicPlayer"
import { PixelMusicPlayer } from "./PixelMusicPlayer"
import { ModernWindowMusicPlayer } from "./ModernWindowMusicPlayer"

// Map specific style IDs to components
export const MUSIC_PLAYER_COMPONENTS: Record<string, React.ComponentType<MusicPlayerStyleProps>> = {
    "default": DefaultMusicPlayer,
    "liquid-glass": LiquidGlassMusicPlayer,
    "windows-98": Windows98MusicPlayer,
    "windows-xp": WindowsXPMusicPlayer,
    "windows-7": Windows7MusicPlayer,
    "pixel": PixelMusicPlayer,
    "modern-window": ModernWindowMusicPlayer,
}

export function getMusicPlayerComponent(styleId: string) {
    return MUSIC_PLAYER_COMPONENTS[styleId] || DefaultMusicPlayer
}

export function getMusicPlayerJSX(styleId: string, props: MusicPlayerStyleProps): React.JSX.Element {
    const Component = getMusicPlayerComponent(styleId)
    return React.createElement(Component, props)
}