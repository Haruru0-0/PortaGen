"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { PixelCharacter } from "@/components/pixel-character"
import { usePortfolioContext } from "@/contexts/portfolioContext"

export default function PortfoliosPage() {
  const router = useRouter()
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

  useEffect(() => {
    fetchList().finally(() => setLoadedOnce(true))
  }, [fetchList])

  const handleCreate = async () => {
    setCreating(true)
    const created = await createPortfolio(newName?.trim() || "MY PORTFOLIO", newBio?.trim())
    setCreating(false)
    if (created) {
      setIsCreateOpen(false)
      setNewName("MY PORTFOLIO")
      setNewBio("")
    }
  }

  const handleDelete = async (id: number) => {
    setDeleting(true)
    const ok = await deletePortfolio(id)
    setDeleting(false)
    if (ok) {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-end">
        <PixelButton className="text-xs w-full sm:w-auto" onClick={() => setIsCreateOpen(true)}>NEW PORTFOLIO</PixelButton>
      </div>
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
          <div className="font-dialogue text-sm">No portfolios yet. Create your first one with NEW PORTFOLIO.</div>
        </PixelCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolios.map((p) => (
            <PixelCard key={p.id} className="flex flex-col gap-4 example-card">
              <div className="aspect-video bg-gradient-to-br from-[#87CEEB] to-[#E0BBE4] p-3 relative">
                <div className="absolute top-2 left-2">
                  <PixelCharacter color="#8B5CF6" size={20} />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm pixel-text-shadow truncate">{p.portfolioName}</h3>
                <p className="text-xs pixel-text-shadow truncate">{p.bio}</p>
              </div>
              <div className="mt-auto flex gap-2">
                <PixelButton variant="primary" className="text-xs flex-1" onClick={() => router.push(`/dashboard/editor/${p.id}`)}>EDIT</PixelButton>
                <PixelButton variant="secondary" className="text-xs flex-1 bg-card text-red-700 border-red-700 hover:bg-red-700 hover:text-white dark:text-red-300 dark:border-red-300" onClick={() => setDeleteTarget({ id: p.id, name: p.portfolioName })}>DELETE</PixelButton>
              </div>
            </PixelCard>
          ))}
        </div>
      )}

      <PixelModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="NEW PORTFOLIO">
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1">Portfolio Name</label>
            <PixelInput value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="MY PORTFOLIO" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1">Bio</label>
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="A short description of your portfolio..."
              className="w-full px-4 py-3 text-xs bg-input border-4 border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <PixelButton variant="secondary" className="text-xs" onClick={() => setIsCreateOpen(false)}>CANCEL</PixelButton>
            <PixelButton className="text-xs" onClick={handleCreate} disabled={creating}>{creating ? "CREATING…" : "CREATE"}</PixelButton>
          </div>
        </div>
      </PixelModal>

      <PixelModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="DELETE PORTFOLIO">
        <div className="space-y-4">
          <p className="text-[12px]">Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end pt-2">
            <PixelButton variant="secondary" className="text-xs" onClick={() => setDeleteTarget(null)}>CANCEL</PixelButton>
            <PixelButton className="text-xs bg-destructive border-destructive hover:bg-destructive/90 " onClick={() => deleteTarget && handleDelete(deleteTarget.id)} disabled={deleting}>
              {deleting ? "DELETING…" : "DELETE"}
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  )
}
