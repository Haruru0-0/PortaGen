import React from "react"
import { DraggableComponent } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface PropertiesPanelProps {
    component: DraggableComponent | null
    onChange: (id: string, updates: Record<string, any>) => void
}

export function PropertiesPanel({ component, onChange }: PropertiesPanelProps) {
    if (!component) {
        return (
            <div className="p-4 text-center text-muted-foreground text-sm">
                Select a component to edit its properties
            </div>
        )
    }

    const handleChange = (key: string, value: any) => {
        onChange(component.id, { [key]: value })
    }

    const renderFields = () => {
        switch (component.type) {
            case "text":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                                value={component.props.content || ""}
                                onChange={(e) => handleChange("content", e.target.value)}
                                placeholder="Enter text content..."
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Font Size (px)</Label>
                            <Input
                                type="number"
                                value={component.props.fontSize || ""}
                                onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
                                placeholder="16"
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <Input
                                type="color"
                                value={component.props.color || "#000000"}
                                onChange={(e) => handleChange("color", e.target.value)}
                                className="h-10 p-1 border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Alignment</Label>
                            <Select
                                value={component.props.textAlign || "left"}
                                onValueChange={(val) => handleChange("textAlign", val)}
                            >
                                <SelectTrigger className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                    <SelectItem value="justify">Justify</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )
            case "image":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                                value={component.props.src || ""}
                                onChange={(e) => handleChange("src", e.target.value)}
                                placeholder="https://..."
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Alt Text</Label>
                            <Input
                                value={component.props.alt || ""}
                                onChange={(e) => handleChange("alt", e.target.value)}
                                placeholder="Image description"
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                    </>
                )
            case "card":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={component.props.title || ""}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="Card Title"
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={component.props.description || ""}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Card description..."
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                    </>
                )
            case "carousel":
                const items = component.props.items || []
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Items Per Slide</Label>
                            <Input
                                type="number"
                                value={component.props.itemsPerSlide || 3}
                                onChange={(e) => handleChange("itemsPerSlide", Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                                min={1}
                                max={5}
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Carousel Items</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const newItems = [...items, { name: "New Item", role: "Role", content: "Content", avatar: "" }]
                                        handleChange("items", newItems)
                                    }}
                                    className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all active:translate-y-1 active:shadow-none bg-background text-foreground hover:bg-muted"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item: any, index: number) => (
                                    <div key={index} className="border border-border p-3 rounded-md space-y-3 relative">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-white hover:bg-red-500 border-2 border-transparent hover:border-foreground rounded-none transition-none z-10"
                                            onClick={() => {
                                                const newItems = items.filter((_: any, i: number) => i !== index)
                                                handleChange("items", newItems)
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Name</Label>
                                            <Input
                                                value={item.name}
                                                onChange={(e) => {
                                                    const newItems = [...items]
                                                    newItems[index] = { ...item, name: e.target.value }
                                                    handleChange("items", newItems)
                                                }}
                                                className="h-8 border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-0.5 focus:shadow-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Role</Label>
                                            <Input
                                                value={item.role}
                                                onChange={(e) => {
                                                    const newItems = [...items]
                                                    newItems[index] = { ...item, role: e.target.value }
                                                    handleChange("items", newItems)
                                                }}
                                                className="h-8 border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-0.5 focus:shadow-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Content</Label>
                                            <Textarea
                                                value={item.content}
                                                onChange={(e) => {
                                                    const newItems = [...items]
                                                    newItems[index] = { ...item, content: e.target.value }
                                                    handleChange("items", newItems)
                                                }}
                                                className="min-h-[60px] text-xs border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-0.5 focus:shadow-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <Label className="text-xs">Avatar URL</Label>
                                            <Input
                                                value={item.avatar}
                                                onChange={(e) => {
                                                    const newItems = [...items]
                                                    newItems[index] = { ...item, avatar: e.target.value }
                                                    handleChange("items", newItems)
                                                }}
                                                className="h-8 border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-0.5 focus:shadow-none transition-all"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            case "card-group":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Number of Cards</Label>
                            <Input
                                type="number"
                                value={component.props.count || 3}
                                onChange={(e) => handleChange("count", parseInt(e.target.value))}
                                min={1}
                                max={12}
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Columns</Label>
                            <Select
                                value={String(component.props.columns || 3)}
                                onValueChange={(val) => handleChange("columns", parseInt(val))}
                            >
                                <SelectTrigger className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <SelectItem value="1">1 Column</SelectItem>
                                    <SelectItem value="2">2 Columns</SelectItem>
                                    <SelectItem value="3">3 Columns</SelectItem>
                                    <SelectItem value="4">4 Columns</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )
            case "vertical-separator":
                return (
                    <div className="space-y-2">
                        <Label>Height (px)</Label>
                        <Input
                            type="number"
                            value={component.props.height || 80}
                            onChange={(e) => handleChange("height", parseInt(e.target.value))}
                            className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                        />
                    </div>
                )
            case "button":
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                                value={component.props.label || ""}
                                onChange={(e) => handleChange("label", e.target.value)}
                                placeholder="Button Label"
                                className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Variant</Label>
                            <Select
                                value={component.props.variant || "primary"}
                                onValueChange={(val) => handleChange("variant", val)}
                            >
                                <SelectTrigger className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <SelectItem value="primary">Primary</SelectItem>
                                    <SelectItem value="secondary">Secondary</SelectItem>
                                    <SelectItem value="outline">Outline</SelectItem>
                                    <SelectItem value="ghost">Ghost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Alignment</Label>
                            <Select
                                value={component.props.alignment || "start"}
                                onValueChange={(val) => handleChange("alignment", val)}
                            >
                                <SelectTrigger className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <SelectItem value="start">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                )
            case "spacer":
                return (
                    <div className="space-y-2">
                        <Label>Height (px)</Label>
                        <Input
                            type="number"
                            value={component.props.height || ""}
                            onChange={(e) => handleChange("height", parseInt(e.target.value))}
                            placeholder="20"
                            className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                        />
                    </div>
                )
            default:
                return (
                    <div className="text-sm text-muted-foreground">
                        No specific properties available.
                    </div>
                )
        }
    }

    return (
        <div className="space-y-6 p-1 h-full overflow-y-auto">
            <div>
                <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Component Properties</h4>
                <div className="space-y-4">
                    {renderFields()}
                </div>
            </div>

            <div className="border-t border-border pt-4">
                <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Common Styles</h4>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Padding (px)</Label>
                        <Input
                            type="number"
                            value={component.props.padding || 0}
                            onChange={(e) => handleChange("padding", parseInt(e.target.value))}
                            placeholder="0"
                            className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Margin Bottom (px)</Label>
                        <Input
                            type="number"
                            value={component.props.marginBottom || 0}
                            onChange={(e) => handleChange("marginBottom", parseInt(e.target.value))}
                            placeholder="0"
                            className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
