import React from "react";

export type SnapType =
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "left-wide"
    | "right-narrow"
    | "three-col-left"
    | "three-col-center"
    | "three-col-right"
    | "four-grid-top-left"
    | "four-grid-top-right"
    | "four-grid-bottom-left"
    | "four-grid-bottom-right"
    | "left-half-right-top"
    | "left-half-right-bottom"
    | "center-wide-left"
    | "center-wide-center"
    | "center-wide-right";

interface SnapMenuProps {
    onSnap: (type: SnapType) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const SnapZone = ({
    className,
    onSnap,
    type,
}: {
    className: string;
    onSnap: (type: SnapType) => void;
    type: SnapType;
}) => (
    <div
        className={`bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors cursor-pointer ${className}`}
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSnap(type);
        }}
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
    />
);

export function SnapMenu({ onSnap, onMouseEnter, onMouseLeave }: SnapMenuProps) {
    return (
        <div
            className="absolute top-full right-0 pt-2 z-50 w-[280px]"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 grid grid-cols-3 gap-4">
                {/* 1. 50/50 Split */}
                <div className="flex gap-1 h-16 w-full group">
                    <SnapZone className="w-1/2 h-full" onSnap={onSnap} type="left" />
                    <SnapZone className="w-1/2 h-full" onSnap={onSnap} type="right" />
                </div>

                {/* 2. 60/40 Split */}
                <div className="flex gap-1 h-16 w-full group">
                    <SnapZone className="w-[60%] h-full" onSnap={onSnap} type="left-wide" />
                    <SnapZone className="w-[40%] h-full" onSnap={onSnap} type="right-narrow" />
                </div>

                {/* 3. Three Columns */}
                <div className="flex gap-1 h-16 w-full group">
                    <SnapZone className="w-1/3 h-full" onSnap={onSnap} type="three-col-left" />
                    <SnapZone className="w-1/3 h-full" onSnap={onSnap} type="three-col-center" />
                    <SnapZone className="w-1/3 h-full" onSnap={onSnap} type="three-col-right" />
                </div>

                {/* 4. Grid (Quadrants) */}
                <div className="grid grid-cols-2 gap-1 h-16 w-full group">
                    <SnapZone className="h-full" onSnap={onSnap} type="four-grid-top-left" />
                    <SnapZone className="h-full" onSnap={onSnap} type="four-grid-top-right" />
                    <SnapZone className="h-full" onSnap={onSnap} type="four-grid-bottom-left" />
                    <SnapZone className="h-full" onSnap={onSnap} type="four-grid-bottom-right" />
                </div>

                {/* 5. Left Half / Right Quarters */}
                <div className="flex gap-1 h-16 w-full group">
                    <SnapZone className="w-1/2 h-full" onSnap={onSnap} type="left" />
                    <div className="flex flex-col gap-1 w-1/2 h-full">
                        <SnapZone className="h-1/2 w-full" onSnap={onSnap} type="left-half-right-top" />
                        <SnapZone className="h-1/2 w-full" onSnap={onSnap} type="left-half-right-bottom" />
                    </div>
                </div>

                {/* 6. Center Wide */}
                <div className="flex gap-1 h-16 w-full group">
                    <SnapZone className="w-1/4 h-full" onSnap={onSnap} type="center-wide-left" />
                    <SnapZone className="w-1/2 h-full" onSnap={onSnap} type="center-wide-center" />
                    <SnapZone className="w-1/4 h-full" onSnap={onSnap} type="center-wide-right" />
                </div>
            </div>
        </div>
    );
}
