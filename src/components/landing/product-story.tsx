import Image from 'next/image';
import { ArrowUpRight, Folder, FileText, Mail, Link2, Terminal, BookOpen, Trophy, LayoutTemplate } from 'lucide-react';
import { WorkspaceLink } from '@/components/workspace/workspace-link';
import { WorkspacePanel } from '@/components/workspace/workspace-primitives';
import { PortfolioShowcase } from './portfolio-showcase';

const windowTypes = [
  [Folder, 'Projects'], [FileText, 'Resume'], [Mail, 'Contact'], [Link2, 'Links'],
  [BookOpen, 'Blog'], [Terminal, 'Terminal'], [Trophy, 'Achievements'], [LayoutTemplate, 'Blank canvas'],
] as const;

export function ProductStory() {
  return <>
    <section className="landing-section showcase-section persona-section-blue" id="explore">
      <div className="section-intro">
        <h2>Not just a page.<br /><em>A place to explore.</em></h2>
        <p>Turn your work into a desktop. Visitors open windows, discover projects and get to know the person behind them.</p>
      </div>
      <PortfolioShowcase />
      <p className="demo-caption">Try the icons. Your portfolio can have its own windows, wallpaper and personality.</p>
    </section>
    <section className="landing-section workflow-section persona-section-paper">
      <h2>From blank desktop<br />to your own world.</h2>
      <ol className="workflow-steps">
        <li><span>Choose your look</span><p>Start with a desktop theme and make the wallpaper your own.</p></li>
        <li><span>Add your story</span><p>Fill windows with your projects, experience, links and contact details.</p></li>
        <li><span>Make it personal</span><p>Arrange icons, choose sounds and add music or widgets.</p></li>
        <li><span>Share your desktop</span><p>Preview the experience, then share your portfolio’s own link.</p></li>
      </ol>
      <WorkspaceLink className="ws-inline-cta persona-pointed-action" href="/auth/signup">Build your first portfolio <ArrowUpRight size={22} aria-hidden="true" /></WorkspaceLink>
    </section>
    <section className="landing-section window-section persona-section-blue">
      <div className="window-library" aria-label="Illustrative portfolio windows">
        <WorkspacePanel className="library-back">
          <div className="demo-windowbar" data-frame-section>Projects <Folder size={16} aria-hidden="true" /></div>
          <div className="library-project"><Folder size={38} aria-hidden="true" /><span>GOOD WORK<br />DESERVES SPACE.</span></div>
        </WorkspacePanel>
        <WorkspacePanel className="library-front">
          <div className="demo-windowbar" data-frame-section>About me <FileText size={16} aria-hidden="true" /></div>
          <h3>More than a résumé.</h3>
          <p>Your background, your work, your next chapter. Give each its own window.</p>
        </WorkspacePanel>
        <div className="library-floating"><Terminal size={19} aria-hidden="true" /><span>Hello, world.</span></div>
      </div>
      <div className="window-copy">
        <h2>A window for<br /><em>every part of you.</em></h2>
        <p>Put your work in context. Use the built-in window types and edit their content in one place.</p>
        <ul className="window-types">{windowTypes.map(([Icon, label]) => <li key={label}><Icon size={19} aria-hidden="true" />{label}</li>)}</ul>
      </div>
    </section>
    <section className="landing-section customization-section persona-section-paper">
      <WorkspacePanel className="customization-art" data-parallax="art">
        <div className="customization-art-fill" data-frame-section><Image src="/artwork/eighty-six/reference-set/03-lena-wind.webp" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" loading="lazy" /></div>
      </WorkspacePanel>
      <div className="customization-copy">
        <h2>Your taste.<br />Your atmosphere.<br /><em>Your desktop.</em></h2>
        <p>Retro pixels, familiar desktops or a softer modern look. Your portfolio’s theme is yours to choose.</p>
        <div className="theme-swatches" aria-label="Example theme directions"><span className="theme-pixel">Pixel</span><span className="theme-xp">Windows XP</span><span className="theme-glass">Liquid glass</span></div>
        <p className="customization-note">Bring your own wallpapers, icons, music and sounds. The editor puts the details in your hands.</p>
      </div>
    </section>
    <section className="landing-section sharing-section persona-section-blue">
      <div>
        <h2>Behind the scenes,<br /><em>you’re in control.</em></h2>
        <p>Edit your desktop’s lock screen, home screen and window content. Preview as you go, then send people straight to your world.</p>
      </div>
      <div className="sharing-comparison">
        <WorkspacePanel className="editor-example">
          <strong data-frame-section>In your editor</strong>
          <div><span>Portfolio name</span><span className="example-input">Alex’s desktop</span><span>About me</span><span className="example-input">A little about my work…</span><span className="example-save">Save Info</span></div>
        </WorkspacePanel>
        <ArrowUpRight className="comparison-arrow" size={28} aria-hidden="true" />
        <WorkspacePanel className="visitor-example">
          <strong data-frame-section>For your visitors</strong>
          <div className="mini-desktop" data-frame-section><Folder size={27} aria-hidden="true" /><span>Projects</span><div className="mini-window">Your work,<br />front and center.</div></div>
        </WorkspacePanel>
        <p className="example-url">Your portfolio link includes your username and portfolio ID.</p>
      </div>
    </section>
  </>;
}
