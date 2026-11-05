"use client"

import { useEffect, useState } from "react"
import { PortfolioUrlShare } from "@/components/portfolio-url-share"
import { PreviewPanel } from "@/components/editor/preview-panel"
import { CategorySelection } from "@/components/editor/CategorySelection"
import { TabsNavigation } from "@/components/editor/TabsNavigation"
import { TabContent } from "@/components/editor/TabContent"

import { PortfolioSettings } from "@/components/editor/portfolio-settings"
import { useGoogleDrive } from "@/hooks/use-google-drive"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { Cloud, XCircle } from "lucide-react"

export default function EditorPage() {
    const { connected, loading: driveLoading, connectDrive } = useGoogleDrive();

    return (
        <div>
            <PortfolioUrlShare />

            {!driveLoading && !connected && (
                <PixelCard className="border-yellow-500 mt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 md:gap-2">
                        <div className="flex items-center gap-3">
                            <XCircle className="w-6 h-6 text-yellow-500" />
                            <div>
                                <p className="text-[10px] font-bold">
                                    GOOGLE DRIVE NOT CONNECTED
                                </p>
                                <p className="font-dialogue text-sm text-muted-foreground">
                                    Connect your Google Drive to upload and manage assets
                                </p>
                            </div>
                        </div>
                        <PixelButton
                            variant="primary"
                            className="text-[10px] flex items-center gap-2"
                            onClick={connectDrive}
                            disabled={driveLoading}
                        >
                            <Cloud className="w-4 h-4" />
                            {driveLoading ? "CONNECTING..." : "CONNECT NOW"}
                        </PixelButton>
                    </div>
                </PixelCard>
            )}

            <div id="editor-top" className={`min-h-[calc(100vh-180px)] flex flex-col ${!driveLoading && !connected ? 'mt-4' : 'mt-8'}`}>
                <PortfolioSettings />

                <CategorySelection />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <TabsNavigation />
                    <TabContent />
                </div>

                {/* Preview Panel: below the controls, with a jump button that follows you while it is out of view */}
                <div id="live-preview" className="flex-1 scroll-mt-4">
                    <a
                        href="#editor-top"
                        className="inline-block py-2 mb-2 font-dialogue text-sm text-foreground hover:underline"
                    >
                        ↑ Back to the controls
                    </a>
                    <PreviewPanel />
                </div>
            </div>
            <JumpToPreviewButton />
        </div>
    )
}

/** A floating "preview" button, shown only while the live preview is scrolled out of view. */
function JumpToPreviewButton() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const target = document.getElementById("live-preview")
        if (!target) return
        const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.05 })
        observer.observe(target)
        return () => observer.disconnect()
    }, [])

    if (!visible) return null
    return (
        <a
            href="#live-preview"
            className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-4 right-20 z-50 h-14 px-4 flex items-center bg-secondary text-secondary-foreground border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-[10px] font-bold uppercase tracking-wider"
            aria-label="Jump to the live preview"
        >
            Preview ↓
        </a>
    )
}