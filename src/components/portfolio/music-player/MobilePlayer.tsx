import React from "react";
import Image from "next/image";
import { Loader2, Pause, Play, SkipBack, SkipForward, List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import MusicWallpaper from "@/assets/MusicWallPaper.gif";
import sanrio from "@/assets/sanrio.png";
import Forward from "@/assets/Forward.png";
import Previous from "@/assets/Previous.png";
import PlaylistIcon from "@/assets/PlaylistIcon.png";
import CinamonExit from "@/assets/CinamonExit.png";
import { Slider } from "@/components/ui/slider";
import SliderIcon from "@/assets/SliderIcon.png";
import { Track } from "@/lib/types";

interface MobilePlayerProps {
    playerRef: React.RefObject<HTMLDivElement | null>;
    showPlaylist: boolean;
    setShowPlaylist: (show: boolean) => void;
    albumCoverRef: React.RefObject<HTMLDivElement | null>;
    isLoading: boolean;
    useSpotify: boolean;
    spotifyCurrentTrack: any;
    currentTrack: Track;
    buttonsRef: React.MutableRefObject<HTMLButtonElement[]>;
    handlePrevious: () => void;
    playClickSound: () => void;
    handleButtonClick: (index: number) => void;
    handleButtonHover: (index: number) => void;
    handleButtonLeave: (index: number) => void;
    handlePlayPause: () => void;
    isPlaying: boolean;
    handleNext: () => void;
    handlePlaylistToggle: () => void;
    progress: number;
    handleSeek: (value: number[]) => void;
    formatTime: (progress: number) => string;
    spotifyPlaylistTracks: any[];
    playlist: Track[];
    changeTrack: (track: Track) => void;
    formatDuration: (ms: number) => string;
}

export const MobilePlayer: React.FC<MobilePlayerProps> = ({
    playerRef,
    showPlaylist,
    setShowPlaylist,
    albumCoverRef,
    isLoading,
    useSpotify,
    spotifyCurrentTrack,
    currentTrack,
    buttonsRef,
    handlePrevious,
    playClickSound,
    handleButtonClick,
    handleButtonHover,
    handleButtonLeave,
    handlePlayPause,
    isPlaying,
    handleNext,
    handlePlaylistToggle,
    progress,
    handleSeek,
    formatTime,
    spotifyPlaylistTracks,
    playlist,
    changeTrack,
    formatDuration,
}) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div
                ref={playerRef}
                className="w-full min-h-[220px] rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${MusicWallpaper.src})` }}
            >
                {!showPlaylist ? (
                    <div className="p-4 gap-4 flex flex-row items-center h-full">
                        <div
                            ref={albumCoverRef}
                            className={cn(
                                "w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-md transform transition-transform flex-shrink-0",
                                isLoading ? "opacity-80" : "opacity-100"
                            )}
                        >
                            <Image
                                src={
                                    (useSpotify &&
                                        spotifyCurrentTrack?.album?.images?.[0]?.url) ||
                                    currentTrack.cover ||
                                    "/placeholder.svg"
                                }
                                alt={`${(useSpotify && spotifyCurrentTrack?.name) ||
                                    currentTrack.title
                                    } album cover`}
                                className="object-cover"
                                fill
                                sizes="128px"
                            />
                        </div>

                        <div className="flex flex-col flex-1 gap-3 h-full justify-between min-w-0">
                            <div className="w-full flex flex-col items-start min-w-0">
                                <h2
                                    className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white w-full leading-tight"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {(useSpotify && spotifyCurrentTrack?.name) ||
                                        currentTrack.title}
                                </h2>
                                <p
                                    className="text-sm text-gray-600 dark:text-gray-300 w-full leading-tight"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {(useSpotify &&
                                        spotifyCurrentTrack?.artists
                                            ?.map((a: any) => a.name)
                                            .join(", ")) ||
                                        currentTrack.artist}
                                </p>
                            </div>

                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-2">
                                    <button
                                        ref={(el) => {
                                            if (el) buttonsRef.current[6] = el;
                                        }}
                                        className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                                        onClick={() => {
                                            handlePrevious();
                                            playClickSound();
                                            handleButtonClick(6);
                                        }}
                                        onMouseEnter={() => handleButtonHover(6)}
                                        onMouseLeave={() => handleButtonLeave(6)}
                                        disabled={isLoading}
                                    >
                                        <Image src={Previous} alt="previous" />
                                        <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                                            <SkipBack className="h-3 w-3" />
                                        </div>
                                    </button>

                                    <button
                                        ref={(el) => {
                                            if (el) buttonsRef.current[7] = el;
                                        }}
                                        className="w-16 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                                        onClick={() => {
                                            handlePlayPause();
                                            handleButtonClick(7);
                                        }}
                                        onMouseEnter={() => handleButtonHover(7)}
                                        onMouseLeave={() => handleButtonLeave(7)}
                                        disabled={isLoading}
                                    >
                                        <Image src={sanrio} alt="sanrio" />
                                        <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                                            {isLoading ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : isPlaying ? (
                                                <Pause className="h-3 w-3" />
                                            ) : (
                                                <Play className="h-3 w-3" />
                                            )}
                                        </div>
                                    </button>

                                    <button
                                        ref={(el) => {
                                            if (el) buttonsRef.current[8] = el;
                                        }}
                                        className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                                        onClick={() => {
                                            handleNext();
                                            playClickSound();
                                            handleButtonClick(8);
                                        }}
                                        onMouseEnter={() => handleButtonHover(8)}
                                        onMouseLeave={() => handleButtonLeave(8)}
                                        disabled={isLoading}
                                    >
                                        <Image src={Forward} alt="forward" />
                                        <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                                            <SkipForward className="h-3 w-3" />
                                        </div>
                                    </button>
                                </div>
                                <button
                                    ref={(el) => {
                                        if (el) buttonsRef.current[9] = el;
                                    }}
                                    className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                                    onClick={() => {
                                        handlePlaylistToggle();
                                        handleButtonClick(9);
                                    }}
                                    onMouseEnter={() => handleButtonHover(9)}
                                    onMouseLeave={() => handleButtonLeave(9)}
                                    disabled={isLoading}
                                >
                                    <Image src={PlaylistIcon} alt="Playlist Icon" />
                                    <div className="absolute top-[20%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                                        <List className="h-3 w-3" />
                                    </div>
                                </button>
                            </div>

                            <div className="w-full">
                                <Slider
                                    value={[progress]}
                                    max={100}
                                    step={0.1}
                                    className="cursor-pointer w-full"
                                    onValueChange={handleSeek}
                                    disabled={isLoading}
                                    trackClassName="bg-[#ccf2fc]"
                                    rangeClassName="bg-[#74defc]"
                                    thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                                    thumb={
                                        <Image
                                            src={SliderIcon}
                                            className="w-full h-full object-cover rounded-full"
                                            alt={"sliderIcon"}
                                            width={32}
                                            height={32}
                                        />
                                    }
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{formatTime(progress)}</span>
                                    <span>{currentTrack.duration}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                Playlist
                            </h3>
                            <button
                                ref={(el) => {
                                    if (el) buttonsRef.current[10] = el;
                                }}
                                className="w-8 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                                onClick={() => {
                                    setShowPlaylist(false);
                                    playClickSound();
                                    handleButtonClick(10);
                                }}
                                onMouseEnter={() => handleButtonHover(10)}
                                onMouseLeave={() => handleButtonLeave(10)}
                            >
                                <Image src={CinamonExit} alt="Cinamon Exit" />
                                <div className="absolute top-[55%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                                    <X className="h-3 w-3" />
                                </div>
                            </button>
                        </div>

                        {/* Horizontal scrolling playlist */}
                        <div className="flex-1 overflow-hidden">
                            <div
                                className="flex gap-3 overflow-x-auto p-2 py-2 h-full"
                                style={{ scrollbarWidth: "thin" }}
                            >
                                {(useSpotify ? spotifyPlaylistTracks : playlist).map(
                                    (track) => (
                                        <div
                                            key={track.id}
                                            className={cn(
                                                "flex flex-row gap-2 shrink-0 min-w-[200px] max-w-[200px] items-center bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 cursor-pointer transition-all duration-200 border",
                                                (useSpotify
                                                    ? spotifyCurrentTrack?.id
                                                    : currentTrack.id) === track.id
                                                    ? "border-blue-400 bg-blue-100/30 dark:bg-blue-900/30"
                                                    : "border-white/20 hover:bg-white/30 dark:hover:bg-gray-700/50"
                                            )}
                                            onClick={() => {
                                                if (!useSpotify) {
                                                    changeTrack(track);
                                                    setShowPlaylist(false);
                                                }
                                            }}
                                            onMouseEnter={(e) => {
                                                const prefersReducedMotion = window.matchMedia(
                                                    "(prefers-reduced-motion: reduce)"
                                                ).matches;
                                                if (!prefersReducedMotion) {
                                                    gsap.to(e.currentTarget, {
                                                        scale: 1.05,
                                                        y: -2,
                                                        duration: 0.1,
                                                    });
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const prefersReducedMotion = window.matchMedia(
                                                    "(prefers-reduced-motion: reduce)"
                                                ).matches;
                                                if (!prefersReducedMotion) {
                                                    gsap.to(e.currentTarget, {
                                                        scale: 1,
                                                        y: 0,
                                                        duration: 0.1,
                                                    });
                                                }
                                            }}
                                            onMouseDown={(e) => {
                                                const prefersReducedMotion = window.matchMedia(
                                                    "(prefers-reduced-motion: reduce)"
                                                ).matches;
                                                if (!prefersReducedMotion) {
                                                    gsap.to(e.currentTarget, {
                                                        scale: 0.95,
                                                        duration: 0.1,
                                                    });
                                                }
                                            }}
                                            onMouseUp={(e) => {
                                                const prefersReducedMotion = window.matchMedia(
                                                    "(prefers-reduced-motion: reduce)"
                                                ).matches;
                                                if (!prefersReducedMotion) {
                                                    gsap.to(e.currentTarget, {
                                                        scale: 1.05,
                                                        duration: 0.1,
                                                    });
                                                }
                                            }}
                                        >
                                            <div className="w-12 h-12 aspect-square rounded-lg overflow-hidden relative">
                                                <Image
                                                    src={
                                                        (useSpotify
                                                            ? track.album?.images?.[0]?.url
                                                            : track.cover) || "/placeholder.svg"
                                                    }
                                                    alt={useSpotify ? track.name : track.title}
                                                    className="object-cover"
                                                    fill
                                                    sizes="48px"
                                                />
                                            </div>
                                            <div className="text-center min-w-0 flex-1 overflow-hidden">
                                                <p
                                                    className="font-medium text-sm text-gray-800 dark:text-white leading-tight"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {useSpotify ? track.name : track.title}
                                                </p>
                                                <p
                                                    className="text-xs text-gray-600 dark:text-gray-300 leading-tight"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {useSpotify
                                                        ? track.artists?.map((a: any) => a.name).join(", ")
                                                        : track.artist}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                                                    {useSpotify
                                                        ? formatDuration(track.duration_ms)
                                                        : track.duration}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
