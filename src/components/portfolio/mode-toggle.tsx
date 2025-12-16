import { Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTheme } from "@/components/theme-provider";
import { useThemeStore } from "@/lib/stores/theme-store";
import { useMediaQuery } from "@/hooks/use-media-query";

// Style configurations for each menubar theme
const STYLE_CONFIGS = {
  "liquid-glass": {
    wrapper: "liquidGlass-wrapper dropdown",
    content: "liquidGlass-content p-2 w-full",
    item: "w-full cursor-pointer hover:bg-sky-400/30 focus:bg-sky-400/30 text-slate-900 focus:text-slate-900",
    icon: "text-gray-600",
    hasGlassLayers: true
  },
  "retro": {
    wrapper: "bg-[#c0c0c0] border-2 border-l-white border-t-white border-r-black border-b-black shadow-md",
    content: "p-2 w-full",
    item: "w-full cursor-pointer hover:bg-[#000080] hover:text-white text-black",
    icon: "text-black",
    hasGlassLayers: false
  },
  "windows-xp": {
    wrapper: "border border-[#1a3a8a] shadow-lg",
    content: "p-2 w-full text-white",
    item: "w-full cursor-pointer hover:bg-[#3168d5] text-white",
    icon: "text-white",
    hasGlassLayers: false,
    customBg: "linear-gradient(to bottom, #3168d5 0%, #2252b7 100%)"
  },
  "windows-7": {
    wrapper: "backdrop-blur-md border border-white/20 rounded-lg shadow-xl",
    content: "p-2 w-full text-white",
    item: "w-full cursor-pointer hover:bg-white/20 text-white/90 rounded",
    icon: "text-white/70",
    hasGlassLayers: false,
    customBg: "linear-gradient(to bottom, rgba(80,120,180,0.9) 0%, rgba(40,70,130,0.95) 100%)"
  },
  "pixel": {
    wrapper: "bg-[#0f380f] border-4 border-[#8bac0f]",
    content: "p-2 w-full font-pixel text-[#9bbc0f]",
    item: "w-full cursor-pointer hover:bg-[#306230] text-[#9bbc0f]",
    icon: "text-[#9bbc0f]",
    hasGlassLayers: false
  },
  "window": {
    wrapper: "bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg",
    content: "p-2 w-full",
    item: "w-full cursor-pointer hover:bg-white/10 text-white/90",
    icon: "text-white/70",
    hasGlassLayers: false
  }
};

function getStyleConfig(styleId: string) {
  return STYLE_CONFIGS[styleId as keyof typeof STYLE_CONFIGS] || STYLE_CONFIGS["liquid-glass"];
}

export function ModeToggle({ previewMode, embedded = false }: { previewMode?: "desktop" | "mobile"; embedded?: boolean }) {
  const { theme, setTheme } = useTheme();
  const menubarStyleId = useThemeStore((state) => (state as any).menubarStyleId);
  const [open, setOpen] = useState(false);
  const mqDesktop = useMediaQuery("(min-width: 768px)");
  const isDesktop = previewMode ? previewMode === "desktop" : mqDesktop;

  const shouldShowDrawer = (previewMode === "mobile" && embedded) || (!previewMode && !isDesktop);
  const styleConfig = getStyleConfig(menubarStyleId || "liquid-glass") as typeof STYLE_CONFIGS["liquid-glass"] & { customBg?: string };

  const ModeContent = (
    <div
      className={styleConfig.wrapper}
      style={styleConfig.customBg ? { background: styleConfig.customBg } : undefined}
    >
      {styleConfig.hasGlassLayers && (
        <>
          <div className="liquidGlass-effect"></div>
          <div className="liquidGlass-tint"></div>
          <div className="liquidGlass-shine"></div>
        </>
      )}
      <div className={styleConfig.content}>
        <div
          onClick={() => setTheme("light")}
          className={`${styleConfig.item} flex items-center p-2 rounded-sm`}
        >
          <Sun className={`h-[1.2rem] w-[1.2rem] mr-2 ${styleConfig.icon}`} /> Light
        </div>
        <div
          onClick={() => setTheme("dark")}
          className={`${styleConfig.item} flex items-center p-2 rounded-sm`}
        >
          <Moon className={`h-[1.2rem] w-[1.2rem] mr-2 ${styleConfig.icon}`} /> Dark
        </div>
        <div
          onClick={() => setTheme("system")}
          className={`${styleConfig.item} flex items-center p-2 rounded-sm`}
        >
          <Monitor className={`h-[1.2rem] w-[1.2rem] mr-2 ${styleConfig.icon}`} /> System
        </div>
      </div>
    </div>
  );

  const TriggerButton = (
    <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors">
      <Sun
        className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 data-[theme=system]:rotate-90 data-[theme=system]:scale-0"
        data-theme={theme}
      />
      <Moon
        className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 data-[theme=system]:rotate-90 data-[theme=system]:scale-0 data-[theme=system]:hidden"
        data-theme={theme}
      />
      <Monitor
        className="absolute h-5 w-5 rotate-90 scale-0 transition-all data-[theme=system]:rotate-0 data-[theme=system]:scale-100"
        data-theme={theme}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );

  if (shouldShowDrawer) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="bg-transparent border-none shadow-none">
          <div className="mx-auto w-full max-w-sm p-4">
            {ModeContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 p-0 bg-transparent border-none shadow-none z-50"
      >
        {ModeContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
