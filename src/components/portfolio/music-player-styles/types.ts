import React from "react"
import { Track } from "@/lib/types"

export interface SpotifyTrack {
    id: string
    name: string
    album?: {
        images?: { url: string }[]
    }
    artists?: {
        name: string
    }[]
    duration_ms?: number
}

export interface SpotifyPlaylistTrack {
    track: SpotifyTrack
}

export interface MusicPlayerStyleProps {
    embedded?: boolean
    playerRef: React.RefObject<HTMLDivElement | null>
    buttonsRef: React.MutableRefObject<HTMLButtonElement[]>
    handleExpandClick: () => void
    handleButtonClick: (index: number) => void
    handleButtonHover: (index: number) => void
    handleButtonLeave: (index: number) => void
    isLoading: boolean
    albumCoverRef: React.RefObject<HTMLDivElement | null>
    useSpotify: boolean
    spotifyCurrentTrack: SpotifyTrack | null
    currentTrack: Track
    showPlaylist?: boolean
    setShowPlaylist?: (show: boolean) => void
    handlePlaylistToggle?: () => void
    handleDesktopClose?: () => void
    progress?: number
    handleSeek?: (value: number[]) => void
    formatTime?: (progress: number) => string
    spDurationMs?: number
    isPlaying?: boolean
    onPlayPause?: () => void
    onNext?: () => void
    onPrevious?: () => void
    volume?: number
    setVolume?: (volume: number) => void
    spotifyPlayerRef?: React.MutableRefObject<unknown>
    playClickSound?: () => void
    playlistRef?: React.RefObject<HTMLDivElement | null>
    spotifyPlaylistTracks?: SpotifyTrack[]
    playlist?: Track[]
    changeTrack?: (track: Track) => void
    formatDuration?: (ms: number) => string
    previewMode?: "desktop" | "mobile"
    playerType: "collapsed" | "expanded" | "mobile"
}