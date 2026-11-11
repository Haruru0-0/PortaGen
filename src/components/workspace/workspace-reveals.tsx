"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate } from "motion";
import { useWorkspaceMotion } from "./workspace-motion-provider";

/** Observe owner content, without wrapping or moving any layout containers. */
export function WorkspaceReveals() {
  const marker = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const { ready, reducedMotion } = useWorkspaceMotion();

  useEffect(() => {
    const root = marker.current?.parentElement;
    if (!root || !ready || reducedMotion || !window.IntersectionObserver) return;
    const originals = new Map<HTMLElement, { opacity: string; translate: string }>();
    const running = new Map<HTMLElement, ReturnType<typeof animate>>();
    const seen = new WeakSet<HTMLElement>();
    const restore = (element: HTMLElement) => {
      const original = originals.get(element);
      if (original) { element.style.opacity = original.opacity; element.style.translate = original.translate; }
      element.dataset.revealState = "visible";
    };
    const finish = (element: HTMLElement) => {
      running.get(element)?.stop();
      running.delete(element);
      observer.unobserve(element);
      restore(element);
    };
    const paused = () => !!root.querySelector('.landing-world[data-motion-paused="true"]');
    const observer = new IntersectionObserver(entries => {
      let stagger = 0;
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (!entry.isIntersecting) continue;
        observer.unobserve(element);
        if (paused()) { finish(element); continue; }
        element.dataset.revealState = "revealing";
        const playback = animate(element, { opacity: [0, 1], translate: [innerWidth < 768 ? "0 32px" : "0 56px", "0 0px"] }, {
          duration: .8, delay: Math.min(stagger++, 3) * .1, ease: [.2, .65, .3, 1], onComplete: () => { running.delete(element); restore(element); },
        });
        running.set(element, playback);
      }
    }, { threshold: 0, rootMargin: "0px 0px -80px 0px" });
    const collect = () => {
      if (paused()) { originals.forEach((_, element) => finish(element)); return; }
      const targets = root.querySelectorAll<HTMLElement>(
        '.landing-section > :not(.ws-frame-fill), .persona-page-header, .ws-auth-form > h1, .ws-auth-description, .ws-auth-form > .ws-panel, .ws-dashboard-main .ws-panel',
      );
      targets.forEach(element => {
        if (seen.has(element) || element.closest('.workspace-preview, .workspace-editor-preview-shell, [role="dialog"]')) return;
        // Reveal outer panels only: fields and nested section fills stay stable.
        if (element.classList.contains('ws-panel') && element.parentElement?.closest('.ws-panel')) return;
        seen.add(element);
        originals.set(element, { opacity: element.style.opacity, translate: element.style.translate });
        // Leave visible and above-the-fold content alone, including restored scroll positions.
        if (element.getBoundingClientRect().top < innerHeight - 80 || element.contains(document.activeElement)) {
          restore(element); return;
        }
        element.dataset.revealState = "pending";
        element.style.opacity = "0";
        observer.observe(element);
      });
    };
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      originals.forEach((_, element) => { if (element.contains(event.target as Node)) finish(element); });
    };
    collect();
    const changes = new MutationObserver(collect);
    changes.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-motion-paused'] });
    root.addEventListener('focusin', focus);
    return () => {
      observer.disconnect(); changes.disconnect(); root.removeEventListener('focusin', focus);
      running.forEach(playback => playback.stop());
      originals.forEach((_, element) => restore(element));
    };
  }, [pathname, ready, reducedMotion]);

  return <span ref={marker} hidden aria-hidden="true" />;
}
