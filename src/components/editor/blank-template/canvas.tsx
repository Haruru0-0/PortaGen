import React from "react"
import { useDroppable } from "@dnd-kit/core"
import { DraggableComponent } from "@/lib/types"
import { ComponentRenderer } from "./component-renderer"

interface CanvasProps {
    components: DraggableComponent[]
    selectedId: string | null
    onSelect: (id: string) => void
    onDelete: (id: string) => void
    onMoveUp: (id: string) => void
    onMoveDown: (id: string) => void
    onEdit: (id: string) => void
    data: {
        backgroundColor?: string;
        padding?: string;
        gap?: string;
    }
}

export function Canvas({ components, selectedId, onSelect, onDelete, onMoveUp, onMoveDown, onEdit, data }: CanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: "canvas-droppable",
    })

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 h-full min-h-[500px] p-8 transition-colors overflow-y-auto
                ${isOver ? 'bg-primary/10 border-primary' : 'bg-muted/10 border-border'}
                border-4 border-dashed rounded-none relative`}
            style={{
                backgroundColor: data.backgroundColor,
                padding: data.padding,
                gap: data.gap,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {components.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-muted-foreground opacity-50">
                        <p className="text-lg font-bold mb-2">Empty Canvas</p>
                        <p className="text-sm">Drag components here to start building</p>
                    </div>
                </div>
            )}

            {components.map((component) => (
                <ComponentRenderer
                    key={component.id}
                    component={component}
                    isSelected={selectedId === component.id}
                    onSelect={() => onSelect(component.id)}
                    onDelete={() => onDelete(component.id)}
                    onMoveUp={() => onMoveUp(component.id)}
                    onMoveDown={() => onMoveDown(component.id)}
                    onEdit={() => onEdit(component.id)}
                />
            ))}
        </div>
    )
}
