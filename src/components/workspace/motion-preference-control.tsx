"use client";
import { Switch } from '@/components/ui/switch';
import { useEffect, useId, useRef, useState } from 'react';
import type { MotionPreference } from '@/lib/blue-hour/motion-preference';
import { useWorkspaceMotion } from './workspace-motion-provider';

export function MotionPreferenceControl() {
  const { preference, reducedMotion, setPreference } = useWorkspaceMotion();
  const id = useId();
  const [settling, setSettling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const changePreference = (next: MotionPreference) => {
    if (timer.current) clearTimeout(timer.current);
    // Finish only a toggle started with motion enabled. The page preference
    // changes immediately, and already-reduced users get no motion exception.
    setSettling(!reducedMotion);
    if (!reducedMotion) timer.current = setTimeout(() => setSettling(false), 360);
    setPreference(next);
  };

  return <div className="ws-motion-control">
    <label htmlFor={id} className="ws-switch-label">
      <span>Reduce animation</span>
      <Switch id={id} checked={reducedMotion}
        data-motion-switch-settling={settling || undefined}
        onCheckedChange={checked => changePreference(checked ? 'reduced' : 'full')}
        aria-describedby={`${id}-help`} />
    </label>
    <p id={`${id}-help`} className="ws-helper">
      {preference === 'system' ? 'Following your device setting.' : 'Your choice is saved on this device.'} Reduces entrances, water, parallax and page transitions.
    </p>
    <button type="button" className="ws-text-button" onClick={() => changePreference('system')}>Use device setting</button>
  </div>;
}
