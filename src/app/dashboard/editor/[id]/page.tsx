"use client"

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
                                <p className="text-[8px] text-muted-foreground">
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

            <div className={`min-h-[calc(100vh-180px)] flex flex-col ${!driveLoading && !connected ? 'mt-4' : 'mt-8'}`}>
                <PortfolioSettings />

                <CategorySelection />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <TabsNavigation />
                    <TabContent />
                </div>

                {/* Preview Panel - Below Everything */}
                <div className="flex-1">
                    <PreviewPanel />
                </div>
            </div>
        </div>
    )
}