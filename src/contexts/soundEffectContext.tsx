'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { getSoundEffects, updateSoundEffects, getSoundPresets } from '@/lib/services/soundEffectService'
import { useAppSound } from './sound-context'

interface SoundEffectContextType {
    soundEffects: {
        presetId: string
    }
    presets: any[]
    currentPreset: string
    isLoading: boolean
    error: Error | null
    fetchSoundEffects: (portfolioId: number) => Promise<void>
    updateSoundEffects: (portfolioId: number, presetId: string) => Promise<void>
    setPreset: (portfolioId: number, presetId: string) => void
}

const SoundEffectContext = createContext<SoundEffectContextType | undefined>(undefined)

export function SoundEffectProvider({ children }: { children: React.ReactNode }) {
    const { setPreset: setSoundPreset } = useAppSound()
    const [soundEffects, setSoundEffects] = useState({
        presetId: 'arcade'
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const presets = getSoundPresets()

    const fetchSoundEffects = useCallback(async (portfolioId: number) => {
        try {
            setIsLoading(true)
            setError(null)
            const data = await getSoundEffects(portfolioId)
            if (data) {
                setSoundEffects({
                    presetId: data.presetId || 'arcade'
                })
            }
        } catch (error) {
            console.error('Failed to fetch sound effects:', error)
            setError(error as Error)
            toast.error('Failed to fetch sound effects')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateSoundEffectsContext = useCallback(async (portfolioId: number, presetId: string) => {
        try {
            setIsLoading(true)
            setError(null)

            // Update local state immediately for better UX
            setSoundEffects({ presetId })

            // Update sound context
            setSoundPreset(presetId)

            // Update via API
            await updateSoundEffects(portfolioId, presetId)
            toast.success('Sound effects updated successfully!')
        } catch (error) {
            console.error('Failed to update sound effects:', error)
            setError(error as Error)
            toast.error('Failed to update sound effects')
            // Revert local state if API call fails
            fetchSoundEffects(portfolioId)
        } finally {
            setIsLoading(false)
        }
    }, [fetchSoundEffects, setSoundPreset])

    const setPreset = useCallback((portfolioId: number, presetId: string) => {
        updateSoundEffectsContext(portfolioId, presetId)
    }, [updateSoundEffectsContext])


    return (
        <SoundEffectContext.Provider
            value={{
                soundEffects,
                presets,
                currentPreset: soundEffects.presetId,
                isLoading,
                error,
                fetchSoundEffects,
                updateSoundEffects: updateSoundEffectsContext,
                setPreset
            }}
        >
            {children}
        </SoundEffectContext.Provider>
    )
}

export function useSoundEffects() {
    const context = useContext(SoundEffectContext)
    if (context === undefined) {
        throw new Error('useSoundEffects must be used within a SoundEffectProvider')
    }
    return context
}