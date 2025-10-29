import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { Trash2, Edit2, Plus } from "lucide-react"
import Placeholder from "@/assets/Placeholder.png"
import Image from "next/image";

interface Icon {
    id: number
    name: string
    icon: string
    url?: string
}

interface IconsTabProps {
    icons: Icon[]
    onEdit: (icon: Icon) => void
    onDelete: (id: number) => void
    onAdd: () => void
}

export function IconsTab({ icons, onEdit, onDelete, onAdd }: IconsTabProps) {
    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm pixel-text-shadow">DESKTOP ICONS</h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {icons.map((icon) => (
                        <div
                            key={icon.id}
                            className="flex items-center justify-between p-3 border-2 border-border bg-muted hover:bg-accent transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                        src={Placeholder}
                                        alt={icon.name}
                                        className="w-8 h-8 object-cover border-2 border-border"
                                    />
                                <span className="text-[10px]">{icon.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(icon)}
                                    className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                                >
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => onDelete(icon.id)}
                                    className="w-8 h-8 border-2 border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <PixelButton
                    variant="secondary"
                    className="w-full text-[10px] flex items-center justify-center gap-2"
                    onClick={onAdd}
                >
                    <Plus className="w-4 h-4" />
                    ADD ICON
                </PixelButton>
            </div>
        </PixelCard>
    )
}