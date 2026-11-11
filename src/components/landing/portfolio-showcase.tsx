"use client";

import { useState } from 'react';
import { Folder, UserRound, Mail, Minus, Square, X, ArrowUpRight } from 'lucide-react';
import { WorkspacePanel } from '@/components/workspace/workspace-primitives';

const examples = {
  About: { icon: UserRound, title: 'A little about me', body: 'Hi, I’m Alex. I design thoughtful digital experiences and bring them to life with code.', detail: 'Designer · Developer · Curious human' },
  Projects: { icon: Folder, title: 'Selected work', body: 'Small ideas. Carefully made.', detail: 'Studio Archive / Identity, design & development' },
  Contact: { icon: Mail, title: 'Let’s make something', body: 'Have an idea in mind? Open a conversation.', detail: 'hello@example.com' },
};

export function PortfolioShowcase() {
  const [active, setActive] = useState<keyof typeof examples>('About');
  const current = examples[active];
  const Icon = current.icon;
  return <WorkspacePanel className="demo-desktop" aria-label="Illustrative portfolio desktop">
    <div className="demo-menubar" data-frame-section><strong>Alex’s desktop</strong><span>Illustrative example</span></div>
    <div className="demo-body">
      <div className="demo-wallpaper-art" data-frame-section aria-hidden="true" />
      <div className="demo-icons" role="group" aria-label="Explore example windows">
        {Object.entries(examples).map(([name, item]) => {
          const ItemIcon = item.icon;
          return <button type="button" key={name} aria-pressed={active === name} aria-controls="sample-window" onClick={() => setActive(name as keyof typeof examples)}><ItemIcon size={30} strokeWidth={1.5} aria-hidden="true" /><span>{name}</span></button>;
        })}
      </div>
      <WorkspacePanel className="demo-window" id="sample-window" role="region" aria-label={current.title}>
        <div className="demo-windowbar" data-frame-section><span><Icon size={15} aria-hidden="true" />{active}</span><span aria-hidden="true"><Minus size={12} /><Square size={11} /><X size={13} /></span></div>
        <div className="demo-windowbody">
          <div className="demo-avatar" aria-hidden="true">A.</div>
          <h3>{current.title}</h3><p>{current.body}</p><span className="demo-detail">{current.detail}</span>
          {active === 'Projects' && <div className="demo-project"><span>Studio<br />Archive</span><ArrowUpRight size={36} aria-hidden="true" /></div>}
        </div>
      </WorkspacePanel>
      <div className="demo-wallpaper-type" aria-hidden="true">MAKE<br />IT YOURS.</div>
    </div>
    <div className="demo-taskbar" data-frame-section><span><Square size={15} aria-hidden="true" />My portfolio</span><span>About · Projects · Contact</span></div>
  </WorkspacePanel>;
}
