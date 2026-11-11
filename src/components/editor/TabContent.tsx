import { LockScreenSettingsTab } from "@/components/editor/lock-screen-settings-tab";
import { LockScreenWallpaperTab } from "@/components/editor/lock-screen-wallpaper-tab";
import { MobileWidgetsTab } from "@/components/editor/mobile-widgets-tab";
import { DesktopWallpaperTab } from "@/components/editor/desktop-wallpaper-tab";
import { IconsTab } from "@/components/editor/icons-tab";
import { MusicTab } from "@/components/editor/music-tab";
import { WindowsTab } from "@/components/editor/windows-tab";
import { SoundEffectsTab } from "@/components/editor/sound-effects-tab";
import { ThemeEditor } from "@/components/theme-editor";
import { WorkspacePanel as PixelCard } from "@/components/workspace/workspace-primitives";
import { DesktopWidgetTab } from "@/components/editor/desktop-widget-tab";
import { animate } from "motion";
import { useEffect, useRef } from "react";
import { useWorkspaceMotion } from "@/components/workspace/workspace-motion-provider";
import { homeScreenTabs, lockScreenTabs } from "@/lib/constants/tabs";
import { editorTabId } from "./TabsNavigation";
import { useEditorUIStore } from "@/lib/stores/ui-store";

export const TabContent = ({ idPrefix }: { idPrefix: string }) => {
    const {
        activeCategory,
        activeLockScreenTab,
        activeHomeScreenTab
    } = useEditorUIStore();

    const { ready, reducedMotion } = useWorkspaceMotion();
    const panelRef = useRef<HTMLDivElement>(null);
    const activeTab = activeCategory === "lockScreen" ? activeLockScreenTab : activeHomeScreenTab;
    const tabs = activeCategory === "lockScreen" ? lockScreenTabs : homeScreenTabs;
    useEffect(() => {
        if (!ready || reducedMotion || !panelRef.current) return;
        const panel = panelRef.current;
        const original = { opacity: panel.style.opacity, translate: panel.style.translate };
        const restore = () => { panel.style.opacity = original.opacity; panel.style.translate = original.translate; };
        const animation = animate(panel, { opacity: [0, 1], translate: ["0 24px", "0 0px"] }, {
            duration: .42, ease: [.22, 1, .36, 1], onComplete: restore,
        });
        return () => { animation.stop(); restore(); };
    }, [activeCategory, activeTab, ready, reducedMotion]);

    return (
        <div className="lg:col-span-2 min-[1400px]:col-span-1 min-w-0">
            <div ref={panelRef} className="tab-content">
                {tabs.map(tab => {
                    const id = editorTabId(idPrefix, activeCategory, tab.id);
                    if (tab.id === activeTab) return null;
                    return <div key={id} id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab`} hidden />;
                })}
                <div id={`${editorTabId(idPrefix, activeCategory, activeTab)}-panel`} role="tabpanel" aria-labelledby={`${editorTabId(idPrefix, activeCategory, activeTab)}-tab`} tabIndex={0}>
                <p className="workspace-editor-location">{activeCategory === "lockScreen" ? "Lock screen" : "Home screen"} / {tabs.find(tab => tab.id === activeTab)?.label}</p>
                {activeCategory === "lockScreen" && (
                    <>
                        {activeLockScreenTab === "settings" && <LockScreenSettingsTab />}
                        {activeLockScreenTab === "wallpaper" && <LockScreenWallpaperTab />}
                    </>
                )}

                {activeCategory === "homeScreen" && (
                    <>
                        {activeHomeScreenTab === "wallpaper" && <DesktopWallpaperTab />}
                        {activeHomeScreenTab === "mobile widgets" && <MobileWidgetsTab />}
                        {activeHomeScreenTab === "desktop widget" && <DesktopWidgetTab />}
                        {activeHomeScreenTab === "icons" && <IconsTab />}
                        {activeHomeScreenTab === "music" && <MusicTab />}
                        {activeHomeScreenTab === "windows" && <WindowsTab />}
                        {activeHomeScreenTab === "sounds" && <SoundEffectsTab />}
                        {activeHomeScreenTab === "theme" && (
                            <PixelCard>
                                <ThemeEditor />
                            </PixelCard>
                        )}
                    </>
                )}
                </div>
            </div>
        </div>
    );
};
