import React from "react"
import Image from "next/image"
import { MusicPlayerStyleProps, SpotifyTrack } from "./types"
import { Track } from "@/lib/types"
import MusicPlayerImage from "@/assets/MusicPlayerImage.png"
import MusicWallpaper from "@/assets/MusicWallPaper.gif"
import { Loader2, Pause, Play, SkipBack, SkipForward, List, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function ModernWindowMusicPlayer(props: MusicPlayerStyleProps) {
    const { playerType, embedded, playerRef, buttonsRef, handleExpandClick, handleButtonClick,
        handleButtonHover, handleButtonLeave, isLoading, albumCoverRef, useSpotify,
        spotifyCurrentTrack, currentTrack } = props

    if (playerType === "collapsed") {
        return (
            <div
                ref={playerRef}
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 z-99
                modernWindow-wrapper music-player`}
            >
                <button
                    ref={(el) => { if (el) buttonsRef.current[0] = el }}
                    className="w-20 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent modernWindow-button"
                    onClick={() => { handleExpandClick(); handleButtonClick(0) }}
                    onMouseEnter={() => handleButtonHover(0)}
                    onMouseLeave={() => handleButtonLeave(0)}
                    disabled={isLoading}
                >
                    <Image src={MusicPlayerImage} alt="Music Player" className="modernWindow-image" />
                    <div
                        ref={albumCoverRef}
                        className="absolute top-[60.5%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 modernWindow-album-cover"
                    >
                        <Image
                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                            alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                            className="w-full h-full object-cover"
                            fill
                            sizes="56px"
                        />
                    </div>
                </button>
            </div>
        )
    }

    if (playerType === "expanded") {
        const expandedProps = props as unknown as MusicPlayerStyleProps & {
            showPlaylist: boolean, setShowPlaylist: (show: boolean) => void, handleDesktopClose: () => void,
            handlePlaylistToggle: () => void, progress: number, handleSeek: (value: number[]) => void,
            formatTime: (progress: number) => string, spDurationMs: number, isPlaying: boolean,
            onPlayPause: () => void, onNext: () => void, onPrevious: () => void, volume: number,
            setVolume: (volume: number) => void, playClickSound: () => void, playlistRef: React.RefObject<HTMLDivElement | null>,
            spotifyPlaylistTracks: SpotifyTrack[], playlist: Track[], changeTrack: (track: Track) => void, formatDuration: (ms: number) => string
        }

        const displayTracks = useSpotify ? expandedProps.spotifyPlaylistTracks : expandedProps.playlist;

        return (
            <div
                ref={playerRef}
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 z-99 modernWindow-expanded shadow-2xl transition-all duration-300`}
                style={{ width: "min(380px, 90vw)", height: "min(400px, 80vh)" }}
            >
                <div className="modernWindow-content relative flex flex-col h-full w-full overflow-hidden p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    {/* Modern Header */}
                    <div className="flex justify-between items-center h-10 px-4 mt-1 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                                <Play className="w-3 h-3 text-white fill-white" />
                            </div>
                            <h3 className="font-bold text-[12px] text-zinc-800 dark:text-zinc-100 tracking-tight">Modern Player</h3>
                        </div>
                        <div className="flex gap-1.5">
                            <button
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${expandedProps.showPlaylist ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                onClick={expandedProps.handlePlaylistToggle}
                            >
                                <List className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                            </button>
                            <button
                                className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-all group"
                                onClick={expandedProps.handleDesktopClose}
                            >
                                <X className="w-4 h-4 text-zinc-400 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 min-h-0 overflow-hidden px-4 py-2">
                        {props.isSpotifyFallback && props.spotifyEmbedUrl ? (
                            <div className="w-full h-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                <iframe
                                    src={props.spotifyEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    frameBorder={0}
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                />
                            </div>
                        ) : (
                            expandedProps.showPlaylist ? (
                                <div ref={expandedProps.playlistRef} className="w-full h-full flex flex-col min-h-0">
                                    <h4 className="text-zinc-400 text-[10px] font-bold mb-3 uppercase tracking-widest">Up Next</h4>
                                    <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                                        {displayTracks.map((track: any) => {
                                            const isCurrent = (useSpotify ? spotifyCurrentTrack?.id : currentTrack.id) === track.id;
                                            return (
                                                <div
                                                    key={track.id}
                                                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer group ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                                                    onClick={() => !useSpotify && expandedProps.changeTrack(track)}
                                                >
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 flex-shrink-0 shadow-sm">
                                                        <Image
                                                            src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                            alt={useSpotify ? track.name : track.title}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[12px] font-semibold truncate ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-200'}`}>
                                                            {useSpotify ? track.name : track.title}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400 truncate">
                                                            {useSpotify ? track.artists?.map((a: any) => a.name).join(", ") : track.artist}
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] text-zinc-400">
                                                        {useSpotify ? expandedProps.formatDuration(track.duration_ms) : track.duration}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-6">
                                    <div ref={albumCoverRef} className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800 relative group transition-transform duration-500 hover:scale-[1.02]">
                                        <Image
                                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                            alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                            className="w-full h-full object-cover"
                                            fill
                                            sizes="(max-width: 768px) 160px, 192px"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                    </div>
                                    <div className="text-center space-y-1 w-full px-4">
                                        <h4 className="font-bold text-lg md:text-xl truncate text-zinc-800 dark:text-zinc-100 leading-tight">
                                            {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        </h4>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                                            {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Modern Controls */}
                    {!props.isSpotifyFallback && (
                        <div className="px-6 pb-6 pt-2 shrink-0 space-y-4">
                            <div className="space-y-1.5">
                                <Slider
                                    value={[expandedProps.progress]}
                                    max={100}
                                    step={0.1}
                                    className="flex-1"
                                    onValueChange={expandedProps.handleSeek}
                                    disabled={isLoading}
                                    trackClassName="bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full"
                                    rangeClassName="bg-blue-500 rounded-full"
                                    thumbClassName="h-3.5 w-3.5 bg-white dark:bg-zinc-100 border-2 border-blue-500 shadow-lg cursor-pointer transition-transform active:scale-125"
                                />
                                <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold tabular-nums">
                                    <span>{expandedProps.formatTime(expandedProps.progress)}</span>
                                    <span>{currentTrack.duration}</span>
                                </div>
                            </div>

                            <div className="flex justify-center items-center gap-6">
                                <button
                                    className="w-10 h-10 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all text-zinc-700 dark:text-zinc-300 active:scale-95"
                                    onClick={expandedProps.onPrevious}
                                >
                                    <SkipBack className="w-5 h-5 fill-current" />
                                </button>
                                <button
                                    className="w-14 h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all text-white shadow-lg shadow-blue-500/25 active:scale-90"
                                    onClick={expandedProps.onPlayPause}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-7 h-7 animate-spin" />
                                    ) : expandedProps.isPlaying ? (
                                        <Pause className="w-7 h-7 fill-current" />
                                    ) : (
                                        <Play className="w-7 h-7 fill-current ml-1" />
                                    )}
                                </button>
                                <button
                                    className="w-10 h-10 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all text-zinc-700 dark:text-zinc-300 active:scale-95"
                                    onClick={expandedProps.onNext}
                                >
                                    <SkipForward className="w-5 h-5 fill-current" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (playerType === "mobile") {
        const mobileProps = props as unknown as MusicPlayerStyleProps & {
            showPlaylist: boolean, setShowPlaylist: (show: boolean) => void, handlePlaylistToggle: () => void,
            handlePrevious: () => void, playClickSound: () => void, handlePlayPause: () => void, isPlaying: boolean,
            handleNext: () => void, progress: number, handleSeek: (value: number[]) => void, formatTime: (progress: number) => string,
            spotifyPlaylistTracks: SpotifyTrack[], playlist: Track[], changeTrack: (track: Track) => void, formatDuration: (ms: number) => string
        }

        const displayTracks = useSpotify ? mobileProps.spotifyPlaylistTracks : mobileProps.playlist;

        return (
            <div className="flex flex-col items-center justify-center w-full px-1">
                <div
                    ref={playerRef}
                    className="w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-300"
                    style={{ minHeight: "220px" }}
                >
                    <div className="flex flex-col h-full overflow-hidden">
                        {mobileProps.showPlaylist ? (
                            <div className="p-4 flex flex-col h-full min-h-0">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Up Next</h4>
                                    <button
                                        className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
                                        onClick={mobileProps.handlePlaylistToggle}
                                    >
                                        <X className="w-3.5 h-3.5 text-zinc-500" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div
                                        className="flex gap-4 overflow-x-auto pb-4 pt-2 h-full scrollbar-none"
                                        style={{ scrollSnapType: 'x mandatory' }}
                                    >
                                        {displayTracks.map((track: any) => {
                                            const isCurrent = (useSpotify ? spotifyCurrentTrack?.id : currentTrack.id) === track.id;
                                            return (
                                                <div
                                                    key={track.id}
                                                    style={{ scrollSnapAlign: 'start' }}
                                                    className={`flex flex-col items-center gap-2 min-w-[100px] max-w-[100px] group transition-all ${isCurrent ? 'scale-105' : 'opacity-80 active:scale-95'}`}
                                                    onClick={() => !useSpotify && mobileProps.changeTrack(track)}
                                                >
                                                    <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors shadow-md ${isCurrent ? 'border-blue-500' : 'border-zinc-100 dark:border-zinc-800'}`}>
                                                        <Image
                                                            src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                            alt={useSpotify ? track.name : track.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <p className={`text-[10px] font-bold truncate w-full text-center ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-200'}`}>
                                                        {useSpotify ? track.name : track.title}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 flex flex-row items-center gap-4 h-full">
                                <div ref={albumCoverRef} className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-800 shrink-0 relative">
                                    <Image
                                        src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                        alt="album cover"
                                        className="object-cover"
                                        fill
                                        sizes="96px"
                                    />
                                </div>

                                <div className="flex flex-col flex-1 gap-2.5 h-full justify-center min-w-0">
                                    <div className="flex flex-col items-start min-w-0">
                                        <h2 className="font-bold text-sm truncate w-full text-zinc-800 dark:text-zinc-100">
                                            {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        </h2>
                                        <p className="text-[11px] truncate w-full text-zinc-500 dark:text-zinc-400">
                                            {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <button
                                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 active:scale-90"
                                                onClick={() => { mobileProps.handlePrevious(); mobileProps.playClickSound(); handleButtonClick(6) }}
                                            >
                                                <SkipBack className="w-4 h-4 fill-current" />
                                            </button>
                                            <button
                                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-90"
                                                onClick={() => { mobileProps.handlePlayPause(); handleButtonClick(7) }}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : mobileProps.isPlaying ? (
                                                    <Pause className="w-5 h-5 fill-current" />
                                                ) : (
                                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                                )}
                                            </button>
                                            <button
                                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 active:scale-90"
                                                onClick={() => { mobileProps.handleNext(); mobileProps.playClickSound(); handleButtonClick(8) }}
                                            >
                                                <SkipForward className="w-4 h-4 fill-current" />
                                            </button>
                                        </div>
                                        <button
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border border-zinc-100 dark:border-zinc-800 text-zinc-400 active:scale-90"
                                            onClick={() => { mobileProps.handlePlaylistToggle(); handleButtonClick(9) }}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="w-full">
                                        <Slider
                                            value={[mobileProps.progress]}
                                            max={100}
                                            step={0.1}
                                            className="h-1.5"
                                            onValueChange={mobileProps.handleSeek}
                                            disabled={isLoading}
                                            trackClassName="bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full"
                                            rangeClassName="bg-blue-500"
                                            thumbClassName="h-3 w-3 bg-white border-2 border-blue-500 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return null
}
