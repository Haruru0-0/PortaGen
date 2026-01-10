import React from "react"
import Image from "next/image"
import { MusicPlayerStyleProps, SpotifyTrack } from "./types"
import { Track } from "@/lib/types"
import { Loader2, Pause, Play, SkipBack, SkipForward, List, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function LiquidGlassMusicPlayer(props: MusicPlayerStyleProps) {
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
                    className="w-16 h-16 rounded-full glass-morphism relative flex items-center justify-center p-0 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden active:scale-95 transition-transform"
                    onClick={() => { handleExpandClick(); handleButtonClick(0) }}
                    onMouseEnter={() => handleButtonHover(0)}
                    onMouseLeave={() => handleButtonLeave(0)}
                    disabled={isLoading}
                >
                    <Image
                        src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                        alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                        className="w-full h-full object-cover opacity-80"
                        fill
                        sizes="64px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                </button>
            </div>
        )
    }

    if (playerType === "expanded") {
        const {
            showPlaylist, setShowPlaylist, handleDesktopClose, handlePlaylistToggle,
            progress, handleSeek, formatTime, spDurationMs, isPlaying, onPlayPause,
            onNext, onPrevious, volume, setVolume, playClickSound, playlistRef,
            spotifyPlaylistTracks, playlist, changeTrack, formatDuration
        } = props as unknown as MusicPlayerStyleProps & {
            showPlaylist: boolean, setShowPlaylist: (show: boolean) => void, handleDesktopClose: () => void,
            handlePlaylistToggle: () => void, progress: number, handleSeek: (value: number[]) => void,
            formatTime: (progress: number) => string, spDurationMs: number, isPlaying: boolean,
            onPlayPause: () => void, onNext: () => void, onPrevious: () => void, volume: number,
            setVolume: (volume: number) => void, playClickSound: () => void, playlistRef: React.RefObject<HTMLDivElement | null>,
            spotifyPlaylistTracks: SpotifyTrack[], playlist: Track[], changeTrack: (track: Track) => void, formatDuration: (ms: number) => string
        }

        const displayTracks = useSpotify ? spotifyPlaylistTracks : playlist;

        return (
            <div
                ref={playerRef}
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 z-99 glass-morphism backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500`}
                style={{ width: "min(380px, 90vw)", height: "min(400px, 80vh)" }}
            >
                <div className="flex flex-col h-full w-full p-6 text-white">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">Liquid Audio</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${showPlaylist ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                onClick={handlePlaylistToggle}
                            >
                                <List className="w-4 h-4 opacity-80" />
                            </button>
                            <button
                                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
                                onClick={handleDesktopClose}
                            >
                                <X className="w-4 h-4 opacity-80" />
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 min-h-0 overflow-hidden">
                        {props.isSpotifyFallback && props.spotifyEmbedUrl ? (
                            <div className="w-full h-full rounded-[2rem] overflow-hidden border border-white/10">
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
                            showPlaylist ? (
                                <div ref={playlistRef} className="w-full h-full flex flex-col min-h-0">
                                    <h4 className="text-[10px] font-bold mb-4 uppercase tracking-widest opacity-50">Queue</h4>
                                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar scrollbar-thin scrollbar-thumb-white/20">
                                        {displayTracks.map((track: any) => {
                                            const isCurrent = (useSpotify ? spotifyCurrentTrack?.id : currentTrack.id) === track.id;
                                            return (
                                                <div
                                                    key={track.id}
                                                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer group ${isCurrent ? 'bg-white/20 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                                                    onClick={() => !useSpotify && changeTrack(track)}
                                                >
                                                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                                                        <Image
                                                            src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                            alt={useSpotify ? track.name : track.title}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover w-full h-full opacity-80"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-medium truncate ${isCurrent ? 'text-white' : 'text-white/70'}`}>
                                                            {useSpotify ? track.name : track.title}
                                                        </p>
                                                        <p className="text-[10px] text-white/40 truncate">
                                                            {useSpotify ? track.artists?.map((a: any) => a.name).join(", ") : track.artist}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-8">
                                    <div ref={albumCoverRef} className="w-48 h-48 md:w-56 md:h-56 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 relative group">
                                        <Image
                                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                            alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                            className="w-full h-full object-cover"
                                            fill
                                            sizes="(max-width: 768px) 192px, 224px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                    </div>
                                    <div className="text-center space-y-2 w-full">
                                        <h4 className="font-bold text-xl md:text-2xl truncate px-4 tracking-tight">
                                            {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        </h4>
                                        <p className="text-white/50 text-xs tracking-wide uppercase font-medium">
                                            {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Progress */}
                    {!props.isSpotifyFallback && (
                        <div className="mt-8 space-y-3 shrink-0">
                            <Slider
                                value={[progress]}
                                max={100}
                                step={0.1}
                                onValueChange={handleSeek}
                                disabled={isLoading}
                                trackClassName="bg-white/10 h-1.5 rounded-full"
                                rangeClassName="bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                                thumbClassName="h-4 w-4 bg-white shadow-xl ring-4 ring-white/10 cursor-pointer active:scale-125 transition-transform"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-white/30 tracking-widest tabular-nums uppercase">
                                <span>{formatTime(progress)}</span>
                                <span>{currentTrack.duration}</span>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    {!props.isSpotifyFallback && (
                        <div className="flex justify-between items-center mt-6 shrink-0 px-2">
                            <button
                                className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center transition-all active:scale-90"
                                onClick={onPrevious}
                            >
                                <SkipBack className="w-5 h-5 opacity-80" />
                            </button>
                            <button
                                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl active:scale-90 transition-all"
                                onClick={onPlayPause}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="w-8 h-8 fill-current" />
                                ) : (
                                    <Play className="w-8 h-8 fill-current ml-1" />
                                )}
                            </button>
                            <button
                                className="w-12 h-12 rounded-full border border-white/10 hover:bg-white/5 flex items-center justify-center transition-all active:scale-90"
                                onClick={onNext}
                            >
                                <SkipForward className="w-5 h-5 opacity-80" />
                            </button>
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
                    className="w-full glass-morphism backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2rem] shadow-2xl p-4 overflow-hidden transition-all duration-300"
                    style={{ minHeight: "220px" }}
                >
                    <div className="flex flex-col h-full text-white">
                        {mobileProps.showPlaylist ? (
                            <div className="flex flex-col h-full min-h-0">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 pl-2">Queue</h4>
                                    <button
                                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
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
                                                    className={`flex flex-col items-center gap-3 min-w-[100px] max-w-[100px] transition-all ${isCurrent ? 'scale-110' : 'opacity-40 active:scale-95'}`}
                                                    onClick={() => !useSpotify && mobileProps.changeTrack(track)}
                                                >
                                                    <div className={`w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 transition-all ${isCurrent ? 'border-white/40 shadow-xl' : 'border-transparent'}`}>
                                                        <Image
                                                            src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                            alt={useSpotify ? track.name : track.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover w-full h-full opacity-80"
                                                        />
                                                    </div>
                                                    <p className={`text-[10px] font-bold truncate w-full text-center tracking-tight ${isCurrent ? 'text-white' : 'text-white/50'}`}>
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
                                    <div ref={albumCoverRef} className="w-24 h-24 rounded-[1.5rem] overflow-hidden border border-white/20 relative shrink-0">
                                        <Image
                                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                            alt="album cover"
                                            className="object-cover opacity-80"
                                            fill
                                            sizes="96px"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1 justify-center min-w-0">
                                        <h2 className="font-bold text-sm truncate tracking-tight mb-1">
                                            {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        </h2>
                                        <p className="text-[10px] font-medium text-white/40 truncate tracking-wide uppercase mb-4">
                                            {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                        </p>

                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/5 active:scale-75"
                                                    onClick={() => { mobileProps.handlePrevious(); mobileProps.playClickSound(); handleButtonClick(6) }}
                                                >
                                                    <SkipBack className="w-4 h-4 opacity-60" />
                                                </button>
                                                <button
                                                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white text-black shadow-xl active:scale-75"
                                                    onClick={() => { mobileProps.handlePlayPause(); handleButtonClick(7) }}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    ) : mobileProps.isPlaying ? (
                                                        <Pause className="w-6 h-6 fill-current" />
                                                    ) : (
                                                        <Play className="w-6 h-6 fill-current ml-0.5" />
                                                    )}
                                                </button>
                                                <button
                                                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/5 active:scale-75"
                                                    onClick={() => { mobileProps.handleNext(); mobileProps.playClickSound(); handleButtonClick(8) }}
                                                >
                                                    <SkipForward className="w-4 h-4 opacity-60" />
                                                </button>
                                            </div>
                                            <button
                                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/5 active:scale-75"
                                                onClick={() => { mobileProps.handlePlaylistToggle(); handleButtonClick(9) }}
                                            >
                                                <List className="w-4 h-4 opacity-40" />
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
                                        trackClassName="bg-white/10 h-1 rounded-full"
                                        rangeClassName="bg-white/40 rounded-full"
                                        thumbClassName="h-3 w-3 bg-white shadow-lg"
                                    />
                                    <div className="flex justify-between text-[8px] mt-1.5 font-bold tracking-[0.2em] text-white/20 uppercase tabular-nums">
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
