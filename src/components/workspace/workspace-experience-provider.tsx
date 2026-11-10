"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isWorkspacePath } from '@/lib/blue-hour/navigation-policy';
import { WorkspaceScene } from "./workspace-scene";
import { useWorkspaceMotion } from './workspace-motion-provider';
type Experience = {
    navigate: (href: string, direction?: 'forward' | 'back') => void;
    cancelPendingTransition: () => void;
};
const Context = createContext<Experience>({ navigate: () => { }, cancelPendingTransition: () => { } });
export function WorkspaceExperienceProvider({ children }: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const surface = pathname === '/' ? 'landing' : pathname.startsWith('/auth/') ? 'auth' : pathname.startsWith('/dashboard/editor/') ? 'editor' : pathname.split('/').at(-1) || 'dashboard';
    const { reducedMotion } = useWorkspaceMotion();
    const [cover, setCover] = useState<'forward' | 'back' | null>(null);
    const pending = useRef<string | null>(null);
    const intended = useRef<string | null>(null);
    const token = useRef(0);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
    const cancelPendingTransition = useCallback(() => { clear(); token.current++; pending.current = null; intended.current = null; setCover(null); }, [clear]);
    const navigate = useCallback((href: string, direction: 'forward' | 'back' = 'forward') => {
        clear();
        const id = ++token.current;
        pending.current = href;
        intended.current = new URL(href, window.location.origin).pathname;
        if (reducedMotion) {
            pending.current = null;
            setCover(null);
            router.push(href);
            return;
        }
        setCover(direction);
        timers.current.push(setTimeout(() => { if (token.current === id) {
            pending.current = null;
            router.push(href);
        } }, 180));
        timers.current.push(setTimeout(() => { if (token.current === id)
            setCover(null); }, 700));
    }, [clear, reducedMotion, router]);
    useEffect(() => {
        const native = () => cancelPendingTransition();
        window.addEventListener('popstate', native);
        window.addEventListener('hashchange', native);
        window.addEventListener('pagehide', native);
        return () => { clear(); window.removeEventListener('popstate', native); window.removeEventListener('hashchange', native); window.removeEventListener('pagehide', native); };
    }, [cancelPendingTransition, clear]);
    useEffect(() => {
        clear();
        pending.current = null;
        setCover(null);
        if (intended.current !== pathname) {
            intended.current = null;
            token.current++;
            return;
        }
        intended.current = null;
        const id = token.current;
        let attempts = 0;
        const focus = () => { if (id !== token.current)
            return; const heading = document.querySelector<HTMLElement>('[data-page-heading]') ?? document.querySelector<HTMLElement>('main h1') ?? document.querySelector<HTMLElement>('main h2'); if (heading) {
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
        }
        else if (attempts++ < 20)
            timers.current.push(setTimeout(focus, 50)); };
        timers.current.push(setTimeout(focus, 0));
    }, [pathname, clear]);
    useEffect(() => { if (reducedMotion) {
        const href = pending.current;
        clear();
        pending.current = null;
        setCover(null);
        if (href)
            router.push(href);
    } }, [reducedMotion, clear, router]);
    return <Context.Provider value={{ navigate, cancelPendingTransition }}>{isWorkspacePath(pathname) ? <div className="workspace-theme persona-app" data-workspace-surface={surface} data-workspace-motion={reducedMotion ? 'reduced' : 'full'}><WorkspaceScene surface={surface}/>{children}{cover && <div className={`ws-route-wipe ws-route-wipe-${cover}`} aria-hidden="true"/>}</div> : children}</Context.Provider>;
}
export const useWorkspaceExperience = () => useContext(Context);
