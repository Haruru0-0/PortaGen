"use client";
import { useRef, type ReactNode } from 'react';
import { useLandingParallax } from './use-landing-parallax';
export function LandingDepth({ children }: {
    children: ReactNode;
}) { const ref = useRef<HTMLDivElement>(null); useLandingParallax(ref); return <div ref={ref}>{children}</div>; }
