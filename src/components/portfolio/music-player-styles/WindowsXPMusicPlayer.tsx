import React from "react"
import Image from "next/image"
import { MusicPlayerStyleProps, SpotifyTrack } from "./types"
import { Track } from "@/lib/types"
import { Loader2, Pause, Play, SkipBack, SkipForward, List, X, Minus } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function WindowsXPMusicPlayer(props: MusicPlayerStyleProps) {
    const { playerType, embedded, playerRef, buttonsRef, handleExpandClick, handleButtonClick,
        handleButtonHover, handleButtonLeave, isLoading, albumCoverRef, useSpotify,
        spotifyCurrentTrack, currentTrack } = props

    if (playerType === "collapsed") {
        return (
            <div
                ref={playerRef}
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 ${embedded ? "z-10" : "z-50"}
                music-player`}
            >
                <button
                    ref={(el) => { if (el) buttonsRef.current[0] = el }}
                    className="flex items-center gap-2 p-1.5 bg-[#245edb] border-2 border-[#003bc3] rounded-t-lg shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    onClick={() => { handleExpandClick(); handleButtonClick(0) }}
                    onMouseEnter={() => handleButtonHover(0)}
                    onMouseLeave={() => handleButtonLeave(0)}
                    disabled={isLoading}
                >
                    <div className="w-8 h-8 rounded border border-white/40 overflow-hidden bg-black">
                        <Image
                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                            alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                            className="w-full h-full object-cover"
                            fill
                            sizes="32px"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-white pr-2 font-['Tahoma']">Windows Media Player</span>
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
                className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 ${embedded ? "z-10" : "z-50"
                    } bg-[#ece9d8] border-[3px] border-[#245edb] rounded-t-lg shadow-2xl overflow-hidden transition-all duration-300 font-['Tahoma']`}
                style={{ width: "min(380px, 90vw)", height: "min(400px, 80vh)" }}
            >
                {/* XP Title Bar */}
                <div className="flex justify-between items-center h-[30px] px-2 bg-gradient-to-r from-[#245edb] via-[#3a81f1] to-[#245edb] border-b border-[#003bc3] shrink-0">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-white/20 rounded-sm flex items-center justify-center">
                            <Play className="w-2.5 h-2.5 text-white fill-current" />
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">Windows Media Player</span>
                    </div>
                    <div className="flex gap-0.5">
                        <button className="w-[21px] h-[21px] bg-[#245edb] border border-white/40 rounded-[2px] flex items-center justify-center hover:brightness-110 shadow-[inset_-1px_-1px_1px_rgba(0,0,0,0.3)]">
                            <Minus className="w-3 h-3 text-white" strokeWidth={3} />
                        </button>
                        <button
                            className="w-[21px] h-[21px] bg-[#e31212] border border-white/40 rounded-[2px] flex items-center justify-center hover:bg-[#ff4d4d] shadow-[inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
                            onClick={expandedProps.handleDesktopClose}
                        >
                            <X className="w-3 h-3 text-white" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col h-[calc(100%-30px)] p-1">
                    <div className="flex-1 min-h-0 flex flex-col bg-black rounded-sm border border-[#7ca6ff] relative overflow-hidden">
                        {expandedProps.showPlaylist ? (
                            <div ref={expandedProps.playlistRef} className="w-full h-full flex flex-col min-h-0 bg-[#001c5a] p-3">
                                <h4 className="text-[10px] font-bold text-[#7ca6ff] mb-3 uppercase flex justify-between">
                                    <span>Now Playing</span>
                                    <button onClick={expandedProps.handlePlaylistToggle} className="text-white hover:text-red-400">
                                        <X className="w-3 h-3" strokeWidth={3} />
                                    </button>
                                </h4>
                                <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar scrollbar-xp">
                                    {displayTracks.map((track: any) => {
                                        const isCurrent = (useSpotify ? spotifyCurrentTrack?.id : currentTrack.id) === track.id;
                                        return (
                                            <div
                                                key={track.id}
                                                className={`flex items-center gap-3 p-2 transition-all cursor-pointer group ${isCurrent ? 'bg-[#ff9c00] text-black' : 'text-[#7ca6ff] hover:bg-[#003bc3] hover:text-white'}`}
                                                onClick={() => !useSpotify && expandedProps.changeTrack(track)}
                                            >
                                                <div className="w-8 h-8 shrink-0 border border-white/20">
                                                    <Image
                                                        src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                        alt={useSpotify ? track.name : track.title}
                                                        width={32}
                                                        height={32}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-bold truncate">
                                                        {useSpotify ? track.name : track.title}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-6">
                                <div ref={albumCoverRef} className="w-40 h-40 md:w-48 md:h-48 border-2 border-[#7ca6ff] relative shadow-[0_0_30px_rgba(36,94,219,0.3)]">
                                    <Image
                                        src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                        alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        className="w-full h-full object-cover"
                                        fill
                                        sizes="(max-width: 768px) 160px, 192px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#245edb]/20 to-transparent pointer-events-none" />
                                </div>
                                <div className="text-center space-y-1 w-full px-6">
                                    <h4 className="font-bold text-base md:text-lg truncate text-[#7ca6ff]">
                                        {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                    </h4>
                                    <p className="text-[#3a81f1] text-[10px] font-bold uppercase tracking-wider">
                                        {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* XP Controls Bar */}
                    <div className="bg-gradient-to-b from-[#7ca6ff] to-[#245edb] p-3 mt-1 rounded-sm border border-[#003bc3] flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-black border border-[#003bc3] rounded-full relative overflow-hidden group">
                                <div
                                    className="h-full bg-gradient-to-b from-[#ff9c00] to-[#e68a00] transition-all duration-300"
                                    style={{ width: `${expandedProps.progress}%` }}
                                />
                                <Slider
                                    value={[expandedProps.progress]}
                                    max={100}
                                    step={0.1}
                                    onValueChange={expandedProps.handleSeek}
                                    disabled={isLoading}
                                    className="absolute inset-x-0 -top-1 opacity-0 cursor-pointer h-5 z-10"
                                />
                            </div>
                            <span className="text-[9px] font-bold text-white min-w-[30px]">{expandedProps.formatTime(expandedProps.progress)}</span>
                        </div>

                        <div className="flex justify-between items-center px-2">
                            <button
                                className="w-8 h-8 bg-gradient-to-b from-[#3a81f1] to-[#245edb] border border-white/20 rounded-lg flex items-center justify-center shadow-lg hover:brightness-110 active:shadow-inner"
                                onClick={expandedProps.handlePlaylistToggle}
                            >
                                <List className="w-4 h-4 text-white" />
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    className="w-10 h-10 bg-gradient-to-b from-[#3a81f1] to-[#245edb] border-2 border-white/40 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 active:brightness-90"
                                    onClick={expandedProps.onPrevious}
                                >
                                    <SkipBack className="w-5 h-5 text-white fill-current" />
                                </button>
                                <button
                                    className="w-12 h-12 bg-gradient-to-b from-[#4bc500] to-[#2e7d00] border-2 border-white/60 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(75,197,0,0.5)] hover:brightness-110 active:brightness-90"
                                    onClick={expandedProps.onPlayPause}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    ) : expandedProps.isPlaying ? (
                                        <Pause className="w-7 h-7 text-white fill-current" />
                                    ) : (
                                        <Play className="w-7 h-7 text-white fill-current ml-1" />
                                    )}
                                </button>
                                <button
                                    className="w-10 h-10 bg-gradient-to-b from-[#3a81f1] to-[#245edb] border-2 border-white/40 rounded-full flex items-center justify-center shadow-lg hover:brightness-110 active:brightness-90"
                                    onClick={expandedProps.onNext}
                                >
                                    <SkipForward className="w-5 h-5 text-white fill-current" />
                                </button>
                            </div>

                            <div className="w-8" />
                        </div>
                    </div>
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
            <div className="flex flex-col items-center justify-center w-full px-4 font-['Tahoma']">
                <div
                    ref={playerRef}
                    className="w-full bg-[#ece9d8] border-[3px] border-[#245edb] rounded-lg shadow-xl overflow-hidden transition-all duration-300"
                    style={{ height: mobileProps.showPlaylist ? "300px" : "180px" }}
                >
                    <div className="flex flex-col h-full">
                        {/* Mobile XP Title */}
                        <div className="flex justify-between items-center h-7 px-2 bg-gradient-to-r from-[#245edb] to-[#3a81f1] shrink-0">
                            <span className="text-[10px] font-bold text-white">Media Player Mobile</span>
                            <button className="text-white opacity-60 hover:opacity-100" onClick={mobileProps.handlePlaylistToggle}>
                                <List className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="p-3 flex flex-col h-full">
                            {mobileProps.showPlaylist ? (
                                <div className="flex flex-col h-full min-h-0 bg-white border border-[#003bc3] p-1">
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
                                                        className={`flex flex-col items-center gap-2 min-w-[100px] max-w-[100px] transition-all ${isCurrent ? 'scale-105' : 'opacity-60 active:scale-95'}`}
                                                        onClick={() => !useSpotify && mobileProps.changeTrack(track)}
                                                    >
                                                        <div className={`w-16 h-16 rounded border-2 transition-all ${isCurrent ? 'border-[#ff9c00] shadow-md' : 'border-[#245edb]/20'}`}>
                                                            <Image
                                                                src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                                alt={useSpotify ? track.name : track.title}
                                                                width={64}
                                                                height={64}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <p className={`text-[9px] font-bold truncate w-full text-center ${isCurrent ? 'text-[#e68a00]' : 'text-[#245edb]'}`}>
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
                                        <div ref={albumCoverRef} className="w-20 h-20 rounded border-2 border-[#245edb] shrink-0 bg-black">
                                            <Image
                                                src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                                alt="album cover"
                                                className="object-cover"
                                                fill
                                                sizes="80px"
                                            />
                                        </div>

                                        <div className="flex flex-col flex-1 justify-center min-w-0">
                                            <h2 className="font-bold text-xs truncate text-[#003bc3]">
                                                {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                            </h2>
                                            <p className="text-[10px] font-bold text-[#3a81f1] truncate mb-3">
                                                {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="w-10 h-10 rounded-full bg-gradient-to-b from-[#3a81f1] to-[#245edb] border border-white/40 flex items-center justify-center shadow active:scale-90"
                                                    onClick={() => { mobileProps.handlePrevious(); mobileProps.playClickSound(); handleButtonClick(6) }}
                                                >
                                                    <SkipBack className="w-4 h-4 text-white fill-current" />
                                                </button>
                                                <button
                                                    className="w-12 h-12 rounded-full bg-gradient-to-b from-[#4bc500] to-[#2e7d00] border border-white/60 flex items-center justify-center shadow-lg active:scale-90"
                                                    onClick={() => { mobileProps.handlePlayPause(); handleButtonClick(7) }}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                    ) : mobileProps.isPlaying ? (
                                                        <Pause className="w-6 h-6 text-white fill-current" />
                                                    ) : (
                                                        <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                                                    )}
                                                </button>
                                                <button
                                                    className="w-10 h-10 rounded-full bg-gradient-to-b from-[#3a81f1] to-[#245edb] border border-white/40 flex items-center justify-center shadow active:scale-90"
                                                    onClick={() => { mobileProps.handleNext(); mobileProps.playClickSound(); handleButtonClick(8) }}
                                                >
                                                    <SkipForward className="w-4 h-4 text-white fill-current" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 shrink-0 px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2.5 bg-white border border-[#245edb] rounded-full overflow-hidden relative">
                                                <div
                                                    className="h-full bg-[#ff9c00]"
                                                    style={{ width: `${mobileProps.progress}%` }}
                                                />
                                                <Slider
                                                    value={[mobileProps.progress]}
                                                    max={100}
                                                    step={0.1}
                                                    onValueChange={mobileProps.handleSeek}
                                                    disabled={isLoading}
                                                    className="absolute inset-x-0 -top-1 opacity-0 h-4 cursor-pointer z-10"
                                                />
                                            </div>
                                            <span className="text-[8px] font-bold text-[#245edb] tabular-nums">{mobileProps.formatTime(mobileProps.progress)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
