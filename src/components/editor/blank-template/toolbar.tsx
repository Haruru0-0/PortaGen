import React from "react"
import { useDraggable } from "@dnd-kit/core"
import { ComponentType } from "@/lib/types"
import { Type, ImageIcon, CreditCard, MousePointerClick, Minus, ArrowUpDown, Layout } from "lucide-react"
import { PixelCard } from "@/components/pixel-card"

export const TOOLBAR_ITEMS: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
    { type: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
    { type: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
    { type: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
    { type: "card-group", label: "Group", icon: <Layout className="w-4 h-4" /> },
    { type: "carousel", label: "Carousel", icon: <Layout className="w-4 h-4 rotate-90" /> },
    { type: "button", label: "Button", icon: <MousePointerClick className="w-4 h-4" /> },
    { type: "divider", label: "Divider", icon: <Minus className="w-4 h-4" /> },
    { type: "vertical-separator", label: "V-Sep", icon: <Minus className="w-4 h-4 rotate-90" /> },
    { type: "spacer", label: "Spacer", icon: <ArrowUpDown className="w-4 h-4" /> },
]

export function Toolbar() {
    return (
        <div className="w-full p-2">
            <div className="flex flex-wrap gap-2">
                {TOOLBAR_ITEMS.map((item) => (
                    <DraggableToolbarItem key={item.type} {...item} />
                ))}
            </div>
        </div>
    )
}

function DraggableToolbarItem({ type, label, icon }: { type: ComponentType; label: string; icon: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `toolbar-${type}`,
        data: { type }
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
            <PixelCard className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors">
                {icon}
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
            </PixelCard>
        </div>
    )
}
