
import { PixelCard } from "@/components/pixel-card";
import { homeScreenTabs, lockScreenTabs } from "@/lib/constants/tabs";
import { useEditorUIStore, LockScreenTab, HomeScreenTab } from "@/lib/stores/ui-store";
import { useRef } from "react";
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

          <div className="space-y-2">
            {activeCategory === "lockScreen"
              ? lockScreenTabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(el) => {
                    if (el) tabsRef.current[index] = el;
                  }}
                  onClick={() => handleTabChange(tab.id as LockScreenTab)}
                  className={`w-full cursor-pointer text-left px-4 py-3 text-[10px] border-2 border-border transition-colors ${activeLockScreenTab === tab.id
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
                  onClick={() => handleTabChange(tab.id as HomeScreenTab)}
                  className={`w-full cursor-pointer text-left px-4 py-3 text-[10px] border-2 border-border transition-colors ${activeHomeScreenTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
          </div>
        </div>
      </PixelCard>
    </div>
  );
};
