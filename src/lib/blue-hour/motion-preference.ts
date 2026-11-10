export type MotionPreference = 'system' | 'reduced' | 'full';
export const MOTION_STORAGE_KEY = 'portagen:workspace-motion:v1';
export function parseMotionPreference(value: string | null): MotionPreference { return value === 'reduced' || value === 'full' ? value : 'system'; }
export function resolveReducedMotion(preference: MotionPreference, systemReduced: boolean) { return preference === 'system' ? systemReduced : preference === 'reduced'; }
export function preferenceFromStorageEvent(key: string | null, value: string | null): MotionPreference | null { return key === null || key === MOTION_STORAGE_KEY ? parseMotionPreference(value) : null; }
