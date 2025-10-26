"use client"

import { useState, Suspense, useRef } from "react"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelModal } from "@/components/pixel-modal"
import { FileUpload } from "@/components/file-upload"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { AssetLibraryModal } from "@/components/asset-library-modal"
import { PortfolioUrlShare } from "@/components/portfolio-url-share"
import { Trash2, Edit2, Plus, Lock, Unlock, Monitor, Smartphone, Library } from "lucide-react"
import { LockScreen } from "@/components/portfolio/lock-screen"
import Desktop from "@/components/portfolio/desktop"
import { CuteSuspenseFallback } from "@/components/portfolio/suspense-fallback"
import { SoundProvider } from "@/components/portfolio/sound-context"
import { AudioProvider } from "@/components/portfolio/audio-context"
import { ThemeEditor } from "@/components/theme-editor"
import { SoundEditor } from "@/components/sound-editor"
import { THEME_PRESETS, type PortfolioTheme } from "@/types/portfolio-theme"
import { DEFAULT_SOUNDS, DEFAULT_WALLPAPERS, DEFAULT_ICONS, DEFAULT_MUSIC } from "@/lib/default-assets"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

type Tab = "wallpaper" | "icons" | "music" | "theme" | "password" | "windows"

interface Icon {
  id: number
  name: string
  icon: string
  url?: string
}

interface Music {
  id: number
  name: string
  url: string
  type: "spotify" | "upload"
}

interface Wallpaper {
  id: number
  name: string
  url?: string
  color?: string
}

interface WindowContent {
  id: string
  name: string
  enabled: boolean
  data: any
}

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("wallpaper")
  const [portfolioName, setPortfolioName] = useState("MY PORTFOLIO")
  const [selectedColor, setSelectedColor] = useState("#8B5CF6")

  const [lockScreenPassword, setLockScreenPassword] = useState("1234")
  const [lockScreenHint, setLockScreenHint] = useState("It's 1234")
  const [lockScreenImage, setLockScreenImage] = useState("")
  const [lockScreenEnabled, setLockScreenEnabled] = useState(true)
  const [isLocked, setIsLocked] = useState(true)

  const [desktopGif, setDesktopGif] = useState("")

  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false)
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false)
  const [isWindowModalOpen, setIsWindowModalOpen] = useState(false)
  const [editingIcon, setEditingIcon] = useState<Icon | null>(null)
  const [editingMusic, setEditingMusic] = useState<Music | null>(null)
  const [editingWindow, setEditingWindow] = useState<WindowContent | null>(null)

  const [icons, setIcons] = useState<Icon[]>([
    { id: 1, name: "ABOUT", icon: "/placeholder.svg" },
    { id: 2, name: "PROJECTS", icon: "/placeholder.svg" },
    { id: 3, name: "CONTACT", icon: "/placeholder.svg" },
    { id: 4, name: "RESUME", icon: "/placeholder.svg" },
    { id: 5, name: "BLOG", icon: "/placeholder.svg" },
    { id: 6, name: "LINKS", icon: "/placeholder.svg" },
  ])

  const [musicTracks, setMusicTracks] = useState<Music[]>([
    { id: 1, name: "CHIPTUNE_BEAT.MP3", url: "", type: "upload" },
  ])

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([
    { id: 1, name: "SUNSET", color: "from-orange-400 to-pink-500" },
    { id: 2, name: "OCEAN", color: "from-blue-400 to-cyan-300" },
    { id: 3, name: "FOREST", color: "from-green-500 to-emerald-400" },
    { id: 4, name: "GALAXY", color: "from-purple-600 to-indigo-500" },
  ])

  const [windowContents, setWindowContents] = useState<WindowContent[]>([
    { id: "about", name: "About Me", enabled: true, data: {} },
    { id: "projects", name: "Projects", enabled: true, data: {} },
    { id: "contact", name: "Contact", enabled: true, data: {} },
    { id: "resume", name: "Resume", enabled: true, data: {} },
    { id: "blog", name: "Blog", enabled: true, data: {} },
    { id: "links", name: "Links", enabled: true, data: {} },
  ])

  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)
  const [uploadedWallpaper, setUploadedWallpaper] = useState<string>("")
  const [uploadedMusic, setUploadedMusic] = useState<string>("")
  const [iconFormData, setIconFormData] = useState({ name: "", icon: "", url: "" })
  const [musicFormData, setMusicFormData] = useState({ name: "", url: "", type: "upload" as "spotify" | "upload" })
  const [iconImagePreview, setIconImagePreview] = useState<string>("")
  const [deleteTarget, setDeleteTarget] = useState<{ type: "icon" | "music"; id: number } | null>(null)
  const [mobileWidget1, setMobileWidget1] = useState("")
  const [mobileWidget2, setMobileWidget2] = useState("")
  const [musicPlayerIcon, setMusicPlayerIcon] = useState("")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const [currentTheme, setCurrentTheme] = useState<PortfolioTheme>(THEME_PRESETS[0])
  const [soundEffects, setSoundEffects] = useState([
    { id: "click", name: "Click Sound", url: "", volume: 50 },
    { id: "hover", name: "Hover Sound", url: "", volume: 30 },
    { id: "open", name: "Window Open", url: "", volume: 40 },
    { id: "close", name: "Window Close", url: "", volume: 40 },
  ])

  const tabs: { id: Tab; label: string }[] = [
    { id: "password", label: "PASSWORD" },
    { id: "wallpaper", label: "WALLPAPER" },
    { id: "icons", label: "ICONS" },
    { id: "music", label: "MUSIC" },
    { id: "windows", label: "WINDOWS" },
    { id: "theme", label: "THEME" },
  ]

  const leftPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLButtonElement[]>([])

  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false)
  const [assetLibraryType, setAssetLibraryType] = useState<"sound" | "wallpaper" | "icon" | "music">("wallpaper")

  const handleAddIcon = () => {
    if (iconFormData.name && iconFormData.icon) {
      const newIcon: Icon = {
        id: Date.now(),
        name: iconFormData.name,
        icon: iconFormData.icon,
        url: iconFormData.url,
      }
      setIcons([...icons, newIcon])
      setIconFormData({ name: "", icon: "", url: "" })
      setIconImagePreview("")
      setIsIconModalOpen(false)
    }
  }

  const handleEditIcon = (icon: Icon) => {
    setEditingIcon(icon)
    setIconFormData({ name: icon.name, icon: icon.icon, url: icon.url || "" })
    setIconImagePreview(icon.icon)
    setIsIconModalOpen(true)
  }

  const handleUpdateIcon = () => {
    if (editingIcon && iconFormData.name && iconFormData.icon) {
      setIcons(
          icons.map((i) =>
              i.id === editingIcon.id
                  ? { ...i, name: iconFormData.name, icon: iconFormData.icon, url: iconFormData.url }
                  : i,
          ),
      )
      setEditingIcon(null)
      setIconFormData({ name: "", icon: "", url: "" })
      setIconImagePreview("")
      setIsIconModalOpen(false)
    }
  }

  const handleDeleteIcon = (id: number) => {
    setDeleteTarget({ type: "icon", id })
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === "icon") {
        setIcons(icons.filter((i) => i.id !== deleteTarget.id))
      } else if (deleteTarget.type === "music") {
        setMusicTracks(musicTracks.filter((m) => m.id !== deleteTarget.id))
      }
      setDeleteTarget(null)
    }
  }

  const handleAddMusic = () => {
    if (musicFormData.name && (musicFormData.url || uploadedMusic)) {
      const newMusic: Music = {
        id: Date.now(),
        name: musicFormData.name,
        url: musicFormData.url || uploadedMusic,
        type: musicFormData.type,
      }
      setMusicTracks([...musicTracks, newMusic])
      setMusicFormData({ name: "", url: "", type: "upload" })
      setUploadedMusic("")
      setIsMusicModalOpen(false)
    }
  }

  const handleDeleteMusic = (id: number) => {
    setDeleteTarget({ type: "music", id })
  }

  const handleWallpaperUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setUploadedWallpaper(url)
    const newWallpaper: Wallpaper = {
      id: Date.now(),
      name: file.name,
      url: url,
    }
    setWallpapers([...wallpapers, newWallpaper])
    setSelectedWallpaper(newWallpaper)
  }

  const handleMusicUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setUploadedMusic(url)
    setMusicFormData({ ...musicFormData, name: file.name, url: url })
  }

  const handleIconImageUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setIconImagePreview(url)
    setIconFormData({ ...iconFormData, icon: url })
  }

  const handleLockScreenImageUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setLockScreenImage(url)
  }

  const handleDesktopGifUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setDesktopGif(url)
  }

  const handleEditWindow = (window: WindowContent) => {
    setEditingWindow(window)
    setIsWindowModalOpen(true)
  }

  const handleToggleWindow = (id: string) => {
    setWindowContents(windowContents.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)))
  }

  const handleMobileWidget1Upload = (file: File) => {
    const url = URL.createObjectURL(file)
    setMobileWidget1(url)
  }

  const handleMobileWidget2Upload = (file: File) => {
    const url = URL.createObjectURL(file)
    setMobileWidget2(url)
  }

  const handleMusicPlayerIconUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setMusicPlayerIcon(url)
  }

  const colors = ["#8B5CF6", "#EC4899", "#FBBF24", "#10B981", "#3B82F6", "#EF4444"]

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Animate panels on mount
    if (leftPanelRef.current && rightPanelRef.current) {
      gsap.fromTo(leftPanelRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" })

      gsap.fromTo(
          rightPanelRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 },
      )
    }

    // Animate tabs
    tabsRef.current.forEach((tab, index) => {
      if (tab) {
        gsap.fromTo(
            tab,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, delay: 0.2 + index * 0.05, ease: "back.out(1.7)" },
        )
      }
    })
  }, [])

  const handleTabChange = (tabId: Tab) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!prefersReducedMotion && leftPanelRef.current) {
      gsap.fromTo(
          leftPanelRef.current.querySelector(".tab-content"),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
      )
    }
    setActiveTab(tabId)
  }

  const openAssetLibrary = (type: "sound" | "wallpaper" | "icon" | "music") => {
    setAssetLibraryType(type)
    setAssetLibraryOpen(true)
  }

  const handleAssetSelect = (asset: any) => {
    if (assetLibraryType === "wallpaper") {
      const newWallpaper = {
        id: Date.now(),
        name: asset.name,
        url: asset.url,
      }
      setWallpapers([...wallpapers, newWallpaper])
      setSelectedWallpaper(newWallpaper)
    } else if (assetLibraryType === "icon") {
      setIconFormData({ ...iconFormData, icon: asset.url })
      setIconImagePreview(asset.url)
    } else if (assetLibraryType === "music") {
      setMusicFormData({ ...musicFormData, name: asset.name, url: asset.url })
    } else if (assetLibraryType === "sound") {
      // Handle sound selection
    }
  }

  return (
      <>
        <PortfolioUrlShare username="demo-user" />
        <div className="min-h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-4 mt-8">
          {/* Left Panel - Controls */}
          <div ref={leftPanelRef} className="w-full lg:w-96 space-y-4 overflow-y-auto">
            <PixelCard>
              <div className="space-y-4">
                <PixelInput
                    label="PORTFOLIO NAME"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                />

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-2">
                  {tabs.map((tab, index) => (
                      <button
                          key={tab.id}
                          ref={(el) => {
                            if (el) tabsRef.current[index] = el
                          }}
                          onClick={() => handleTabChange(tab.id)}
                          className={`px-4 py-2 text-[10px] border-2 border-border transition-colors ${
                              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                          }`}
                      >
                        {tab.label}
                      </button>
                  ))}
                </div>
              </div>
            </PixelCard>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "password" && (
                  <PixelCard>
                    <div className="space-y-4">
                      <h3 className="text-sm pixel-text-shadow">LOCK SCREEN</h3>

                      {/* Lock screen enable/disable toggle */}
                      <div className="flex items-center justify-between p-3 border-2 border-border bg-muted">
                        <span className="text-[10px]">ENABLE LOCK SCREEN</span>
                        <button
                            onClick={() => setLockScreenEnabled(!lockScreenEnabled)}
                            className={`w-12 h-6 rounded-full border-2 border-border transition-colors ${
                                lockScreenEnabled ? "bg-primary" : "bg-muted-foreground"
                            }`}
                        >
                          <div
                              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                  lockScreenEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                          />
                        </button>
                      </div>

                      {lockScreenEnabled && (
                          <>
                            <PixelInput
                                label="PASSWORD"
                                type="password"
                                value={lockScreenPassword}
                                onChange={(e) => setLockScreenPassword(e.target.value)}
                                placeholder="Enter password"
                            />

                            <PixelInput
                                label="PASSWORD HINT"
                                value={lockScreenHint}
                                onChange={(e) => setLockScreenHint(e.target.value)}
                                placeholder="Enter hint"
                            />

                            <FileUpload
                                accept="image/*"
                                onFileSelect={handleLockScreenImageUpload}
                                preview={lockScreenImage}
                                label="LOCK SCREEN IMAGE"
                                maxSize={5}
                            />
                          </>
                      )}

                      <FileUpload
                          accept="image/gif,image/*"
                          onFileSelect={handleDesktopGifUpload}
                          preview={desktopGif}
                          label="DESKTOP GIF/IMAGE"
                          maxSize={5}
                      />

                      {/* Mobile widget uploads */}
                      <div className="space-y-3 pt-3 border-t-2 border-border">
                        <h4 className="text-[10px] pixel-text-shadow">MOBILE WIDGETS</h4>

                        <FileUpload
                            accept="image/*"
                            onFileSelect={handleMobileWidget1Upload}
                            preview={mobileWidget1}
                            label="WIDGET 1"
                            maxSize={2}
                        />

                        <FileUpload
                            accept="image/*"
                            onFileSelect={handleMobileWidget2Upload}
                            preview={mobileWidget2}
                            label="WIDGET 2"
                            maxSize={2}
                        />

                        <FileUpload
                            accept="image/*"
                            onFileSelect={handleMusicPlayerIconUpload}
                            preview={musicPlayerIcon}
                            label="MUSIC PLAYER ICON"
                            maxSize={1}
                        />
                      </div>
                    </div>
                  </PixelCard>
              )}

              {activeTab === "wallpaper" && (
                  <PixelCard>
                    <div className="space-y-4">
                      <h3 className="text-sm pixel-text-shadow">WALLPAPER</h3>

                      <FileUpload
                          accept="image/*"
                          onFileSelect={handleWallpaperUpload}
                          preview={uploadedWallpaper}
                          label="UPLOAD CUSTOM"
                          maxSize={5}
                      />

                      <PixelButton
                          variant="secondary"
                          className="w-full text-[10px] flex items-center justify-center gap-2"
                          onClick={() => openAssetLibrary("wallpaper")}
                      >
                        <Library className="w-4 h-4" />
                        CHOOSE FROM LIBRARY
                      </PixelButton>

                      {/* Preset Wallpapers */}
                      <div>
                        <p className="text-[10px] mb-3">SELECTED</p>
                        <div className="grid grid-cols-2 gap-3">
                          {wallpapers.slice(0, 4).map((wallpaper) => (
                              <button
                                  key={wallpaper.id}
                                  onClick={() => setSelectedWallpaper(wallpaper)}
                                  className={`aspect-video cursor-pointer border-4 transition-colors ${
                                      selectedWallpaper?.id === wallpaper.id
                                          ? "border-primary"
                                          : "border-border hover:border-muted-foreground"
                                  }`}
                              >
                                {wallpaper.url ? (
                                    <img
                                        src={wallpaper.url || "/placeholder.svg"}
                                        alt={wallpaper.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${wallpaper.color}`} />
                                )}
                              </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PixelCard>
              )}

              {activeTab === "icons" && (
                  <PixelCard>
                    <div className="space-y-4">
                      <h3 className="text-sm pixel-text-shadow">DESKTOP ICONS</h3>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {icons.map((icon) => (
                            <div
                                key={icon.id}
                                className="flex items-center justify-between p-3 border-2 border-border bg-muted hover:bg-accent transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {icon.icon.startsWith("blob:") || icon.icon.startsWith("http") ? (
                                    <img
                                        src={icon.icon || "/placeholder.svg"}
                                        alt={icon.name}
                                        className="w-8 h-8 object-cover border-2 border-border"
                                    />
                                ) : (
                                    <span className="text-xl">{icon.icon}</span>
                                )}
                                <span className="text-[10px]">{icon.name}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditIcon(icon)}
                                    className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => handleDeleteIcon(icon.id)}
                                    className="w-8 h-8 border-2 border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                        ))}
                      </div>

                      <PixelButton
                          variant="secondary"
                          className="w-full text-[10px] flex items-center justify-center gap-2"
                          onClick={() => {
                            setEditingIcon(null)
                            setIconFormData({ name: "", icon: "", url: "" })
                            setIconImagePreview("")
                            setIsIconModalOpen(true)
                          }}
                      >
                        <Plus className="w-4 h-4" />
                        ADD ICON
                      </PixelButton>
                    </div>
                  </PixelCard>
              )}

              {activeTab === "music" && (
                  <PixelCard>
                    <div className="space-y-4">
                      <h3 className="text-sm pixel-text-shadow">MUSIC</h3>

                      <FileUpload
                          accept="audio/*"
                          onFileSelect={handleMusicUpload}
                          preview={uploadedMusic}
                          label="UPLOAD AUDIO"
                          maxSize={10}
                      />

                      <PixelButton
                          variant="secondary"
                          className="w-full text-[10px] flex items-center justify-center gap-2"
                          onClick={() => openAssetLibrary("music")}
                      >
                        <Library className="w-4 h-4" />
                        CHOOSE FROM LIBRARY
                      </PixelButton>

                      {/* Current Tracks */}
                      <div className="space-y-3">
                        <p className="text-[10px]">TRACKS ({musicTracks.length})</p>
                        {musicTracks.map((track) => (
                            <div key={track.id} className="border-2 border-border p-3 bg-muted">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                  <div className="w-8 h-8 bg-primary flex items-center justify-center text-xs">♪</div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] truncate">{track.name}</p>
                                    <p className="text-[8px] text-muted-foreground">{track.type.toUpperCase()}</p>
                                  </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteMusic(track.id)}
                                    className="w-8 h-8 border-2 border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center ml-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                  </PixelCard>
              )}

              {activeTab === "windows" && (
                  <PixelCard>
                    <div className="space-y-4">
                      <h3 className="text-sm pixel-text-shadow">WINDOW CONTENT</h3>
                      <p className="text-[10px] text-muted-foreground">
                        Manage which windows appear and edit their content
                      </p>

                      <div className="space-y-3">
                        {windowContents.map((window) => (
                            <div
                                key={window.id}
                                className="flex items-center justify-between p-3 border-2 border-border bg-muted hover:bg-accent transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={window.enabled}
                                    onChange={() => handleToggleWindow(window.id)}
                                    className="w-4 h-4"
                                />
                                <span className="text-[10px]">{window.name}</span>
                              </div>
                              <button
                                  onClick={() => handleEditWindow(window)}
                                  className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                        ))}
                      </div>

                      {/* Sound Editor */}
                      <div className="pt-4 border-t-2 border-border">
                        <SoundEditor sounds={soundEffects} onSoundsChange={setSoundEffects} />
                      </div>
                    </div>
                  </PixelCard>
              )}

              {activeTab === "theme" && (
                  <PixelCard>
                    <ThemeEditor currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
                  </PixelCard>
              )}
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div ref={rightPanelRef} className="flex-1 space-y-4">
            <PixelCard className="">
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm pixel-text-shadow">LIVE PREVIEW</h3>
                  <div className="flex gap-2 flex-wrap">
                    {/* Preview mode toggle (desktop/mobile) */}
                    <button
                        onClick={() => setPreviewMode("desktop")}
                        className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${
                            previewMode === "desktop" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                        }`}
                    >
                      <Monitor className="w-3 h-3" />
                      DESKTOP
                    </button>
                    <button
                        onClick={() => setPreviewMode("mobile")}
                        className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${
                            previewMode === "mobile" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                        }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      MOBILE
                    </button>

                    {lockScreenEnabled && (
                        <>
                          <button
                              onClick={() => setIsLocked(true)}
                              className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${
                                  isLocked ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                              }`}
                          >
                            <Lock className="w-3 h-3" />
                            LOCK
                          </button>
                          <button
                              onClick={() => setIsLocked(false)}
                              className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${
                                  !isLocked ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                              }`}
                          >
                            <Unlock className="w-3 h-3" />
                            DESKTOP
                          </button>
                        </>
                    )}
                  </div>
                </div>

                <div className="flex-1 border-4 border-border relative bg-muted" style={{ zIndex: 1 }}>
                  <div
                      className={`mx-auto h-full transition-all duration-300 overflow-hidden ${
                          previewMode === "mobile" ? "max-w-[375px]" : "w-full"
                      }`}
                      style={{
                        aspectRatio: previewMode === "mobile" ? "9/16" : "auto",
                      }}
                  >
                    <SoundProvider>
                      <AudioProvider>
                        <Suspense fallback={<CuteSuspenseFallback />}>
                          {lockScreenEnabled && isLocked ? (
                              <LockScreen
                                  password={lockScreenPassword}
                                  hint={lockScreenHint}
                                  wallpaper={lockScreenImage || "/beautiful-pastel-gradient-wallpaper.jpg"}
                                  onUnlock={() => setIsLocked(false)}
                              />
                          ) : (
                              <div className="w-full h-full relative" style={{ zIndex: 1 }}>
                                <Desktop
                                    mobileWidget1={mobileWidget1 || "/water-cd.jpg"}
                                    mobileWidget2={mobileWidget2 || "/cute-puppy.png"}
                                    musicPlayerIcon={musicPlayerIcon}
                                    desktopGif={desktopGif || "/cute-greeting-gif.jpg"}
                                    wallpaper={selectedWallpaper?.url || "/beautiful-pastel-gradient-wallpaper.jpg"}
                                    icons={icons}
                                    theme={currentTheme}
                                />
                              </div>
                          )}
                        </Suspense>
                      </AudioProvider>
                    </SoundProvider>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  <PixelButton variant="secondary" className="text-[10px] flex-1 sm:flex-none">
                    ↶ UNDO
                  </PixelButton>
                  <PixelButton variant="secondary" className="text-[10px] flex-1 sm:flex-none">
                    ↷ REDO
                  </PixelButton>
                  <div className="hidden sm:block flex-1" />
                  <PixelButton variant="accent" className="text-[10px] flex-1 sm:flex-none">
                    SAVE
                  </PixelButton>
                  <PixelButton variant="primary" className="text-[10px] flex-1 sm:flex-none">
                    PUBLISH
                  </PixelButton>
                </div>
              </div>
            </PixelCard>
          </div>
        </div>

        {/* Icon Modal */}
        <PixelModal
            isOpen={isIconModalOpen}
            onClose={() => {
              setIsIconModalOpen(false)
              setEditingIcon(null)
              setIconFormData({ name: "", icon: "", url: "" })
              setIconImagePreview("")
            }}
            title={editingIcon ? "EDIT ICON" : "ADD ICON"}
        >
          <div className="space-y-4">
            <PixelInput
                label="ICON NAME"
                value={iconFormData.name}
                onChange={(e) => setIconFormData({ ...iconFormData, name: e.target.value })}
                placeholder="ABOUT ME"
            />

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider">ICON IMAGE</label>
              {iconImagePreview && (
                  <div className="flex justify-center mb-3">
                    <img
                        src={iconImagePreview || "/placeholder.svg"}
                        alt="Icon preview"
                        className="w-16 h-16 border-4 border-border object-cover"
                    />
                  </div>
              )}
              <FileUpload
                  accept="image/*"
                  onFileSelect={handleIconImageUpload}
                  maxSize={1}
                  label={iconImagePreview ? "REPLACE IMAGE" : "UPLOAD IMAGE"}
              />

              <PixelButton
                  variant="secondary"
                  className="w-full text-[10px] flex items-center justify-center gap-2"
                  onClick={() => openAssetLibrary("icon")}
              >
                <Library className="w-4 h-4" />
                CHOOSE FROM LIBRARY
              </PixelButton>
            </div>

            {/* Link URL (OPTIONAL) */}
            <PixelInput
                label="LINK URL (OPTIONAL)"
                value={iconFormData.url}
                onChange={(e) => setIconFormData({ ...iconFormData, url: e.target.value })}
                placeholder="https://..."
            />
            <div className="flex gap-3 pt-2">
              <PixelButton
                  variant="secondary"
                  className="flex-1 text-[10px]"
                  onClick={() => {
                    setIsIconModalOpen(false)
                    setEditingIcon(null)
                    setIconFormData({ name: "", icon: "", url: "" })
                    setIconImagePreview("")
                  }}
              >
                CANCEL
              </PixelButton>
              <PixelButton
                  variant="primary"
                  className="flex-1 text-[10px]"
                  onClick={editingIcon ? handleUpdateIcon : handleAddIcon}
              >
                {editingIcon ? "UPDATE" : "ADD"}
              </PixelButton>
            </div>
          </div>
        </PixelModal>

        {/* Asset Library Modal */}
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
        />

        {/* Music Modal */}
        <PixelModal
            isOpen={isMusicModalOpen}
            onClose={() => {
              setIsMusicModalOpen(false)
              setEditingMusic(null)
              setMusicFormData({ name: "", url: "", type: "upload" })
            }}
            title={editingMusic ? "EDIT MUSIC" : "ADD MUSIC"}
        >
          <div className="space-y-4">
            <PixelInput
                label="MUSIC NAME"
                value={musicFormData.name}
                onChange={(e) => setMusicFormData({ ...musicFormData, name: e.target.value })}
                placeholder="CHIPTUNE_BEAT.MP3"
            />

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider">MUSIC FILE</label>
              {uploadedMusic && (
                  <div className="flex justify-center mb-3">
                    <audio controls className="w-full">
                      <source src={uploadedMusic} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
              )}
              <FileUpload
                  accept="audio/*"
                  onFileSelect={handleMusicUpload}
                  maxSize={10}
                  label={uploadedMusic ? "REPLACE AUDIO" : "UPLOAD AUDIO"}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <PixelButton
                  variant="secondary"
                  className="flex-1 text-[10px]"
                  onClick={() => {
                    setIsMusicModalOpen(false)
                    setEditingMusic(null)
                    setMusicFormData({ name: "", url: "", type: "upload" })
                  }}
              >
                CANCEL
              </PixelButton>
              <PixelButton
                  variant="primary"
                  className="flex-1 text-[10px]"
                  onClick={
                    editingMusic
                        ? () => {
                          setMusicTracks(
                              musicTracks.map((m) =>
                                  m.id === editingMusic.id
                                      ? { ...m, name: musicFormData.name, url: musicFormData.url, type: musicFormData.type }
                                      : m,
                              ),
                          )
                          setEditingMusic(null)
                          setMusicFormData({ name: "", url: "", type: "upload" })
                          setUploadedMusic("")
                          setIsMusicModalOpen(false)
                        }
                        : handleAddMusic
                  }
              >
                {editingMusic ? "UPDATE" : "ADD"}
              </PixelButton>
            </div>
          </div>
        </PixelModal>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
            isOpen={deleteTarget !== null}
            onClose={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
            title={`DELETE ${deleteTarget?.type.toUpperCase()}`}
            message={`ARE YOU SURE YOU WANT TO DELETE THIS ${deleteTarget?.type.toUpperCase()}?`}
        />
      </>
  )
}
