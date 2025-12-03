import React from "react";
import Image from "next/image";
import { List, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import PlaylistIcon from "@/assets/PlaylistIcon.png";
import CinamonExit from "@/assets/CinamonExit.png";
import { PlaylistProps } from "./types";

export const Playlist: React.FC<PlaylistProps & {
    buttonsRef?: React.MutableRefObject<HTMLButtonElement[]>;
    handleButtonHover?: (index: number) => void;
    handleButtonLeave?: (index: number) => void;
    handleButtonClick?: (index: number) => void;
}> = ({
    tracks,
    currentTrackId,
    onTrackSelect,
    useSpotify,
    spotifyPlaylistTracks,
    spotifyCurrentTrack,
    formatDuration,
    onClose,
    buttonsRef,
    handleButtonHover,
    handleButtonLeave,
    handleButtonClick,
}) => {
        const displayTracks = useSpotify ? spotifyPlaylistTracks : tracks;

        return (
            <div className="absolute top-0 right-0 w-80 h-full bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col z-10 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-800 dark:text-white shrink-0">
                        Playlist
                    </h4>
                    {onClose && buttonsRef && handleButtonHover && handleButtonLeave && handleButtonClick && (
                        <button
                            ref={(el) => {
                                if (el) buttonsRef.current[1] = el;
                            }}
                            className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                            onClick={() => {
                                onClose();
                                handleButtonClick(1);
                            }}
                            onMouseEnter={() => handleButtonHover(1)}
                            onMouseLeave={() => handleButtonLeave(1)}
                        >
                            <Image src={PlaylistIcon} alt="Playlist Icon" />
                            <div className="absolute top-[21%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                                <List className="h-4 w-4" />
                            </div>
                        </button>
                    )}
                </div>
                <div className="space-y-2 overflow-y-auto px-2 py-2 flex-1 min-h-0">
                    {displayTracks.map((track) => (
                        <div
                            key={track.id}
                            className={cn(
                                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                                (useSpotify
                                    ? spotifyCurrentTrack?.id
                                    : currentTrackId) === track.id
                                    ? "bg-blue-100 dark:bg-blue-900/30"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={() => (useSpotify ? null : onTrackSelect(track))}
                            onMouseEnter={(e) => {
                                const prefersReducedMotion = window.matchMedia(
                                    "(prefers-reduced-motion: reduce)"
                                ).matches;
                                if (!prefersReducedMotion) {
                                    gsap.to(e.currentTarget, {
                                        scale: 1.02,
                                        duration: 0.1,
                                    });
                                }
                            }}
                            onMouseLeave={(e) => {
                                const prefersReducedMotion = window.matchMedia(
                                    "(prefers-reduced-motion: reduce)"
                                ).matches;
                                if (!prefersReducedMotion) {
                                    gsap.to(e.currentTarget, { scale: 1, duration: 0.1 });
                                }
                            }}
                            onMouseDown={(e) => {
                                const prefersReducedMotion = window.matchMedia(
                                    "(prefers-reduced-motion: reduce)"
                                ).matches;
                                if (!prefersReducedMotion) {
                                    gsap.to(e.currentTarget, {
                                        scale: 0.98,
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
                                        scale: 1.02,
                                        duration: 0.1,
                                    });
                                }
                            }}
                        >
                            <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                                <Image
                                    src={
                                        (useSpotify
                                            ? track.album?.images?.[0]?.url
                                            : track.cover) || "/placeholder.svg"
                                    }
                                    alt={useSpotify ? track.name : track.title}
                                    className="object-cover"
                                    fill
                                    sizes="40px"
                                />
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
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
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                {useSpotify
                                    ? formatDuration(track.duration_ms)
                                    : track.duration}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
