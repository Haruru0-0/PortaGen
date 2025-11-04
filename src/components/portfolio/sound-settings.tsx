import { useState, useRef } from 'react'
import { Volume2, VolumeX, Gamepad2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useAppSound } from './sound-context'

export function SoundSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    isSoundEnabled, 
    setSoundEnabled, 
    volume, 
    setVolume,
    playClickSound,
    playPowerUpSound,
    playMenuSound
  } = useAppSound()
  
  const panelRef = useRef<HTMLDivElement>(null)

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

  const handleTogglePanel = () => {
    setIsOpen(!isOpen)
    playMenuSound()
  }

  useGSAP(() => {
    if (!panelRef.current) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isOpen) {
      if (prefersReducedMotion) {
        gsap.fromTo(panelRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.2 }
        );
      } else {
        gsap.fromTo(panelRef.current, 
          { opacity: 0, scale: 0.95, y: -10 }, 
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.2, 
            ease: "back.out(1.7)" 
          }
        );
      }
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleTogglePanel}
        className="relative flex items-center p-1 rounded-md cursor-pointer hover:text-black hover:bg-white/10 hover:dark:bg-gray-900/60 hover:dark:text-white"
      >
        {isSoundEnabled ? (
          <Volume2 className="h-[1rem] w-[1rem]" />
        ) : (
          <VolumeX className="h-[1rem] w-[1rem]" />
        )}
        <span className="sr-only">Retro sound settings</span>
      </Button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute top-full right-0 mt-2 w-72 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-800/50 rounded-xl shadow-lg z-50"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">8-Bit Sound Effects</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Retro Audio</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleSound}
                className="h-8"
              >
                {isSoundEnabled ? 'On' : 'Off'}
              </Button>
            </div>
            
            {isSoundEnabled && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volume</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[volume]}
                    max={1}
                    min={0}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestSounds}
                  className="w-full text-xs"
                >
                  🎮 Test Retro Sounds
                </Button>
              </>
            )}
            
            <div className="text-xs text-muted-foreground">
              Classic 8-bit arcade sounds with square waves and chiptune effects
            </div>
          </div>
        </div>
      )}
    </div>
  )
}