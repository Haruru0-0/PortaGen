"use client"
import React from "react";

import { DndContext } from "@dnd-kit/core";
import { useEffect, useState, useRef, useMemo } from "react";
import { AppWindow } from "@/components/portfolio/window";
import { DesktopIcon } from "@/components/portfolio/icon";
import { MobileIcon } from "@/components/portfolio/MobileIcon";
import { Taskbar } from "@/components/portfolio/taskbar";
import MenuBar from "@/components/portfolio-preview/menu-bar";
import MusicPlayerWidget from "@/components/portfolio/MusicPlayerWidget";
import Wallpaper from "@/assets/wallpaper.jpg";
import Project from "@/assets/project.png";
import LinkIcon from "@/assets/Links.png";
import Phone from "@/assets/phone.png";
import BlogIcon from "@/assets/Blog.png";
import About from "@/assets/about.png";
import ResumeIcon from "@/assets/resume.png";
import GreetingGif from "@/assets/greeting.gif";
import WaterCd from "@/assets/water-cd.jpg";
import CutePuppy from "@/assets/cute-puppy.jpg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AudioProvider } from "@/components/portfolio/audio-context";
import { SoundProvider } from "@/components/portfolio/sound-context";
import { CuteSuspenseFallback } from "@/components/portfolio/suspense-fallback";
import Image from "next/image";

const AboutMe = React.lazy(() => import("@/components/portfolio/about-me"));
const Resume = React.lazy(() => import("@/components/portfolio/resume"));
const Projects = React.lazy(() => import("@/components/portfolio/projects"));
const Blog = React.lazy(() => import("@/components/portfolio/blog"));
const Links = React.lazy(() => import("@/components/portfolio/links"));
const Contact = React.lazy(() => import("@/components/portfolio/contact"));

interface DesktopProps {
  previewMode?: "desktop" | "mobile";
  embedded?: boolean;
  wallpaper?: string;
  mobileWidget1?: string;
  mobileWidget2?: string;
  musicPlayerIcon?: string;
  desktopGif?: string;
  icons?: Array<{ id: string; label: string; icon: any }>;
  theme?: any;
  spotifyPlaylistUrl?: string;
}

export default function Desktop({ previewMode, embedded = false, wallpaper: wallpaperProp, spotifyPlaylistUrl }: DesktopProps) {
  type WindowData = {
    name: string;
    minimized: boolean;
    component: React.ReactNode;
  };

  const mqDesktop = useMediaQuery("(min-width: 650px)");
  const isDesktop = previewMode ? previewMode === "desktop" : mqDesktop;
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);
  const greetingRef = useRef<HTMLDivElement>(null);
  const greetingImageRef = useRef<HTMLImageElement>(null);
  const greetingTextRef = useRef<HTMLHeadingElement>(null);
  const desktopIconsRef = useRef<HTMLDivElement[]>([]);
  const mobileIconsRef = useRef<HTMLDivElement[]>([]);

  const desktopApps = [
    { id: "about", label: "About me", icon: About },
    { id: "resume", label: "Resume", icon: ResumeIcon },
    { id: "projects", label: "Projects", icon: Project },
    { id: "blog", label: "Blog", icon: BlogIcon },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "contact", label: "Contact me", icon: Phone },
  ];

  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);

  const getComponentForWindow = (name: string) => {
    switch (name) {
      case "About me":
        return <AboutMe />;
      case "Resume":
        return <Resume />;
      case "Projects":
        return <Projects />;
      case "Blog":
        return <Blog />;
      case "Links":
        return <Links />;
      case "Contact me":
        return <Contact />;
      default:
        return <div>Content for {name}</div>;
    }
  };

  const openWindow = (name: string) => {
    setOpenWindows((prev) => {
      if (prev.find((w) => w.name === name)) return prev;
      return [
        ...prev,
        { name, minimized: false, component: getComponentForWindow(name) },
      ];
    });
  };

  const closeWindow = (name: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.name !== name));
  };

  const minimizeWindow = (name: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.name === name ? { ...w, minimized: true } : w))
    );
  };

  const restoreWindow = (name: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.name === name ? { ...w, minimized: false } : w))
    );
  };

  const handleAppClick = (label: string) => {
    const win = openWindows.find((w) => w.name === label);
    if (win?.minimized) {
      restoreWindow(label);
    } else {
      openWindow(label);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      if (greetingRef.current) {
        gsap.fromTo(greetingRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, delay: 0.3 }
        );
      }
      desktopIconsRef.current.forEach((icon, index) => {
        if (icon) {
          gsap.fromTo(icon,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: index * 0.05 }
          );
        }
      });
      mobileIconsRef.current.forEach((icon, index) => {
        if (icon) {
          gsap.fromTo(icon,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: index * 0.05 }
          );
        }
      });
      return;
    }

    if (isDesktop && greetingRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(greetingRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
      );
      if (greetingImageRef.current) {
        tl.fromTo(greetingImageRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
          "-=0.5"
        );
        gsap.to(greetingImageRef.current, {
          y: -10,
          duration: 3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }
      if (greetingTextRef.current) {
        gsap.to(greetingTextRef.current, {
          opacity: 0.7,
          duration: 3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    }

    if (isDesktop) {
      desktopIconsRef.current.forEach((icon, index) => {
        if (icon) {
          gsap.fromTo(icon,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              delay: index * 0.1,
              ease: "back.out(1.7)"
            }
          );
        }
      });
    }
  }, [isDesktop]);

  return (
    <SoundProvider>
      <AudioProvider>
        <DndContext>
          <div
              className="relative w-full h-full overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${(wallpaperProp as any) || Wallpaper.src})` }}
          >
            {isDesktop && (
              <MenuBar className="absolute top-0 left-0 right-0 z-20" />
            )}

            <Image
              src={wallpaperProp || Wallpaper}
              alt="Wallpaper"
              priority
              fill
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                filter: "saturate(1.1)",
              }}
            />

            {isDesktop && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-right z-10">
                <div
                    ref={greetingRef}
                    className="flex flex-col items-center"
                >
                  <Image
                      ref={greetingImageRef}
                      src={GreetingGif}
                      alt="Cute greeting"
                      width={96}
                      height={96}
                      className="w-24 h-24 mb-2 animate-float"
                      style={{
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                      }}
                  />
                  <h1
                      ref={greetingTextRef}
                      className="text-2xl font-bold text-white drop-shadow-md"
                  >
                    {greeting}!
                  </h1>
                </div>
              </div>
            )}

            {isDesktop ? (
              <div className="absolute inset-0 flex flex-col gap-4 p-4 pt-6">
                <div className="flex flex-col flex-wrap gap-4 content-start flex-1 overflow-auto pointer-events-none">
                  {desktopApps.map((app, index) => (
                    <div
                      key={app.id}
                      ref={(el) => {
                        if (el) desktopIconsRef.current[index] = el;
                      }}
                    >
                      <DesktopIcon
                        id={app.id}
                        label={app.label}
                        icon={app.icon}
                        onDoubleClick={() => openWindow(app.label)}
                      />
                    </div>
                  ))}
                </div>
                <MusicPlayerWidget isDesktop={true} embedded={embedded} spotifyPlaylistUrl={spotifyPlaylistUrl} />
                <Taskbar
                  apps={desktopApps}
                  openWindows={openWindows}
                  onAppClick={handleAppClick}
                  className="mt-auto"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden gap-8 p-4">
                <div className="flex flex-col gap-4 justify-between h-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-4 auto-rows-min justify-items-center">
                      {desktopApps.slice(0, 4).map((app, index) => (
                        <div
                          key={app.id}
                          ref={(el) => {
                            if (el) mobileIconsRef.current[index] = el;
                          }}
                        >
                          <MobileIcon
                            id={app.id}
                            label={app.label}
                            icon={app.icon}
                            onClick={() => openWindow(app.label)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Image
                        src={WaterCd}
                        alt="Water CD"
                        width={160}
                        height={160}
                        className="rounded-2xl h-[160px] animate-float"
                        style={{
                          willChange: "transform",
                          backfaceVisibility: "hidden",
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-center">
                      <Image
                        src={CutePuppy}
                        alt="Cute puppy"
                        width={160}
                        height={160}
                        className="rounded-2xl h-[160px] animate-float"
                        style={{
                          willChange: "transform",
                          backfaceVisibility: "hidden",
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 auto-rows-min justify-items-center">
                      {desktopApps.slice(4, 6).map((app, index) => (
                        <div
                          key={app.id}
                          ref={(el) => {
                            if (el) mobileIconsRef.current[index + 4] = el;
                          }}
                        >
                          <MobileIcon
                            id={app.id}
                            label={app.label}
                            icon={app.icon}
                            onClick={() => openWindow(app.label)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <MusicPlayerWidget isDesktop={false} spotifyPlaylistUrl={spotifyPlaylistUrl} />
                </div>
                <Taskbar
                  apps={desktopApps}
                  openWindows={openWindows}
                  onAppClick={handleAppClick}
                  className="mt-auto"
                />
              </div>
            )}

            {openWindows.map((win) => (
              <AppWindow
                key={win.name}
                title={win.name}
                onClose={() => closeWindow(win.name)}
                onMinimize={() => minimizeWindow(win.name)}
                isMobile={!isDesktop}
                isMinimized={win.minimized}
              >
                <React.Suspense fallback={<CuteSuspenseFallback />}>
                    {win.component}
                </React.Suspense>
              </AppWindow>
            ))}
          </div>
        </DndContext>
      </AudioProvider>
    </SoundProvider>
  );
}
