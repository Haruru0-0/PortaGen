import { create } from 'zustand'

export interface DesktopState {
    wallpaper: string
    wallpaperUrl?: string // Saved URL from DB or Input
    wallpaperFileId: string | null
    desktopGif: string
    desktopGifUrl?: string
    desktopGifFileId: string | null
    mobileWidget1: string
    widget1Url?: string
    mobileWidget2: string
    widget2Url?: string
    musicPlayerIcon: string
    spotifyPlaylistUrl: string
    menubarIcon: string
    menubarIconUrl?: string
    menubarIconFileId: string | null
    menubarText: string
    pendingWallpaperFile: File | null
    pendingGifFile: File | null
    pendingWidget1File: File | null
    pendingWidget2File: File | null
    pendingMenubarIconFile: File | null
}

interface DesktopStore extends DesktopState {
    setWallpaper: (wallpaper: string) => void
    setWallpaperUrl: (url: string) => void
    setWallpaperFileId: (fileId: string | null) => void
    setDesktopGif: (gif: string) => void
    setDesktopGifUrl: (url: string) => void
    setDesktopGifFileId: (fileId: string | null) => void
    setMobileWidget1: (widget: string) => void
    setWidget1Url: (url: string) => void
    setMobileWidget2: (widget: string) => void
    setWidget2Url: (url: string) => void
    setMusicPlayerIcon: (icon: string) => void
    setSpotifyPlaylistUrl: (url: string) => void
    setMenubarIcon: (icon: string) => void
    setMenubarIconUrl: (url: string) => void
    setMenubarIconFileId: (fileId: string | null) => void
    setMenubarText: (text: string) => void
    setPendingWallpaperFile: (file: File | null) => void
    setPendingGifFile: (file: File | null) => void
    setPendingWidget1File: (file: File | null) => void
    setPendingWidget2File: (file: File | null) => void
    setPendingMenubarIconFile: (file: File | null) => void

    // Reset/Init
    setDesktopState: (state: Partial<DesktopState>) => void
}

export const useDesktopStore = create<DesktopStore>((set) => ({
    wallpaper: '',
    wallpaperUrl: '',
    wallpaperFileId: null,
    desktopGif: '',
    desktopGifUrl: '',
    desktopGifFileId: null,
    mobileWidget1: '',
    widget1Url: '',
    mobileWidget2: '',
    widget2Url: '',
    musicPlayerIcon: '',
    spotifyPlaylistUrl: '',
    menubarIcon: '',
    menubarIconUrl: '',
    menubarIconFileId: null,
    menubarText: '',
    pendingWallpaperFile: null,
    pendingGifFile: null,
    pendingWidget1File: null,
    pendingWidget2File: null,
    pendingMenubarIconFile: null,

    setWallpaper: (wallpaper) => set({ wallpaper }),
    setWallpaperUrl: (wallpaperUrl) => set({ wallpaperUrl }),
    setWallpaperFileId: (wallpaperFileId) => set({ wallpaperFileId }),
    setDesktopGif: (desktopGif) => set({ desktopGif }),
    setDesktopGifUrl: (desktopGifUrl) => set({ desktopGifUrl }),
    setDesktopGifFileId: (desktopGifFileId) => set({ desktopGifFileId }),
    setMobileWidget1: (mobileWidget1) => set({ mobileWidget1 }),
    setWidget1Url: (widget1Url) => set({ widget1Url }),
    setMobileWidget2: (mobileWidget2) => set({ mobileWidget2 }),
    setWidget2Url: (widget2Url) => set({ widget2Url }),
    setMusicPlayerIcon: (musicPlayerIcon) => set({ musicPlayerIcon }),
    setSpotifyPlaylistUrl: (spotifyPlaylistUrl) => set({ spotifyPlaylistUrl }),
    setMenubarIcon: (menubarIcon) => set({ menubarIcon }),
    setMenubarIconUrl: (menubarIconUrl) => set({ menubarIconUrl }),
    setMenubarIconFileId: (menubarIconFileId) => set({ menubarIconFileId }),
    setMenubarText: (menubarText) => set({ menubarText }),
    setPendingWallpaperFile: (pendingWallpaperFile) => set({ pendingWallpaperFile }),
    setPendingGifFile: (pendingGifFile) => set({ pendingGifFile }),
    setPendingWidget1File: (pendingWidget1File) => set({ pendingWidget1File }),
    setPendingWidget2File: (pendingWidget2File) => set({ pendingWidget2File }),
    setPendingMenubarIconFile: (pendingMenubarIconFile) => set({ pendingMenubarIconFile }),

    setDesktopState: (state) => set((prev) => ({ ...prev, ...state }))
}))
