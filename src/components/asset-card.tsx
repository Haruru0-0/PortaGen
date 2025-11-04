import {PixelCard} from "@/components/pixel-card";
import Image from "next/image";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import Edit from "@/assets/Edit.png";
import {PixelButton} from "@/components/pixel-button";
import Download from "@/assets/Download.png";
import Delete from "@/assets/Delete.png";
import {Asset} from "@/lib/types";

export default function AssetCard(props: {
    onToggle: () => void,
    selectedAssets: number[],
    asset: Asset,
    assetIcon: string,
    onRename: () => void,
    fileSize: string,
    onView: () => void,
    onDownload: () => void,
    onDelete: () => void
}) {
    return <PixelCard className="relative">
        <div className="space-y-3">
            <div className="absolute top-4 left-4 z-10">
                <button
                    onClick={props.onToggle}
                    className={`w-6 h-6 border-2 border-border ${
                        props.selectedAssets.includes(props.asset.id) ? "bg-primary" : "bg-card"
                    } flex items-center justify-center`}
                >
                    {props.selectedAssets.includes(props.asset.id) && (
                        <span className="text-[10px]">✓</span>
                    )}
                </button>
            </div>

            <div
                className="aspect-square bg-muted border-2 border-border flex items-center justify-center text-4xl overflow-hidden relative">
                {props.asset.url && props.asset.type !== "music" && props.asset.type !== "sound" ? (
                    <Image
                        src={props.asset.thumbnailUrl || props.asset.url}
                        alt={props.asset.name}
                        fill
                        sizes="200px"
                        className="object-cover"
                    />
                ) : (
                    props.assetIcon
                )}
            </div>

            <div className="space-y-1">
                {/* Asset Name with Rename Button */}
                <div className="flex items-center justify-between gap-1 group">
                    <div className="text-xs">
                        {props.asset.name}.{props.asset.mimeType ? props.asset.mimeType.split("/")[1] : "file"}
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={props.onRename}
                                className="w-8 h-8 border-2 bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                                <Image alt={"Edit button"} src={Edit}/>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Rename</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="flex flex-col text-[10px] text-muted-foreground">
                    <p>{props.fileSize}</p>
                    <p>{new Date(props.asset.date).toLocaleDateString()}</p>
                    <p>{props.asset.type}</p>
                </div>
            </div>

            <div className="flex gap-2">
                <PixelButton
                    variant="secondary"
                    className="flex-1 text-[10px] px-2 py-1"
                    onClick={props.onView}
                >
                    VIEW
                </PixelButton>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="w-8 h-8 border-2 border-border bg-card hover:bg-muted text-[10px]"
                            onClick={props.onDownload}
                        >
                            <Image alt={"Download button"} src={Download}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Download</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="w-8 h-8 border-2 bg-card hover:bg-destructive text-[10px]"
                            onClick={props.onDelete}
                        >
                            <Image alt={"Delete button"} src={Delete}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    </PixelCard>;
}