"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useWorkspaceMotion } from '@/components/workspace/workspace-motion-provider';
const Context = createContext({ paused: false, togglePaused: () => { }, parallaxAllowed: false });
export function LandingMotionProvider({ children }: {
    children: ReactNode;
}) {
    const [paused, setPaused] = useState(false);
    const [desktop, setDesktop] = useState(false);
    const { ready, reducedMotion } = useWorkspaceMotion();
    useEffect(() => { const query = matchMedia('(min-width: 1024px) and (pointer: fine)'); const sync = () => setDesktop(query.matches); sync(); query.addEventListener('change', sync); return () => query.removeEventListener('change', sync); }, []);
    const saveData = typeof navigator !== 'undefined' && !!(navigator as Navigator & {
        connection?: {
            saveData?: boolean;
        };
    }).connection?.saveData;
    return <Context.Provider value={{ paused, togglePaused: () => setPaused(v => !v), parallaxAllowed: ready && desktop && !reducedMotion && !paused && !saveData }}><div className="landing-world" data-motion-paused={paused || reducedMotion ? 'true' : 'false'}>{children}</div></Context.Provider>;
}
export const useLandingMotion = () => useContext(Context);
