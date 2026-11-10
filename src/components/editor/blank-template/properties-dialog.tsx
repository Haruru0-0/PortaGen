import React from "react"
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogContent } from "@/components/workspace/workspace-overlays"
import { DraggableComponent } from "@/lib/types"
import { PropertiesPanel } from "./properties-panel"
import { Drawer, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/workspace/workspace-overlays"
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
                <DialogContent className="workspace-controls max-w-2xl max-h-[80vh] overflow-y-auto border-4 border-foreground rounded-none  p-0 gap-0 [&>button]:rounded-none [&>button]:border-2 [&>button]:border-transparent [&>button]:hover:border-foreground [&>button]:opacity-100 [&>button]:flex [&>button]:items-center [&>button]:cursor-pointer [&>button]:justify-center [&>button]:w-8 [&>button]:h-8 [&>button]:bg-transparent [&>button]:hover:bg-muted [&>button]:transition-none">
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
            <DrawerContent className="workspace-controls max-h-[85vh] border-t border-x border-foreground rounded-t-none  p-0 gap-0 bg-card ">
                <DrawerHeader className="border-b-4 border-foreground p-4 bg-card  text-left">
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