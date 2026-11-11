"use client"

import { useEffect, useId, useState } from "react"
import { PortfolioUrlShare } from "@/components/portfolio-url-share"
import { PreviewPanel } from "@/components/editor/preview-panel"
import { CategorySelection } from "@/components/editor/CategorySelection"
import { TabsNavigation } from "@/components/editor/TabsNavigation"
import { TabContent } from "@/components/editor/TabContent"

import { PortfolioSettings } from "@/components/editor/portfolio-settings"
import { WorkspaceLink } from "@/components/workspace/workspace-link"
import { ArrowLeft, ArrowUp, ArrowDown } from "lucide-react"

export default function EditorPage() {
    const tabsId = useId();

    return (
        <div>
            <div className="workspace-controls">
                <WorkspaceLink href="/dashboard/portfolios" transition="back" className="workspace-editor-return ws-action ws-action--secondary"><ArrowLeft size={18} aria-hidden="true"/>Portfolios</WorkspaceLink>
                <PortfolioUrlShare />

            </div>
            <div id="editor-top" className="min-h-[calc(100vh-180px)] flex flex-col mt-4">
                {/* From 1400px the preview sits beside all the controls and stays in view; below that it stacks under them */}
                <div className="min-[1400px]:grid min-[1400px]:grid-cols-[minmax(0,1fr)_440px] min-[1400px]:gap-6 min-[1400px]:items-start">
                    <div className="workspace-controls min-w-0">
                        <PortfolioSettings />

                        <CategorySelection />

                        <div className="grid grid-cols-1 lg:grid-cols-3 min-[1400px]:grid-cols-[180px_minmax(0,1fr)] gap-6 mb-6">
                            <TabsNavigation idPrefix={tabsId} />
                            <TabContent idPrefix={tabsId} />
                        </div>
                    </div>

                    <div id="live-preview" className="workspace-editor-preview-shell flex-1 scroll-mt-4 min-[1400px]:sticky min-[1400px]:top-4 min-[1400px]:max-h-[calc(100vh-2rem)] min-[1400px]:overflow-y-auto">
                        <a
                            href="#editor-top"
                            className="workspace-editor-preview-link ws-action ws-action--secondary inline-flex items-center min-h-11 py-2 mb-2 text-sm hover:underline min-[1400px]:hidden"
                        >
                            <ArrowUp size={18} aria-hidden="true"/> Back to the controls
                        </a>
                        <PreviewPanel />
                    </div>
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
            className="workspace-editor-preview-link ws-action ws-action--secondary min-[1400px]:hidden fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-4 right-20 z-50 min-h-11 px-4 flex items-center"
            aria-label="Jump to the live preview"
        >
            Preview <ArrowDown size={18} aria-hidden="true"/>
        </a>
    )
}