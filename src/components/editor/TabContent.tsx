
import { LockScreenSettingsTab } from "@/components/editor/lock-screen-settings-tab";
import { WallpaperTab } from "@/components/editor/wallpaper-tab";
import { IconsTab } from "@/components/editor/icons-tab";
import { MusicTab } from "@/components/editor/music-tab";
import { WindowsTab } from "@/components/editor/windows-tab";
import { SoundEffectsTab } from "@/components/editor/sound-effects-tab";
import { ThemeEditor } from "@/components/theme-editor";
import { PixelCard } from "@/components/pixel-card";

interface TabContentProps {
  activeCategory: string;
  activeLockScreenTab: string;
  activeHomeScreenTab: string;
  onSave: () => void;
  // Add all the necessary props for the tabs here
}

export const TabContent = ({
  activeCategory,
  activeLockScreenTab,
  activeHomeScreenTab,
  onSave,
  ...props
}: TabContentProps) => {
  return (
    <div className="lg:col-span-2">
      <div className="tab-content">
        {activeCategory === "lockScreen" && (
          <>
            {activeLockScreenTab === "settings" && (
              <LockScreenSettingsTab {...props} onSave={onSave} />
            )}
            {activeLockScreenTab === "wallpaper" && (
              <WallpaperTab {...props} onSave={onSave} />
            )}
          </>
        )}

        {activeCategory === "homeScreen" && (
          <>
            {activeHomeScreenTab === "wallpaper" && (
              <WallpaperTab {...props} onSave={onSave} />
            )}
            {activeHomeScreenTab === "icons" && <IconsTab {...props} onSave={onSave} />}
            {activeHomeScreenTab === "music" && <MusicTab {...props} onSave={onSave} />}
            {activeHomeScreenTab === "windows" && <WindowsTab {...props} onSave={onSave} />}
            {activeHomeScreenTab === "sounds" && <SoundEffectsTab {...props} onSave={onSave} />}
            {activeHomeScreenTab === "theme" && (
              <PixelCard>
                <ThemeEditor {...props} />
              </PixelCard>
            )}
          </>
        )}
      </div>
    </div>
  );
};
