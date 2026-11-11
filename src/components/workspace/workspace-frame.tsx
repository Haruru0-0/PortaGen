"use client";

import { forwardRef, useEffect, type HTMLAttributes, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { sectionClipInsets } from "@/lib/blue-hour/frame-geometry";

export function WorkspaceFrameLayers() {
  return <span className="ws-frame-fill" aria-hidden="true" />;
}

export const WorkspaceControlFrame = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function WorkspaceControlFrame({ children, className, ...props }, ref) {
    return <div {...props} ref={ref} className={cn("ws-cut-frame ws-control-frame relative", className)}>
      <WorkspaceFrameLayers />{children}
    </div>;
  },
);

/** Clip decorative fills only. Fields, focus rings and popovers are never clipped. */
export function useWorkspaceSectionClipping(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let scheduled = 0;
    const sections = () => Array.from(frame.querySelectorAll<HTMLElement>("[data-frame-section], .ws-frame-section"))
      .filter(section => section.closest(".ws-cut-frame") === frame);
    const align = () => {
      scheduled = 0;
      const rect = frame.getBoundingClientRect();
      if (!rect.height || !rect.width) return;
      const style = getComputedStyle(frame);
      const cut = parseFloat(style.getPropertyValue("--ws-cut")) || 18;
      const border = parseFloat(style.getPropertyValue("--ws-frame-edge")) || 2;
      for (const section of sections()) {
        const inset = sectionClipInsets(rect, section.getBoundingClientRect(), cut, border);
        section.style.clipPath = `polygon(0 0,calc(100% - ${inset.top}px) 0,calc(100% - ${inset.bottom}px) 100%,0 100%)`;
      }
    };
    const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(align); };
    const resize = new ResizeObserver(schedule);
    resize.observe(frame);
    const observeSections = () => { sections().forEach(section => resize.observe(section)); schedule(); };
    observeSections();
    const changes = new MutationObserver(observeSections);
    changes.observe(frame, { childList: true, subtree: true });
    return () => { resize.disconnect(); changes.disconnect(); cancelAnimationFrame(scheduled); };
  }, [ref]);
}
