"use client";
import Link from 'next/link';
import { forwardRef, type ComponentProps } from 'react';
import { usePathname } from 'next/navigation';
import { shouldTransition } from '@/lib/blue-hour/navigation-policy';
import { useWorkspaceMotion } from './workspace-motion-provider';
import { useWorkspaceExperience } from './workspace-experience-provider';
type Props = ComponentProps<typeof Link> & {
    transition?: 'forward' | 'back' | 'none';
};
export const WorkspaceLink = forwardRef<HTMLAnchorElement, Props>(function WorkspaceLink({ onClick, transition = 'forward', ...props }, ref) {
    const pathname = usePathname();
    const { reducedMotion } = useWorkspaceMotion();
    const { navigate, cancelPendingTransition } = useWorkspaceExperience();
    return <Link {...props} ref={ref} onClick={e => { onClick?.(e); if (e.defaultPrevented)
        return; const href = e.currentTarget.href; if (transition !== 'none' && shouldTransition({ href, origin: window.location.origin, currentPath: pathname, button: e.button, metaKey: e.metaKey, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, target: props.target, download: e.currentTarget.hasAttribute('download'), reducedMotion })) {
        e.preventDefault();
        navigate(href, transition);
    }
    else if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0 && props.target !== '_blank')
        cancelPendingTransition(); }}/>;
});
export default WorkspaceLink;
