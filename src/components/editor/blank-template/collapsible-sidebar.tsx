import React from "react"
import { useWorkspaceMotion } from "@/components/workspace/workspace-motion-provider"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PropertiesPanel } from "./properties-panel"
import { DraggableComponent } from "@/lib/types"

interface CollapsibleSidebarProps {
    component: DraggableComponent | null
    onChange: (id: string, updates: Record<string, any>) => void
    isOpen: boolean
    onToggle: () => void
}

export function CollapsibleSidebar({ component, onChange, isOpen, onToggle }: CollapsibleSidebarProps) {
    const { ready, reducedMotion } = useWorkspaceMotion()
    return (
        <div className={`${ready && !reducedMotion ? "transition-[width] duration-160 ease-out" : ""} ${isOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
            <div className="h-full flex">
                {/* Toggle Button - Always visible */}
                <button data-workspace-control
                    aria-label={isOpen ? "Collapse component properties" : "Expand component properties"}
                    aria-expanded={isOpen}
                    onClick={onToggle}
                    className="w-8 h-12 bg-background border-l border-border flex items-center justify-center hover:bg-muted transition-colors z-10"
                >
                    {isOpen ? (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                    )}
                </button>

                {/* Sidebar Content - Only visible when open */}
                {isOpen && (
                    <div className="flex-1 border-l border-border pl-4 overflow-hidden flex flex-col">
                        <PropertiesPanel
                            component={component}
                            onChange={onChange}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}