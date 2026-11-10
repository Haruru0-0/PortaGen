"use client";
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { MOTION_STORAGE_KEY, parseMotionPreference, resolveReducedMotion, preferenceFromStorageEvent, type MotionPreference } from '@/lib/blue-hour/motion-preference';
type MotionContext = {
    preference: MotionPreference;
    reducedMotion: boolean;
    ready: boolean;
    setPreference: (value: MotionPreference) => void;
};
const Context = createContext<MotionContext>({ preference: 'system', reducedMotion: true, ready: false, setPreference: () => { } });
export function WorkspaceMotionProvider({ children }: {
    children: ReactNode;
}) {
    const [preference, setMode] = useState<MotionPreference>('system');
    const [systemReduced, setSystem] = useState(true);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => setSystem(query.matches);
        const frame = requestAnimationFrame(() => { sync(); try {
            setMode(parseMotionPreference(localStorage.getItem(MOTION_STORAGE_KEY)));
        }
        catch { } setReady(true); });
        const storage = (event: StorageEvent) => { const mode = preferenceFromStorageEvent(event.key, event.newValue); if (mode !== null) {
            sync();
            setMode(mode);
        } };
        query.addEventListener('change', sync);
        window.addEventListener('storage', storage);
        return () => { cancelAnimationFrame(frame); query.removeEventListener('change', sync); window.removeEventListener('storage', storage); };
    }, []);
    const setPreference = useCallback((value: MotionPreference) => { setMode(value); setSystem(window.matchMedia('(prefers-reduced-motion: reduce)').matches); try {
        if (value === 'system')
            localStorage.removeItem(MOTION_STORAGE_KEY);
        else
            localStorage.setItem(MOTION_STORAGE_KEY, value);
    }
    catch { } }, []);
    return <Context.Provider value={{ preference, reducedMotion: !ready || resolveReducedMotion(preference, systemReduced), ready, setPreference }}>{children}</Context.Provider>;
}
export const useWorkspaceMotion = () => useContext(Context);
