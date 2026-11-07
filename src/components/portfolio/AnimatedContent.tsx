import React, { useRef, useEffect, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollContainerContext } from './animated-section';

interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  exitDuration?: number;
  exitEase?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  once?: boolean;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 50,
  direction = 'vertical',
  reverse = false,
  duration = 0.5,
  ease = 'power3.out',
  exitDuration,
  exitEase = 'power2.in',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.01,
  delay = 0,
  once = false,
  className = '',
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useContext(ScrollContainerContext);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const root = scrollContainerRef?.current ?? null;
    const axis = direction === 'horizontal' ? 'x' : 'y';
    const fromOffset = reverse ? -distance : distance;
    const exitDur = exitDuration ?? duration * 0.45;

    gsap.set(el, {
      [axis]: fromOffset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            [axis]: 0,
            scale: 1,
            opacity: 1,
            duration,
            ease,
            delay,
            overwrite: true,
          });
          if (once) io.disconnect();
        } else if (!once && entry.rootBounds) {
          const wentAbove = entry.boundingClientRect.top < entry.rootBounds.top;
          gsap.to(el, {
            [axis]: wentAbove ? -distance * 0.5 : fromOffset,
            opacity: animateOpacity ? 0 : 1,
            duration: exitDur,
            ease: exitEase,
            overwrite: true,
          });
        }
      },
      { root, threshold, rootMargin: '0px 0px -5% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;
