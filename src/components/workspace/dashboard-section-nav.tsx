"use client";
import { usePathname } from 'next/navigation';
import { Home, FolderOpen, Settings } from 'lucide-react';
import { WorkspaceLink } from './workspace-link';
export const dashboardNav = [{ href: '/dashboard', label: 'Home', icon: Home }, { href: '/dashboard/portfolios', label: 'Portfolios', icon: FolderOpen }, { href: '/dashboard/settings', label: 'Settings', icon: Settings }];
export function DashboardSectionNav({ mobile = false }: {
    mobile?: boolean;
}) { const path = usePathname(); return <nav className={mobile ? 'ws-mobile-nav' : 'ws-section-nav'} aria-label={mobile ? 'Mobile workspace navigation' : 'Workspace navigation'}>{dashboardNav.map(({ href, label, icon: Icon }) => <WorkspaceLink key={href} href={href} aria-current={path === href || (href === '/dashboard/portfolios' && path.startsWith('/dashboard/editor/')) ? 'page' : undefined}><Icon size={19}/><span>{label}</span></WorkspaceLink>)}</nav>; }
