export type EntrancePhase = 'waiting' | 'playing' | 'settled';
export type EntranceEvent = 'ready' | 'skip' | 'ended' | 'error' | 'timeout' | 'autoplay-rejected' | 'interrupted' | 'pause';
export function canLoadEntrance(input: {
    seen: boolean;
    reducedMotion: boolean;
    saveData: boolean;
}) { return !input.seen && !input.reducedMotion && !input.saveData; }
export function advanceEntrance(phase: EntrancePhase, event: EntranceEvent): EntrancePhase { if (phase === 'settled')
    return phase; return event === 'ready' ? 'playing' : 'settled'; }
