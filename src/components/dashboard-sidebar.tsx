import { WorkspaceFrameLayers } from "@/components/workspace/workspace-frame";
import {WorkspaceLink} from '@/components/workspace/workspace-link';import {DashboardSectionNav} from '@/components/workspace/dashboard-section-nav';
export function DashboardSidebar(){return <aside className="ws-sidebar ws-cut-frame"><WorkspaceFrameLayers/><WorkspaceLink href="/" className="ws-wordmark">PortaGen /</WorkspaceLink><DashboardSectionNav/><p className="ws-helper mt-auto">Your world,<br/>a window away.</p></aside>;}
