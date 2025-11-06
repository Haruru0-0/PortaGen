import {LockScreenSettingsTab} from "@/components/editor/lock-screen-settings-tab";
import {LockScreenWallpaperTab} from "@/components/editor/lock-screen-wallpaper-tab";
import {WidgetsTab} from "@/components/editor/widgets-tab";
import {DesktopWallpaperTab} from "@/components/editor/desktop-wallpaper-tab";
import {IconsTab} from "@/components/editor/icons-tab";
import {MusicTab} from "@/components/editor/music-tab";
import {WindowsTab} from "@/components/editor/windows-tab";
import {SoundEffectsTab} from "@/components/editor/sound-effects-tab";
import {ThemeEditor} from "@/components/theme-editor";
import {PixelCard} from "@/components/pixel-card";

interface TabContentProps {
    activeCategory: string;
    activeLockScreenTab: string;
    activeHomeScreenTab: string;
}

export const TabContent = ({
                               activeCategory,
                               activeLockScreenTab,
                               activeHomeScreenTab
                           }: TabContentProps) => {
    return (
        <div className="lg:col-span-2">
            <div className="tab-content">
                {activeCategory === "lockScreen" && (
                    <>
                        {activeLockScreenTab === "settings" && <LockScreenSettingsTab/>}
                        {activeLockScreenTab === "wallpaper" && <LockScreenWallpaperTab/>}
                    </>
                )}

                {activeCategory === "homeScreen" && (
                    <>
                        {activeHomeScreenTab === "wallpaper" && <DesktopWallpaperTab/>}
                        {activeHomeScreenTab === "widgets" && <WidgetsTab/>}
                        {activeHomeScreenTab === "icons" && <IconsTab/>}
                        {activeHomeScreenTab === "music" && <MusicTab/>}
                        {activeHomeScreenTab === "windows" && <WindowsTab/>}
                        {activeHomeScreenTab === "sounds" && <SoundEffectsTab/>}
                        {activeHomeScreenTab === "theme" && (
                            <PixelCard>
                                <ThemeEditor/>
                            </PixelCard>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
