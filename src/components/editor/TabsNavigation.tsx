"use client"

import { WorkspacePanel } from "@/components/workspace/workspace-primitives"
import { useWorkspaceMotion } from "@/components/workspace/workspace-motion-provider"
import { homeScreenTabs, lockScreenTabs } from "@/lib/constants/tabs"
import { useEditorUIStore, type LockScreenTab, type HomeScreenTab } from "@/lib/stores/ui-store"
import { useEffect, useRef, useState, type KeyboardEvent } from "react"

export function editorTabId(prefix: string, category: string, tab: string) {
  return `${prefix}-${category}-${tab.replaceAll(" ", "-")}`
}

export const TabsNavigation = ({ idPrefix }: { idPrefix: string }) => {
  const { activeCategory, activeLockScreenTab, activeHomeScreenTab, setActiveLockScreenTab, setActiveHomeScreenTab } = useEditorUIStore()
  const { reducedMotion, ready } = useWorkspaceMotion()
  const stripRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const [vertical, setVertical] = useState(false)
  const [focusedTab, setFocusedTab] = useState<{ category: string; tab: string } | null>(null)
  const tabs = activeCategory === "lockScreen" ? lockScreenTabs : homeScreenTabs
  const activeTab = activeCategory === "lockScreen" ? activeLockScreenTab : activeHomeScreenTab
  const rovingTab = focusedTab?.category === activeCategory ? focusedTab.tab : activeTab

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    const update = () => setVertical(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const strip = stripRef.current
    const selected = strip?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!strip || !selected || strip.scrollWidth <= strip.clientWidth) return
    strip.scrollTo({ left: selected.offsetLeft - (strip.clientWidth - selected.clientWidth) / 2, behavior: ready && !reducedMotion ? "smooth" : "auto" })
  }, [activeTab, activeCategory, reducedMotion, ready])

  const activate = (tab: string) => {
    if (activeCategory === "lockScreen") setActiveLockScreenTab(tab as LockScreenTab)
    else setActiveHomeScreenTab(tab as HomeScreenTab)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let target: number | undefined
    if (event.key === "Home") target = 0
    else if (event.key === "End") target = tabs.length - 1
    else if (event.key === (vertical ? "ArrowDown" : "ArrowRight")) target = (index + 1) % tabs.length
    else if (event.key === (vertical ? "ArrowUp" : "ArrowLeft")) target = (index - 1 + tabs.length) % tabs.length
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      activate(tabs[index].id)
    }
    if (target !== undefined) {
      event.preventDefault()
      tabsRef.current[target]?.focus()
    }
  }

  return <div className="lg:col-span-1 min-w-0">
    <WorkspacePanel>
      <h2 className="workspace-editor-title mb-3">{activeCategory === "lockScreen" ? "Lock screen" : "Home screen"}</h2>
      <div ref={stripRef} role="tablist" aria-label="Editor sections" aria-orientation={vertical ? "vertical" : "horizontal"} className="workspace-editor-tabs">
        {tabs.map((tab, index) => {
          const id = editorTabId(idPrefix, activeCategory, tab.id)
          return <button data-workspace-control key={tab.id} type="button" ref={(element) => { tabsRef.current[index] = element }}
            id={`${id}-tab`} role="tab" aria-selected={activeTab === tab.id} aria-controls={`${id}-panel`}
            tabIndex={rovingTab === tab.id ? 0 : -1}
            onFocus={() => setFocusedTab({ category: activeCategory, tab: tab.id })}
            onKeyDown={(event) => onKeyDown(event, index)} onClick={() => activate(tab.id)} className="workspace-editor-tab">
            {tab.label}
          </button>
        })}
      </div>
    </WorkspacePanel>
  </div>
}
