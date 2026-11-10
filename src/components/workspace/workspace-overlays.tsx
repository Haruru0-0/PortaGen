"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer as DrawerPrimitive } from "vaul";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceMotion } from "./workspace-motion-provider";
import { SelectContent as SharedSelectContent } from "@/components/ui/select";
import { PopoverContent as SharedPopoverContent } from "@/components/ui/popover";
import { DropdownMenuContent as SharedDropdownMenuContent, DropdownMenuSubContent as SharedDropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { TooltipContent as SharedTooltipContent } from "@/components/ui/tooltip";
export * from "@/components/ui/dialog";
export * from "@/components/ui/drawer";
export * from "@/components/ui/select";
export * from "@/components/ui/popover";
export * from "@/components/ui/dropdown-menu";
export * from "@/components/ui/tooltip";
// A portal has no themed DOM ancestor. Each surface reads the preference itself,
// including menus portaled from inside a dialog or another menu.
function usePortalMotion() {
    const { reducedMotion, ready } = useWorkspaceMotion();
    return !ready || reducedMotion ? "reduced" : "full";
}
export const DialogOverlay = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(({ className, ...props }, ref) => {
    const motion = usePortalMotion();
    return <DialogPrimitive.Overlay {...props} ref={ref} data-slot="dialog-overlay" data-workspace-motion={motion} className={cn("workspace-theme ws-overlay fixed inset-0 z-50 bg-black/70", className)}/>;
});
DialogOverlay.displayName = "WorkspaceDialogOverlay";
export const DialogContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}>(({ className, children, showCloseButton = true, ...props }, ref) => {
    const motion = usePortalMotion();
    return <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content {...props} ref={ref} data-slot="dialog-content" data-workspace-motion={motion} className={cn("workspace-theme ws-panel ws-dialog fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto p-6", className)}>
        {children}
        {showCloseButton && <DialogPrimitive.Close className="ws-dialog-close absolute right-2 top-2 flex min-h-11 min-w-11 items-center justify-center" aria-label="Close">
          <X className="size-5" aria-hidden="true"/>
        </DialogPrimitive.Close>}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>;
});
DialogContent.displayName = "WorkspaceDialogContent";
export const DrawerOverlay = React.forwardRef<React.ComponentRef<typeof DrawerPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>>(({ className, ...props }, ref) => {
    const motion = usePortalMotion();
    return <DrawerPrimitive.Overlay {...props} ref={ref} data-slot="drawer-overlay" data-workspace-motion={motion} className={cn("workspace-theme ws-overlay fixed inset-0 z-50 bg-black/70", className)}/>;
});
DrawerOverlay.displayName = "WorkspaceDrawerOverlay";
export const DrawerContent = React.forwardRef<React.ComponentRef<typeof DrawerPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>>(({ className, children, ...props }, ref) => {
    const motion = usePortalMotion();
    return <DrawerPrimitive.Portal>
      <DrawerOverlay />
      <DrawerPrimitive.Content {...props} ref={ref} data-slot="drawer-content" data-workspace-motion={motion} className={cn("workspace-theme ws-panel ws-drawer group/drawer-content fixed z-50 flex h-auto flex-col overflow-y-auto", "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:max-h-[85dvh] data-[vaul-drawer-direction=bottom]:rounded-t-xl", "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:max-h-[85dvh] data-[vaul-drawer-direction=top]:rounded-b-xl", "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-[min(90vw,28rem)]", "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-[min(90vw,28rem)]", className)}>
        <div aria-hidden="true" className="mx-auto mt-3 hidden h-1 w-12 shrink-0 rounded-full bg-current opacity-40 group-data-[vaul-drawer-direction=bottom]/drawer-content:block"/>
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>;
});
DrawerContent.displayName = "WorkspaceDrawerContent";
export function SelectContent({ className, ...props }: React.ComponentProps<typeof SharedSelectContent>) {
    const motion = usePortalMotion();
    return <SharedSelectContent {...props} data-workspace-motion={motion} className={cn("workspace-theme ws-panel ws-select", className)}/>;
}
export function PopoverContent({ className, ...props }: React.ComponentProps<typeof SharedPopoverContent>) {
    const motion = usePortalMotion();
    return <SharedPopoverContent {...props} data-workspace-motion={motion} className={cn("workspace-theme ws-panel ws-popover", className)}/>;
}
export function DropdownMenuContent({ className, ...props }: React.ComponentProps<typeof SharedDropdownMenuContent>) {
    const motion = usePortalMotion();
    return <SharedDropdownMenuContent {...props} data-workspace-motion={motion} className={cn("workspace-theme ws-panel ws-dropdown", className)}/>;
}
export function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof SharedDropdownMenuSubContent>) {
    const motion = usePortalMotion();
    return <SharedDropdownMenuSubContent {...props} data-workspace-motion={motion} className={cn("workspace-theme ws-panel ws-dropdown", className)}/>;
}
export function TooltipContent({ className, arrowClassName, ...props }: React.ComponentProps<typeof SharedTooltipContent>) {
    const motion = usePortalMotion();
    return <SharedTooltipContent {...props} data-workspace-motion={motion} className={cn("workspace-theme ws-tooltip", className)} arrowClassName={cn("fill-[var(--workspace-ink)] bg-[var(--workspace-ink)]", arrowClassName)}/>;
}
