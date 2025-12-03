import { createContext, useContext, useState, useEffect } from 'react'

interface SoundContextType {
  playClickSound: () => void
  playHoverSound: () => void
  playWindowOpenSound: () => void
  playWindowCloseSound: () => void
  playMinimizeSound: () => void
  playMaximizeSound: () => void
  playErrorSound: () => void
  playSuccessSound: () => void
  playPowerUpSound: () => void
  playMenuSound: () => void
  isSoundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  volume: number
  setVolume: (volume: number) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

// Audio context for generating sounds
let audioContext: AudioContext | null = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// 8-bit style sound generation with square waves and retro effects
const generate8BitTone = (
  frequency: number, 
  duration: number, 
  volume: number = 0.3, 
  type: OscillatorType = 'square',
  envelope?: { attack?: number; decay?: number; sustain?: number; release?: number }
) => {
  try {
    const ctx = getAudioContext()
    
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    oscillator.type = type
    
    // 8-bit style envelope
    const attack = envelope?.attack || 0.01
    const decay = envelope?.decay || 0.1
    const sustain = envelope?.sustain || 0.7
    const release = envelope?.release || 0.1
    
    const sustainLevel = volume * sustain
    const sustainTime = duration - attack - decay - release
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack)
    gainNode.gain.linearRampToValueAtTime(sustainLevel, ctx.currentTime + attack + decay)
    gainNode.gain.setValueAtTime(sustainLevel, ctx.currentTime + attack + decay + Math.max(0, sustainTime))
    gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

// Retro arcade-style click sound
const generateRetroClickSound = (volume: number) => {
  // Sharp 8-bit click with quick decay
  generate8BitTone(1200, 0.08, volume * 0.4, 'square', {
    attack: 0.005,
    decay: 0.02,
    sustain: 0.3,
    release: 0.055
  })
}

// Soft retro hover sound
const generateRetroHoverSound = (volume: number) => {
  // Gentle 8-bit blip
  generate8BitTone(800, 0.06, volume * 0.25, 'square', {
    attack: 0.01,
    decay: 0.02,
    sustain: 0.5,
    release: 0.03
  })
}

// Classic power-up style window open
const generateRetroWindowOpenSound = (volume: number) => {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    // Ascending arpeggio like classic game power-ups
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        generate8BitTone(freq, 0.12, volume * 0.35, 'square', {
          attack: 0.01,
          decay: 0.03,
          sustain: 0.6,
          release: 0.08
        })
      }, index * 80)
    })
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

// Classic game-over style window close
const generateRetroWindowCloseSound = (volume: number) => {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    // Descending chromatic like classic game over
    const notes = [1047, 932, 831, 740] // C6 down
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        generate8BitTone(freq, 0.15, volume * 0.4, 'square', {
          attack: 0.01,
          decay: 0.05,
          sustain: 0.4,
          release: 0.09
        })
      }, index * 100)
    })
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

// Retro minimize sound (like collecting a coin)
const generateRetroMinimizeSound = (volume: number) => {
  // Quick ascending blip
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(600, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
    oscillator.type = 'square'
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

// Retro maximize sound (like jumping)
const generateRetroMaximizeSound = (volume: number) => {
  // Classic jump sound
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(400, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05)
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15)
    oscillator.type = 'square'
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.45, ctx.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.15)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

// Classic arcade error sound
const generateRetroErrorSound = (volume: number) => {
  // Harsh buzzer sound like classic arcade games
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    // Low harsh buzz
    generate8BitTone(150, 0.4, volume * 0.5, 'sawtooth', {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.8,
      release: 0.29
    })
    
    // Add some noise-like modulation
    setTimeout(() => {
      generate8BitTone(180, 0.3, volume * 0.3, 'sawtooth', {
        attack: 0.01,
        decay: 0.05,
        sustain: 0.7,
        release: 0.24
      })
    }, 50)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

// Classic success fanfare
const generateRetroSuccessSound = (volume: number) => {
  // Victory fanfare like classic games
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    // Classic victory melody: C-E-G-C
    const melody = [
      { freq: 523, time: 0 },     // C5
      { freq: 659, time: 120 },   // E5
      { freq: 784, time: 240 },   // G5
      { freq: 1047, time: 360 },  // C6
    ]
    
    melody.forEach(({ freq, time }) => {
      setTimeout(() => {
        generate8BitTone(freq, 0.2, volume * 0.4, 'square', {
          attack: 0.01,
          decay: 0.04,
          sustain: 0.7,
          release: 0.15
        })
      }, time)
    })
    
    // Add harmony
    setTimeout(() => {
      generate8BitTone(1047 * 1.5, 0.3, volume * 0.25, 'square', {
        attack: 0.02,
        decay: 0.05,
        sustain: 0.6,
        release: 0.23
      })
    }, 480)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

// Power-up sound for special actions
const generateRetroPowerUpSound = (volume: number) => {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    
    // Classic power-up sweep
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.3)
    oscillator.type = 'square'
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.02)
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.15)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  } catch (error) {
    console.log('Audio generation failed:', error)
  }
}

// Menu navigation sound
const generateRetroMenuSound = (volume: number) => {
  // Quick menu blip
  generate8BitTone(1000, 0.05, volume * 0.3, 'square', {
    attack: 0.005,
    decay: 0.01,
    sustain: 0.4,
    release: 0.035
  })
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('portfolio-sound-enabled')
    return saved !== null ? JSON.parse(saved) : true
  })
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('portfolio-sound-volume')
    return saved !== null ? JSON.parse(saved) : 0.6
  })

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      getAudioContext()
      document.removeEventListener('click', initAudio)
      document.removeEventListener('keydown', initAudio)
    }
    
    document.addEventListener('click', initAudio)
    document.addEventListener('keydown', initAudio)
    
    return () => {
      document.removeEventListener('click', initAudio)
      document.removeEventListener('keydown', initAudio)
    }
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-sound-enabled', JSON.stringify(isSoundEnabled))
  }, [isSoundEnabled])

  useEffect(() => {
    localStorage.setItem('portfolio-sound-volume', JSON.stringify(volume))
  }, [volume])

  // Retro sound functions
  const playClickSound = () => isSoundEnabled && generateRetroClickSound(volume)
  const playHoverSound = () => isSoundEnabled && generateRetroHoverSound(volume)
  const playWindowOpenSound = () => isSoundEnabled && generateRetroWindowOpenSound(volume)
  const playWindowCloseSound = () => isSoundEnabled && generateRetroWindowCloseSound(volume)
  const playMinimizeSound = () => isSoundEnabled && generateRetroMinimizeSound(volume)
  const playMaximizeSound = () => isSoundEnabled && generateRetroMaximizeSound(volume)
  const playErrorSound = () => isSoundEnabled && generateRetroErrorSound(volume)
  const playSuccessSound = () => isSoundEnabled && generateRetroSuccessSound(volume)
  const playPowerUpSound = () => isSoundEnabled && generateRetroPowerUpSound(volume)
  const playMenuSound = () => isSoundEnabled && generateRetroMenuSound(volume)

  return (
    <SoundContext.Provider
      value={{
        playClickSound,
        playHoverSound,
        playWindowOpenSound,
        playWindowCloseSound,
        playMinimizeSound,
        playMaximizeSound,
        playErrorSound,
        playSuccessSound,
        playPowerUpSound,
        playMenuSound,
        isSoundEnabled,
        setSoundEnabled,
        volume,
        setVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useAppSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error('useAppSound must be used within a SoundProvider')
  }
  return context
}