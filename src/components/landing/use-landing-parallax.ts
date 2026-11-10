"use client";
import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLandingMotion } from './landing-motion-provider';
export function useLandingParallax(ref: RefObject<HTMLElement | null>) { const { parallaxAllowed } = useLandingMotion(); useEffect(() => { if (!parallaxAllowed || !ref.current)
    return; gsap.registerPlugin(ScrollTrigger); const context = gsap.context(() => { gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => { const depth = el.dataset.parallax === 'art' ? 24 : 16; gsap.fromTo(el, { y: depth }, { y: -depth, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }); }); }, ref); return () => context.revert(); }, [parallaxAllowed, ref]); }
