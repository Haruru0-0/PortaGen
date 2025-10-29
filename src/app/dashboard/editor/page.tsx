"use client"

import { useState, useRef } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelModal } from "@/components/pixel-modal"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { AssetLibraryModal } from "@/components/asset-library-modal"
import { PortfolioUrlShare } from "@/components/portfolio-url-share"
import { ThemeEditor } from "@/components/theme-editor"
import { Library } from "lucide-react"
import { LockScreenSettingsTab } from "@/components/editor/lock-screen-settings-tab"
import { WallpaperTab } from "@/components/editor/wallpaper-tab"
import { IconsTab } from "@/components/editor/icons-tab"
import { MusicTab } from "@/components/editor/music-tab"
import { WindowsTab } from "@/components/editor/windows-tab"
import { PreviewPanel } from "@/components/editor/preview-panel"
import { THEME_PRESETS, type PortfolioTheme } from "@/lib/portfolio-theme"
import { DEFAULT_SOUNDS, DEFAULT_WALLPAPERS, DEFAULT_ICONS, DEFAULT_MUSIC } from "@/lib/default-assets"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Potion from "@/assets/Potion.png"
import Jellyfish from "@/assets/Jellyfish.png"
import Placeholder from "@/assets/Placeholder.png"
import Image, {StaticImageData} from "next/image";

type Category = "lockScreen" | "homeScreen"
type LockScreenTab = "settings" | "wallpaper"
type HomeScreenTab = "wallpaper" | "icons" | "music" | "windows" | "theme"

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
  const [activeCategory, setActiveCategory] = useState<Category>("homeScreen")
  const [activeLockScreenTab, setActiveLockScreenTab] = useState<LockScreenTab>("settings")
  const [activeHomeScreenTab, setActiveHomeScreenTab] = useState<HomeScreenTab>("wallpaper")
  const [portfolioName, setPortfolioName] = useState("MY PORTFOLIO")

  const [lockScreenPassword, setLockScreenPassword] = useState("1234")
  const [lockScreenHint, setLockScreenHint] = useState("It's 1234")
  const [lockScreenImage, setLockScreenImage] = useState("")
  const [lockScreenEnabled, setLockScreenEnabled] = useState(true)
  const [isLocked, setIsLocked] = useState(true)

  const [desktopGif, setDesktopGif] = useState("")
  const [mobileWidget1, setMobileWidget1] = useState("")
  const [mobileWidget2, setMobileWidget2] = useState("")
  const [musicPlayerIcon, setMusicPlayerIcon] = useState("")

  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false)
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
  const [iconImagePreview, setIconImagePreview] = useState<string | StaticImageData>(Placeholder)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "icon" | "music"; id: number } | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const [currentTheme, setCurrentTheme] = useState<PortfolioTheme>(THEME_PRESETS[0])
  const [soundEffects, setSoundEffects] = useState([
    { id: "click", name: "Click Sound", url: "", volume: 50 },
    { id: "hover", name: "Hover Sound", url: "", volume: 30 },
    { id: "open", name: "Window Open", url: "", volume: 40 },
    { id: "close", name: "Window Close", url: "", volume: 40 },
  ])

  const lockScreenTabs: { id: LockScreenTab; label: string }[] = [
    { id: "settings", label: "SETTINGS" },
    { id: "wallpaper", label: "WALLPAPER" },
  ]

  const homeScreenTabs: { id: HomeScreenTab; label: string }[] = [
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

  // Handlers
  const handleAddIcon = () => {
    if (iconFormData.name && iconFormData.icon) {
      setIcons([...icons, { id: Date.now(), ...iconFormData }])
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
      setIcons(icons.map((i) => (i.id === editingIcon.id ? { ...i, ...iconFormData } : i)))
      setEditingIcon(null)
      setIconFormData({ name: "", icon: "", url: "" })
      setIconImagePreview("")
      setIsIconModalOpen(false)
    }
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
      setMusicTracks([...musicTracks, { id: Date.now(), name: musicFormData.name, url: musicFormData.url || uploadedMusic, type: musicFormData.type }])
      setMusicFormData({ name: "", url: "", type: "upload" })
      setUploadedMusic("")
      setIsMusicModalOpen(false)
    }
  }

  const handleWallpaperUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setUploadedWallpaper(url)
    const newWallpaper = { id: Date.now(), name: file.name, url }
    setWallpapers([...wallpapers, newWallpaper])
    setSelectedWallpaper(newWallpaper)
  }

  const handleMusicUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setUploadedMusic(url)
    setMusicFormData({ ...musicFormData, name: file.name, url })
  }

  const handleIconImageUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setIconImagePreview(url)
    setIconFormData({ ...iconFormData, icon: url })
  }

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    if (leftPanelRef.current && rightPanelRef.current) {
      gsap.fromTo(leftPanelRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" })
      gsap.fromTo(rightPanelRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 })
    }

    tabsRef.current.forEach((tab, index) => {
      if (tab) {
        gsap.fromTo(tab, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.2 + index * 0.05, ease: "back.out(1.7)" })
      }
    })
  }, [])

  const handleTabChange = (tabId: LockScreenTab | HomeScreenTab) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!prefersReducedMotion && leftPanelRef.current) {
      gsap.fromTo(leftPanelRef.current.querySelector(".tab-content"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" })
    }

    if (activeCategory === "lockScreen") {
      setActiveLockScreenTab(tabId as LockScreenTab)
    } else {
      setActiveHomeScreenTab(tabId as HomeScreenTab)
    }
  }

  const openAssetLibrary = (type: "sound" | "wallpaper" | "icon" | "music") => {
    setAssetLibraryType(type)
    setAssetLibraryOpen(true)
  }

  const handleAssetSelect = (asset: any) => {
    if (assetLibraryType === "wallpaper") {
      const newWallpaper = { id: Date.now(), name: asset.name, url: asset.url }
      setWallpapers([...wallpapers, newWallpaper])
      setSelectedWallpaper(newWallpaper)
    } else if (assetLibraryType === "icon") {
      setIconFormData({ ...iconFormData, icon: asset.url })
      setIconImagePreview(asset.url)
    } else if (assetLibraryType === "music") {
      setMusicFormData({ ...musicFormData, name: asset.name, url: asset.url })
    }
  }

  return (
      <>
        <PortfolioUrlShare username="demo-user" />
        <div className="min-h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-4 mt-8">
          <div ref={leftPanelRef} className="w-full lg:w-96 space-y-4 overflow-y-auto">
            <PixelCard>
              <div className="space-y-4">
                <PixelInput label="PORTFOLIO NAME" value={portfolioName} onChange={(e) => setPortfolioName(e.target.value)} />

                <div className="grid grid-cols-2 gap-2 border-b-2 border-border pb-4">
                  <button onClick={() => setActiveCategory("lockScreen")} className={`flex flex-col items-center gap-2 px-2 py-3 text-xs border-2 border-border transition-colors font-bold ${activeCategory === "lockScreen" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
                    <Image src={Potion} alt={"potion"} className={"w-16 h-16"} /> LOCK SCREEN
                  </button>
                  <button onClick={() => setActiveCategory("homeScreen")} className={`flex flex-col items-center gap-2 px-2 py-3 text-xs border-2 border-border transition-colors font-bold ${activeCategory === "homeScreen" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
                    <Image src={Jellyfish} alt={"jellyfish"} className={"w-16 h-16"} /> HOME SCREEN
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {activeCategory === "lockScreen"
                      ? lockScreenTabs.map((tab, index) => (
                          <button key={tab.id} ref={(el) => { if (el) tabsRef.current[index] = el }} onClick={() => handleTabChange(tab.id)} className={`px-4 py-2 text-[10px] border-2 border-border transition-colors ${activeLockScreenTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
                            {tab.label}
                          </button>
                      ))
                      : homeScreenTabs.map((tab, index) => (
                          <button key={tab.id} ref={(el) => { if (el) tabsRef.current[index] = el }} onClick={() => handleTabChange(tab.id)} className={`px-4 py-2 text-[10px] border-2 border-border transition-colors ${activeHomeScreenTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
                            {tab.label}
                          </button>
                      ))}
                </div>
              </div>
            </PixelCard>

            <div className="tab-content">
              {activeCategory === "lockScreen" && (
                  <>
                    {activeLockScreenTab === "settings" && (
                        <LockScreenSettingsTab
                            lockScreenEnabled={lockScreenEnabled}
                            lockScreenPassword={lockScreenPassword}
                            lockScreenHint={lockScreenHint}
                            mobileWidget1={mobileWidget1}
                            mobileWidget2={mobileWidget2}
                            musicPlayerIcon={musicPlayerIcon}
                            onToggleLockScreen={() => setLockScreenEnabled(!lockScreenEnabled)}
                            onPasswordChange={setLockScreenPassword}
                            onHintChange={setLockScreenHint}
                            onWidget1Upload={(file) => setMobileWidget1(URL.createObjectURL(file))}
                            onWidget2Upload={(file) => setMobileWidget2(URL.createObjectURL(file))}
                            onMusicPlayerIconUpload={(file) => setMusicPlayerIcon(URL.createObjectURL(file))}
                        />
                    )}
                    {activeLockScreenTab === "wallpaper" && (
                        <WallpaperTab
                            type="lockScreen"
                            preview={lockScreenImage}
                            selectedWallpaper={null}
                            wallpapers={[]}
                            onUpload={(file) => setLockScreenImage(URL.createObjectURL(file))}
                            onOpenLibrary={() => openAssetLibrary("wallpaper")}
                        />
                    )}
                  </>
              )}

              {activeCategory === "homeScreen" && (
                  <>
                    {activeHomeScreenTab === "wallpaper" && (
                        <WallpaperTab
                            type="desktop"
                            preview={uploadedWallpaper}
                            selectedWallpaper={selectedWallpaper}
                            wallpapers={wallpapers}
                            desktopGif={desktopGif}
                            onUpload={handleWallpaperUpload}
                            onGifUpload={(file) => setDesktopGif(URL.createObjectURL(file))}
                            onSelectWallpaper={setSelectedWallpaper}
                            onOpenLibrary={() => openAssetLibrary("wallpaper")}
                        />
                    )}
                    {activeHomeScreenTab === "icons" && (
                        <IconsTab
                            icons={icons}
                            onEdit={handleEditIcon}
                            onDelete={(id) => setDeleteTarget({ type: "icon", id })}
                            onAdd={() => {
                              setEditingIcon(null)
                              setIconFormData({ name: "", icon: "", url: "" })
                              setIconImagePreview("")
                              setIsIconModalOpen(true)
                            }}
                        />
                    )}
                    {activeHomeScreenTab === "music" && (
                        <MusicTab
                            musicTracks={musicTracks}
                            uploadedMusic={uploadedMusic}
                            onUpload={handleMusicUpload}
                            onDelete={(id) => setDeleteTarget({ type: "music", id })}
                            onOpenLibrary={() => openAssetLibrary("music")}
                        />
                    )}
                    {activeHomeScreenTab === "windows" && (
                        <WindowsTab
                            windowContents={windowContents}
                            soundEffects={soundEffects}
                            onToggleWindow={(id) => setWindowContents(windowContents.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)))}
                            onEditWindow={setEditingWindow}
                            onSoundsChange={setSoundEffects}
                        />
                    )}
                    {activeHomeScreenTab === "theme" && (
                        <PixelCard>
                          <ThemeEditor currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
                        </PixelCard>
                    )}
                  </>
              )}
            </div>
          </div>

          <div ref={rightPanelRef} className="flex-1 space-y-4">
            <PreviewPanel
                previewMode={previewMode}
                isLocked={isLocked}
                lockScreenEnabled={lockScreenEnabled}
                lockScreenPassword={lockScreenPassword}
                lockScreenHint={lockScreenHint}
                lockScreenImage={lockScreenImage}
                desktopGif={desktopGif}
                wallpaper={selectedWallpaper?.url || ""}
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
        <PixelModal isOpen={isIconModalOpen} onClose={() => { setIsIconModalOpen(false); setEditingIcon(null); setIconFormData({ name: "", icon: "", url: "" }); setIconImagePreview("") }} title={editingIcon ? "EDIT ICON" : "ADD ICON"}>
          <div className="space-y-4">
            <PixelInput label="ICON NAME" value={iconFormData.name} onChange={(e) => setIconFormData({ ...iconFormData, name: e.target.value })} placeholder="ABOUT ME" />
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider">ICON IMAGE</label>
              {iconImagePreview && <div className="flex justify-center mb-3"><img src={iconImagePreview} alt="Icon preview" className="w-16 h-16 border-4 border-border object-cover" /></div>}
              <FileUpload accept="image/*" onFileSelect={handleIconImageUpload} maxSize={1} label={iconImagePreview ? "REPLACE IMAGE" : "UPLOAD IMAGE"} />
              <PixelButton variant="secondary" className="w-full text-[10px] flex items-center justify-center gap-2" onClick={() => openAssetLibrary("icon")}>
                <Library className="w-4 h-4" /> CHOOSE FROM LIBRARY
              </PixelButton>
            </div>
            <PixelInput label="LINK URL (OPTIONAL)" value={iconFormData.url} onChange={(e) => setIconFormData({ ...iconFormData, url: e.target.value })} placeholder="https://..." />
            <div className="flex gap-3 pt-2">
              <PixelButton variant="secondary" className="flex-1 text-[10px]" onClick={() => { setIsIconModalOpen(false); setEditingIcon(null); setIconFormData({ name: "", icon: "", url: "" }); setIconImagePreview("") }}>CANCEL</PixelButton>
              <PixelButton variant="primary" className="flex-1 text-[10px]" onClick={editingIcon ? handleUpdateIcon : handleAddIcon}>{editingIcon ? "UPDATE" : "ADD"}</PixelButton>
            </div>
          </div>
        </PixelModal>

        <AssetLibraryModal isOpen={assetLibraryOpen} onClose={() => setAssetLibraryOpen(false)} assets={assetLibraryType === "wallpaper" ? DEFAULT_WALLPAPERS : assetLibraryType === "icon" ? DEFAULT_ICONS : assetLibraryType === "music" ? DEFAULT_MUSIC : DEFAULT_SOUNDS} type={assetLibraryType} onSelect={handleAssetSelect} />

        <PixelModal isOpen={isMusicModalOpen} onClose={() => { setIsMusicModalOpen(false); setEditingMusic(null); setMusicFormData({ name: "", url: "", type: "upload" }) }} title={editingMusic ? "EDIT MUSIC" : "ADD MUSIC"}>
          <div className="space-y-4">
            <PixelInput label="MUSIC NAME" value={musicFormData.name} onChange={(e) => setMusicFormData({ ...musicFormData, name: e.target.value })} placeholder="CHIPTUNE_BEAT.MP3" />
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider">MUSIC FILE</label>
              {uploadedMusic && <div className="flex justify-center mb-3"><audio controls className="w-full"><source src={uploadedMusic} type="audio/mpeg" /></audio></div>}
              <FileUpload accept="audio/*" onFileSelect={handleMusicUpload} maxSize={10} label={uploadedMusic ? "REPLACE AUDIO" : "UPLOAD AUDIO"} />
            </div>
            <div className="flex gap-3 pt-2">
              <PixelButton variant="secondary" className="flex-1 text-[10px]" onClick={() => { setIsMusicModalOpen(false); setEditingMusic(null); setMusicFormData({ name: "", url: "", type: "upload" }) }}>CANCEL</PixelButton>
              <PixelButton variant="primary" className="flex-1 text-[10px]" onClick={editingMusic ? () => { setMusicTracks(musicTracks.map((m) => (m.id === editingMusic.id ? { ...m, ...musicFormData } : m))); setEditingMusic(null); setMusicFormData({ name: "", url: "", type: "upload" }); setUploadedMusic(""); setIsMusicModalOpen(false) } : handleAddMusic}>{editingMusic ? "UPDATE" : "ADD"}</PixelButton>
            </div>
          </div>
        </PixelModal>

        <DeleteConfirmationModal isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete} title={`DELETE ${deleteTarget?.type.toUpperCase()}`} message={`ARE YOU SURE YOU WANT TO DELETE THIS ${deleteTarget?.type.toUpperCase()}?`} />
      </>
  )
}