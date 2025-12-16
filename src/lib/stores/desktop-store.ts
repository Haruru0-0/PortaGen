import { create } from 'zustand'

export interface DesktopState {
    wallpaper: string
    wallpaperFileId: string | null
    desktopGif: string
    desktopGifFileId: string | null
    mobileWidget1: string
    mobileWidget2: string
    musicPlayerIcon: string
    spotifyPlaylistUrl: string
    pendingWallpaperFile: File | null
    pendingGifFile: File | null
    pendingWidget1File: File | null
    pendingWidget2File: File | null
}

interface DesktopStore extends DesktopState {
    setWallpaper: (wallpaper: string) => void
    setWallpaperFileId: (fileId: string | null) => void
    setDesktopGif: (gif: string) => void
    setDesktopGifFileId: (fileId: string | null) => void
    setMobileWidget1: (widget: string) => void
    setMobileWidget2: (widget: string) => void
    setMusicPlayerIcon: (icon: string) => void
    setSpotifyPlaylistUrl: (url: string) => void
    setPendingWallpaperFile: (file: File | null) => void
    setPendingGifFile: (file: File | null) => void
    setPendingWidget1File: (file: File | null) => void
    setPendingWidget2File: (file: File | null) => void

    // Reset/Init
    setDesktopState: (state: Partial<DesktopState>) => void
}

export const useDesktopStore = create<DesktopStore>((set) => ({
    wallpaper: '',
    wallpaperFileId: null,
    desktopGif: '',
    desktopGifFileId: null,
    mobileWidget1: '',
    mobileWidget2: '',
    musicPlayerIcon: '',
    spotifyPlaylistUrl: '',
    pendingWallpaperFile: null,
    pendingGifFile: null,
    pendingWidget1File: null,
    pendingWidget2File: null,

    setWallpaper: (wallpaper) => set({ wallpaper }),
    setWallpaperFileId: (wallpaperFileId) => set({ wallpaperFileId }),
    setDesktopGif: (desktopGif) => set({ desktopGif }),
    setDesktopGifFileId: (desktopGifFileId) => set({ desktopGifFileId }),
    setMobileWidget1: (mobileWidget1) => set({ mobileWidget1 }),
    setMobileWidget2: (mobileWidget2) => set({ mobileWidget2 }),
    setMusicPlayerIcon: (musicPlayerIcon) => set({ musicPlayerIcon }),
    setSpotifyPlaylistUrl: (spotifyPlaylistUrl) => set({ spotifyPlaylistUrl }),
    setPendingWallpaperFile: (pendingWallpaperFile) => set({ pendingWallpaperFile }),
    setPendingGifFile: (pendingGifFile) => set({ pendingGifFile }),
    setPendingWidget1File: (pendingWidget1File) => set({ pendingWidget1File }),
    setPendingWidget2File: (pendingWidget2File) => set({ pendingWidget2File }),

    setDesktopState: (state) => set((prev) => ({ ...prev, ...state }))
}))
