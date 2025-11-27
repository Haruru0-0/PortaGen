import React from "react";
import Image from "next/image";
import { DndContext } from "@dnd-kit/core";
import { useEffect, useState, useRef } from "react";
import { AppWindow } from "./window";
import { DesktopIcon } from "./icon";
import { MobileIcon } from "./MobileIcon";
import { Taskbar } from "./taskbar";
import MenuBar from "./MenuBar";
import MusicPlayerWidget from "./MusicPlayerWidget";
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
import { AudioProvider } from "./audio-context";
import { SoundProvider } from "./sound-context";
import { MobileSettingsBar } from "./MobileSettingsBar";

const AboutMe = React.lazy(() => import("./about-me"));
const Resume = React.lazy(() => import("./resume"));
const Projects = React.lazy(() => import("./projects"));
const Blog = React.lazy(() => import("./blog"));
const Links = React.lazy(() => import("./links"));
const Contact = React.lazy(() => import("./contact"));

export default function Desktop({ preview = false, previewMode }: { preview?: boolean; previewMode?: "desktop" | "mobile" }) {
  type WindowData = {
    name: string;
    minimized: boolean;
    component: React.ReactNode;
  };

  const mqDesktop = useMediaQuery("(min-width: 650px)");
  const isDesktop = previewMode ? previewMode === "desktop" : mqDesktop;
  const hour = new Date().getHours();
  const initialGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const [greeting, setGreeting] = useState(initialGreeting);
  const greetingRef = useRef<HTMLDivElement>(null);
  const greetingImageRef = useRef<HTMLImageElement>(null);
  const greetingTextRef = useRef<HTMLHeadingElement>(null);
  const desktopIconsRef = useRef<HTMLDivElement[]>([]);
  const mobileIconsRef = useRef<HTMLDivElement[]>([]);
  const floatingAnims = useRef<gsap.core.Tween[]>([]);

  const desktopApps = [
    { id: "about", label: "About me", icon: About },
    { id: "resume", label: "Resume", icon: ResumeIcon },
    { id: "projects", label: "Projects", icon: Project },
    { id: "blog", label: "Blog", icon: BlogIcon },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "contact", label: "Contact me", icon: Phone },
  ];

  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);

  useEffect(() => {
    if (!isDesktop) {
      const hasOpenWindow = openWindows.some((w) => !w.minimized);
      if (hasOpenWindow) {
        floatingAnims.current.forEach((anim) => anim.pause());
      } else {
        floatingAnims.current.forEach((anim) => anim.resume());
      }
    }
  }, [openWindows, isDesktop]);

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
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        // Simple fade-in for reduced motion users
        if (greetingRef.current) {
          gsap.fromTo(
            greetingRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: 0.3 }
          );
        }

        desktopIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0 },
              { opacity: 1, duration: 0.3, delay: index * 0.05 }
            );
          }
        });

        mobileIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0 },
              { opacity: 1, duration: 0.3, delay: index * 0.05 }
            );
          }
        });
        return;
      }

      // Desktop greeting animation
      if (isDesktop && greetingRef.current) {
        const tl = gsap.timeline();

        tl.fromTo(
          greetingRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
        );

        if (greetingImageRef.current) {
          tl.fromTo(
            greetingImageRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
            "-=0.5"
          );

          // Floating animation
          floatingAnims.current.push(
            gsap.to(greetingImageRef.current, {
              y: -10,
              duration: 3,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
            })
          );
        }

        if (greetingTextRef.current) {
          floatingAnims.current.push(
            gsap.to(greetingTextRef.current, {
              opacity: 0.7,
              duration: 3,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
            })
          );
        }
      }

      // Desktop icons animation
      if (isDesktop) {
        desktopIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0, x: -20 },
              {
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: index * 0.1,
                ease: "back.out(1.7)",
              }
            );
          }
        });
      } else {
        // Mobile icons animation
        mobileIconsRef.current.forEach((icon, index) => {
          if (icon) {
            gsap.fromTo(
              icon,
              { opacity: 0, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                delay: index * 0.1,
                ease: "back.out(1.7)",
              }
            );
          }
        });
      }

      // Floating animation for decorative images
      const floatingElements =
        document.querySelectorAll<HTMLElement>(".animate-float");
      floatingElements.forEach((element) => {
        floatingAnims.current.push(
          gsap.to(element, {
            y: -10,
            duration: 6,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
          })
        );
      });
    },
    { dependencies: [isDesktop, greeting], revertOnUpdate: true }
  );

  return (
    <SoundProvider>
      <AudioProvider>
        <DndContext>
          <div
            className={`${preview ? 'w-full h-full' : 'w-screen h-screen'} relative overflow-hidden bg-cover bg-center`}
            style={{ backgroundImage: `url(${Wallpaper.src})` }}
          >
            {isDesktop && <MenuBar embedded={preview} previewMode={previewMode} />}

            {isDesktop && (
              <div className="absolute top-9 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <div ref={greetingRef} className="flex flex-col items-center">
                  <div ref={greetingImageRef} className="w-24 h-24 mb-2 animate-float relative" style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}>
                    <Image
                      src={GreetingGif}
                      alt="Cute greeting"
                      width={96}
                      height={96}
                      className="w-full h-full"
                    />
                  </div>
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
              <div className="absolute inset-0 flex flex-col gap-4 p-4 pt-12">
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
                <MusicPlayerWidget isDesktop={true} embedded={preview} />
                <Taskbar
                  apps={desktopApps}
                  openWindows={openWindows}
                  onAppClick={handleAppClick}
                  className="mt-auto"
                  embedded={preview}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden gap-8 p-4 pb-24">
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
                        className="rounded-2xl h-[160px] w-auto animate-float-smooth"
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
                        alt="Cute Puppy"
                        width={160}
                        height={160}
                        className="rounded-2xl h-[160px] w-auto animate-float-smooth"
                        style={{
                          willChange: "transform",
                          backfaceVisibility: "hidden",
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
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
                      <MobileSettingsBar previewMode={previewMode} embedded={preview} />
                    </div>
                  </div>
                  <MusicPlayerWidget isDesktop={false} embedded={preview} />
                </div>
                <Taskbar
                  apps={desktopApps}
                  openWindows={openWindows}
                  onAppClick={handleAppClick}
                  className="mt-auto"
                  embedded={preview}
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
                {win.component}
              </AppWindow>
            ))}
          </div>
        </DndContext>
      </AudioProvider>
    </SoundProvider>
  );
}
