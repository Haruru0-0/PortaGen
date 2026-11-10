export function isWorkspacePath(pathname: string) { return ['/', '/privacy', '/auth/login', '/auth/signup', '/auth/forgot-password'].includes(pathname) || pathname === '/dashboard' || pathname.startsWith('/dashboard/'); }
export interface TransitionInput {
    href: string;
    origin: string;
    currentPath: string;
    button: number;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    target?: string;
    download: boolean;
    reducedMotion: boolean;
}
export function shouldTransition(input: TransitionInput) {
    if (input.reducedMotion || input.button !== 0 || input.metaKey || input.ctrlKey || input.shiftKey || input.altKey || input.download || (input.target && input.target !== '_self'))
        return false;
    try {
        const url = new URL(input.href, input.origin);
        return url.origin === input.origin && !url.hash && url.pathname !== input.currentPath && isWorkspacePath(url.pathname) && isWorkspacePath(input.currentPath);
    }
    catch {
        return false;
    }
}
