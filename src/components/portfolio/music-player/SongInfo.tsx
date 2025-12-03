import React from "react";
import Image from "next/image";
import { SongInfoProps } from "./types";

export const SongInfo: React.FC<SongInfoProps> = ({
    track,
    useSpotify,
    spotifyTrack,
    albumCoverRef,
}) => {
    return (
        <div className="flex gap-4 mb-4">
            <div
                ref={albumCoverRef}
                className="w-20 h-20 rounded-xl overflow-hidden shadow-lg relative flex-shrink-0"
            >
                <Image
                    src={
                        (useSpotify && spotifyTrack?.album?.images?.[0]?.url) ||
                        track.cover ||
                        "/placeholder.svg"
                    }
                    alt={(useSpotify && spotifyTrack?.name) || track.title}
                    className="w-full h-full object-cover"
                    fill
                    sizes="80px"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h4
                    className="font-bold text-gray-800 dark:text-white text-base leading-tight"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {(useSpotify && spotifyTrack?.name) || track.title}
                </h4>
                <p
                    className="text-sm text-gray-600 dark:text-gray-300 leading-tight"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {(useSpotify &&
                        spotifyTrack?.artists?.map((a: any) => a.name).join(", ")) ||
                        track.artist}
                </p>
            </div>
        </div>
    );
};
