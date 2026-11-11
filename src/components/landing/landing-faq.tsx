import { ArrowUpRight } from 'lucide-react';
import { WorkspaceLink } from '@/components/workspace/workspace-link';

const questions = [
  ['Do I need to code?', 'No. Use the editor to update your desktop, icons and window content.'],
  ['Can I make more than one portfolio?', 'Yes. Your dashboard keeps your portfolios together so you can choose which one to edit.'],
  ['Does my portfolio have to look like this site?', 'No. Your published desktop uses the theme and artwork you choose in the editor.'],
  ['Can I reduce the animations?', 'Yes. Open Display options here or Appearance in your account settings. Your choice is saved on this device.'],
];

export function LandingFaq() {
  return <>
    <section className="landing-section faq-section persona-section-paper">
      <h2>Before you<br /><em>press start.</em></h2>
      <div className="faq-items">{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
    <section className="landing-section final-menu persona-section-blue">
      <h2>MAKE ROOM<br /><em>FOR YOUR WORLD.</em></h2>
      <WorkspaceLink href="/auth/signup" className="ws-final-cta persona-pointed-action">Create your account <ArrowUpRight size={24} aria-hidden="true" /></WorkspaceLink>
      <p>Already started? <WorkspaceLink href="/auth/login">Sign in</WorkspaceLink></p>
    </section>
    <footer className="landing-bottom"><WorkspaceLink href="/" className="ws-wordmark">PortaGen /</WorkspaceLink><span>A desktop. A story. Yours.</span><WorkspaceLink href="/privacy">Privacy policy</WorkspaceLink></footer>
  </>;
}
