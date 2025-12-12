import { SOUND_PRESETS } from '@/lib/constants/sound-presets'

export interface SoundEffectData {
    presetId: string
}

export async function getSoundEffects(portfolioId: number): Promise<SoundEffectData | undefined> {
    try {
        const response = await fetch(`/api/sound-effects/get?portfolioId=${portfolioId}`)
        if (!response.ok) return undefined
        return await response.json()
    } catch (error) {
        console.error('getSoundEffects error:', error)
        return undefined
    }
}

export async function updateSoundEffects(portfolioId: number, presetId: string) {
    const res = await fetch('/api/sound-effects/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId, presetId }),
    })
    if (!res.ok) throw new Error('Failed to update sound effects')
    return res.json()
}

export function getSoundPresets() {
    return SOUND_PRESETS
}

export function getSoundPreset(presetId: string) {
    return SOUND_PRESETS.find(preset => preset.id === presetId)
}