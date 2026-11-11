"use client";
import { WorkspaceFrameLayers } from "@/components/workspace/workspace-frame";
import { useState } from 'react';
import { ArrowDown, SlidersHorizontal, Pause, Play, SkipForward } from 'lucide-react';
import { type HeroMedia } from '@/lib/blue-hour/media';
import { WorkspaceLink } from '@/components/workspace/workspace-link';
import { MotionPreferenceControl } from '@/components/workspace/motion-preference-control';
import { useEntranceScene } from './use-entrance-scene';
export function EntranceHero({ media }: {
    media: HeroMedia;
}) {
    const { phase, videoRef, motionPaused, skipIntro, toggleMotion } = useEntranceScene(media);
    const [options, setOptions] = useState(false);
    return <section className="entrance-hero" aria-labelledby="landing-title">
 <div className="entrance-art" aria-hidden="true"><video ref={videoRef} muted playsInline preload="none" poster={phase === 'settled' ? media.settledPoster : media.emptyPoster} className={phase === 'settled' ? 'is-settled' : ''}/>{phase === 'settled' && <div className="entrance-settled" style={{ backgroundImage: `url(${media.settledPoster})` }}/>}<div className="hero-water-depth" data-parallax="water"><div className="water-light"/></div></div>
 <header className="landing-header"><WorkspaceLink href="/" className="ws-wordmark">PortaGen<span aria-hidden="true"> / </span></WorkspaceLink><button type="button" className="ws-cut-frame ws-display-toggle relative" aria-label="Display options" aria-expanded={options} aria-controls="landing-display-options" onClick={() => setOptions(!options)}><WorkspaceFrameLayers/><SlidersHorizontal size={19} aria-hidden="true"/><span className="ws-display-label">Display options</span></button>{options && <div className="landing-display-options ws-panel ws-cut-frame" id="landing-display-options"><WorkspaceFrameLayers/><MotionPreferenceControl /><button type="button" className="ws-text-button" onClick={() => setOptions(false)}>Close display options</button></div>}</header>
 <div className="entrance-menu"><h1 id="landing-title">YOUR WORLD.<br /><span>ON DISPLAY.</span></h1><p>A portfolio they can explore.<br />A desktop that feels like you.</p><nav aria-label="Get started" className="game-menu"><WorkspaceLink href="/auth/signup" className="game-menu-item is-primary">Sign up<span>New story</span></WorkspaceLink><WorkspaceLink href="/auth/login" className="game-menu-item">Sign in<span>Continue</span></WorkspaceLink></nav><a href="#explore" className="landing-explore">Explore PortaGen <ArrowDown size={17}/></a></div>
 <div className="entrance-footer"><span>MAKE SOMETHING WORTH EXPLORING.</span><div className="entrance-controls">{phase !== 'settled' && <button type="button" onClick={skipIntro}><SkipForward size={15}/>Skip intro</button>}<button type="button" onClick={toggleMotion} aria-pressed={motionPaused}>{motionPaused ? <Play size={15}/> : <Pause size={15}/>}Pause background motion</button></div></div>
 </section>;
}
