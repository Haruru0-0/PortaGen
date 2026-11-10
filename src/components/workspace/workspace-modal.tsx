"use client";
import { useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "./workspace-overlays";
type WorkspaceModalProps = {
    title: string;
    children: ReactNode;
    className?: string;
} & ({
    open: boolean;
    onOpenChange(open: boolean): void;
    isOpen?: never;
    onClose?: never;
} | {
    isOpen: boolean;
    onClose(): void;
    open?: never;
    onOpenChange?: never;
});
export function WorkspaceModal(props: WorkspaceModalProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const open = props.open ?? props.isOpen;
    const returnFocus = useRef<HTMLElement | null>(null);
    // Callers control these dialogs from ordinary buttons outside a Radix Trigger.
    const rememberFocus = () => {
        const active = document.activeElement;
        returnFocus.current = active instanceof HTMLElement && active !== document.body ? active : null;
    };
    const restoreFocus = (event: Event) => {
        if (returnFocus.current?.isConnected) {
            event.preventDefault();
            returnFocus.current.focus({ preventScroll: true });
        }
    };
    const onOpenChange = props.onOpenChange ?? ((nextOpen: boolean) => { if (!nextOpen)
        props.onClose?.(); });
    if (!isDesktop) {
        return <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent onOpenAutoFocus={rememberFocus} onCloseAutoFocus={restoreFocus} className={cn("p-6", props.className)} aria-describedby={undefined}>
        <DrawerHeader className="relative px-0 pb-6 pr-12 text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerClose className="ws-dialog-close absolute right-0 top-0 flex min-h-11 min-w-11 items-center justify-center" aria-label="Close">
            <X className="size-5" aria-hidden="true"/>
          </DrawerClose>
        </DrawerHeader>
        {props.children}
      </DrawerContent>
    </Drawer>;
    }
    return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent onOpenAutoFocus={rememberFocus} onCloseAutoFocus={restoreFocus} className={props.className} aria-describedby={undefined}>
      <DialogHeader className="pr-10 text-left">
        <DialogTitle>{props.title}</DialogTitle>
      </DialogHeader>
      {props.children}
    </DialogContent>
  </Dialog>;
}
