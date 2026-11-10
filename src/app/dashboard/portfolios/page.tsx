"use client"
import { PersonaPageHeader } from "@/components/workspace/persona-page-header"
import React, { useEffect, useState } from "react"
import Link from "@/components/workspace/workspace-link"
import { WorkspacePanel as PixelCard } from "@/components/workspace/workspace-primitives"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { WorkspaceModal as PixelModal } from "@/components/workspace/workspace-modal"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { usePortfolioContext } from "@/contexts/portfolioContext"

export default function PortfoliosPage() {
  const {
    portfolios,
    loadingList,
    fetchList,
    createPortfolio,
    deletePortfolio,
  } = usePortfolioContext()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newBio, setNewBio] = useState("")
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  // The context starts with loadingList=false, so without this the empty state flashes before the first fetch begins
  const [loadedOnce, setLoadedOnce] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [operationError, setOperationError] = useState("")
  const selected = portfolios.find(p => p.id === selectedId) ?? portfolios[0]

  useEffect(() => {
    fetchList().finally(() => setLoadedOnce(true))
  }, [fetchList])

  const handleCreate = async () => {
    setOperationError("")
    setCreating(true)
    const created = await createPortfolio(newName?.trim() || "MY PORTFOLIO", newBio?.trim())
    setCreating(false)
    if (created) {
      setSelectedId(created.id)
      setIsCreateOpen(false)
      setNewName("MY PORTFOLIO")
      setNewBio("")
    } else {
      setOperationError("Could not create your portfolio. Please try again.")
    }
  }

  const handleDelete = async (id: number) => {
    setOperationError("")
    setDeleting(true)
    const ok = await deletePortfolio(id)
    setDeleting(false)
    if (ok) {
      setDeleteTarget(null)
    } else {
      setOperationError("Could not delete this portfolio. Please try again.")
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PersonaPageHeader title="Portfolios" description="Choose a save slot to continue your story.">
        <PixelButton className="text-sm w-full sm:w-auto" onClick={() => { setOperationError(""); setIsCreateOpen(true) }}>New portfolio</PixelButton>
      </PersonaPageHeader>
      {loadingList || !loadedOnce ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status" aria-label="Loading your portfolios">
          {[0, 1, 2].map((i) => (
            <PixelCard key={i} className="flex flex-col gap-4">
              <div className="aspect-video bg-muted animate-pulse motion-reduce:animate-none" />
              <div className="space-y-2">
                <div className="h-4 w-2/3 bg-muted animate-pulse motion-reduce:animate-none" />
                <div className="h-3 w-1/3 bg-muted animate-pulse motion-reduce:animate-none" />
              </div>
              <div className="h-10 bg-muted animate-pulse motion-reduce:animate-none" />
            </PixelCard>
          ))}
          <span className="sr-only">Loading your portfolios…</span>
        </div>
      ) : portfolios.length === 0 ? (
        <PixelCard>
          <div className="font-[family-name:var(--font-workspace-body)] text-sm">No portfolios yet. Create your first one with NEW PORTFOLIO.</div>
        </PixelCard>
      ) : (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <div className="space-y-3" aria-label="Your portfolios">
            {portfolios.map((portfolio, index) => (
              <button key={portfolio.id} type="button" aria-pressed={selected?.id === portfolio.id} data-persona-slot
                onClick={() => setSelectedId(portfolio.id)}
                className={`w-full text-left p-5 border min-h-24 flex gap-4 items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#44e4ff] ${selected?.id === portfolio.id ? "bg-[#fffef5] text-[#bc174c] border-[#fffef5]" : "bg-[#071657] text-[#fffef5] border-[#3864a6] hover:border-[#44e4ff]"}`}>
                <span className="text-2xl tabular-nums opacity-70" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0"><span className="block font-semibold break-words">{portfolio.portfolioName}</span><span className="block mt-1 text-sm">{selected?.id === portfolio.id ? "Selected portfolio" : "Select portfolio"}</span></span>
              </button>
            ))}
          </div>
          {selected && <PixelCard className="persona-slot-detail self-start space-y-6 p-6 md:p-8">
            <div><h2 className="text-2xl font-semibold break-words">{selected.portfolioName}</h2><p className="mt-3 text-muted-foreground whitespace-pre-wrap break-words">{selected.bio || "Add a bio in the editor to introduce this portfolio."}</p></div>
            {selected.createdAt && <p className="text-sm text-muted-foreground">Created {new Date(selected.createdAt).toLocaleDateString()}</p>}
            <div className="flex flex-wrap gap-3">
              <Link href={`/dashboard/editor/${selected.id}`} className="ws-action ws-action--primary inline-flex min-h-11 items-center px-5">Edit portfolio</Link>
              <PixelButton variant="secondary" className="text-[#ffb2c5]" onClick={() => { setOperationError(""); setDeleteTarget({ id: selected.id, name: selected.portfolioName }) }}>Delete portfolio</PixelButton>
            </div>
          </PixelCard>}
        </div>
      )}

      {operationError && !isCreateOpen && !deleteTarget && <p role="alert" className="text-[#ffb2c5]">{operationError}</p>}
      <PixelModal isOpen={isCreateOpen} onClose={() => !creating && setIsCreateOpen(false)} title="NEW PORTFOLIO">
        <div className="space-y-4">
          {operationError && <p role="alert" className="text-[#ffb2c5]">{operationError}</p>}
          <div>
            <label htmlFor="new-portfolio-name" className="block text-sm mb-2">Portfolio name</label>
            <PixelInput id="new-portfolio-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="MY PORTFOLIO" />
          </div>
          <div>
            <label htmlFor="new-portfolio-bio" className="block text-sm mb-2">Bio</label>
            <textarea id="new-portfolio-bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="A short description of your portfolio..."
              className="ws-input w-full resize-y"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <PixelButton variant="secondary" className="text-sm" onClick={() => setIsCreateOpen(false)} disabled={creating}>CANCEL</PixelButton>
            <PixelButton className="text-sm" onClick={handleCreate} disabled={creating}>{creating ? "CREATING…" : "CREATE"}</PixelButton>
          </div>
        </div>
      </PixelModal>

      <PixelModal isOpen={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} title="DELETE PORTFOLIO">
        <div className="space-y-4">
          {operationError && <p role="alert" className="text-[#ffb2c5]">{operationError}</p>}
          <p className="text-base leading-relaxed">Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end pt-2">
            <PixelButton variant="secondary" className="text-sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>CANCEL</PixelButton>
            <PixelButton className="text-sm bg-destructive border-destructive hover:bg-destructive/90 " onClick={() => deleteTarget && handleDelete(deleteTarget.id)} disabled={deleting}>
              {deleting ? "DELETING…" : "DELETE"}
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  )
}
