import React from "react"
import Image from "next/image"
import { MusicPlayerStyleProps, SpotifyTrack } from "./types"
import { Track } from "@/lib/types"
import { Loader2, Pause, Play, SkipBack, SkipForward, List, X, Minus } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function Windows98MusicPlayer(props: MusicPlayerStyleProps) {
    const { playerType, embedded, playerRef, buttonsRef, handleExpandClick, handleButtonClick,
        handleButtonHover, handleButtonLeave, isLoading, albumCoverRef, useSpotify,
        spotifyCurrentTrack, currentTrack } = props

    if (playerType === "collapsed") {
        return (
            <div
                ref={playerRef}
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 z-99 music-player win98-window`}
            >
                <button
                    ref={(el) => { if (el) buttonsRef.current[0] = el }}
                    className="flex items-center gap-2 p-1 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0_0_#000] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white active:shadow-[-1px_-1px_0_0_#000] transition-all"
                    onClick={() => { handleExpandClick(); handleButtonClick(0) }}
                    onMouseEnter={() => handleButtonHover(0)}
                    onMouseLeave={() => handleButtonLeave(0)}
                    disabled={isLoading}
                >
                    <div className="w-8 h-8 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white bg-black overflow-hidden relative">
                        <Image
                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                            alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                            className="w-full h-full object-cover pixelated"
                            fill
                            sizes="32px"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-black px-1 font-['MS_Sans_Serif',sans-serif]">Player</span>
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
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 z-99 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0_0_#000] p-1 flex flex-col font-['MS_Sans_Serif',sans-serif]`}
                style={{ width: "min(380px, 90vw)", height: "min(400px, 80vh)" }}
            >
                {/* Win98 Title Bar */}
                <div className="flex justify-between items-center h-5 px-1 bg-gradient-to-r from-[#000080] to-[#1084d0] shrink-0 mb-1">
                    <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                            <Play className="w-2.5 h-2.5 text-white fill-current" />
                        </div>
                        <span className="text-[10px] font-bold text-white leading-none">Windows Media Player</span>
                    </div>
                    <div className="flex gap-0.5">
                        <button className="w-4 h-3.5 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[0.5px_0.5px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white">
                            <Minus className="w-2.5 h-2.5 text-black" strokeWidth={4} />
                        </button>
                        <button
                            className="w-4 h-3.5 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[0.5px_0.5px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
                            onClick={expandedProps.handleDesktopClose}
                        >
                            <X className="w-2.5 h-2.5 text-black" strokeWidth={4} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col p-1 gap-2">
                    {props.isSpotifyFallback && props.spotifyEmbedUrl ? (
                        <div className="flex-1 min-h-0 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white bg-black relative overflow-hidden">
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
                        <>
                            <div className="flex-1 min-h-0 flex flex-col border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white bg-black relative overflow-hidden">
                                {expandedProps.showPlaylist ? (
                                    <div ref={expandedProps.playlistRef} className="w-full h-full flex flex-col min-h-0 bg-white p-2">
                                        <div className="flex justify-between items-center mb-1 pb-1 border-b border-black">
                                            <span className="text-[9px] font-bold text-black uppercase">Playlist</span>
                                            <button
                                                className="w-4 h-3.5 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] flex items-center justify-center"
                                                onClick={expandedProps.handlePlaylistToggle}
                                            >
                                                <X className="w-2 h-2 text-black" />
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto pr-1 space-y-0.5 custom-scrollbar scrollbar-win98">
                                            {displayTracks.map((track: any) => {
                                                const isCurrent = (useSpotify ? spotifyCurrentTrack?.id : currentTrack.id) === track.id;
                                                return (
                                                    <div
                                                        key={track.id}
                                                        className={`flex items-center gap-2 p-1 transition-all cursor-pointer ${isCurrent ? 'bg-[#000080] text-white' : 'text-black hover:bg-[#c0c0c0]'}`}
                                                        onClick={() => !useSpotify && expandedProps.changeTrack(track)}
                                                    >
                                                        <div className="w-6 h-6 shrink-0 border border-[#808080]">
                                                            <Image
                                                                src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                                alt={useSpotify ? track.name : track.title}
                                                                width={24}
                                                                height={24}
                                                                className="object-cover w-full h-full pixelated"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] truncate leading-tight">
                                                            {useSpotify ? track.name : track.title}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-4">
                                        <div ref={albumCoverRef} className="w-36 h-36 border-t font-bold border-l-2 border-[#808080] border-b-2 border-r-2 border-[#c0c0c0] relative shadow-[inset_1px_1px_0_0_#000,inset_-1px_-1px_0_0_#fff]">
                                            <Image
                                                src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                                alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                                className="w-full h-full object-cover pixelated"
                                                fill
                                                sizes="144px"
                                            />
                                        </div>
                                        <div className="text-center px-4 w-full">
                                            <p className="text-[#00ff00] text-xs font-bold font-mono tracking-tighter truncate leading-none mb-1 uppercase">
                                                {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                            </p>
                                            <p className="text-[#00ff00] text-[10px] font-mono leading-none truncate opacity-80">
                                                {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Win98 Controls Bar */}
                            <div className="flex flex-col gap-2 p-2 border-t border-white border-l border-white border-b border-[#808080] border-r border-[#808080]">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-4 bg-white border-t-2 border-l-2 border-[#808080] border-b border-white border-r border-white relative">
                                        <div
                                            className="h-full bg-[#000080]"
                                            style={{ width: `${expandedProps.progress}%` }}
                                        />
                                        <Slider
                                            value={[expandedProps.progress]}
                                            max={100}
                                            step={0.1}
                                            onValueChange={expandedProps.handleSeek}
                                            disabled={isLoading}
                                            className="absolute inset-0 opacity-0 cursor-pointer h-full z-10"
                                        />
                                    </div>
                                    <div className="bg-black border border-[#808080] px-1 h-4 flex items-center">
                                        <span className="text-[9px] font-mono text-[#00ff00] leading-none tabular-nums">
                                            {expandedProps.formatTime(expandedProps.progress)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        className="h-6 px-2 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white active:shadow-[-0.5px_-0.5px_0_0_#000]"
                                        onClick={expandedProps.handlePlaylistToggle}
                                    >
                                        <List className="w-3.5 h-3.5 text-black" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        <button
                                            className="w-8 h-7 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
                                            onClick={expandedProps.onPrevious}
                                        >
                                            <SkipBack className="w-3.5 h-3.5 text-black fill-black" />
                                        </button>
                                        <button
                                            className="w-10 h-8 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
                                            onClick={expandedProps.onPlayPause}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 text-black animate-spin" />
                                            ) : expandedProps.isPlaying ? (
                                                <Pause className="w-4 h-4 text-black fill-black" />
                                            ) : (
                                                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                                            )}
                                        </button>
                                        <button
                                            className="w-8 h-7 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
                                            onClick={expandedProps.onNext}
                                        >
                                            <SkipForward className="w-3.5 h-3.5 text-black fill-black" />
                                        </button>
                                    </div>

                                    <div className="w-8" />
                                </div>
                            </div>
                        </>
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
            <div className="flex flex-col items-center justify-center w-full px-1 font-['MS_Sans_Serif',sans-serif]">
                <div
                    ref={playerRef}
                    className="w-full bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[1px_1px_0_0_#000] p-1 overflow-hidden transition-all duration-300"
                    style={{ minHeight: "220px" }}
                >
                    <div className="flex flex-col h-full">
                        {/* Mobile Title */}
                        <div className="bg-[#000080] h-5 px-1 flex items-center justify-between mb-1 shrink-0">
                            <span className="text-[9px] font-bold text-white uppercase">Mobile Media Player</span>
                            <button onClick={mobileProps.handlePlaylistToggle}>
                                <List className="w-3.5 h-3.5 text-white" />
                            </button>
                        </div>

                        {mobileProps.showPlaylist ? (
                            <div className="flex flex-col h-full min-h-0 bg-white border-t border-l border-[#808080] p-1">
                                <div className="flex-1 overflow-hidden">
                                    <div
                                        className="flex gap-3 overflow-x-auto pb-4 pt-1 h-full scrollbar-none"
                                        style={{ scrollSnapType: 'x mandatory' }}
                                    >
                                        {displayTracks.map((track: any) => {
                                            const isCurrent = (useSpotify ? spotifyCurrentTrack?.id : currentTrack.id) === track.id;
                                            return (
                                                <div
                                                    key={track.id}
                                                    style={{ scrollSnapAlign: 'start' }}
                                                    className={`flex flex-col items-center gap-1 min-w-[90px] max-w-[90px] transition-all ${isCurrent ? 'scale-105' : 'opacity-60 active:scale-95'}`}
                                                    onClick={() => !useSpotify && mobileProps.changeTrack(track)}
                                                >
                                                    <div className={`w-16 h-16 border-2 transition-all ${isCurrent ? 'border-[#000080]' : 'border-transparent'}`}>
                                                        <Image
                                                            src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                            alt={useSpotify ? track.name : track.title}
                                                            width={64}
                                                            height={64}
                                                            className="object-cover w-full h-full pixelated"
                                                        />
                                                    </div>
                                                    <p className={`text-[8px] font-bold truncate w-full text-center ${isCurrent ? 'bg-[#000080] text-white' : 'text-black'}`}>
                                                        {useSpotify ? track.name : track.title}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full p-1">
                                <div className="flex gap-3 items-center flex-1 min-h-0">
                                    <div ref={albumCoverRef} className="w-20 h-20 border-t border-l border-[#808080] bg-black shrink-0 shadow-[inset_1px_1px_0_0_rgba(0,0,0,0.5)]">
                                        <Image
                                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                            alt="album cover"
                                            className="object-cover pixelated opacity-80"
                                            fill
                                            sizes="80px"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1 justify-center min-w-0">
                                        <h2 className="font-bold text-[10px] truncate text-black mb-0.5">
                                            {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        </h2>
                                        <p className="text-[9px] text-[#424242] truncate mb-3">
                                            {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                        </p>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                className="w-8 h-7 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] shadow-[0.5px_0.5px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080]"
                                                onClick={() => { mobileProps.handlePrevious(); mobileProps.playClickSound(); handleButtonClick(6) }}
                                            >
                                                <SkipBack className="w-3.5 h-3.5 text-black fill-black" />
                                            </button>
                                            <button
                                                className="w-10 h-8 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] shadow-[0.5px_0.5px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080]"
                                                onClick={() => { mobileProps.handlePlayPause(); handleButtonClick(7) }}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 text-black animate-spin" />
                                                ) : mobileProps.isPlaying ? (
                                                    <Pause className="w-4 h-4 text-black fill-black" />
                                                ) : (
                                                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                                                )}
                                            </button>
                                            <button
                                                className="w-8 h-7 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] shadow-[0.5px_0.5px_0_0_#000] flex items-center justify-center active:border-t-[#808080] active:border-l-[#808080]"
                                                onClick={() => { mobileProps.handleNext(); mobileProps.playClickSound(); handleButtonClick(8) }}
                                            >
                                                <SkipForward className="w-3.5 h-3.5 text-black fill-black" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 shrink-0 px-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-3 bg-white border-t border-l border-[#808080] overflow-hidden relative">
                                            <div
                                                className="h-full bg-[#000080]"
                                                style={{ width: `${mobileProps.progress}%` }}
                                            />
                                            <Slider
                                                value={[mobileProps.progress]}
                                                max={100}
                                                step={0.1}
                                                onValueChange={mobileProps.handleSeek}
                                                disabled={isLoading}
                                                className="absolute inset-0 opacity-0 h-full cursor-pointer z-10"
                                            />
                                        </div>
                                        <div className="bg-black px-1">
                                            <span className="text-[8px] font-mono text-[#00ff00] tabular-nums whitespace-nowrap">
                                                {mobileProps.formatTime(mobileProps.progress)}
                                            </span>
                                        </div>
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
