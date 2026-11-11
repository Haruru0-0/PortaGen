"use client";
import Image from 'next/image';
import { WorkspaceLink } from './workspace-link';
import { usePortfolioContext } from '@/contexts/portfolioContext';
export function DashboardMainMenu({ username }: {
    username: string;
}) { const { currentPortfolioId } = usePortfolioContext(); const editor = currentPortfolioId ? `/dashboard/editor/${currentPortfolioId}` : '/dashboard/portfolios'; return <section className="ws-dashboard-menu-scene"><div className="ws-dashboard-menu-art" aria-hidden="true"><Image src="/artwork/eighty-six/reference-set/06-shin-scarf.webp" alt="" fill sizes="(min-width: 768px) 70vw, 100vw"/></div><h1 data-page-heading>Welcome back,<br />{username}.</h1><p>Your next chapter starts here.</p><nav aria-label="Main menu" className="game-menu"><WorkspaceLink className="game-menu-item is-primary" href={editor}>Continue<span>Editor</span></WorkspaceLink><WorkspaceLink className="game-menu-item" href="/dashboard/portfolios">Portfolios<span>Save slots</span></WorkspaceLink><WorkspaceLink className="game-menu-item" href="/dashboard/settings">Settings<span>Options</span></WorkspaceLink></nav></section>; }
