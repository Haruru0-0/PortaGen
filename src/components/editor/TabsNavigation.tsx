
import { PixelCard } from "@/components/pixel-card";

interface TabsNavigationProps {
  activeCategory: string;
  lockScreenTabs: { id: string; label: string }[];
  homeScreenTabs: { id: string; label: string }[];
  activeLockScreenTab: string;
  activeHomeScreenTab: string;
  handleTabChange: (tabId: any) => void;
  tabsRef: React.MutableRefObject<HTMLButtonElement[]>;
}

export const TabsNavigation = ({
  activeCategory,
  lockScreenTabs,
  homeScreenTabs,
  activeLockScreenTab,
  activeHomeScreenTab,
  handleTabChange,
  tabsRef,
}: TabsNavigationProps) => {
  return (
    <div className="lg:col-span-1">
      <PixelCard>
        <div className="space-y-4">
          <h3 className="text-sm pixel-text-shadow">
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
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-left px-4 py-3 text-[10px] border-2 border-border transition-colors ${
                      activeLockScreenTab === tab.id
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
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-left px-4 py-3 text-[10px] border-2 border-border transition-colors ${
                      activeHomeScreenTab === tab.id
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
