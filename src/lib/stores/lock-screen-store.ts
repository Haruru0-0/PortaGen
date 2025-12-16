import { create } from 'zustand'

export interface LockScreenState {
    enabled: boolean
    password: string
    hint: string
    wallpaper: string
    wallpaperFileId: string | null
    isPreview: boolean
    isLocked: boolean
    showLogin: boolean
    inputPassword: string
    isWrongPassword: boolean
    pendingWallpaperFile: File | null
}

interface LockScreenStore extends LockScreenState {
    setEnabled: (enabled: boolean) => void
    setPassword: (password: string) => void
    setHint: (hint: string) => void
    setWallpaper: (wallpaper: string) => void
    setWallpaperFileId: (fileId: string | null) => void
    setIsPreview: (isPreview: boolean) => void
    setIsLocked: (isLocked: boolean) => void
    setShowLogin: (showLogin: boolean) => void
    setInputPassword: (inputPassword: string) => void
    setIsWrongPassword: (isWrongPassword: boolean) => void
    setPendingWallpaperFile: (file: File | null) => void

    // Reset/Init
    setLockScreenState: (state: Partial<LockScreenState>) => void
}

export const useLockScreenStore = create<LockScreenStore>((set) => ({
    enabled: true,
    password: '1234',
    hint: "It's 1234",
    wallpaper: '',
    wallpaperFileId: null,
    isPreview: false,
    isLocked: false,
    showLogin: false,
    inputPassword: '',
    isWrongPassword: false,
    pendingWallpaperFile: null,

    setEnabled: (enabled) => set({ enabled }),
    setPassword: (password) => set({ password }),
    setHint: (hint) => set({ hint }),
    setWallpaper: (wallpaper) => set({ wallpaper }),
    setWallpaperFileId: (wallpaperFileId) => set({ wallpaperFileId }),
    setIsPreview: (isPreview) => set({ isPreview }),
    setIsLocked: (isLocked) => set({ isLocked }),
    setShowLogin: (showLogin) => set({ showLogin }),
    setInputPassword: (inputPassword) => set({ inputPassword }),
    setIsWrongPassword: (isWrongPassword) => set({ isWrongPassword }),
    setPendingWallpaperFile: (pendingWallpaperFile) => set({ pendingWallpaperFile }),

    setLockScreenState: (state) => set((prev) => ({ ...prev, ...state }))
}))
