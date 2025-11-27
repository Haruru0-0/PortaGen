import { Monitor, Moon, Sun } from "lucide-react";
import { useState, useCallback } from "react";
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
import { useMediaQuery } from "@/hooks/use-media-query";

export function ModeToggle({ previewMode, embedded = false }: { previewMode?: "desktop" | "mobile"; embedded?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const mqDesktop = useMediaQuery("(min-width: 768px)");
  const isDesktop = previewMode ? previewMode === "desktop" : mqDesktop;

  // Show drawer if previewMode is mobile AND embedded, otherwise use normal desktop/mobile logic
  const shouldShowDrawer = (previewMode === "mobile" && embedded) || (!previewMode && !isDesktop);

  const ModeContent = (
    <div className="liquidGlass-wrapper dropdown">
      <div className="liquidGlass-effect"></div>
      <div className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine"></div>
      <div className="liquidGlass-content p-2 w-full">
        <div
          onClick={() => setTheme("light")}
          className="w-full cursor-pointer hover:bg-sky-400/30 dark:hover:bg-sky-400/30 text-slate-900 focus:text-slate-900 flex items-center p-2 rounded-sm"
        >
          <Sun className="h-[1rem] w-[1rem] mr-2" /> Light
        </div>
        <div
          onClick={() => setTheme("dark")}
          className="w-full cursor-pointer hover:bg-sky-400/30 dark:hover:bg-sky-400/30 text-slate-900 focus:text-slate-900 flex items-center p-2 rounded-sm"
        >
          <Moon className="h-[1rem] w-[1rem] mr-2" /> Dark
        </div>
        <div
          onClick={() => setTheme("system")}
          className="w-full cursor-pointer hover:bg-sky-400/30 dark:hover:bg-sky-400/30 text-slate-900 focus:text-slate-900 flex items-center p-2 rounded-sm"
        >
          <Monitor className="h-[1rem] w-[1rem] mr-2" /> System
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
        <div className="liquidGlass-wrapper dropdown">
          <div className="liquidGlass-effect"></div>
          <div className="liquidGlass-tint"></div>
          <div className="liquidGlass-shine"></div>
          <div className="liquidGlass-content p-2 w-full">
            <DropdownMenuItem onClick={() => setTheme("light")} className="w-full cursor-pointer hover:bg-sky-400/30 focus:bg-sky-400/30 text-slate-900 focus:text-slate-900">
              <Sun className="h-[1rem] w-[1rem] mr-2 text-gray-600" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="w-full cursor-pointer hover:bg-sky-400/30 focus:bg-sky-400/30 text-slate-900 focus:text-slate-900">
              <Moon className="h-[1rem] w-[1rem] mr-2 text-gray-600" /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="w-full cursor-pointer hover:bg-sky-400/30 focus:bg-sky-400/30 text-slate-900 focus:text-slate-900">
              <Monitor className="h-[1rem] w-[1rem] mr-2 text-gray-600" /> System
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
