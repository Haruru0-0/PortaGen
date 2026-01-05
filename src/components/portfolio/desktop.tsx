import React from "react";
import Image from "next/image";
import { DndContext } from "@dnd-kit/core";
import { useEffect, useState, useRef } from "react";
import { Window } from "./window";
import { DesktopIcon } from "./icon";
import { MobileIcon } from "./MobileIcon";
import { Taskbar } from "./taskbar";
import MenuBar from "./MenuBar";
import MusicPlayerWidget from "./MusicPlayerWidget";
import Wallpaper from "@/assets/wallpaper.jpg";
import GreetingGif from "@/assets/greeting.gif";
import WaterCd from "@/assets/water-cd.jpg";
import CutePuppy from "@/assets/cute-puppy.jpg";
import { useMediaQuery } from "@/hooks/use-media-query";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MobileSettingsBar } from "./MobileSettingsBar";
import { useIconContext } from "@/contexts/iconContext";
import { useDesktopContext } from "@/contexts/desktopContext";
import { useDesktopStore } from "@/lib/stores/desktop-store";
import type { WindowContent } from "@/lib/types";
import { useParams } from "next/navigation";

const AboutMe = React.lazy(() => import("./about-me"));
const Resume = React.lazy(() => import("./resume"));
const Projects = React.lazy(() => import("./projects"));
const Blog = React.lazy(() => import("./blog"));
const Links = React.lazy(() => import("./links"));
const Contact = React.lazy(() => import("./contact"));

import { useWindowsContext } from "@/contexts/windowsContext";
import { useThemeStore } from "@/lib/stores/theme-store";

export default function Desktop({ preview = false, previewMode }: { preview?: boolean; previewMode?: "desktop" | "mobile" }) {
  type WindowData = {
    name: string;
    minimized: boolean;
    component: React.ReactNode;
  };

  const params = useParams<{ username: string, id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { data, getDesktopData, displayDesktopData } = useDesktopContext();
  const { wallpaper, desktopGif, mobileWidget1, mobileWidget2, setDesktopState } = useDesktopStore();
  const { icons, getAllIcons, displayIcons } = useIconContext();
  const { windows: fetchedWindows, fetchWindows, displayWindows } = useWindowsContext();
  const musicPlayerStyleId = useThemeStore((state) => state.musicPlayerStyleId);

  useEffect(() => {
    if (currentPortfolioId && !data) {
      if (preview) {
        void getDesktopData(currentPortfolioId)
      } else {
        void displayDesktopData(params.username, currentPortfolioId)
      }
    }
  }, []);

  useEffect(() => {
    if (data) {
      setDesktopState({
        wallpaper: data.wallpaperUrl || '',
        desktopGif: data.desktopGifUrl || '',
        mobileWidget1: data.widget1Url || '',
        mobileWidget2: data.widget2Url || ''
      })
    }
  }, [data, setDesktopState])

  useEffect(() => {
    if (currentPortfolioId) {
      if (preview) {
        void getAllIcons(currentPortfolioId)
        void fetchWindows(currentPortfolioId)
      } else {
        console.log("we're here")
        void displayIcons(params.username, currentPortfolioId)
        void displayWindows(params.username, currentPortfolioId)
      }
    }
  }, [])

  const effectiveWallpaper = wallpaper || Wallpaper.src;
  const effectiveGif = desktopGif || GreetingGif.src;
  const effectiveWidget1 = mobileWidget1 || WaterCd.src;
  const effectiveWidget2 = mobileWidget2 || CutePuppy.src;

  // Use editor content in preview mode, otherwise use fetched windows
  const effectiveWindows = fetchedWindows;

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
    const windowContent = effectiveWindows.find((w: WindowContent) => w.name === name);

    // If we found the window content, use its type to decide what to render
    if (windowContent && windowContent.data) {
      // Handle both possible structures
      const actualContent = windowContent.data.content || windowContent.data;
      const windowType = windowContent.data.type;

      switch (windowType) {
        case "about": return <AboutMe data={actualContent} />;
        case "resume": return <Resume />;
        case "projects": return <Projects data={actualContent} />;
        case "blog": return <Blog data={actualContent} />;
        case "links": return <Links />;
        case "contact": return <Contact data={actualContent} />;
        default: return <div>{windowContent.data.description || "Content"}</div>;
      }
    }

    return <div>No content available</div>;
  };

  const findWindowByIconId = (iconId: string) => {
    console.log("Looking for window with iconId:", iconId, "typeof:", typeof iconId);
    console.log("Available windows:", effectiveWindows.map(w => ({ name: w.name, iconId: w.iconId, iconIdType: typeof w.iconId })));

    const foundWindow = effectiveWindows.find((w: WindowContent) => {
      // Handle both string and number comparisons
      const windowIconId = w.iconId;
      const match = String(windowIconId) === String(iconId);
      console.log(`Checking window ${w.name}: iconId=${windowIconId} (${typeof windowIconId}), looking for=${iconId} (${typeof iconId}), match=${match}`);
      return match;
    });

    console.log("Found window:", foundWindow);
    return foundWindow;
  };

  const openWindow = (iconId: string) => {
    const windowContent = findWindowByIconId(iconId);
    if (!windowContent) {
      return;
    }

    setOpenWindows((prev) => {
      if (prev.find((w) => w.name === windowContent.name)) return prev;
      return [
        ...prev,
        { name: windowContent.name, minimized: false, component: getComponentForWindow(windowContent.name) },
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
    // Find the icon by name to get its ID
    const icon = icons.find((i) => i.name === label);
    if (!icon) {
      return;
    }

    const windowContent = findWindowByIconId(String(icon.id));
    if (!windowContent) {
      return;
    }

    const win = openWindows.find((w) => w.name === windowContent.name);
    if (win?.minimized) {
      restoreWindow(windowContent.name);
    } else {
      openWindow(String(icon.id));
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
    <DndContext>
      <div
        className={`${preview ? 'w-full h-full' : 'w-screen h-screen'} relative overflow-hidden bg-cover bg-center`}
        style={{ backgroundImage: `url(${effectiveWallpaper})` }}
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
                  src={effectiveGif}
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
              {icons.map((app, index) => (
                <div
                  key={app.id}
                  ref={(el) => {
                    if (el) desktopIconsRef.current[index] = el;
                  }}
                >
                  <DesktopIcon
                    id={String(app.id)}
                    label={app.name}
                    icon={app.icon}
                    onDoubleClick={() => openWindow(String(app.id))}
                  />
                </div>
              ))}
            </div>
            <MusicPlayerWidget isDesktop={true} embedded={preview} spotifyPlaylistUrl={data?.spotifyPlaylistUrl} musicPlayerStyleId={musicPlayerStyleId} />
            <Taskbar
              apps={icons.map(icon => ({ id: String(icon.id), label: icon.name, icon: icon.icon }))}
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
                  {icons.slice(0, 4).map((app, index) => (
                    <div
                      key={app.id}
                      ref={(el) => {
                        if (el) mobileIconsRef.current[index] = el;
                      }}
                    >
                      <MobileIcon
                        id={String(app.id)}
                        label={app.name}
                        icon={app.icon}
                        onClick={() => openWindow(String(app.id))}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Image
                    src={effectiveWidget1}
                    alt="Water CD"
                    width={160}
                    height={160}
                    className="rounded-2xl h-40 w-auto animate-float-smooth"
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
                    src={effectiveWidget2}
                    alt="Cute Puppy"
                    width={160}
                    height={160}
                    className="rounded-2xl h-40 w-auto animate-float-smooth"
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-4 auto-rows-min justify-items-center">
                    {icons.slice(4, 6).map((app, index) => (
                      <div
                        key={app.id}
                        ref={(el) => {
                          if (el) mobileIconsRef.current[index + 4] = el;
                        }}
                      >
                        <MobileIcon
                          id={String(app.id)}
                          label={app.name}
                          icon={app.icon}
                          onClick={() => openWindow(String(app.id))}
                        />
                      </div>
                    ))}
                  </div>
                  <MobileSettingsBar previewMode={previewMode} embedded={preview} />
                </div>
              </div>
              <MusicPlayerWidget isDesktop={false} embedded={preview} musicPlayerStyleId={musicPlayerStyleId} />
            </div>
            <Taskbar
              apps={icons.map(icon => ({ id: String(icon.id), label: icon.name, icon: icon.icon }))}
              openWindows={openWindows}
              onAppClick={handleAppClick}
              className="mt-auto"
              embedded={preview}
            />
          </div>
        )}

        {openWindows.map((win) => (
          <Window
            key={win.name}
            title={win.name}
            onClose={() => closeWindow(win.name)}
            onMinimize={() => minimizeWindow(win.name)}
            isMobile={!isDesktop}
            isMinimized={win.minimized}
          >
            {win.component}
          </Window>
        ))}
      </div>
    </DndContext>
  );
}