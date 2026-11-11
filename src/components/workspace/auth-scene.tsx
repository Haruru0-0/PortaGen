"use client";
import type { ReactNode } from "react";
import Image from "next/image";
import { WorkspacePanel } from "./workspace-primitives";
import { ArrowLeft } from "lucide-react";
import { WorkspaceLink } from "./workspace-link";
import { useWorkspaceMotion } from "./workspace-motion-provider";
export interface AuthSceneProps {
    title: string;
    description?: string;
    artwork?: string;
    artworkLayout?: "scene" | "left-panel";
    children: ReactNode;
}
export function AuthScene({ title, description, artwork, artworkLayout = "scene", children }: AuthSceneProps) {
    const { reducedMotion, ready } = useWorkspaceMotion();
    return <main className="workspace-theme ws-auth persona-auth" data-artwork-layout={artworkLayout} data-workspace-motion={!ready || reducedMotion ? "reduced" : "full"}>
    {artwork && <div className="ws-auth-art" aria-hidden="true">
      <Image src={artwork} alt="" fill sizes="100vw" className="object-cover" priority />
    </div>}
    <div className="persona-auth-header">
      <WorkspaceLink href="/" className="ws-wordmark">PortaGen /</WorkspaceLink>
      <WorkspaceLink href="/" className="ws-back-link"><ArrowLeft size={17} aria-hidden="true"/>Back to home</WorkspaceLink>
    </div>
    <div className="ws-auth-form">
      <h1 id="auth-title" className="persona-page-title" data-page-heading>{title}</h1>
      {description && <p className="ws-auth-description">{description}</p>}
      <WorkspacePanel className="persona-auth-controls" aria-labelledby="auth-title">
        {children}
      </WorkspacePanel>
    </div>
  </main>;
}
