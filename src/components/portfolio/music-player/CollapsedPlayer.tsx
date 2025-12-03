import React from "react";
import Image from "next/image";
import MusicPlayerImage from "@/assets/MusicPlayerImage.png";
import { Track } from "@/lib/types";

interface CollapsedPlayerProps {
    embedded?: boolean;
    playerRef: React.RefObject<HTMLDivElement | null>;
    buttonsRef: React.MutableRefObject<HTMLButtonElement[]>;
    handleExpandClick: () => void;
    handleButtonClick: (index: number) => void;
    handleButtonHover: (index: number) => void;
    handleButtonLeave: (index: number) => void;
    isLoading: boolean;
    albumCoverRef: React.RefObject<HTMLDivElement | null>;
    useSpotify: boolean;
    spotifyCurrentTrack: any;
    currentTrack: Track;
}

export const CollapsedPlayer: React.FC<CollapsedPlayerProps> = ({
    embedded,
    playerRef,
    buttonsRef,
    handleExpandClick,
    handleButtonClick,
    handleButtonHover,
    handleButtonLeave,
    isLoading,
    albumCoverRef,
    useSpotify,
    spotifyCurrentTrack,
    currentTrack,
}) => {
    return (
        <div
            ref={playerRef}
            className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 ${embedded ? "z-10" : "z-50"
                }`}
        >
            <button
                ref={(el) => {
                    if (el) buttonsRef.current[0] = el;
                }}
                className="w-20 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                    handleExpandClick();
                    handleButtonClick(0);
                }}
                onMouseEnter={() => handleButtonHover(0)}
                onMouseLeave={() => handleButtonLeave(0)}
                disabled={isLoading}
            >
                <Image src={MusicPlayerImage} alt="Music Player" />
                <div
                    ref={albumCoverRef}
                    className="absolute top-[60.5%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full overflow-hidden border-2 border-white/30"
                >
                    <Image
                        src={
                            (useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) ||
                            currentTrack.cover ||
                            "/placeholder.svg"
                        }
                        alt={
                            (useSpotify && spotifyCurrentTrack?.name) || currentTrack.title
                        }
                        className="w-full h-full object-cover"
                        fill
                        sizes="56px"
                    />
                </div>
            </button>
        </div>
    );
};
