import React from "react";
import Image from "next/image";
import { Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import SliderIcon from "@/assets/SliderIcon.png";
import { VolumeControlProps } from "./types";

export const VolumeControl: React.FC<VolumeControlProps> = ({
    volume,
    onVolumeChange,
    isLoading,
}) => {
    return (
        <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <Slider
                value={[volume]}
                max={100}
                step={1}
                className="cursor-pointer w-full flex-1"
                onValueChange={onVolumeChange}
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
            <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                {volume}
            </span>
        </div>
    );
};
