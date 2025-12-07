import React, { useState, useEffect } from "react"
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { BlankTemplateData, DraggableComponent, ComponentType } from "@/lib/types"
import { Canvas } from "../blank-template/canvas"
import { Toolbar, TOOLBAR_ITEMS } from "../blank-template/toolbar"
import { PropertiesDialog } from "../blank-template/properties-dialog"
import { PixelCard } from "@/components/pixel-card"

// Simple ID generator to avoid uuid dependency issues
const generateId = () => Math.random().toString(36).substr(2, 9)

interface BlankTemplateEditorProps {
    initialData: BlankTemplateData
    onChange: (data: BlankTemplateData) => void
}

export function BlankTemplateEditor({ initialData, onChange }: BlankTemplateEditorProps) {
    const [components, setComponents] = useState<DraggableComponent[]>(initialData.components || [])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [activeDragType, setActiveDragType] = useState<ComponentType | null>(null)
    const [showPropertiesDialog, setShowPropertiesDialog] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    useEffect(() => {
        onChange({ ...initialData, components })
    }, [components])

    const handleDragStart = (event: any) => {
        setActiveDragType(event.active.data.current?.type)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveDragType(null)

        if (over && over.id === "canvas-droppable") {
            const type = active.data.current?.type as ComponentType
            if (type) {
                const newComponent: DraggableComponent = {
                    id: generateId(),
                    type,
                    props: getDefaultProps(type)
                }
                setComponents((prev: DraggableComponent[]) => [...prev, newComponent])
                setSelectedId(newComponent.id)
            }
        }
    }

    const getDefaultProps = (type: ComponentType) => {
        switch (type) {
            case "text": return { content: "New Text Block", fontSize: 16, textAlign: "left" }
            case "image": return { src: "", alt: "" }
            case "card": return { title: "New Card", description: "Card description" }
            case "button": return { label: "Button", variant: "primary", alignment: "start" }
            case "spacer": return { height: 20 }
            default: return {}
        }
    }

    const handleUpdateComponent = (id: string, updates: Record<string, any>) => {
        setComponents((prev: DraggableComponent[]) => prev.map(c => c.id === id ? { ...c, props: { ...c.props, ...updates } } : c))
    }

    const handleEditComponent = (id: string) => {
        setSelectedId(id)
        // Open dialog with properties for this component
        setShowPropertiesDialog(true)
    }

    const handleDeleteComponent = (id: string) => {
        setComponents((prev: DraggableComponent[]) => prev.filter(c => c.id !== id))
        if (selectedId === id) setSelectedId(null)
    }

    const handleMoveUp = (id: string) => {
        const index = components.findIndex(c => c.id === id)
        if (index > 0) {
            setComponents((prev: DraggableComponent[]) => {
                const newComponents = [...prev]
                const temp = newComponents[index]
                newComponents[index] = newComponents[index - 1]
                newComponents[index - 1] = temp
                return newComponents
            })
        }
    }

    const handleMoveDown = (id: string) => {
        const index = components.findIndex(c => c.id === id)
        if (index !== -1 && index < components.length - 1) {
            setComponents((prev: DraggableComponent[]) => {
                const newComponents = [...prev]
                const temp = newComponents[index]
                newComponents[index] = newComponents[index + 1]
                newComponents[index + 1] = temp
                return newComponents
            })
        }
    }

    const selectedComponent = components.find(c => c.id === selectedId) || null

    const activeItem = TOOLBAR_ITEMS.find(i => i.type === activeDragType)

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-full gap-4">
                <Toolbar />

                {/* Main Content Area */}
                <div className="flex-1 flex gap-4 min-h-0">
                    {/* Canvas Area - Takes available space */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <Canvas
                            components={components}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onDelete={handleDeleteComponent}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onEdit={handleEditComponent}
                            data={{
                                backgroundColor: initialData.backgroundColor,
                                padding: initialData.padding,
                                gap: initialData.gap
                            }}
                        />
                    </div>

                </div>
            </div>
            <DragOverlay>
                {activeItem ? (
                    <PixelCard className="flex items-center gap-2 px-3 py-2 min-w-[100px] justify-center cursor-grabbing opacity-90">
                        {activeItem.icon}
                        <span className="text-sm font-medium whitespace-nowrap">{activeItem.label}</span>
                    </PixelCard>
                ) : null}
            </DragOverlay>
            <PropertiesDialog
                component={selectedComponent}
                onChange={handleUpdateComponent}
                isOpen={showPropertiesDialog}
                onClose={() => setShowPropertiesDialog(false)}
            />
        </DndContext>
    )
}
