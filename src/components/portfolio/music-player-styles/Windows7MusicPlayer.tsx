import React from "react"
import Image from "next/image"
import { MusicPlayerStyleProps, SpotifyTrack } from "./types"
import { Track } from "@/lib/types"
import { Loader2, Pause, Play, SkipBack, SkipForward, List, X, Minimize2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function Windows7MusicPlayer(props: MusicPlayerStyleProps) {
    const { playerType, embedded, playerRef, buttonsRef, handleExpandClick, handleButtonClick,
        handleButtonHover, handleButtonLeave, isLoading, albumCoverRef, useSpotify,
        spotifyCurrentTrack, currentTrack } = props

    if (playerType === "collapsed") {
        return (
            <div
                ref={playerRef}
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 z-99 music-player`}
            >
                <button
                    ref={(el) => { if (el) buttonsRef.current[0] = el }}
                    className="group relative flex items-center justify-center p-1 bg-gradient-to-b from-blue-400/80 to-blue-600/80 backdrop-blur-md rounded-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all"
                    onClick={() => { handleExpandClick(); handleButtonClick(0) }}
                    onMouseEnter={() => handleButtonHover(0)}
                    onMouseLeave={() => handleButtonLeave(0)}
                    disabled={isLoading}
                >
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-black/20 relative">
                        <Image
                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                            alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                            className="w-full h-full object-cover"
                            fill
                            sizes="48px"
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
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 z-99 glass-morphism rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border border-white/30`}
                style={{
                    width: "min(380px, 90vw)",
                    height: "min(400px, 80vh)",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(20px)"
                }}
            >
                <div className="flex flex-col h-full w-full">
                    {/* Aero Title Bar */}
                    <div className="flex justify-between items-center h-8 px-3 shrink-0 bg-gradient-to-r from-blue-500/20 to-transparent border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-sm shadow-sm flex items-center justify-center">
                                <Play className="w-2 h-2 text-white fill-current" />
                            </div>
                            <span className="text-[11px] font-medium text-white/90 drop-shadow-sm">Windows Media Player</span>
                        </div>
                        <div className="flex">
                            <button className="w-8 h-6 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Minimize2 className="w-3.5 h-3.5 text-white/70" />
                            </button>
                            <button
                                className="w-10 h-6 flex items-center justify-center hover:bg-red-500 transition-colors bg-red-500/10"
                                onClick={expandedProps.handleDesktopClose}
                            >
                                <X className="w-3.5 h-3.5 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 flex flex-col p-4">
                        {props.isSpotifyFallback && props.spotifyEmbedUrl ? (
                            <div className="w-full h-full flex flex-col min-h-0 bg-black/20 rounded-lg overflow-hidden border border-white/5">
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
                                <div ref={expandedProps.playlistRef} className="w-full h-full flex flex-col min-h-0 bg-black/20 rounded-lg p-2 border border-white/5">
                                    <div className="flex justify-between items-center mb-3 px-2">
                                        <span className="text-[10px] uppercase font-bold text-blue-200/50 tracking-wider">Now Playing List</span>
                                        <button
                                            className="p-1 hover:bg-white/10 rounded"
                                            onClick={expandedProps.handlePlaylistToggle}
                                        >
                                            <X className="w-3 h-3 text-white/50" />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                                        {displayTracks.map((track: any) => {
                                            const isCurrent = (useSpotify ? spotifyCurrentTrack?.id : currentTrack.id) === track.id;
                                            return (
                                                <div
                                                    key={track.id}
                                                    className={`flex items-center gap-3 p-2 rounded transition-all cursor-pointer group ${isCurrent ? 'bg-blue-500/30 border border-blue-400/30' : 'hover:bg-white/5 border border-transparent'}`}
                                                    onClick={() => !useSpotify && expandedProps.changeTrack(track)}
                                                >
                                                    <div className="w-8 h-8 rounded shrink-0 border border-white/10 overflow-hidden">
                                                        <Image
                                                            src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                            alt={useSpotify ? track.name : track.title}
                                                            width={32}
                                                            height={32}
                                                            className="object-cover w-full h-full opacity-60"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-[11px] font-medium truncate ${isCurrent ? 'text-white' : 'text-white/60'}`}>
                                                            {useSpotify ? track.name : track.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center flex-1 space-y-6">
                                    <div ref={albumCoverRef} className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/10 relative shrink-0">
                                        <Image
                                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                            alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                            className="w-full h-full object-cover"
                                            fill
                                            sizes="(max-width: 768px) 160px, 192px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                                    </div>
                                    <div className="text-center space-y-1 w-full px-4">
                                        <h4 className="font-bold text-lg md:text-xl truncate text-white drop-shadow-md">
                                            {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        </h4>
                                        <p className="text-blue-200/60 text-xs font-medium uppercase tracking-wide">
                                            {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Progress & Controls Area */}
                    {!props.isSpotifyFallback && (
                        <div className="bg-blue-900/40 backdrop-blur-md p-6 border-t border-white/10">
                            <div className="space-y-2 mb-6">
                                <Slider
                                    value={[expandedProps.progress]}
                                    max={100}
                                    step={0.1}
                                    onValueChange={expandedProps.handleSeek}
                                    disabled={isLoading}
                                    trackClassName="bg-black/30 h-1.5 rounded-full border border-white/5"
                                    rangeClassName="bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"
                                    thumbClassName="h-4 w-4 bg-gradient-to-b from-white to-zinc-300 border border-black/20 shadow-lg cursor-pointer transition-transform active:scale-125"
                                />
                                <div className="flex justify-between text-[9px] font-bold text-blue-200/40 tabular-nums uppercase tracking-tighter">
                                    <span>{expandedProps.formatTime(expandedProps.progress)}</span>
                                    <span>{currentTrack.duration}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-4">
                                <button
                                    className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-400/20 to-blue-600/20 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                                    onClick={expandedProps.handlePlaylistToggle}
                                >
                                    <List className="w-4 h-4 text-white/60" />
                                </button>

                                <div className="flex items-center gap-4">
                                    <button
                                        className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-400/20 to-blue-600/20 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                                        onClick={expandedProps.onPrevious}
                                    >
                                        <SkipBack className="w-5 h-5 text-white/80 fill-current" />
                                    </button>
                                    <button
                                        className="w-14 h-14 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 p-[2px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                                        onClick={expandedProps.onPlayPause}
                                    >
                                        <div className="w-full h-full rounded-full bg-gradient-to-b from-white/20 to-transparent flex items-center justify-center border border-white/10">
                                            {isLoading ? (
                                                <Loader2 className="w-7 h-7 text-white animate-spin" />
                                            ) : expandedProps.isPlaying ? (
                                                <Pause className="w-7 h-7 text-white fill-current" />
                                            ) : (
                                                <Play className="w-7 h-7 text-white fill-current ml-1" />
                                            )}
                                        </div>
                                    </button>
                                    <button
                                        className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-400/20 to-blue-600/20 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                                        onClick={expandedProps.onNext}
                                    >
                                        <SkipForward className="w-5 h-5 text-white/80 fill-current" />
                                    </button>
                                </div>

                                <div className="w-10 h-10" /> {/* Spacer */}
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
                    className="w-full bg-gradient-to-b from-blue-500/30 to-blue-900/50 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 overflow-hidden transition-all duration-300"
                    style={{ minHeight: "220px" }}
                >
                    <div className="flex flex-col h-full text-white">
                        {mobileProps.showPlaylist ? (
                            <div className="flex flex-col h-full min-h-0">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-[10px] font-black uppercase text-blue-200/50 tracking-[0.2em] pl-1">Tracks</h4>
                                    <button
                                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
                                        onClick={mobileProps.handlePlaylistToggle}
                                    >
                                        <X className="w-3.5 h-3.5 opacity-60" />
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
                                                    className={`flex flex-col items-center gap-2 min-w-[100px] max-w-[100px] transition-all ${isCurrent ? 'scale-105' : 'opacity-40 active:scale-95'}`}
                                                    onClick={() => !useSpotify && mobileProps.changeTrack(track)}
                                                >
                                                    <div className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${isCurrent ? 'border-blue-400 shadow-lg shadow-blue-500/40' : 'border-white/10'}`}>
                                                        <Image
                                                            src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                            alt={useSpotify ? track.name : track.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover w-full h-full opacity-80"
                                                        />
                                                    </div>
                                                    <p className={`text-[10px] font-bold truncate w-full text-center tracking-tight ${isCurrent ? 'text-blue-300' : 'text-white/40'}`}>
                                                        {useSpotify ? track.name : track.title}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="flex gap-4 items-center flex-1 min-h-0">
                                    <div ref={albumCoverRef} className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 relative shrink-0 shadow-lg">
                                        <Image
                                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                            alt="album cover"
                                            className="object-cover opacity-90"
                                            fill
                                            sizes="96px"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1 justify-center min-w-0">
                                        <h2 className="font-bold text-sm truncate text-white drop-shadow-sm mb-0.5">
                                            {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        </h2>
                                        <p className="text-[10px] font-bold text-blue-200/40 truncate tracking-wider uppercase mb-3">
                                            {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/10 active:scale-75 shadow-sm"
                                                    onClick={() => { mobileProps.handlePrevious(); mobileProps.playClickSound(); handleButtonClick(6) }}
                                                >
                                                    <SkipBack className="w-4 h-4 text-white/60 fill-current" />
                                                </button>
                                                <button
                                                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-lg active:scale-75"
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
                                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/10 active:scale-75 shadow-sm"
                                                    onClick={() => { mobileProps.handleNext(); mobileProps.playClickSound(); handleButtonClick(8) }}
                                                >
                                                    <SkipForward className="w-4 h-4 text-white/60 fill-current" />
                                                </button>
                                            </div>
                                            <button
                                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/10 active:scale-75"
                                                onClick={() => { mobileProps.handlePlaylistToggle(); handleButtonClick(9) }}
                                            >
                                                <List className="w-4 h-4 opacity-40 text-blue-200" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 shrink-0">
                                    <Slider
                                        value={[mobileProps.progress]}
                                        max={100}
                                        step={0.1}
                                        onValueChange={mobileProps.handleSeek}
                                        disabled={isLoading}
                                        trackClassName="bg-black/40 h-1.5 rounded-full"
                                        rangeClassName="bg-blue-400 rounded-full"
                                        thumbClassName="h-3.5 w-3.5 bg-white shadow-xl"
                                    />
                                    <div className="flex justify-between text-[8px] mt-2 font-black tracking-widest text-blue-200/20 uppercase tabular-nums">
                                        <span>{mobileProps.formatTime(mobileProps.progress)}</span>
                                        <span>{currentTrack.duration}</span>
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
