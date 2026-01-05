import React from "react"
import Image from "next/image"
import { MusicPlayerStyleProps, SpotifyTrack } from "./types"
import { Track } from "@/lib/types"
import MusicPlayerImage from "@/assets/MusicPlayerImage.png"
import MusicWallpaper from "@/assets/MusicWallPaper.gif"
import { Loader2, Pause, Play, SkipBack, SkipForward, List, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function PixelMusicPlayer(props: MusicPlayerStyleProps) {
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
                    className="flex items-center h-10 px-3 gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    style={{
                        background: "#000",
                        border: "4px solid #fff",
                        boxShadow: "4px 4px 0px rgba(0,0,0,0.5)",
                    }}
                    onClick={() => { handleExpandClick(); handleButtonClick(0) }}
                    onMouseEnter={() => handleButtonHover(0)}
                    onMouseLeave={() => handleButtonLeave(0)}
                    disabled={isLoading}
                >
                    <div
                        ref={albumCoverRef}
                        className="w-5 h-5 border-2 border-white overflow-hidden relative"
                    >
                        <Image
                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                            alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                            className="w-full h-full object-cover pixelated"
                            fill
                            sizes="20px"
                        />
                    </div>
                    <span className="text-white text-[10px] font-pixel truncate max-w-[100px] uppercase">
                        {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title || "PIXEL AUDIO"}
                    </span>
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
                    } shadow-[8px_8px_0px_rgba(0,0,0,0.4)] transition-all duration-300`}
                style={{
                    width: "min(380px, 90vw)",
                    height: "min(420px, 80vh)",
                    background: "#000",
                    border: "4px solid #fff",
                    padding: "4px"
                }}
            >
                {/* Pixel Title Bar */}
                <div
                    className="flex justify-between items-center h-8 px-2 mb-2 bg-[#ff00ff] shrink-0"
                    style={{ border: "2px solid #000" }}
                >
                    <div className="flex items-center gap-2">
                        <button
                            className={`w-6 h-6 flex items-center justify-center bg-white border-2 border-black active:translate-y-0.5 ${expandedProps.showPlaylist ? 'bg-[#ffff00]' : ''}`}
                            onClick={expandedProps.handlePlaylistToggle}
                        >
                            <List className="w-4 h-4 text-black" />
                        </button>
                        <h3 className="font-bold text-[10px] text-black font-pixel uppercase">PIXEL MEDIA</h3>
                    </div>
                    <div className="flex gap-1">
                        <button
                            ref={(el) => { if (el) buttonsRef.current[2] = el }}
                            className="w-6 h-6 flex items-center justify-center bg-white border-2 border-black active:translate-y-0.5"
                            onClick={expandedProps.handleDesktopClose}
                            onMouseEnter={() => handleButtonHover(2)}
                            onMouseLeave={() => handleButtonLeave(2)}
                        >
                            <X className="w-3.5 h-3.5 text-black" />
                        </button>
                    </div>
                </div>

                <div className="relative flex flex-col h-[calc(100%-48px)] w-full p-2 gap-4">
                    <div className="flex flex-col flex-1 min-h-0">
                        {expandedProps.showPlaylist ? (
                            <div ref={expandedProps.playlistRef} className="w-full h-full flex flex-col min-h-0">
                                <h4 className="text-[#00ffff] font-pixel text-[10px] mb-2 uppercase tracking-widest pl-1">TRACK LIST</h4>
                                <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar scrollbar-pixel">
                                    {displayTracks.map((track: any) => {
                                        const isCurrent = (useSpotify ? spotifyCurrentTrack?.id : currentTrack.id) === track.id;
                                        return (
                                            <div
                                                key={track.id}
                                                className={`flex items-center gap-3 p-2 border-2 transition-all cursor-pointer ${isCurrent ? 'bg-[#00ff00] border-white' : 'bg-zinc-900 border-transparent hover:border-[#ff00ff]'}`}
                                                onClick={() => !useSpotify && expandedProps.changeTrack(track)}
                                            >
                                                <div className="w-8 h-8 border-2 border-white flex-shrink-0">
                                                    <Image
                                                        src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                        alt={useSpotify ? track.name : track.title}
                                                        width={32}
                                                        height={32}
                                                        className="object-cover w-full h-full pixelated"
                                                    />
                                                </div>
                                                <p className={`text-[10px] font-pixel truncate flex-1 ${isCurrent ? 'text-black' : 'text-white'}`}>
                                                    {useSpotify ? track.name : track.title}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1 h-full min-h-0 items-center justify-center gap-4">
                                <div ref={albumCoverRef} className="w-32 h-32 md:w-40 md:h-40 border-4 border-white overflow-hidden bg-zinc-900 flex items-center justify-center relative shadow-[4px_4px_0px_#444] shrink-0">
                                    <Image
                                        src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                        alt={(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                        className="w-full h-full object-cover pixelated"
                                        width={160}
                                        height={160}
                                    />
                                </div>
                                <div className="flex flex-col items-center text-center w-full gap-2 min-w-0">
                                    <h4 className="font-bold text-sm truncate max-w-full text-[#00ff00] font-pixel uppercase tracking-wider">
                                        {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                    </h4>
                                    <p className="text-[10px] truncate max-w-full text-[#00ffff] font-pixel">
                                        {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pixel Progress Area */}
                    <div className="space-y-1 shrink-0">
                        <Slider
                            value={[expandedProps.progress]}
                            max={100}
                            step={0.1}
                            className="flex-1"
                            onValueChange={expandedProps.handleSeek}
                            disabled={isLoading}
                            trackClassName="bg-zinc-800 h-4 border-2 border-white rounded-none"
                            rangeClassName="bg-[#ffff00]"
                            thumbClassName="h-6 w-3 bg-white border-2 border-black rounded-none shadow-none ring-0 focus:ring-0"
                        />
                        <div className="flex justify-between text-[8px] text-white font-pixel px-1 uppercase mt-1">
                            <span>{expandedProps.formatTime(expandedProps.progress)}</span>
                            <span>{currentTrack.duration}</span>
                        </div>
                    </div>

                    {/* Pixel Controls */}
                    <div className="flex justify-center items-center gap-4 mt-auto shrink-0 pb-1">
                        <button
                            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_#444]"
                            onClick={expandedProps.onPrevious}
                        >
                            <SkipBack className="w-5 h-5 text-black fill-black" />
                        </button>
                        <button
                            className="w-14 h-14 flex items-center justify-center bg-[#00ff00] border-4 border-white active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_rgba(0,255,0,0.3)]"
                            onClick={expandedProps.onPlayPause}
                        >
                            {isLoading ? (
                                <Loader2 className="w-7 h-7 text-black animate-spin" />
                            ) : expandedProps.isPlaying ? (
                                <Pause className="w-7 h-7 text-black fill-black" />
                            ) : (
                                <Play className="w-7 h-7 text-black fill-black ml-1" />
                            )}
                        </button>
                        <button
                            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_#444]"
                            onClick={expandedProps.onNext}
                        >
                            <SkipForward className="w-5 h-5 text-black fill-black" />
                        </button>
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
            <div className="flex flex-col items-center justify-center w-full px-4">
                <div
                    ref={playerRef}
                    className="w-full bg-black border-4 border-white p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden"
                    style={{ height: mobileProps.showPlaylist ? "300px" : "180px" }}
                >
                    <div className="pixel-content relative flex flex-col h-full gap-3 text-white">
                        {mobileProps.showPlaylist ? (
                            <div className="flex flex-col h-full min-h-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-[10px] font-pixel text-[#00ffff] uppercase tracking-widest">TRACKS</h4>
                                    <button
                                        className="w-8 h-8 bg-[#ff00ff] border-2 border-black flex items-center justify-center active:translate-y-0.5"
                                        onClick={mobileProps.handlePlaylistToggle}
                                    >
                                        <X className="w-4 h-4 text-black" />
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
                                                    className={`flex flex-col items-center gap-2 min-w-[100px] max-w-[100px] transition-all ${isCurrent ? 'scale-105' : 'opacity-80 active:scale-95'}`}
                                                    onClick={() => !useSpotify && mobileProps.changeTrack(track)}
                                                >
                                                    <div className={`w-20 h-20 border-2 transition-all ${isCurrent ? 'border-[#00ffcc] shadow-[0_0_10px_#00ffcc]' : 'border-[#333]'}`}>
                                                        <Image
                                                            src={(useSpotify ? track.album?.images?.[0]?.url : track.cover) || "/placeholder.svg"}
                                                            alt={useSpotify ? track.name : track.title}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover w-full h-full pixelated"
                                                        />
                                                    </div>
                                                    <p className={`text-[10px] font-pixel truncate w-full text-center ${isCurrent ? 'text-[#00ffcc]' : 'text-purple-400'}`}>
                                                        {useSpotify ? track.name : track.title}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-row items-center gap-4 flex-1 min-h-0">
                                    <div ref={albumCoverRef} className="w-20 h-20 border-2 border-white flex-shrink-0 bg-zinc-900 relative shadow-[4px_4px_0px_#444]">
                                        <Image
                                            src={(useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) || currentTrack.cover || "/placeholder.svg"}
                                            alt={`${(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title} album cover`}
                                            className="object-cover pixelated"
                                            fill
                                            sizes="80px"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1 gap-2 h-full justify-center min-w-0">
                                        <div className="w-full flex flex-col items-start min-w-0">
                                            <h2 className="font-bold text-[11px] truncate w-full text-[#00ff00] font-pixel uppercase tracking-wider">
                                                {(useSpotify && spotifyCurrentTrack?.name) || currentTrack.title}
                                            </h2>
                                            <p className="text-[10px] truncate w-full text-[#00ffff] font-pixel">
                                                {(useSpotify && spotifyCurrentTrack?.artists?.map((a) => a.name).join(", ")) || currentTrack.artist}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center active:translate-y-0.5"
                                                    onClick={() => { mobileProps.handlePrevious(); mobileProps.playClickSound(); handleButtonClick(6) }}
                                                >
                                                    <SkipBack className="w-4 h-4 text-black fill-black" />
                                                </button>
                                                <button
                                                    className="w-11 h-11 bg-[#00ff00] border-2 border-black flex items-center justify-center active:translate-y-0.5"
                                                    onClick={() => { mobileProps.handlePlayPause(); handleButtonClick(7) }}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-5 h-5 text-black animate-spin" />
                                                    ) : mobileProps.isPlaying ? (
                                                        <Pause className="w-5 h-5 text-black fill-black" />
                                                    ) : (
                                                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                                                    )}
                                                </button>
                                                <button
                                                    className="w-9 h-9 bg-white border-2 border-black flex items-center justify-center active:translate-y-0.5"
                                                    onClick={() => { mobileProps.handleNext(); mobileProps.playClickSound(); handleButtonClick(8) }}
                                                >
                                                    <SkipForward className="w-4 h-4 text-black fill-black" />
                                                </button>
                                            </div>
                                            <button
                                                className="w-9 h-9 bg-[#ffff00] border-2 border-black flex items-center justify-center active:translate-y-0.5"
                                                onClick={() => { mobileProps.handlePlaylistToggle(); handleButtonClick(9) }}
                                            >
                                                <List className="w-4 h-4 text-black" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full mt-2">
                                    <Slider
                                        value={[mobileProps.progress]}
                                        max={100}
                                        step={0.1}
                                        className="cursor-pointer h-3"
                                        onValueChange={mobileProps.handleSeek}
                                        disabled={isLoading}
                                        trackClassName="bg-zinc-800 h-3 border border-white rounded-none"
                                        rangeClassName="bg-[#ffff00]"
                                        thumbClassName="h-4 w-2 bg-white border border-black rounded-none"
                                    />
                                    <div className="flex justify-between text-[8px] mt-1 font-pixel text-white px-1 uppercase">
                                        <span>{mobileProps.formatTime(mobileProps.progress)}</span>
                                        <span>{currentTrack.duration}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return null
}
