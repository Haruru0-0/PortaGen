import { Monitor, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center p-1 rounded-md cursor-pointer hover:text-black hover:bg-white/10 hover:dark:bg-gray-900/60 hover:dark:text-white">
          <Sun
            className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 data-[theme=system]:rotate-90 data-[theme=system]:scale-0"
            data-theme={theme}
          />
          <Moon
            className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 data-[theme=system]:rotate-90 data-[theme=system]:scale-0 data-[theme=system]:hidden"
            data-theme={theme}
          />
          <Monitor
            className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all data-[theme=system]:rotate-0 data-[theme=system]:scale-100"
            data-theme={theme}
          />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-none dark:border-gray-800"
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="h-[1rem] w-[1rem] mr-2" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="h-[1rem] w-[1rem] mr-2" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="h-[1rem] w-[1rem] mr-2" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
