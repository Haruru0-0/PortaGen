import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DraggableComponent } from "@/lib/types"
import { PropertiesPanel } from "./properties-panel"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

interface PropertiesDialogProps {
    component: DraggableComponent | null
    onChange: (id: string, updates: Record<string, any>) => void
    isOpen: boolean
    onClose: () => void
}

export function PropertiesDialog({ component, onChange, isOpen, onClose }: PropertiesDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-4 border-foreground rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 gap-0 [&>button]:rounded-none [&>button]:border-2 [&>button]:border-transparent [&>button]:hover:border-foreground [&>button]:opacity-100 [&>button]:flex [&>button]:items-center [&>button]:cursor-pointer [&>button]:justify-center [&>button]:w-8 [&>button]:h-8 [&>button]:bg-transparent [&>button]:hover:bg-muted [&>button]:transition-none">
                    <DialogHeader className="border-b-4 border-foreground p-6 bg-muted/20">
                        <DialogTitle className="font-bold text-xl uppercase tracking-wider">Edit Component Properties</DialogTitle>
                    </DialogHeader>
                    <div className="p-6">
                        <PropertiesPanel
                            component={component}
                            onChange={onChange}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="max-h-[85vh] border-t-4 border-x-4 border-foreground rounded-t-none shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] p-0 gap-0 bg-white dark:bg-zinc-950">
                <DrawerHeader className="border-b-4 border-foreground p-4 bg-white dark:bg-zinc-950 text-left">
                    <DrawerTitle className="font-bold text-lg uppercase tracking-wider">Edit Properties</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 overflow-y-auto">
                    <PropertiesPanel
                        component={component}
                        onChange={onChange}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}