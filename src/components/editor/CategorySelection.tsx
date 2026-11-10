import { LockKeyhole, House } from "lucide-react"
import { useEditorUIStore } from "@/lib/stores/ui-store"

export const CategorySelection = () => {
  const { activeCategory, setActiveCategory } = useEditorUIStore()
  return <div className="workspace-editor-categories" role="group" aria-label="Portfolio screen">
    <button data-workspace-control type="button" onClick={() => setActiveCategory("lockScreen")} aria-pressed={activeCategory === "lockScreen"} className="workspace-editor-category">
      <LockKeyhole className="size-5 shrink-0" aria-hidden="true" /> Lock screen
    </button>
    <button data-workspace-control type="button" onClick={() => setActiveCategory("homeScreen")} aria-pressed={activeCategory === "homeScreen"} className="workspace-editor-category">
      <House className="size-5 shrink-0" aria-hidden="true" /> Home screen
    </button>
  </div>
}
