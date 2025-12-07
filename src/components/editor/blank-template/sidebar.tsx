import React from "react"
import { useDraggable } from "@dnd-kit/core"
import { ComponentType } from "@/lib/types"
import { Type, Image as ImageIcon, Layout, CreditCard, MousePointerClick, Minus, ArrowUpDown } from "lucide-react"

interface DraggableItemProps {
    type: ComponentType
    label: string
    icon: React.ReactNode
}

function DraggableItem({ type, label, icon }: DraggableItemProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `draggable-${type}`,
        data: { type }
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="flex items-center gap-3 p-3 border-2 border-border bg-card hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
        >
            <div className="text-primary">{icon}</div>
            <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        </div>
    )
}

export function Sidebar() {
    const items: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
        { type: "text", label: "Text Block", icon: <Type className="w-4 h-4" /> },
        { type: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
        { type: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
        { type: "card-group", label: "Card Group", icon: <Layout className="w-4 h-4" /> },
        { type: "carousel", label: "Carousel", icon: <Layout className="w-4 h-4 rotate-90" /> },
        { type: "button", label: "Button", icon: <MousePointerClick className="w-4 h-4" /> },
        { type: "divider", label: "Divider", icon: <Minus className="w-4 h-4" /> },
        { type: "vertical-separator", label: "Vert. Separator", icon: <Minus className="w-4 h-4 rotate-90" /> },
        { type: "spacer", label: "Spacer", icon: <ArrowUpDown className="w-4 h-4" /> },
    ]

    return (
        <div className="space-y-2">
            <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Components</h4>
            <div className="grid grid-cols-1 gap-2">
                {items.map((item) => (
                    <DraggableItem key={item.type} {...item} />
                ))}
            </div>
        </div>
    )
}
