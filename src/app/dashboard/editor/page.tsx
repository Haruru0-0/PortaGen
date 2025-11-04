/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRef, useEffect } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { AssetLibraryModal } from "@/components/asset-library-modal"
import { PortfolioUrlShare } from "@/components/portfolio-url-share"
import { PreviewPanel } from "@/components/editor/preview-panel"
// (removed resizable preview integration to restore original layout)
import {
  DEFAULT_SOUNDS,
  DEFAULT_WALLPAPERS,
  DEFAULT_ICONS,
  DEFAULT_MUSIC,
} from "@/lib/default-assets"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Placeholder from "@/assets/Placeholder.png"
import { useEditorState } from "@/hooks/useEditorState"
import {
  saveData,
  fetchPortfolioData,
  fetchPortfolios as fetchPortfoliosAPI,
  deleteIcon as deleteIconAPI,
  deleteMusic as deleteMusicAPI,
  uploadFile,
} from "@/lib/services/portfolioService"
import { CategorySelection } from "@/components/editor/CategorySelection"
import { TabsNavigation } from "@/components/editor/TabsNavigation"
import { TabContent } from "@/components/editor/TabContent"
import { IconModal } from "@/components/editor/modals/IconModal"
import { MusicModal } from "@/components/editor/modals/MusicModal"
import { DeleteModal } from "@/components/editor/modals/DeleteModal"

type LockScreenTab = "settings" | "wallpaper"
type HomeScreenTab =
  | "wallpaper"
  | "icons"
  | "music"
  | "windows"
  | "theme"
  | "sounds"

interface Icon {
  id: number
  name: string
  icon: string
  url?: string
  iconFileId?: string
}

interface Portfolio {
  id: number
  name: string
  slug: string
  isPublished: boolean
}

export default function EditorPage() {
  const {
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
    isIconModalOpen,
    setIsIconModalOpen,
    isMusicModalOpen,
    setIsMusicModalOpen,
    editingIcon,
    setEditingIcon,
    editingMusic,
    setEditingMusic,
    icons,
    setIcons,
    musicTracks,
    setMusicTracks,
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
    uploadedMusic,
    setUploadedMusic,
    uploadedMusicFileId,
    setUploadedMusicFileId,
    iconFormData,
    setIconFormData,
    musicFormData,
    setMusicFormData,
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
  } = useEditorState()

  useEffect(() => {
    if (currentPortfolioId) {
      const loadPortfolioData = async () => {
        const data = await fetchPortfolioData(currentPortfolioId)
        if (data) {
          setPortfolioName(data.portfolioName)
          setLockScreenEnabled(data.lockScreenSettings.enabled)
          setLockScreenPassword(data.lockScreenSettings.password)
          setLockScreenHint(data.lockScreenSettings.hint)
          setLockScreenImage(
            data.lockScreenSettings.wallpaperAsset?.displayUrl || ""
          )
          setDesktopGif(data.desktopSettings.desktopGifAsset?.displayUrl || "")
          setIcons(data.icons || [])
          setMusicTracks(data.musicTracks || [])
          setWindowContents(data.windowContents || [])
          setSoundEffects(data.soundEffects || [])
          setCurrentTheme(data.themeSettings.theme)
        }
      }
      loadPortfolioData()
    }
  }, [currentPortfolioId])

  const handleUpdatePortfolioName = async () => {
    await saveData("portfolio/settings", {
      portfolioId: currentPortfolioId,
      portfolioName,
    })
  }

  const handleUpdateLockscreenSettings = async () => {
    await saveData("portfolio/lock-screen", {
      portfolioId: currentPortfolioId,
      enabled: lockScreenEnabled,
      password: lockScreenPassword,
      hint: lockScreenHint,
      wallpaperAssetId: lockScreenImageFileId,
    })
  }

  const handleUpdateDesktopSettings = async () => {
    await saveData("portfolio/desktop", {
      portfolioId: currentPortfolioId,
      desktopGifAssetId: desktopGifFileId,
      mobileWidget1: mobileWidget1,
      mobileWidget2: mobileWidget2,
      musicPlayerIcon: musicPlayerIcon,
    })
  }

  const handleUpdateWindows = async () => {
    await saveData("windows", {
      portfolioId: currentPortfolioId,
      windows: windowContents,
    })
  }

  const handleUpdateSounds = async () => {
    await saveData("sounds", {
      portfolioId: currentPortfolioId,
      sounds: soundEffects,
    })
  }

  const handleUpdateTheme = async () => {
    await saveData("theme", {
      portfolioId: currentPortfolioId,
      theme: currentTheme,
    })
  }

  const lockScreenTabs: { id: LockScreenTab; label: string }[] = [
    { id: "settings", label: "SETTINGS" },
    { id: "wallpaper", label: "WALLPAPER" },
  ]

  const homeScreenTabs: { id: HomeScreenTab; label: string }[] = [
    { id: "wallpaper", label: "WALLPAPER" },
    { id: "icons", label: "ICONS" },
    { id: "music", label: "MUSIC" },
    { id: "windows", label: "WINDOWS" },
    { id: "sounds", label: "SOUNDS" },
    { id: "theme", label: "THEME" },
  ]

  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLButtonElement[]>([])
  const fetchPortfolios = async () => {
    const data = await fetchPortfoliosAPI()
    if (data) {
      setPortfolios(data.portfolios || [])

      if (data.portfolios.length > 0 && !currentPortfolioId) {
        setCurrentPortfolioId(data.portfolios[0].id)
        setPortfolioName(data.portfolios[0].name)
      }
    }
  }
  // Fetch portfolios on mount
  useEffect(() => {
    fetchPortfolios()
  }, [])

  const handlePortfolioCreated = (newPortfolio: Portfolio) => {
    setPortfolios((prev) => [...prev, newPortfolio])
    setCurrentPortfolioId(newPortfolio.id)
    setPortfolioName(newPortfolio.name)
  }

  // Handlers
  const handleAddIcon = async () => {
    const newIcon = await saveData("icons", {
      ...iconFormData,
      portfolioId: currentPortfolioId,
    })
    if (newIcon) {
      setIcons([...icons, newIcon])
      setIsIconModalOpen(false)
      setIconFormData({ name: "", icon: "", url: "", fileId: "" })
      setIconImagePreview(Placeholder)
    }
  }

  const handleUpdateIcon = async () => {
    if (editingIcon) {
      const updatedIcon = await saveData("icons", {
        id: editingIcon.id,
        ...iconFormData,
        portfolioId: currentPortfolioId,
      })
      if (updatedIcon) {
        setIcons(icons.map((i) => (i.id === editingIcon.id ? updatedIcon : i)))
        setEditingIcon(null)
        setIsIconModalOpen(false)
        setIconFormData({ name: "", icon: "", url: "", fileId: "" })
        setIconImagePreview(Placeholder)
      }
    }
  }

  const handleDeleteIcon = async (id: number) => {
    const success = await deleteIconAPI(id)
    if (success) {
      setIcons(icons.filter((i) => i.id !== id))
    }
  }

  const handleEditIcon = (icon: Icon) => {
    setEditingIcon(icon)
    setIconFormData({
      name: icon.name,
      icon: icon.icon,
      url: icon.url || "",
      fileId: icon.iconFileId || "",
    })
    setIconImagePreview(icon.icon)
    setIsIconModalOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === "icon") {
        handleDeleteIcon(deleteTarget.id)
      } else if (deleteTarget.type === "music") {
        handleDeleteMusic(deleteTarget.id)
      }
      setDeleteTarget(null)
    }
  }

  const handleAddMusic = async () => {
    const newMusic = await saveData("music", {
      ...musicFormData,
      portfolioId: currentPortfolioId,
    })
    if (newMusic) {
      setMusicTracks([...musicTracks, newMusic])
      setIsMusicModalOpen(false)
      setMusicFormData({ name: "", url: "", type: "upload", fileId: "" })
    }
  }

  const handleUpdateMusic = async () => {
    if (editingMusic) {
      const updatedMusic = await saveData("music", {
        id: editingMusic.id,
        ...musicFormData,
        portfolioId: currentPortfolioId,
      })
      if (updatedMusic) {
        setMusicTracks(
          musicTracks.map((m) => (m.id === editingMusic.id ? updatedMusic : m))
        )
        setEditingMusic(null)
        setIsMusicModalOpen(false)
        setMusicFormData({ name: "", url: "", type: "upload", fileId: "" })
      }
    }
  }

  const handleDeleteMusic = async (id: number) => {
    const success = await deleteMusicAPI(id)
    if (success) {
      setMusicTracks(musicTracks.filter((m) => m.id !== id))
    }
  }

  const handleWallpaperUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setUploadedWallpaper(url)
    const newWallpaper = {
      id: Date.now(),
      name: file.name,
      url,
      fileId: `local_${Date.now()}`,
    }
    setWallpapers([...wallpapers, newWallpaper])
    setSelectedWallpaper(newWallpaper)
  }

  const handleMusicUpload = async (file: File) => {
    if (currentPortfolioId) {
      const { asset } = await uploadFile(file, "audio", currentPortfolioId)
      setUploadedMusic(asset.url)
      setUploadedMusicFileId(asset.id)
      setMusicFormData({
        ...musicFormData,
        name: asset.name,
        url: asset.url,
        fileId: asset.id,
      })
    }
  }

  const handleAssetSelect = async (asset: any) => {
    if (assetLibraryType === "wallpaper") {
      const newWallpaper = {
        id: asset.id,
        name: asset.name,
        url: asset.url,
        fileId: asset.fileId || asset.id,
      }
      setWallpapers([...wallpapers, newWallpaper])
      setSelectedWallpaper(newWallpaper)

      // If selecting for lock screen
      if (activeCategory === "lockScreen" && activeLockScreenTab === "wallpaper") {
        setLockScreenImage(asset.url)
        setLockScreenImageFileId(asset.id)
        await handleUpdateLockscreenSettings()
      } else if (
        activeCategory === "homeScreen" &&
        activeHomeScreenTab === "wallpaper"
      ) {
        setUploadedWallpaper(asset.url)
        setUploadedWallpaperFileId(asset.id)
        await handleUpdateDesktopSettings()
      }
    } else if (assetLibraryType === "icon") {
      setIconFormData({
        ...iconFormData,
        icon: asset.url,
        fileId: asset.id,
      })
      setIconImagePreview(asset.url)
    } else if (assetLibraryType === "music") {
      setMusicFormData({
        ...musicFormData,
        name: asset.name,
        url: asset.url,
        fileId: asset.id,
      })
      setUploadedMusic(asset.url)
      setUploadedMusicFileId(asset.id)
    } else if (assetLibraryType === "sound") {
      // Handle sound effect selection
      console.log("Selected sound:", asset)
    }
  }

  const openAssetLibrary = (type: "sound" | "wallpaper" | "icon" | "music") => {
    setAssetLibraryType(type)
    setAssetLibraryOpen(true)
  }

  useGSAP(() => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    if (leftPanelRef.current && rightPanelRef.current) {
      gsap.fromTo(
        leftPanelRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      )
      gsap.fromTo(
        rightPanelRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
      )
    }

    tabsRef.current.forEach((tab, index) => {
      if (tab) {
        gsap.fromTo(
          tab,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.2 + index * 0.05,
            ease: "back.out(1.7)",
          }
        )
      }
    })
  }, [])

  const handleTabChange = (tabId: LockScreenTab | HomeScreenTab) => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!prefersReducedMotion && leftPanelRef.current) {
      gsap.fromTo(
        leftPanelRef.current.querySelector(".tab-content"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      )
    }

    if (activeCategory === "lockScreen") {
      setActiveLockScreenTab(tabId as LockScreenTab)
    } else {
      setActiveHomeScreenTab(tabId as HomeScreenTab)
    }
  }

  const handleSave = () => {
    if (activeCategory === "lockScreen") {
      if (activeLockScreenTab === "settings") {
        handleUpdateLockscreenSettings();
      } else if (activeLockScreenTab === "wallpaper") {
        handleUpdateLockscreenSettings();
      }
    } else {
      if (activeHomeScreenTab === "wallpaper") {
        handleUpdateDesktopSettings();
      } else if (activeHomeScreenTab === "windows") {
        handleUpdateWindows();
      } else if (activeHomeScreenTab === "sounds") {
        handleUpdateSounds();
      } else if (activeHomeScreenTab === "theme") {
        handleUpdateTheme();
      }
    }
  };

  return (
    <>
      <PortfolioUrlShare username={portfolioName} />

      <div className="min-h-[calc(100vh-180px)] flex flex-col mt-8">
        {/* Portfolio Name */}
        <div className="mb-6">
          <PixelCard>
            <PixelInput
              label="PORTFOLIO NAME"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              onBlur={handleUpdatePortfolioName}
            />
          </PixelCard>
        </div>
        <CategorySelection
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Main Content - Tabs and Content Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TabsNavigation
            activeCategory={activeCategory}
            lockScreenTabs={lockScreenTabs}
            homeScreenTabs={homeScreenTabs}
            activeLockScreenTab={activeLockScreenTab}
            activeHomeScreenTab={activeHomeScreenTab}
            handleTabChange={handleTabChange}

            
            tabsRef={tabsRef}
          />

          <TabContent
            activeCategory={activeCategory}
            activeLockScreenTab={activeLockScreenTab}
            activeHomeScreenTab={activeHomeScreenTab}
            lockScreenEnabled={lockScreenEnabled}
            lockScreenPassword={lockScreenPassword}
            lockScreenHint={lockScreenHint}
            mobileWidget1={mobileWidget1}
            mobileWidget2={mobileWidget2}
            musicPlayerIcon={musicPlayerIcon}
            onToggleLockScreen={() => {
              setLockScreenEnabled(!lockScreenEnabled)
              handleUpdateLockscreenSettings()
            }}
            onPasswordChange={(password:any) => {
              setLockScreenPassword(password)
              handleUpdateLockscreenSettings()
            }}
            onHintChange={(hint:any) => {
              setLockScreenHint(hint)
              handleUpdateLockscreenSettings()
            }}
            onWidget1Upload={async (file:any) => {
              if (currentPortfolioId) {
                const { asset } = await uploadFile(
                  file,
                  "widget",
                  currentPortfolioId
                )
                setMobileWidget1(asset.id)
                await handleUpdateDesktopSettings()
              }
            }}
            onWidget2Upload={async (file) => {
              if (currentPortfolioId) {
                const { asset } = await uploadFile(
                  file,
                  "widget",
                  currentPortfolioId
                )
                setMobileWidget2(asset.id)
                await handleUpdateDesktopSettings()
              }
            }}
            onMusicPlayerIconUpload={async (file) => {
              if (currentPortfolioId) {
                const { asset } = await uploadFile(
                  file,
                  "icon",
                  currentPortfolioId
                )
                setMusicPlayerIcon(asset.id)
                await handleUpdateDesktopSettings()
              }
            }}
            type={activeCategory === "lockScreen" ? "lockScreen" : "desktop"}
            preview={
              activeCategory === "lockScreen"
                ? lockScreenImage
                : uploadedWallpaper
            }
            selectedWallpaper={selectedWallpaper}
            wallpapers={wallpapers}
            desktopGif={desktopGif}
            onUpload={async (file) => {
              if (currentPortfolioId) {
                const { asset } = await uploadFile(
                  file,
                  "wallpaper",
                  currentPortfolioId
                )
                if (activeCategory === "lockScreen") {
                  setLockScreenImage(asset.url)
                  setLockScreenImageFileId(asset.id)
                  await handleUpdateLockscreenSettings()
                } else {
                  setUploadedWallpaper(asset.url)
                  setUploadedWallpaperFileId(asset.id)
                  await handleUpdateDesktopSettings()
                }
              }
            }}
            onGifUpload={async (file) => {
              if (currentPortfolioId) {
                const { asset } = await uploadFile(
                  file,
                  "gif",
                  currentPortfolioId
                )
                setDesktopGif(asset.url)
                setDesktopGifFileId(asset.id)
                await handleUpdateDesktopSettings()
              }
            }}
            onSelectWallpaper={async (wallpaper) => {
              setSelectedWallpaper(wallpaper)
              await handleUpdateDesktopSettings()
            }}
            onOpenLibrary={openAssetLibrary}
            icons={icons}
            onEdit={handleEditIcon}
            onDelete={(id) => setDeleteTarget({ type: "icon", id })}
            onAdd={() => {
              setEditingIcon(null)
              setIconFormData({ name: "", icon: "", url: "", fileId: "" })
              setIconImagePreview(Placeholder)
              setIsIconModalOpen(true)
            }}
            musicTracks={musicTracks}
            uploadedMusic={uploadedMusic}
            onMusicUpload={handleMusicUpload}
            windowContents={windowContents}
            onToggleWindow={(id) => {
              setWindowContents(
                windowContents.map((w) =>
                  w.id === id ? { ...w, enabled: !w.enabled } : w
                )
              )
              handleUpdateWindows()
            }}
            onWindowUpdate={(windows) => {
              setWindowContents(windows)
              handleUpdateWindows()
            }}
            soundEffects={soundEffects}
            onSoundsChange={(sounds) => {
              setSoundEffects(sounds)
              handleUpdateSounds()
            }}
            currentTheme={currentTheme}
            onThemeChange={(theme) => {
              setCurrentTheme(theme)
              handleUpdateTheme()
            }}
            onSave={handleSave}
          />
        </div>

        {/* Preview Panel - Below Everything */}
        <div className="flex-1">
          <PreviewPanel
            previewMode={previewMode}
            isLocked={isLocked}
            lockScreenEnabled={lockScreenEnabled}
            lockScreenPassword={lockScreenPassword}
            lockScreenHint={lockScreenHint}
            lockScreenImage={lockScreenImage}
            desktopGif={desktopGif}
            wallpaper={
              activeCategory === "lockScreen"
                ? lockScreenImage
                : uploadedWallpaper || selectedWallpaper?.url || ""
            }
            mobileWidget1={mobileWidget1}
            mobileWidget2={mobileWidget2}
            musicPlayerIcon={musicPlayerIcon}
            icons={icons}
            theme={currentTheme}
            onPreviewModeChange={setPreviewMode}
            onLockChange={setIsLocked}
          />
        </div>
      </div>

      {/* Modals */}

      <MusicModal
        isOpen={isMusicModalOpen}
        onClose={() => {
          setIsMusicModalOpen(false)
          setEditingMusic(null)
          setMusicFormData({ name: "", url: "", type: "upload", fileId: "" })
        }}
        editingMusic={editingMusic}
        musicFormData={musicFormData}
        setMusicFormData={setMusicFormData}
        uploadedMusic={uploadedMusic}
        handleMusicUpload={handleMusicUpload}
        openAssetLibrary={openAssetLibrary}
        handleUpdateMusic={handleUpdateMusic}
        handleAddMusic={handleAddMusic}
      />

      <DeleteModal
        deleteTarget={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        confirmDelete={confirmDelete}
      />

      <AssetLibraryModal
        isOpen={assetLibraryOpen}
        onClose={() => setAssetLibraryOpen(false)}
        assets={
          assetLibraryType === "wallpaper"
            ? DEFAULT_WALLPAPERS
            : assetLibraryType === "icon"
            ? DEFAULT_ICONS
            : assetLibraryType === "music"
            ? DEFAULT_MUSIC
            : DEFAULT_SOUNDS
        }
        type={assetLibraryType}
        onSelect={handleAssetSelect}
        currentPortfolioId={currentPortfolioId}
      />
    </>
  )
}
