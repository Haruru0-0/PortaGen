import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ItemEditorDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => void
    initialData: any
    title?: string
}

export function ItemEditorDialog({ isOpen, onClose, onSave, initialData, title = "Edit Item" }: ItemEditorDialogProps) {
    const [data, setData] = useState<any>(initialData || {})
    const isDesktop = useMediaQuery("(min-width: 768px)")

    useEffect(() => {
        setData(initialData || {})
    }, [initialData, isOpen])

    const handleSave = () => {
        onSave(data)
        onClose()
    }

    const renderForm = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Name / Title</Label>
                <Input
                    value={data.name || data.title || ""}
                    onChange={(e) => setData({ ...data, name: e.target.value, title: e.target.value })}
                    className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <Label>Role / Subtitle</Label>
                <Input
                    value={data.role || data.subtitle || ""}
                    onChange={(e) => setData({ ...data, role: e.target.value, subtitle: e.target.value })}
                    className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <Label>Content / Description</Label>
                <Textarea
                    value={data.content || data.description || ""}
                    onChange={(e) => setData({ ...data, content: e.target.value, description: e.target.value })}
                    className="min-h-[100px] border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <Label>Avatar URL (Optional)</Label>
                <Input
                    value={data.avatar || ""}
                    onChange={(e) => setData({ ...data, avatar: e.target.value })}
                    placeholder="https://..."
                    className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <Label>Image URL (Optional)</Label>
                <Input
                    value={data.image || ""}
                    onChange={(e) => setData({ ...data, image: e.target.value })}
                    placeholder="https://..."
                    className="border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-y-1 focus:shadow-none transition-all"
                />
            </div>
        </div>
    )

    const renderFooter = () => (
        <>
            <Button
                variant="outline"
                onClick={onClose}
                className="rounded-none border-2 border-foreground hover:bg-muted flex-1 sm:flex-none"
            >
                Cancel
            </Button>
            <Button
                onClick={handleSave}
                className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all bg-primary text-primary-foreground flex-1 sm:flex-none"
            >
                Save Changes
            </Button>
        </>
    )

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="max-w-md border-4 border-foreground rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 gap-0">
                    <DialogHeader className="border-b-4 border-foreground p-4 bg-muted/20">
                        <DialogTitle className="font-bold text-lg uppercase tracking-wider">{title}</DialogTitle>
                    </DialogHeader>
                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                        {renderForm()}
                    </div>
                    <DialogFooter className="p-4 border-t-4 border-foreground bg-muted/20 sm:gap-2">
                        {renderFooter()}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="max-h-[85vh] border-t-4 border-x-4 border-foreground rounded-t-none shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] p-0 gap-0 bg-white dark:bg-zinc-950">
                <DrawerHeader className="border-b-4 border-foreground p-4 bg-white dark:bg-zinc-950 text-left">
                    <DrawerTitle className="font-bold text-lg uppercase tracking-wider">{title}</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 overflow-y-auto">
                    {renderForm()}
                </div>
                <DrawerFooter className="p-4 border-t-4 border-foreground bg-white dark:bg-zinc-950 flex-row gap-2">
                    {renderFooter()}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
