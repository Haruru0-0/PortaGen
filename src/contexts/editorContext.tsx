/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { createContext, ReactNode, useContext, useState } from "react"
import {
  fetchPortfolioData,
  saveData,
  uploadFile,
} from "@/lib/services/portfolioService"
import {
  deleteIcon as deleteIconAPI,
  addIcon as addIconAPI,
  updateIcon as updateIconAPI,
} from "@/lib/services/iconService"

export interface EditorContextType {
  // Core state previously from useEditorState
  portfolios: any[]
  setPortfolios: (v: any[]) => void
  currentPortfolioId: number | null
  setCurrentPortfolioId: (v: number | null) => void

  activeCategory: 'lockScreen' | 'homeScreen'
  setActiveCategory: (v: 'lockScreen' | 'homeScreen') => void
  activeLockScreenTab: 'settings' | 'wallpaper'
  setActiveLockScreenTab: (v: 'settings' | 'wallpaper') => void
  activeHomeScreenTab: 'wallpaper' | 'icons' | 'music' | 'windows' | 'theme' | 'sounds' | "mobile widgets" | "desktop widget"
  setActiveHomeScreenTab: (v: 'wallpaper' | 'icons' | 'music' | 'windows' | 'theme' | 'sounds' | "mobile widgets" | "desktop widget") => void
  portfolioName: string
  setPortfolioName: (v: string) => void

  lockScreenPassword: string
  setLockScreenPassword: (v: string) => void
  lockScreenHint: string
  setLockScreenHint: (v: string) => void
  lockScreenImage: string
  setLockScreenImage: (v: string) => void
  lockScreenImageFileId: string
  setLockScreenImageFileId: (v: string) => void
  lockScreenEnabled: boolean
  setLockScreenEnabled: (v: boolean) => void
  isLocked: boolean
  setIsLocked: (v: boolean) => void

  desktopGif: string
  setDesktopGif: (v: string) => void
  desktopGifFileId: string
  setDesktopGifFileId: (v: string) => void
  mobileWidget1: string
  setMobileWidget1: (v: string) => void
  mobileWidget2: string
  setMobileWidget2: (v: string) => void
  musicPlayerIcon: string
  setMusicPlayerIcon: (v: string) => void
  spotifyPlaylistUrl: string
  setSpotifyPlaylistUrl: (v: string) => void

  isIconModalOpen: boolean
  setIsIconModalOpen: (v: boolean) => void
  editingIcon: any | null
  setEditingIcon: (v: any | null) => void
  editingWindow: any | null
  setEditingWindow: (v: any | null) => void

  icons: any[]
  setIcons: (v: any[]) => void
  wallpapers: any[]
  setWallpapers: (v: any[]) => void
  windowContents: any[]
  setWindowContents: (v: any[]) => void
  selectedWallpaper: any | null
  setSelectedWallpaper: (v: any | null) => void
  uploadedWallpaper: string
  setUploadedWallpaper: (v: string) => void
  uploadedWallpaperFileId: string
  setUploadedWallpaperFileId: (v: string) => void
  iconFormData: { name: string; icon: string; url: string; fileId: string | number }
  setIconFormData: (v: { name: string; icon: string; url: string; fileId: string | number }) => void
  iconImagePreview: string | any
  setIconImagePreview: (v: string | any) => void
  deleteTarget: { type: 'icon' | 'music'; id: number } | null
  setDeleteTarget: (v: { type: 'icon' | 'music'; id: number } | null) => void
  previewMode: 'desktop' | 'mobile'
  setPreviewMode: (v: 'desktop' | 'mobile') => void
  currentTheme: any
  setCurrentTheme: (v: any) => void
  soundEffects: any[]
  setSoundEffects: (v: any[]) => void

  assetLibraryOpen: boolean
  setAssetLibraryOpen: (v: boolean) => void
  assetLibraryType: 'sound' | 'wallpaper' | 'icon' | 'music'
  setAssetLibraryType: (v: 'sound' | 'wallpaper' | 'icon' | 'music') => void


  // Load & Persist
  loadPortfolio: (portfolioId: number) => Promise<void>
  updatePortfolioName: () => Promise<void>
  updateLockscreenSettings: () => Promise<void>
  updateDesktopSettings: () => Promise<void>
  updateWindows: () => Promise<void>
  updateSounds: () => Promise<void>
  updateTheme: () => Promise<void>

  // Assets & CRUD helpers
  uploadAsset: (file: File, type: string, portfolioId: number) => Promise<any>
  deleteIconById: (id: number) => Promise<boolean>

  // Icons
  addIcon: (payload: { name: string; url?: string; fileId?: number | string; position?: number; windowId?: string; isVisible?: boolean }) => Promise<any>
  updateIcon: (payload: { id: number; name?: string; url?: string; fileId?: number | string; position?: number; windowId?: string; isVisible?: boolean }) => Promise<any>

  // Music
  addMusic: () => Promise<any>
  updateMusic: () => Promise<any>

  // Wallpaper / desktop media helpers
  setDesktopWallpaperByAsset: (asset: { id: number; url: string }) => Promise<void>
  setLockscreenWallpaperByAsset: (asset: { id: number; url: string }) => Promise<void>
  setDesktopGifByAsset: (asset: { id: number; url: string }) => Promise<void>

  // Asset library helpers
  openAssetLibrary: (type: 'sound' | 'wallpaper' | 'icon' | 'music') => void
  closeAssetLibrary: () => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  // Core state
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [currentPortfolioId, setCurrentPortfolioId] = useState<number | null>(null)

  const [activeCategory, setActiveCategory] = useState<'lockScreen' | 'homeScreen'>('homeScreen')
  const [activeLockScreenTab, setActiveLockScreenTab] = useState<'settings' | 'wallpaper'>('settings')
  const [activeHomeScreenTab, setActiveHomeScreenTab] = useState<'wallpaper' | 'icons' | 'music' | 'windows' | 'theme' | 'sounds' | "mobile widgets" | "desktop widget">('wallpaper')
  const [portfolioName, setPortfolioName] = useState('MY PORTFOLIO')

  const [lockScreenPassword, setLockScreenPassword] = useState('1234')
  const [lockScreenHint, setLockScreenHint] = useState("It's 1234")
  const [lockScreenImage, setLockScreenImage] = useState('')
  const [lockScreenImageFileId, setLockScreenImageFileId] = useState('')
  const [lockScreenEnabled, setLockScreenEnabled] = useState(true)
  const [isLocked, setIsLocked] = useState(false)

  const [desktopGif, setDesktopGif] = useState('')
  const [desktopGifFileId, setDesktopGifFileId] = useState('')
  const [mobileWidget1, setMobileWidget1] = useState('')
  const [mobileWidget2, setMobileWidget2] = useState('')
  const [musicPlayerIcon, setMusicPlayerIcon] = useState('')
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState('')

  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [editingIcon, setEditingIcon] = useState<any | null>(null)
  const [editingWindow, setEditingWindow] = useState<any | null>(null)

  const [icons, setIcons] = useState<any[]>([])
  const [wallpapers, setWallpapers] = useState<any[]>([
    { id: 1, name: 'SUNSET', color: 'from-orange-400 to-pink-500' },
    { id: 2, name: 'OCEAN', color: 'from-blue-400 to-cyan-300' },
    { id: 3, name: 'FOREST', color: 'from-green-500 to-emerald-400' },
    { id: 4, name: 'GALAXY', color: 'from-purple-600 to-indigo-500' },
  ])
  const [windowContents, setWindowContents] = useState<any[]>([])
  const [selectedWallpaper, setSelectedWallpaper] = useState<any | null>(null)
  const [uploadedWallpaper, setUploadedWallpaper] = useState<string>('')
  const [uploadedWallpaperFileId, setUploadedWallpaperFileId] = useState<string>('')
  const [iconFormData, setIconFormData] = useState<{ name: string; icon: string; url: string; fileId: string | number }>({ name: '', icon: '', url: '', fileId: '' })
  const [iconImagePreview, setIconImagePreview] = useState<string | any>('')
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'icon' | 'music'; id: number } | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [currentTheme, setCurrentTheme] = useState<any>({})
  const [soundEffects, setSoundEffects] = useState<any[]>([])

  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false)
  const [assetLibraryType, setAssetLibraryType] = useState<'sound' | 'wallpaper' | 'icon' | 'music'>('wallpaper')


  const loadPortfolio = async (portfolioId: number) => {
    const data = await fetchPortfolioData(portfolioId)
    if (!data) return
    setPortfolioName(data.portfolioName)
    setLockScreenEnabled(data.lockScreenSettings.enabled)
    setLockScreenPassword(data.lockScreenSettings.password)
    setLockScreenHint(data.lockScreenSettings.hint)
    setLockScreenImage(data.lockScreenSettings.wallpaperAsset?.displayUrl || "")
    setDesktopGif(data.desktopSettings.desktopGifAsset?.displayUrl || "")
    setSpotifyPlaylistUrl(data.desktopSettings?.spotifyPlaylistUrl || "")
    setIcons((data.icons || []).map((i: any) => ({ ...i, icon: i.asset?.displayUrl || i.icon })))
    
    setWindowContents(data.windowContents || [])
    setCurrentTheme(data.themeSettings.theme)
  }

  const updatePortfolioName = async () => {
    await saveData("portfolio/settings", {
      portfolioId: currentPortfolioId,
      portfolioName: portfolioName,
    })
  }

  const updateLockscreenSettings = async () => {
    await saveData("portfolio/lock-screen", {
      portfolioId: currentPortfolioId,
      enabled: lockScreenEnabled,
      password: lockScreenPassword,
      hint: lockScreenHint,
      wallpaperAssetId: lockScreenImageFileId,
    })
  }

  const updateDesktopSettings = async () => {
    await saveData("portfolio/desktop", {
      portfolioId: currentPortfolioId,
      desktopGifAssetId: desktopGifFileId,
      mobileWidget1: mobileWidget1,
      mobileWidget2: mobileWidget2,
      musicPlayerIcon: musicPlayerIcon,
      spotifyPlaylistUrl: spotifyPlaylistUrl,
    })
  }

  const updateWindows = async () => {
    await saveData("windows", {
      portfolioId: currentPortfolioId,
      windows: windowContents,
    })
  }

  const updateSounds = async () => {
    await saveData("sounds", {
      portfolioId: currentPortfolioId,
      sounds: soundEffects,
    })
  }

  const updateTheme = async () => {
    await saveData("theme", {
      portfolioId: currentPortfolioId,
      theme: currentTheme,
    })
  }

  const uploadAsset = async (file: File, type: string, portfolioId: number) => {
    return uploadFile(file, type, portfolioId)
  }

  const deleteIconById = async (id: number) => deleteIconAPI(id)
  
  // Icons CRUD
  const addIcon = async (payload: { name: string; url?: string; fileId?: number | string; position?: number; windowId?: string; isVisible?: boolean }) => {
    const created = await addIconAPI({ portfolioId: currentPortfolioId, ...payload })
    if (created) setIcons([...(icons as any[]), created])
    return created
  }
  const updateIcon = async (payload: { id: number; name?: string; url?: string; fileId?: number | string; position?: number; windowId?: string; isVisible?: boolean }) => {
    const updated = await updateIconAPI({ portfolioId: currentPortfolioId, ...payload })
    if (updated) setIcons((icons as any[]).map((i: any) => (i.id === updated.id ? updated : i)))
    return updated
  }

  // Music CRUD (kept for backward compat; can be removed later)
  const addMusic = async () => undefined as any
  const updateMusic = async () => undefined as any

  // Wallpaper / desktop media helpers
  const setDesktopWallpaperByAsset = async (asset: { id: number; url: string }) => {
    setUploadedWallpaper(asset.url)
    setUploadedWallpaperFileId(String(asset.id))
    await updateDesktopSettings()
  }
  const setLockscreenWallpaperByAsset = async (asset: { id: number; url: string }) => {
    setLockScreenImage(asset.url)
    setLockScreenImageFileId(String(asset.id))
    await updateLockscreenSettings()
  }
  const setDesktopGifByAsset = async (asset: { id: number; url: string }) => {
    setDesktopGif(asset.url)
    setDesktopGifFileId(String(asset.id))
    await updateDesktopSettings()
  }

  // Asset library helpers
  const openAssetLibrary = (type: 'sound' | 'wallpaper' | 'icon' | 'music') => {
    setAssetLibraryType(type)
    setAssetLibraryOpen(true)
  }
  const closeAssetLibrary = () => setAssetLibraryOpen(false)

  return (
      <EditorContext.Provider
          value={{
            portfolios,
            setPortfolios,
            currentPortfolioId,
            setCurrentPortfolioId,
            activeCategory,
            setActiveCategory,
            activeLockScreenTab,
            setActiveLockScreenTab,
            activeHomeScreenTab,
            setActiveHomeScreenTab,
            portfolioName,
            setPortfolioName,
            lockScreenPassword,
            setLockScreenPassword,
            lockScreenHint,
            setLockScreenHint,
            lockScreenImage,
            setLockScreenImage,
            lockScreenImageFileId,
            setLockScreenImageFileId,
            lockScreenEnabled,
            setLockScreenEnabled,
            isLocked,
            setIsLocked,
            desktopGif,
            setDesktopGif,
            desktopGifFileId,
            setDesktopGifFileId,
            mobileWidget1,
            setMobileWidget1,
            mobileWidget2,
            setMobileWidget2,
            musicPlayerIcon,
            setMusicPlayerIcon,
            spotifyPlaylistUrl,
            setSpotifyPlaylistUrl,
            isIconModalOpen,
            setIsIconModalOpen,
            editingIcon,
            setEditingIcon,
            editingWindow,
            setEditingWindow,
            icons,
            setIcons,
            wallpapers,
            setWallpapers,
            windowContents,
            setWindowContents,
            selectedWallpaper,
            setSelectedWallpaper,
            uploadedWallpaper,
            setUploadedWallpaper,
            uploadedWallpaperFileId,
            setUploadedWallpaperFileId,
            iconFormData,
            setIconFormData,
            iconImagePreview,
            setIconImagePreview,
            deleteTarget,
            setDeleteTarget,
            previewMode,
            setPreviewMode,
            currentTheme,
            setCurrentTheme,
            soundEffects,
            setSoundEffects,
            assetLibraryOpen,
            setAssetLibraryOpen,
            assetLibraryType,
            setAssetLibraryType,
            loadPortfolio,
            updatePortfolioName,
            updateLockscreenSettings,
            updateDesktopSettings,
            updateWindows,
            updateSounds,
            updateTheme,
            uploadAsset,
            deleteIconById,
            addIcon,
            updateIcon,
            addMusic,
            updateMusic,
            setDesktopWallpaperByAsset,
            setLockscreenWallpaperByAsset,
            setDesktopGifByAsset,
            openAssetLibrary,
            closeAssetLibrary
          }}
      >
        {children}
      </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error("useEditorContext must be used within EditorProvider")
  }
  return context
}

