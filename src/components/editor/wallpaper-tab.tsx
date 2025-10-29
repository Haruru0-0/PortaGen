import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { Library } from "lucide-react"

interface Wallpaper {
    id: number
    name: string
    url?: string
    color?: string
}

interface WallpaperTabProps {
    type: "lockScreen" | "desktop"
    preview: string
    selectedWallpaper: Wallpaper | null
    wallpapers: Wallpaper[]
    desktopGif?: string
    onUpload: (file: File) => void
    onGifUpload?: (file: File) => void
    onSelectWallpaper?: (wallpaper: Wallpaper) => void
    onOpenLibrary: () => void
}

export function WallpaperTab({
                                 type,
                                 preview,
                                 selectedWallpaper,
                                 wallpapers,
                                 desktopGif,
                                 onUpload,
                                 onGifUpload,
                                 onSelectWallpaper,
                                 onOpenLibrary,
                             }: WallpaperTabProps) {
    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm pixel-text-shadow">
                    {type === "lockScreen" ? "LOCK SCREEN WALLPAPER" : "DESKTOP WALLPAPER"}
                </h3>

                {type === "desktop" && onGifUpload && (
                    <FileUpload
                        accept="image/gif,image/*"
                        onFileSelect={onGifUpload}
                        preview={desktopGif || ""}
                        label="DESKTOP GIF/IMAGE"
                        maxSize={5}
                    />
                )}

                <FileUpload
                    accept="image/*"
                    onFileSelect={onUpload}
                    preview={preview}
                    label={type === "lockScreen" ? "LOCK SCREEN IMAGE" : "UPLOAD CUSTOM"}
                    maxSize={5}
                />

                <PixelButton
                    variant="secondary"
                    className="w-full text-[10px] flex items-center justify-center gap-2"
                    onClick={onOpenLibrary}
                >
                    <Library className="w-4 h-4" />
                    CHOOSE FROM LIBRARY
                </PixelButton>

                {type === "desktop" && onSelectWallpaper && (
                    <div>
                        <p className="text-[10px] mb-3">SELECTED</p>
                        <div className="grid grid-cols-2 gap-3">
                            {wallpapers.slice(0, 4).map((wallpaper) => (
                                <button
                                    key={wallpaper.id}
                                    onClick={() => onSelectWallpaper(wallpaper)}
                                    className={`aspect-video cursor-pointer border-4 transition-colors ${
                                        selectedWallpaper?.id === wallpaper.id
                                            ? "border-primary"
                                            : "border-border hover:border-muted-foreground"
                                    }`}
                                >
                                    {wallpaper.url ? (
                                        <img
                                            src={wallpaper.url || "/placeholder.svg"}
                                            alt={wallpaper.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className={`w-full h-full bg-gradient-to-br ${wallpaper.color}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PixelCard>
    )
}