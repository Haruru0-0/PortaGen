"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { canLoadEntrance, advanceEntrance, type EntrancePhase } from '@/lib/blue-hour/entrance-policy';
import { INTRO_STORAGE_KEY, ENTRANCE_TIMEOUT_MS, type HeroMedia } from '@/lib/blue-hour/media';
import { useWorkspaceMotion } from '@/components/workspace/workspace-motion-provider';
import { useLandingMotion } from './landing-motion-provider';
export function useEntranceScene(media: HeroMedia) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [phase, setPhase] = useState<EntrancePhase>('waiting');
    const terminal = useRef(false);
    const { ready, reducedMotion } = useWorkspaceMotion();
    const { paused, togglePaused } = useLandingMotion();
    const settle = useCallback(() => { terminal.current = true; setPhase('settled'); videoRef.current?.pause(); try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    }
    catch { } }, []);
    useEffect(() => {
        if (!ready)
            return;
        const video = videoRef.current;
        if (!video)
            return;
        let seen = false;
        try {
            seen = sessionStorage.getItem(INTRO_STORAGE_KEY) === '1';
        }
        catch { }
        const saveData = !!(navigator as Navigator & {
            connection?: {
                saveData?: boolean;
            };
        }).connection?.saveData;
        if (terminal.current || paused || !canLoadEntrance({ seen, reducedMotion, saveData })) {
            const frame = requestAnimationFrame(settle);
            return () => cancelAnimationFrame(frame);
        }
        let timer: ReturnType<typeof setTimeout> | undefined;
        let disposed = false;
        const timeout = () => { if (timer === undefined) timer = setTimeout(settle, ENTRANCE_TIMEOUT_MS); };
        const playing = () => { if (terminal.current || disposed) {
            video.pause();
            return;
        } clearTimeout(timer); timer = undefined; setPhase(p => advanceEntrance(p, 'ready')); };
        const start = () => { if (!terminal.current && !disposed)
            video.play()?.catch(settle); };
        const visibility = () => { if (document.hidden)
            settle(); };
        const observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting)
            settle(); }, { threshold: 0.05 });
        video.addEventListener('canplay', start);
        video.addEventListener('playing', playing);
        video.addEventListener('ended', settle);
        video.addEventListener('error', settle);
        video.addEventListener('waiting', timeout);
        video.addEventListener('stalled', timeout);
        document.addEventListener('visibilitychange', visibility);
        video.src = media.entranceSrc;
        video.load();
        timeout();
        observer.observe(video);
        return () => { disposed = true; clearTimeout(timer); observer.disconnect(); video.pause(); video.removeEventListener('canplay', start); video.removeEventListener('playing', playing); video.removeEventListener('ended', settle); video.removeEventListener('error', settle); video.removeEventListener('waiting', timeout); video.removeEventListener('stalled', timeout); document.removeEventListener('visibilitychange', visibility); };
    }, [ready, reducedMotion, paused, media.entranceSrc, settle]);
    return { phase, videoRef, motionPaused: paused, skipIntro: settle, toggleMotion: togglePaused };
}
