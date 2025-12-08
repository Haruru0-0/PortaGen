import React, { useState } from "react"
import { DraggableComponent } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Pencil, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface PropertiesPanelProps {
    component: DraggableComponent | null
    onChange: (id: string, updates: Record<string, any>) => void
}

export function PropertiesPanel({ component, onChange }: PropertiesPanelProps) {
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
    const [tempItem, setTempItem] = useState<any>(null)

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

    const handleEditItem = (index: number) => {
        const items = component.props.items || []
        setTempItem({ ...items[index] })
        setEditingItemIndex(index)
    }

    const handleSaveItem = () => {
        if (editingItemIndex !== null && tempItem) {
            const items = [...(component.props.items || [])]
            items[editingItemIndex] = tempItem
            handleChange("items", items)
            setEditingItemIndex(null)
            setTempItem(null)
        }
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
                                        const newItems = [...items, { name: "New Item", role: "Role", content: "Content", avatar: "", image: "" }]
                                        handleChange("items", newItems)
                                    }}
                                    className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all active:translate-y-1 active:shadow-none bg-background text-foreground hover:bg-muted"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add
                                </Button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {items.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between border-2 border-border p-2 bg-card hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="w-8 h-8 bg-muted border border-border flex items-center justify-center shrink-0">
                                                {item.avatar ? (
                                                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold text-muted-foreground">{item.name?.charAt(0) || "?"}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold truncate">{item.name || "Unnamed"}</p>
                                                <p className="text-xs text-muted-foreground truncate">{item.role || "No role"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-foreground hover:text-background rounded-none"
                                                onClick={() => handleEditItem(index)}
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white rounded-none"
                                                onClick={() => {
                                                    const newItems = items.filter((_: any, i: number) => i !== index)
                                                    handleChange("items", newItems)
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <div className="text-center p-4 border-2 border-dashed border-border text-muted-foreground text-xs">
                                        No items added yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Edit Item Dialog */}
                        <Dialog open={editingItemIndex !== null} onOpenChange={(open) => !open && setEditingItemIndex(null)}>
                            <DialogContent className="max-w-md border-4 border-foreground rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 gap-0">
                                <DialogHeader className="border-b-4 border-foreground p-4 bg-muted/20">
                                    <DialogTitle className="font-bold text-lg uppercase tracking-wider">Edit Item</DialogTitle>
                                </DialogHeader>
                                <div className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={tempItem?.name || ""}
                                            onChange={(e) => setTempItem({ ...tempItem, name: e.target.value })}
                                            className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Input
                                            value={tempItem?.role || ""}
                                            onChange={(e) => setTempItem({ ...tempItem, role: e.target.value })}
                                            className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Content</Label>
                                        <Textarea
                                            value={tempItem?.content || ""}
                                            onChange={(e) => setTempItem({ ...tempItem, content: e.target.value })}
                                            className="min-h-[100px] border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Avatar URL (Optional)</Label>
                                        <Input
                                            value={tempItem?.avatar || ""}
                                            onChange={(e) => setTempItem({ ...tempItem, avatar: e.target.value })}
                                            placeholder="https://..."
                                            className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Card Image URL (Optional)</Label>
                                        <Input
                                            value={tempItem?.image || ""}
                                            onChange={(e) => setTempItem({ ...tempItem, image: e.target.value })}
                                            placeholder="https://..."
                                            className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="p-4 border-t-4 border-foreground bg-muted/20">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEditingItemIndex(null)}
                                        className="rounded-none border-2 border-foreground hover:bg-muted"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveItem}
                                        className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all bg-primary text-primary-foreground"
                                    >
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
