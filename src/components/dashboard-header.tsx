"use client";
import { WorkspaceFrameLayers } from "./workspace/workspace-frame";
import {UserDropdown} from '@/components/user-dropdown';import {usePathname} from 'next/navigation';
const labels:Record<string,string>={'/dashboard':'Main menu','/dashboard/portfolios':'Portfolios / Save slots','/dashboard/settings':'Settings / Options'};
export function DashboardHeader(){const path=usePathname();return <header className="ws-dashboard-header ws-cut-frame"><WorkspaceFrameLayers/><span className="ws-dashboard-header-title">{labels[path]??'Portfolio editor'}</span><UserDropdown/></header>;}
