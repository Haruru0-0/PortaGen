import { create } from 'zustand'
import { CategoryType, LockScreenTab, HomeScreenTab } from '../constants/tabs'
export type { CategoryType, LockScreenTab, HomeScreenTab }

export interface EditorUIState {
    activeCategory: CategoryType
    activeLockScreenTab: LockScreenTab
    activeHomeScreenTab: HomeScreenTab

    setActiveCategory: (category: CategoryType) => void
    setActiveLockScreenTab: (tab: LockScreenTab) => void
    setActiveHomeScreenTab: (tab: HomeScreenTab) => void

    // Asset Library
    assetLibraryOpen: boolean
    assetLibraryType: 'sound' | 'wallpaper' | 'icon' | 'music'
    setAssetLibraryOpen: (open: boolean) => void
    setAssetLibraryType: (type: 'sound' | 'wallpaper' | 'icon' | 'music') => void
    openAssetLibrary: (type: 'sound' | 'wallpaper' | 'icon' | 'music') => void
    closeAssetLibrary: () => void

    // Preview Handling
    previewMode: 'desktop' | 'mobile'
    setPreviewMode: (mode: 'desktop' | 'mobile') => void

    // Modals & Editing
    isIconModalOpen: boolean
    setIsIconModalOpen: (open: boolean) => void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editingIcon: any | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEditingIcon: (icon: any | null) => void

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editingWindow: any | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEditingWindow: (window: any | null) => void

    iconFormData: { name: string; icon: string; url: string; fileId: string | number }
    setIconFormData: (data: { name: string; icon: string; url: string; fileId: string | number }) => void

    deleteTarget: { type: 'icon' | 'music'; id: number } | null
    setDeleteTarget: (target: { type: 'icon' | 'music'; id: number } | null) => void

    // Selected Wallpaper (transient state for preview before upload/save)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedWallpaper: any | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedWallpaper: (wallpaper: any | null) => void
}

export const useEditorUIStore = create<EditorUIState>((set) => ({
    activeCategory: 'homeScreen',
    activeLockScreenTab: 'settings',
    activeHomeScreenTab: 'wallpaper',

    setActiveCategory: (category) => set({ activeCategory: category }),
    setActiveLockScreenTab: (tab) => set({ activeLockScreenTab: tab }),
    setActiveHomeScreenTab: (tab) => set({ activeHomeScreenTab: tab }),

    // Asset Library State
    assetLibraryOpen: false,
    assetLibraryType: 'wallpaper',
    setAssetLibraryOpen: (open) => set({ assetLibraryOpen: open }),
    setAssetLibraryType: (type) => set({ assetLibraryType: type }),
    openAssetLibrary: (type) => set({ assetLibraryOpen: true, assetLibraryType: type }),
    closeAssetLibrary: () => set({ assetLibraryOpen: false }),

    // Preview
    previewMode: 'desktop',
    setPreviewMode: (mode) => set({ previewMode: mode }),

    // Modals & Editing
    isIconModalOpen: false,
    setIsIconModalOpen: (open) => set({ isIconModalOpen: open }),
    editingIcon: null,
    setEditingIcon: (icon) => set({ editingIcon: icon }),
    editingWindow: null,
    setEditingWindow: (window) => set({ editingWindow: window }),

    iconFormData: { name: '', icon: '', url: '', fileId: '' },
    setIconFormData: (data) => set({ iconFormData: data }),

    deleteTarget: null,
    setDeleteTarget: (target) => set({ deleteTarget: target }),

    selectedWallpaper: null,
    setSelectedWallpaper: (wallpaper) => set({ selectedWallpaper: wallpaper })
}))
