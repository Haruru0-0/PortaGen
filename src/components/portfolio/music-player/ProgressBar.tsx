import React from "react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import SliderIcon from "@/assets/SliderIcon.png";
import { ProgressBarProps } from "./types";

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    duration,
    durationMs,
    onSeek,
    formatTime,
    isLoading,
}) => {
    return (
        <div className="mt-2">
            <Slider
                value={[progress]}
                max={100}
                step={0.1}
                className="cursor-pointer w-full"
                onValueChange={onSeek}
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
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatTime(progress)}</span>
                <span>
                    {durationMs
                        ? new Date(durationMs).toISOString().substr(14, 5)
                        : duration}
                </span>
            </div>
        </div>
    );
};
