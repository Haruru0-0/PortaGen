
import { useState } from "react";
import {
  type PortfolioTheme,
  THEME_PRESETS,
} from "@/lib/portfolio-theme";
import { StaticImageData } from "next/image";
import Placeholder from "@/assets/Placeholder.png";

type Category = "lockScreen" | "homeScreen";
type LockScreenTab = "settings" | "wallpaper";
type HomeScreenTab =
  | "wallpaper"
  | "icons"
  | "music"
  | "windows"
  | "theme"
  | "sounds";

interface Icon {
  id: number;
  name: string;
  icon: string;
  url?: string;
  iconFileId?: string;
}

interface Music {
  id: number;
  name: string;
  url: string;
  type: "spotify" | "upload";
  fileId?: string;
}

interface Wallpaper {
  id: number;
  name: string;
  url?: string;
  color?: string;
  fileId?: string;
}

interface WindowContent {
  id: string;
  name: string;
  enabled: boolean;
  data: {
    type: "about" | "projects" | "contact" | "resume" | "blog" | "links" | "custom";
    fields: Array<{
      id: string;
      type: "text" | "textarea" | "image" | "link" | "list" | "badge";
      label: string;
      value: any;
      placeholder?: string;
    }>;
    template?: string;
    description?: string;
  };
  type: "about" | "projects" | "contact" | "resume" | "blog" | "links" | "custom";
}

interface Portfolio {
  id: number;
  name: string;
  slug: string;
  isPublished: boolean;
}

export const useEditorState = () => {
  // Portfolio State
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolioId, setCurrentPortfolioId] = useState<number | null>(
    null
  );

  // UI State
  const [activeCategory, setActiveCategory] = useState<Category>("homeScreen");
  const [activeLockScreenTab, setActiveLockScreenTab] =
    useState<LockScreenTab>("settings");
  const [activeHomeScreenTab, setActiveHomeScreenTab] =
    useState<HomeScreenTab>("wallpaper");
  const [portfolioName, setPortfolioName] = useState("MY PORTFOLIO");

  // Lock Screen State
  const [lockScreenPassword, setLockScreenPassword] = useState("1234");
  const [lockScreenHint, setLockScreenHint] = useState("It's 1234");
  const [lockScreenImage, setLockScreenImage] = useState("");
  const [lockScreenImageFileId, setLockScreenImageFileId] = useState("");
  const [lockScreenEnabled, setLockScreenEnabled] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  // Desktop State
  const [desktopGif, setDesktopGif] = useState("");
  const [desktopGifFileId, setDesktopGifFileId] = useState("");
  const [mobileWidget1, setMobileWidget1] = useState("");
  const [mobileWidget2, setMobileWidget2] = useState("");
  const [musicPlayerIcon, setMusicPlayerIcon] = useState("");

  // Modal States
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<Icon | null>(null);
  const [editingMusic, setEditingMusic] = useState<Music | null>(null);
  const [editingWindow, setEditingWindow] = useState<WindowContent | null>(
    null
  );

  // Content State
  const [icons, setIcons] = useState<Icon[]>([
    { id: 1, name: "ABOUT", icon: "/placeholder.svg" },
    { id: 2, name: "PROJECTS", icon: "/placeholder.svg" },
    { id: 3, name: "CONTACT", icon: "/placeholder.svg" },
    { id: 4, name: "RESUME", icon: "/placeholder.svg" },
    { id: 5, name: "BLOG", icon: "/placeholder.svg" },
    { id: 6, name: "LINKS", icon: "/placeholder.svg" },
  ]);

  const [musicTracks, setMusicTracks] = useState<Music[]>([
    { id: 1, name: "CHIPTUNE_BEAT.MP3", url: "", type: "upload" },
  ]);

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([
    { id: 1, name: "SUNSET", color: "from-orange-400 to-pink-500" },
    { id: 2, name: "OCEAN", color: "from-blue-400 to-cyan-300" },
    { id: 3, name: "FOREST", color: "from-green-500 to-emerald-400" },
    { id: 4, name: "GALAXY", color: "from-purple-600 to-indigo-500" },
  ]);

  const [windowContents, setWindowContents] = useState<WindowContent[]>([]);

  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(
    null
  );
  const [uploadedWallpaper, setUploadedWallpaper] = useState<string>("");
  const [uploadedWallpaperFileId, setUploadedWallpaperFileId] =
    useState<string>("");
  const [uploadedMusic, setUploadedMusic] = useState<string>("");
  const [uploadedMusicFileId, setUploadedMusicFileId] = useState<string>("");
  const [iconFormData, setIconFormData] = useState({
    name: "",
    icon: "",
    url: "",
    fileId: "",
  });
  const [musicFormData, setMusicFormData] = useState({
    name: "",
    url: "",
    type: "upload" as "spotify" | "upload",
    fileId: "",
  });
  const [iconImagePreview, setIconImagePreview] = useState<
    string | StaticImageData
  >(Placeholder);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "icon" | "music";
    id: number;
  } | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );

  // Theme & Sounds
  const [currentTheme, setCurrentTheme] =
    useState<PortfolioTheme>(THEME_PRESETS[0]);
  const [soundEffects, setSoundEffects] = useState([]);

  // Asset Library
  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false);
  const [assetLibraryType, setAssetLibraryType] = useState<
    "sound" | "wallpaper" | "icon" | "music"
  >("wallpaper");

  return {
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
    editingWindow,
    setEditingWindow,
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
  };
};
