"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer as DrawerPrimitive } from "vaul";
import { X, ChevronDown } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { WorkspaceFrameLayers } from "./workspace-frame";
import { cn } from "@/lib/utils";
import { useWorkspaceMotion } from "./workspace-motion-provider";
import { SelectScrollUpButton, SelectScrollDownButton } from "@/components/ui/select";
import { snapshotMenuExit } from "./workspace-menu-exit";
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
const SelectContentRef = React.createContext<React.RefObject<HTMLDivElement | null> | null>(null);
export function Select({ open, defaultOpen = false, onOpenChange, ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
    const [localOpen, setLocalOpen] = React.useState(defaultOpen);
    const isOpen = open ?? localOpen;
    const content = React.useRef<HTMLDivElement>(null);
    const exit = React.useRef<(() => void) | null>(null);
    const motion = usePortalMotion();
    const discardExit = React.useCallback(() => { const cleanup = exit.current; exit.current = null; cleanup?.(); }, []);
    React.useEffect(() => { if (motion === "reduced") discardExit(); return discardExit; }, [motion, discardExit]);
    return <SelectContentRef.Provider value={content}><SelectPrimitive.Root {...props} open={isOpen} onOpenChange={next => {
        discardExit();
        if (!next && isOpen && motion === "full" && content.current) {
            exit.current = snapshotMenuExit(content.current, () => { exit.current = null; });
        }
        if (open === undefined) setLocalOpen(next);
        onOpenChange?.(next);
    }}/></SelectContentRef.Provider>;
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
      <DialogPrimitive.Content {...props} ref={ref} data-slot="dialog-content" data-workspace-motion={motion} className={cn("workspace-theme ws-panel ws-cut-frame ws-dialog fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-visible p-6", className)}>
        <WorkspaceFrameLayers /><div className="ws-dialog-scroll">{children}</div>
        {showCloseButton && <DialogPrimitive.Close className="ws-dialog-close ws-cut-frame ws-icon-frame absolute right-2 top-2 flex min-h-11 min-w-11 items-center justify-center" aria-label="Close">
          <WorkspaceFrameLayers /><X className="size-5" aria-hidden="true"/>
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
      <DrawerPrimitive.Content {...props} ref={ref} data-slot="drawer-content" data-workspace-motion={motion} className={cn("workspace-theme ws-panel ws-cut-frame ws-drawer group/drawer-content fixed z-50 flex h-auto flex-col overflow-visible", "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:max-h-[85dvh] data-[vaul-drawer-direction=bottom]:rounded-t-xl", "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:max-h-[85dvh] data-[vaul-drawer-direction=top]:rounded-b-xl", "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-[min(90vw,28rem)]", "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-[min(90vw,28rem)]", className)}>
        <WorkspaceFrameLayers /><div aria-hidden="true" className="mx-auto mt-3 hidden h-1 w-12 shrink-0 rounded-full bg-current opacity-40 group-data-[vaul-drawer-direction=bottom]/drawer-content:block"/>
        <div className="ws-drawer-scroll">{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>;
});
DrawerContent.displayName = "WorkspaceDrawerContent";
export const SelectTrigger = React.forwardRef<React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { size?: "sm" | "default" }>(
  function SelectTrigger({ className, children, size = "default", ...props }, ref) {
    return <SelectPrimitive.Trigger {...props} ref={ref} data-slot="select-trigger" data-size={size}
      className={cn("ws-cut-frame ws-select-trigger", className)}>
      <WorkspaceFrameLayers /><span className="ws-select-text">{children}</span>
      <SelectPrimitive.Icon asChild><ChevronDown className="size-4 shrink-0" aria-hidden="true" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>;
  },
);

export const SelectContent = React.forwardRef<React.ComponentRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  function SelectContent({ className, children, position = "popper", sideOffset = 8, ...props }, ref) {
    const motion = usePortalMotion();
    const contentRef = React.useContext(SelectContentRef);
    const assignRef = React.useCallback((element: HTMLDivElement | null) => {
      if (contentRef) contentRef.current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    }, [contentRef, ref]);
    return <SelectPrimitive.Portal><SelectPrimitive.Content {...props} ref={assignRef} position={position} sideOffset={sideOffset}
      data-slot="select-content" data-workspace-motion={motion}
      className={cn("workspace-theme ws-panel ws-cut-frame ws-select", className)}>
      <WorkspaceFrameLayers /><SelectScrollUpButton />
      <SelectPrimitive.Viewport className="ws-menu-viewport">{children}</SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content></SelectPrimitive.Portal>;
  },
);

export const PopoverContent = React.forwardRef<React.ComponentRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(
  function PopoverContent({ className, children, sideOffset = 8, ...props }, ref) {
    const motion = usePortalMotion();
    return <PopoverPrimitive.Portal><PopoverPrimitive.Content {...props} ref={ref} sideOffset={sideOffset}
      data-slot="popover-content" data-workspace-motion={motion}
      className={cn("workspace-theme ws-panel ws-cut-frame ws-popover", className)}>
      <WorkspaceFrameLayers />{children}
    </PopoverPrimitive.Content></PopoverPrimitive.Portal>;
  },
);

export const DropdownMenuContent = React.forwardRef<React.ComponentRef<typeof DropdownPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>>(
  function DropdownMenuContent({ className, children, sideOffset = 8, ...props }, ref) {
    const motion = usePortalMotion();
    return <DropdownPrimitive.Portal><DropdownPrimitive.Content {...props} ref={ref} sideOffset={sideOffset}
      data-slot="dropdown-menu-content" data-workspace-motion={motion}
      className={cn("workspace-theme ws-panel ws-cut-frame ws-dropdown", className)}>
      <WorkspaceFrameLayers /><div className="ws-menu-viewport">{children}</div>
    </DropdownPrimitive.Content></DropdownPrimitive.Portal>;
  },
);

export const DropdownMenuSubContent = React.forwardRef<React.ComponentRef<typeof DropdownPrimitive.SubContent>, React.ComponentPropsWithoutRef<typeof DropdownPrimitive.SubContent>>(
  function DropdownMenuSubContent({ className, children, sideOffset = 6, ...props }, ref) {
    const motion = usePortalMotion();
    return <DropdownPrimitive.Portal><DropdownPrimitive.SubContent {...props} ref={ref} sideOffset={sideOffset}
      data-slot="dropdown-menu-sub-content" data-workspace-motion={motion}
      className={cn("workspace-theme ws-panel ws-cut-frame ws-dropdown", className)}>
      <WorkspaceFrameLayers /><div className="ws-menu-viewport">{children}</div>
    </DropdownPrimitive.SubContent></DropdownPrimitive.Portal>;
  },
);

export const TooltipContent = React.forwardRef<React.ComponentRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { arrowClassName?: string }>(
  function TooltipContent({ className, children, arrowClassName: _arrowClassName, sideOffset = 8, ...props }, ref) {
    const motion = usePortalMotion();
    void _arrowClassName;
    return <TooltipPrimitive.Portal><TooltipPrimitive.Content {...props} ref={ref} sideOffset={sideOffset}
      data-slot="tooltip-content" data-workspace-motion={motion}
      className={cn("workspace-theme ws-cut-frame ws-tooltip", className)}>
      <WorkspaceFrameLayers />{children}
    </TooltipPrimitive.Content></TooltipPrimitive.Portal>;
  },
);
