import { useState } from 'react'
import { Volume2, VolumeX, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useAppSound } from '../../contexts/sound-context'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useThemeStore } from "@/lib/stores/theme-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import SliderIcon from "@/assets/SliderIcon.png";
import Image from "next/image"

// Style configurations for each menubar theme
const STYLE_CONFIGS = {
  "liquid-glass": {
    wrapper: "liquidGlass-wrapper dropdown",
    content: "liquidGlass-content p-4",
    text: "text-slate-900",
    subtext: "text-slate-700",
    button: "text-slate-900 border-white/20 bg-sky-500/20 hover:bg-sky-500/30 hover:text-slate-900",
    icon: "text-blue-600",
    hasGlassLayers: true
  },
  "retro": {
    wrapper: "bg-[#c0c0c0] border-2 border-l-white border-t-white border-r-black border-b-black shadow-md",
    content: "p-4",
    text: "text-black",
    subtext: "text-gray-700",
    button: "text-black border-2 border-l-white border-t-white border-r-black border-b-black bg-[#c0c0c0] hover:bg-[#d0d0d0]",
    icon: "text-black",
    hasGlassLayers: false
  },
  "windows-xp": {
    wrapper: "border border-[#1a3a8a] shadow-lg bg-gradient-to-b from-[#3168d5] to-[#2252b7]",
    content: "p-4",
    text: "text-white",
    subtext: "text-white/70",
    button: "text-white border-white/30 bg-[#3d86e5] hover:bg-[#4a90e8]",
    icon: "text-white",
    hasGlassLayers: false
  },
  "windows-7": {
    wrapper: "backdrop-blur-md border border-white/20 rounded-lg shadow-xl bg-gradient-to-b from-[rgba(80,120,180,0.9)] to-[rgba(40,70,130,0.95)]",
    content: "p-4",
    text: "text-white/90",
    subtext: "text-white/60",
    button: "text-white/90 border-white/20 bg-white/10 hover:bg-white/20",
    icon: "text-white/70",
    hasGlassLayers: false
  },
  "pixel": {
    wrapper: "bg-[#0f380f] border-4 border-[#8bac0f]",
    content: "p-4 font-pixel",
    text: "text-[#9bbc0f]",
    subtext: "text-[#8bac0f]",
    button: "text-[#9bbc0f] border-2 border-[#8bac0f] bg-[#306230] hover:bg-[#0f380f]",
    icon: "text-[#9bbc0f]",
    hasGlassLayers: false
  },
  "window": {
    wrapper: "bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg",
    content: "p-4",
    text: "text-white/90",
    subtext: "text-white/60",
    button: "text-white/90 border-white/20 bg-white/10 hover:bg-white/20",
    icon: "text-white/70",
    hasGlassLayers: false
  }
};

function getStyleConfig(styleId: string) {
  return STYLE_CONFIGS[styleId as keyof typeof STYLE_CONFIGS] || STYLE_CONFIGS["liquid-glass"];
}

function SoundContent({ styleConfig, customBg }: { styleConfig: typeof STYLE_CONFIGS["liquid-glass"]; customBg?: string }) {
  const {
    isSoundEnabled,
    setSoundEnabled,
    volume,
    setVolume,
    playClickSound,
    playPowerUpSound,
    playMenuSound
  } = useAppSound()

  const handleToggleSound = () => {
    setSoundEnabled(!isSoundEnabled)
    if (!isSoundEnabled) {
      setTimeout(() => playPowerUpSound(), 100)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    playClickSound()
  }

  const handleTestSounds = () => {
    playMenuSound()
    setTimeout(() => playClickSound(), 200)
    setTimeout(() => playPowerUpSound(), 400)
  }

  return (
    <div
      className={styleConfig.wrapper}
      style={customBg ? { background: customBg } : undefined}
    >
      {styleConfig.hasGlassLayers && (
        <>
          <div className="liquidGlass-effect"></div>
          <div className="liquidGlass-tint"></div>
          <div className="liquidGlass-shine"></div>
        </>
      )}
      <div className={styleConfig.content}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Gamepad2 className={`h-4 w-4 ${styleConfig.icon}`} />
            <span className={`text-sm font-medium ${styleConfig.text}`}>8-Bit Sound Effects</span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm ${styleConfig.text}`}>Retro Audio</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSound}
              className={`h-8 ${styleConfig.button}`}
            >
              {isSoundEnabled ? 'On' : 'Off'}
            </Button>
          </div>

          {isSoundEnabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${styleConfig.text}`}>Volume</span>
                  <span className={`text-xs ${styleConfig.subtext}`}>
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[volume]}
                  max={1}
                  min={0}
                  step={0.1}
                  className="cursor-pointer w-full"
                  onValueChange={handleVolumeChange}
                  trackClassName="bg-[#ccf2fc]"
                  rangeClassName="bg-[#74defc]"
                  thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                  thumb={
                    <Image
                      src={SliderIcon}
                      className="w-full h-full object-cover rounded-full"
                      alt={"sliderIcon"}
                    />
                  }
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestSounds}
                className={`w-full text-xs ${styleConfig.button}`}
              >
                🎮 Test Retro Sounds
              </Button>
            </>
          )}

          <div className={`text-xs ${styleConfig.subtext}`}>
            Classic 8-bit arcade sounds with square waves and chiptune effects
          </div>
        </div>
      </div>
    </div>
  )
}

export function SoundSettings({ previewMode, embedded = false }: { previewMode?: "desktop" | "mobile"; embedded?: boolean }) {
  const { isSoundEnabled } = useAppSound()
  const menubarStyleId = useThemeStore((state) => (state as any).menubarStyleId)
  const [open, setOpen] = useState(false)
  const mqDesktop = useMediaQuery("(min-width: 768px)")
  const isDesktop = previewMode ? previewMode === "desktop" : mqDesktop

  const shouldShowDrawer = (previewMode === "mobile" && embedded) || (!previewMode && !isDesktop)
  const styleConfig = getStyleConfig(menubarStyleId || "liquid-glass") as typeof STYLE_CONFIGS["liquid-glass"] & { customBg?: string }

  const TriggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-colors"
    >
      {isSoundEnabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
      <span className="sr-only">Retro sound settings</span>
    </Button>
  )

  if (shouldShowDrawer) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="bg-transparent border-none shadow-none">
          <div className="mx-auto w-full max-w-sm p-4">
            <SoundContent styleConfig={styleConfig} customBg={styleConfig.customBg} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 p-0 bg-transparent border-none shadow-none z-50"
      >
        <SoundContent styleConfig={styleConfig} customBg={styleConfig.customBg} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}