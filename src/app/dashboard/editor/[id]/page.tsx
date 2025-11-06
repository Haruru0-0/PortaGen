/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {useRef} from "react"
import {PixelCard} from "@/components/pixel-card"
import {PixelInput} from "@/components/pixel-input"
import {AssetLibraryModal} from "@/components/asset-library-modal"
import {PortfolioUrlShare} from "@/components/portfolio-url-share"
import {PreviewPanel} from "@/components/editor/preview-panel"
import {DEFAULT_ICONS, DEFAULT_MUSIC, DEFAULT_SOUNDS, DEFAULT_WALLPAPERS,} from "@/lib/default-assets"
import gsap from "gsap"
import {useGSAP} from "@gsap/react"
import {EditorProvider, useEditorContext} from "@/contexts/editorContext"
import {LockScreenProvider} from "@/contexts/lockScreenContext"
import {DesktopProvider} from "@/contexts/desktopContext"
import {IconProvider, useIconContext} from "@/contexts/iconContext"
import {saveData,} from "@/lib/services/portfolioService"
import {CategorySelection} from "@/components/editor/CategorySelection"
import {TabsNavigation} from "@/components/editor/TabsNavigation"
import {TabContent} from "@/components/editor/TabContent"
// Icon modals now live inside IconsTab
import {DeleteModal} from "@/components/editor/modals/DeleteModal"
import {useParams} from "next/navigation";

type LockScreenTab = "settings" | "wallpaper"
type HomeScreenTab =
    | "wallpaper"
    | "icons"
    | "music"
    | "windows"
    | "theme"
    | "sounds"
    | "widgets"

function EditorContent() {
    const params = useParams<{ id: string }>()
    const currentPortfolioId = Number(params?.id)
    const {
        activeCategory,
        setActiveCategory,
        activeLockScreenTab,
        setActiveLockScreenTab,
        activeHomeScreenTab,
        setActiveHomeScreenTab,
        portfolioName,
        setPortfolioName,
        lockScreenPassword,
        lockScreenHint,
        lockScreenImage,
        lockScreenEnabled,
        isLocked,
        setIsLocked,
        desktopGif,
        desktopGifFileId,
        mobileWidget1,
        mobileWidget2,
        musicPlayerIcon,
        spotifyPlaylistUrl,
        selectedWallpaper,
        uploadedWallpaper,
        setUploadedWallpaper,
        setUploadedWallpaperFileId,
        iconFormData,
        setIconFormData,
        deleteTarget,
        setDeleteTarget,
        previewMode,
        setPreviewMode,
        currentTheme,
        assetLibraryOpen,
        setAssetLibraryOpen,
        assetLibraryType,
    } = useEditorContext()
    const {icons} = useIconContext()

    const handleUpdatePortfolioName = async () => {
        await saveData("portfolio/settings", {
            portfolioId: currentPortfolioId,
            portfolioName,
        })
    }
    const handleUpdateDesktopSettings = async () => {
        await saveData("portfolio/desktop", {
            portfolioId: currentPortfolioId,
            desktopGifAssetId: desktopGifFileId,
            mobileWidget1: mobileWidget1,
            mobileWidget2: mobileWidget2,
            musicPlayerIcon: musicPlayerIcon,
            spotifyPlaylistUrl,
        })
    }

    const lockScreenTabs: { id: LockScreenTab; label: string }[] = [
        {id: "settings", label: "SETTINGS"},
        {id: "wallpaper", label: "WALLPAPER"},
    ]

    const homeScreenTabs: { id: HomeScreenTab; label: string }[] = [
        {id: "wallpaper", label: "WALLPAPER"},
        {id: "widgets", label: "WIDGETS"},
        {id: "icons", label: "ICONS"},
        {id: "music", label: "MUSIC"},
        {id: "windows", label: "WINDOWS"},
        {id: "sounds", label: "SOUNDS"},
        {id: "theme", label: "THEME"},
    ]

    const leftPanelRef = useRef<HTMLDivElement>(null)
    const rightPanelRef = useRef<HTMLDivElement>(null)
    const tabsRef = useRef<HTMLButtonElement[]>([])

    useGSAP(() => {
        const prefersReducedMotion =
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReducedMotion) return

        if (leftPanelRef.current && rightPanelRef.current) {
            gsap.fromTo(
                leftPanelRef.current,
                {x: -50, opacity: 0},
                {x: 0, opacity: 1, duration: 0.6, ease: "power3.out"}
            )
            gsap.fromTo(
                rightPanelRef.current,
                {x: 50, opacity: 0},
                {x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1}
            )
        }

        tabsRef.current.forEach((tab, index) => {
            if (tab) {
                gsap.fromTo(
                    tab,
                    {y: -20, opacity: 0},
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
                {opacity: 0, y: 10},
                {opacity: 1, y: 0, duration: 0.3, ease: "power2.out"}
            )
        }

        if (activeCategory === "lockScreen") {
            setActiveLockScreenTab(tabId as LockScreenTab)
        } else {
            setActiveHomeScreenTab(tabId as HomeScreenTab)
        }
    }

    return (
        <>
            <PortfolioUrlShare username={portfolioName}/>

            <div className="min-h-[calc(100vh-180px)] flex flex-col mt-8">
                {/* Portfolio Name */}
                <div className="mb-6">
                    <PixelCard>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider">Portfolio Name</label>
                                <PixelInput
                                    value={portfolioName}
                                    onChange={(e) => setPortfolioName(e.target.value)}
                                    placeholder="MY PORTFOLIO"
                                />
                            </div>
                            <div className="flex items-end justify-end">
                                <button
                                    className="px-4 py-2 text-[10px] border-2 border-border bg-primary text-primary-foreground"
                                    onClick={handleUpdatePortfolioName}
                                >
                                    Save Name
                                </button>
                            </div>
                        </div>
                    </PixelCard>
                </div>

                {/* Category Selection */}
                <CategorySelection
                    activeCategory={activeCategory as any}
                    setActiveCategory={setActiveCategory as any}
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
                        spotifyPlaylistUrl={spotifyPlaylistUrl}
                        icons={icons}
                        theme={currentTheme}
                        onPreviewModeChange={setPreviewMode}
                        onLockChange={setIsLocked}
                    />
                </div>
            </div>

            {/* Modals */}
            {/* Icon modals handled inside IconsTab */}

            <DeleteModal
                deleteTarget={deleteTarget as any}
                onClose={() => setDeleteTarget(null)}
                confirmDelete={() => {
                    if (!deleteTarget) return
                    // icon deletes handled within IconsTab
                    setDeleteTarget(null)
                }}
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
                type={assetLibraryType as any}
                onSelect={async (asset: any) => {
                    if (assetLibraryType === "wallpaper") {
                        setUploadedWallpaper(asset.url)
                        setUploadedWallpaperFileId(asset.id)
                        await handleUpdateDesktopSettings()
                    } else if (assetLibraryType === "icon") {
                        setIconFormData({...iconFormData, icon: asset.url, fileId: asset.id})
                    }
                }}
                currentPortfolioId={currentPortfolioId as any}
            />
        </>
    )
}

export default function EditorPage() {
    return (
        <EditorProvider>
            <DesktopProvider>
                <LockScreenProvider>
                    <IconProvider>
                        <EditorContent/>
                    </IconProvider>
                </LockScreenProvider>
            </DesktopProvider>
        </EditorProvider>
    )
}
