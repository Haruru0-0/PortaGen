import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useAppSound } from '../../contexts/sound-context'
import { useMediaQuery } from '@/hooks/use-media-query'
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

function SoundContent() {
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
    <div className="liquidGlass-wrapper dropdown">
      <div className="liquidGlass-effect"></div>
      <div className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine"></div>
      <div className="liquidGlass-content p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Gamepad2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-900">8-Bit Sound Effects</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-900">Retro Audio</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSound}
              className="h-8 text-slate-900 border-white/20 bg-sky-500/20 hover:bg-sky-500/30 hover:text-slate-900"
            >
              {isSoundEnabled ? 'On' : 'Off'}
            </Button>
          </div>

          {isSoundEnabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-900">Volume</span>
                  <span className="text-xs text-slate-700">
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
                className="w-full text-xs text-slate-900 border-white/20 bg-sky-500/20 hover:bg-sky-500/30 hover:text-slate-900"
              >
                🎮 Test Retro Sounds
              </Button>
            </>
          )}

          <div className="text-xs text-slate-700">
            Classic 8-bit arcade sounds with square waves and chiptune effects
          </div>
        </div>
      </div>
    </div>
  )
}

export function SoundSettings({ previewMode, embedded = false }: { previewMode?: "desktop" | "mobile"; embedded?: boolean }) {
  const { isSoundEnabled } = useAppSound()
  const [open, setOpen] = useState(false)
  const mqDesktop = useMediaQuery("(min-width: 768px)")
  const isDesktop = previewMode ? previewMode === "desktop" : mqDesktop

  // Show drawer if previewMode is mobile AND embedded, otherwise use normal desktop/mobile logic
  const shouldShowDrawer = (previewMode === "mobile" && embedded) || (!previewMode && !isDesktop)

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
            <SoundContent />
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
        <SoundContent />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}