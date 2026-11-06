
import { PixelCard } from "@/components/pixel-card";
import { homeScreenTabs, lockScreenTabs } from "@/lib/constants/tabs";
import { useEditorUIStore, LockScreenTab, HomeScreenTab } from "@/lib/stores/ui-store";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const TabsNavigation = () => {
  const {
    activeCategory,
    activeLockScreenTab,
    activeHomeScreenTab,
    setActiveLockScreenTab,
    setActiveHomeScreenTab
  } = useEditorUIStore();

  const tabsRef = useRef<HTMLButtonElement[]>([]);
  const stripRef = useRef<HTMLDivElement>(null);
  const activeTab = activeCategory === "lockScreen" ? activeLockScreenTab : activeHomeScreenTab;

  // On small screens the tab strip scrolls sideways: keep the selected tab in view without moving the page
  useEffect(() => {
    const strip = stripRef.current;
    const selected = strip?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!strip || !selected || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: selected.offsetLeft - (strip.clientWidth - selected.clientWidth) / 2, behavior: "smooth" });
  }, [activeTab, activeCategory]);

  useGSAP(() => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    tabsRef.current.forEach((tab, index) => {
      if (tab) {
        gsap.fromTo(
          tab,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.2 + index * 0.05,
            ease: "back.out(1.7)",
          }
        )
      }
    })
  }, [])

  const handleTabChange = (tabId: LockScreenTab | HomeScreenTab) => {
    // Animation logic for content switching could be added here if needed
    // For now just updating state
    const tabContent = document.querySelector(".tab-content");
    if (tabContent) {
      gsap.fromTo(
        tabContent,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      )
    }

    if (activeCategory === "lockScreen") {
      setActiveLockScreenTab(tabId as LockScreenTab)
    } else {
      setActiveHomeScreenTab(tabId as HomeScreenTab)
    }
  }

  return (
    <div className="lg:col-span-1">
      <PixelCard>
        <div className="space-y-4">
          <h3 className="text-sm dashboard-pixel-text-shadow">
            {activeCategory === "lockScreen" ? "LOCK SCREEN" : "HOME SCREEN"}
          </h3>

          <div className="relative">
          <div ref={stripRef} role="tablist" aria-label="Editor sections" className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {activeCategory === "lockScreen"
              ? lockScreenTabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => {
                    if (el) tabsRef.current[index] = el;
                  }}
                  role="tab"
                  aria-selected={activeLockScreenTab === tab.id}
                  onClick={() => handleTabChange(tab.id as LockScreenTab)}
                  className={`lg:w-full shrink-0 whitespace-nowrap min-h-11 cursor-pointer text-left px-4 py-3 text-xs border-2 border-border transition-colors ${activeLockScreenTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                    }`}
                >
                  {tab.label}
                </button>
              ))
              : homeScreenTabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => {
                    if (el) tabsRef.current[index] = el;
                  }}
                  role="tab"
                  aria-selected={activeHomeScreenTab === tab.id}
                  onClick={() => handleTabChange(tab.id as HomeScreenTab)}
                  className={`lg:w-full shrink-0 whitespace-nowrap min-h-11 cursor-pointer text-left px-4 py-3 text-xs border-2 border-border transition-colors ${activeHomeScreenTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
          </div>
          <div aria-hidden="true" className="lg:hidden pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-card to-transparent" />
          </div>
        </div>
      </PixelCard>
    </div>
  );
};
