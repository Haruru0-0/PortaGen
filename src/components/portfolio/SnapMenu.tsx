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
        className={`snap-zone cursor-pointer ${className}`}
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

const SnapCell = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-1">
        {/* overflow-hidden keeps zones inside the border frame */}
        <div className="snap-cell flex gap-px h-10 w-full overflow-hidden">
            {children}
        </div>
        <span className="snap-label">{label}</span>
    </div>
);

export function SnapMenu({ onSnap, onMouseEnter, onMouseLeave }: SnapMenuProps) {
    return (
        <div
            className="absolute top-full right-0 pt-1 z-50 w-[220px]"
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
            <div className="snap-menu-panel grid grid-cols-3 gap-2">
                {/* 1. 50/50 — equal flex */}
                <SnapCell label="50/50">
                    <SnapZone className="flex-1 h-full" onSnap={onSnap} type="left" />
                    <SnapZone className="flex-1 h-full" onSnap={onSnap} type="right" />
                </SnapCell>

                {/* 2. 60/40 — 3:2 ratio */}
                <SnapCell label="60/40">
                    <SnapZone className="flex-[3] h-full min-w-0" onSnap={onSnap} type="left-wide" />
                    <SnapZone className="flex-[2] h-full min-w-0" onSnap={onSnap} type="right-narrow" />
                </SnapCell>

                {/* 3. Three equal columns */}
                <SnapCell label="3-COL">
                    <SnapZone className="flex-1 h-full" onSnap={onSnap} type="three-col-left" />
                    <SnapZone className="flex-1 h-full" onSnap={onSnap} type="three-col-center" />
                    <SnapZone className="flex-1 h-full" onSnap={onSnap} type="three-col-right" />
                </SnapCell>

                {/* 4. 2×2 grid — single flex child that's a grid */}
                <SnapCell label="GRID">
                    <div className="flex-1 grid grid-cols-2 gap-px h-full min-w-0">
                        <SnapZone className="h-full" onSnap={onSnap} type="four-grid-top-left" />
                        <SnapZone className="h-full" onSnap={onSnap} type="four-grid-top-right" />
                        <SnapZone className="h-full" onSnap={onSnap} type="four-grid-bottom-left" />
                        <SnapZone className="h-full" onSnap={onSnap} type="four-grid-bottom-right" />
                    </div>
                </SnapCell>

                {/* 5. Left half / right stacked quarters */}
                <SnapCell label="L+2R">
                    <SnapZone className="flex-1 h-full" onSnap={onSnap} type="left" />
                    <div className="flex-1 flex flex-col gap-px h-full min-w-0">
                        <SnapZone className="flex-1 w-full" onSnap={onSnap} type="left-half-right-top" />
                        <SnapZone className="flex-1 w-full" onSnap={onSnap} type="left-half-right-bottom" />
                    </div>
                </SnapCell>

                {/* 6. Center wide — 1:2:1 ratio */}
                <SnapCell label="C-WIDE">
                    <SnapZone className="flex-1 h-full" onSnap={onSnap} type="center-wide-left" />
                    <SnapZone className="flex-[2] h-full min-w-0" onSnap={onSnap} type="center-wide-center" />
                    <SnapZone className="flex-1 h-full" onSnap={onSnap} type="center-wide-right" />
                </SnapCell>
            </div>
        </div>
    );
}
