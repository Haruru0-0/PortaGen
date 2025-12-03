import React from "react";
import Image from "next/image";
import { Loader2, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import sanrio from "@/assets/sanrio.png";
import Forward from "@/assets/Forward.png";
import Previous from "@/assets/Previous.png";
import { PlayerControlsProps } from "./types";

export const PlayerControls: React.FC<PlayerControlsProps> = ({
    isPlaying,
    isLoading,
    onPlayPause,
    onNext,
    onPrevious,
    buttonsRef,
    handleButtonHover,
    handleButtonLeave,
    handleButtonClick,
}) => {
    return (
        <div className="flex items-center justify-center gap-4 mb-4">
            <button
                ref={(el) => {
                    if (el) buttonsRef.current[3] = el;
                }}
                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                    onPrevious();
                    handleButtonClick(3);
                }}
                onMouseEnter={() => handleButtonHover(3)}
                onMouseLeave={() => handleButtonLeave(3)}
                disabled={isLoading}
            >
                <Image src={Previous} alt="previous" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <SkipBack className="h-4 w-4" />
                </div>
            </button>

            <button
                ref={(el) => {
                    if (el) buttonsRef.current[4] = el;
                }}
                className="w-18 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                    onPlayPause();
                    handleButtonClick(4);
                }}
                onMouseEnter={() => handleButtonHover(4)}
                onMouseLeave={() => handleButtonLeave(4)}
                disabled={isLoading}
            >
                <Image src={sanrio} alt="sanrio" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                </div>
            </button>

            <button
                ref={(el) => {
                    if (el) buttonsRef.current[5] = el;
                }}
                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                    onNext();
                    handleButtonClick(5);
                }}
                onMouseEnter={() => handleButtonHover(5)}
                onMouseLeave={() => handleButtonLeave(5)}
                disabled={isLoading}
            >
                <Image src={Forward} alt="forward" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <SkipForward className="h-4 w-4" />
                </div>
            </button>
        </div>
    );
};
