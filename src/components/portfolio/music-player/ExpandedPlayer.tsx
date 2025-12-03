import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { List, X } from "lucide-react";
import { gsap } from "gsap";
import MusicWallpaper from "@/assets/MusicWallPaper.gif";
import PlaylistIcon from "@/assets/PlaylistIcon.png";
import CinamonExit from "@/assets/CinamonExit.png";
import { PlayerControls } from "./PlayerControls";
import { SongInfo } from "./SongInfo";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { Playlist } from "./Playlist";
import { Track } from "@/lib/types";

interface ExpandedPlayerProps {
    embedded?: boolean;
    playerRef: React.RefObject<HTMLDivElement | null>;
    showPlaylist: boolean;
    setShowPlaylist: (show: boolean) => void;
    buttonsRef: React.MutableRefObject<HTMLButtonElement[]>;
    handleButtonHover: (index: number) => void;
    handleButtonLeave: (index: number) => void;
    handleButtonClick: (index: number) => void;
    handleDesktopClose: () => void;
    handlePlaylistToggle: () => void;
    albumCoverRef: React.RefObject<HTMLDivElement | null>;
    useSpotify: boolean;
    spotifyCurrentTrack: any;
    currentTrack: Track;
    progress: number;
    handleSeek: (value: number[]) => void;
    isLoading: boolean;
    formatTime: (progress: number) => string;
    spDurationMs: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    volume: number;
    setVolume: (value: number) => void;
    spotifyPlayerRef: React.MutableRefObject<any>;
    playClickSound: () => void;
    playlistRef: React.RefObject<HTMLDivElement | null>;
    spotifyPlaylistTracks: any[];
    playlist: Track[];
    changeTrack: (track: Track) => void;
    formatDuration: (ms: number) => string;
}

export const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({
    embedded,
    playerRef,
    showPlaylist,
    setShowPlaylist,
    buttonsRef,
    handleButtonHover,
    handleButtonLeave,
    handleButtonClick,
    handleDesktopClose,
    handlePlaylistToggle,
    albumCoverRef,
    useSpotify,
    spotifyCurrentTrack,
    currentTrack,
    progress,
    handleSeek,
    isLoading,
    formatTime,
    spDurationMs,
    isPlaying,
    onPlayPause,
    onNext,
    onPrevious,
    volume,
    setVolume,
    spotifyPlayerRef,
    playClickSound,
    playlistRef,
    spotifyPlaylistTracks,
    playlist,
    changeTrack,
    formatDuration,
}) => {

    // Playlist animation
    useEffect(() => {
        if (!playlistRef.current) return;

        if (showPlaylist) {
            gsap.fromTo(
                playlistRef.current,
                { x: 320, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                }
            );
        } else {
            gsap.to(playlistRef.current, {
                x: 320,
                opacity: 0,
                duration: 0.3,
                ease: "back.in(1.7)",
            });
        }
    }, [showPlaylist, playlistRef]);

    return (
        <div
            ref={playerRef}
            className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 ${embedded ? "z-10" : "z-50"
                } backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-cover bg-center transition-all duration-300`}
            style={{
                width: "380px",
                height: "300px",
                backgroundImage: `url(${MusicWallpaper.src})`,
            }}
        >
            <div className="relative flex h-full w-full overflow-hidden">
                {/* Main Player */}
                <div
                    className={`p-6 flex flex-col transition-all duration-300 ${showPlaylist ? "w-full" : "flex-1"
                        }`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            Now Playing
                        </h3>
                        <div className="flex gap-2">
                            <button
                                ref={(el) => {
                                    if (el) buttonsRef.current[1] = el;
                                }}
                                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                                onClick={() => {
                                    handlePlaylistToggle();
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
                            <button
                                ref={(el) => {
                                    if (el) buttonsRef.current[2] = el;
                                }}
                                className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                                onClick={() => {
                                    handleDesktopClose();
                                    handleButtonClick(2);
                                }}
                                onMouseEnter={() => handleButtonHover(2)}
                                onMouseLeave={() => handleButtonLeave(2)}
                            >
                                <Image src={CinamonExit} alt="Cinamon Exit" />
                                <div className="absolute top-[55%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                                    <X className="h-4 w-4" />
                                </div>
                            </button>
                        </div>
                    </div>

                    <SongInfo
                        track={currentTrack}
                        useSpotify={useSpotify}
                        spotifyTrack={spotifyCurrentTrack}
                        albumCoverRef={albumCoverRef}
                    />

                    <ProgressBar
                        progress={progress}
                        duration={currentTrack.duration}
                        durationMs={useSpotify ? spDurationMs : undefined}
                        onSeek={handleSeek}
                        formatTime={formatTime}
                        isLoading={isLoading}
                    />

                    <PlayerControls
                        isPlaying={isPlaying}
                        isLoading={isLoading}
                        onPlayPause={onPlayPause}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        buttonsRef={buttonsRef}
                        handleButtonHover={handleButtonHover}
                        handleButtonLeave={handleButtonLeave}
                        handleButtonClick={handleButtonClick}
                    />

                    <VolumeControl
                        volume={volume}
                        onVolumeChange={(value) => {
                            const v = value[0];
                            setVolume(v);
                            if (useSpotify && spotifyPlayerRef.current) {
                                const vol = Math.min(1, Math.max(0, v / 100));
                                spotifyPlayerRef.current.setVolume(vol);
                            }
                            playClickSound();
                        }}
                        isLoading={isLoading}
                    />
                </div>

                {/* Playlist Panel */}
                {showPlaylist && (
                    <div ref={playlistRef} className="absolute inset-0 z-20">
                        <Playlist
                            tracks={playlist}
                            currentTrackId={currentTrack.id}
                            onTrackSelect={changeTrack}
                            useSpotify={useSpotify}
                            spotifyPlaylistTracks={spotifyPlaylistTracks}
                            spotifyCurrentTrack={spotifyCurrentTrack}
                            formatDuration={formatDuration}
                            onClose={() => setShowPlaylist(false)}
                            buttonsRef={buttonsRef}
                            handleButtonHover={handleButtonHover}
                            handleButtonLeave={handleButtonLeave}
                            handleButtonClick={handleButtonClick}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
