import React from "react"
import { MusicPlayerStyleProps } from "./types"
import { CollapsedPlayer } from "../music-player/CollapsedPlayer"
import { ExpandedPlayer } from "../music-player/ExpandedPlayer"
import { MobilePlayer } from "../music-player/MobilePlayer"

export function DefaultMusicPlayer(props: MusicPlayerStyleProps) {
    const { playerType, ...restProps } = props
    
    // Type guards to ensure proper props for each player type
    const isCollapsed = playerType === "collapsed"
    const isExpanded = playerType === "expanded"
    const isMobile = playerType === "mobile"
    
    if (isCollapsed) {
        // Collapsed player only needs basic props
        const collapsedProps = {
            embedded: restProps.embedded,
            playerRef: restProps.playerRef,
            buttonsRef: restProps.buttonsRef,
            handleExpandClick: restProps.handleExpandClick,
            handleButtonClick: restProps.handleButtonClick,
            handleButtonHover: restProps.handleButtonHover,
            handleButtonLeave: restProps.handleButtonLeave,
            isLoading: restProps.isLoading,
            albumCoverRef: restProps.albumCoverRef,
            useSpotify: restProps.useSpotify,
            spotifyCurrentTrack: restProps.spotifyCurrentTrack,
            currentTrack: restProps.currentTrack,
        }
        return <CollapsedPlayer {...collapsedProps} />
    }
    
    if (isExpanded) {
        // Expanded player needs all the expanded props
        const expandedProps = {
            embedded: restProps.embedded,
            playerRef: restProps.playerRef,
            showPlaylist: restProps.showPlaylist || false,
            setShowPlaylist: restProps.setShowPlaylist,
            buttonsRef: restProps.buttonsRef,
            handleButtonHover: restProps.handleButtonHover,
            handleButtonLeave: restProps.handleButtonLeave,
            handleButtonClick: restProps.handleButtonClick,
            handleDesktopClose: restProps.handleDesktopClose,
            handlePlaylistToggle: restProps.handlePlaylistToggle,
            albumCoverRef: restProps.albumCoverRef,
            useSpotify: restProps.useSpotify,
            spotifyCurrentTrack: restProps.spotifyCurrentTrack,
            currentTrack: restProps.currentTrack,
            progress: restProps.progress || 0,
            handleSeek: restProps.handleSeek,
            isLoading: restProps.isLoading,
            formatTime: restProps.formatTime,
            spDurationMs: restProps.spDurationMs || 0,
            isPlaying: restProps.isPlaying || false,
            onPlayPause: restProps.onPlayPause,
            onNext: restProps.onNext,
            onPrevious: restProps.onPrevious,
            volume: restProps.volume || 50,
            setVolume: restProps.setVolume,
            spotifyPlayerRef: restProps.spotifyPlayerRef,
            playClickSound: restProps.playClickSound,
            playlistRef: restProps.playlistRef,
            spotifyPlaylistTracks: restProps.spotifyPlaylistTracks,
            playlist: restProps.playlist,
            changeTrack: restProps.changeTrack,
            formatDuration: restProps.formatDuration,
        }
        return <ExpandedPlayer {...expandedProps} />
    }
    
    if (isMobile) {
        // Mobile player needs mobile-specific props
        const mobileProps = {
            playerRef: restProps.playerRef,
            showPlaylist: restProps.showPlaylist || false,
            setShowPlaylist: restProps.setShowPlaylist,
            albumCoverRef: restProps.albumCoverRef,
            isLoading: restProps.isLoading,
            useSpotify: restProps.useSpotify,
            spotifyCurrentTrack: restProps.spotifyCurrentTrack,
            currentTrack: restProps.currentTrack,
            buttonsRef: restProps.buttonsRef,
            handlePrevious: restProps.onPrevious,
            playClickSound: restProps.playClickSound,
            handleButtonClick: restProps.handleButtonClick,
            handleButtonHover: restProps.handleButtonHover,
            handleButtonLeave: restProps.handleButtonLeave,
            handlePlayPause: restProps.onPlayPause,
            isPlaying: restProps.isPlaying || false,
            handleNext: restProps.onNext,
            handlePlaylistToggle: restProps.handlePlaylistToggle,
            progress: restProps.progress || 0,
            handleSeek: restProps.handleSeek,
            formatTime: restProps.formatTime,
            spotifyPlaylistTracks: restProps.spotifyPlaylistTracks,
            playlist: restProps.playlist,
            changeTrack: restProps.changeTrack,
            formatDuration: restProps.formatDuration,
        }
        return <MobilePlayer {...mobileProps} />
    }
    
    // Default to collapsed player
    return <CollapsedPlayer {...restProps} />
}