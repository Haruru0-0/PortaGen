import '@/components/landing/landing-persona.css';
import type {Metadata} from 'next';
import {HERO_MEDIA} from '@/lib/blue-hour/media';
import {LandingMotionProvider} from '@/components/landing/landing-motion-provider';
import {EntranceHero} from '@/components/landing/entrance-hero';
import {LandingDepth} from '@/components/landing/landing-depth';
import {ProductStory} from '@/components/landing/product-story';
import {LandingFaq} from '@/components/landing/landing-faq';
export const metadata:Metadata={title:'PortaGen — Your world, on display',description:'Build a desktop-style portfolio with your projects, windows, wallpapers and personality. Create, preview and share your own world.'};
export default function HomePage(){return <main className="blue-hour-landing"><LandingMotionProvider><LandingDepth><EntranceHero media={HERO_MEDIA}/><ProductStory/><LandingFaq/></LandingDepth></LandingMotionProvider></main>;}
