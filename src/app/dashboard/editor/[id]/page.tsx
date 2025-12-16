
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { PortfolioUrlShare } from "@/components/portfolio-url-share"
import { PreviewPanel } from "@/components/editor/preview-panel"
import { CategorySelection } from "@/components/editor/CategorySelection"
import { TabsNavigation } from "@/components/editor/TabsNavigation"
import { TabContent } from "@/components/editor/TabContent"

import { PortfolioSettings } from "@/components/editor/portfolio-settings"

export default function EditorPage() {

    return (
        <div>
            <PortfolioUrlShare />

            <div className="min-h-[calc(100vh-180px)] flex flex-col mt-8">
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