"use client"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { PixelCharacter } from "@/components/pixel-character"
import { usePortfolioContext } from "@/contexts/portfolioContext"
import LoadingDanceGif from "@/assets/LoadingDance.gif";
import Image from "next/image";

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
  const loadingImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    fetchList()
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
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold">Your Portfolios</h1>
        <PixelButton className="text-[10px]" onClick={() => setIsCreateOpen(true)}>NEW PORTFOLIO</PixelButton>
      </div>
      {loadingList ? (
        <PixelCard>
          <div className="flex justify-center items-center">
            <Image
              ref={loadingImageRef}
              src={LoadingDanceGif}
              alt="Loading"
              className="mb-2 animate-float"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        </PixelCard>
      ) : portfolios.length === 0 ? (
        <PixelCard>
          <div className="text-[12px]">No portfolios yet. Create your first one.</div>
        </PixelCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolios.map((p) => (
            <PixelCard key={p.id} className="flex flex-col gap-4 example-card">
              <div className="aspect-video bg-gradient-to-br from-[#87CEEB] to-[#E0BBE4] p-3 relative">
                <div className="absolute top-2 left-2">
                  <PixelCharacter color="#8B5CF6" size={20} />
                </div>
                <div className="absolute bottom-2 right-2 text-[8px] text-white pixel-text-shadow">
                  ID {p.id}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm pixel-text-shadow truncate">{p.portfolioName}</h3>
                <p className="text-[10px] pixel-text-shadow truncate">{p.bio}</p>
              </div>
              <div className="mt-auto flex gap-2">
                <PixelButton variant="secondary" className="text-[10px] flex-1" onClick={() => router.push(`/dashboard/editor/${p.id}`)}>EDIT</PixelButton>
                <PixelButton className="text-[10px] flex-1" onClick={() => setDeleteTarget({ id: p.id, name: p.portfolioName })}>DELETE</PixelButton>
              </div>
            </PixelCard>
          ))}
        </div>
      )}

      <PixelModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="NEW PORTFOLIO">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider mb-1">Portfolio Name</label>
            <PixelInput value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="MY PORTFOLIO" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider mb-1">Bio</label>
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder="A short description of your portfolio..."
              className="w-full px-4 py-3 text-xs bg-input border-4 border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <PixelButton variant="secondary" className="text-[10px]" onClick={() => setIsCreateOpen(false)}>CANCEL</PixelButton>
            <PixelButton className="text-[10px]" onClick={handleCreate} disabled={creating}>{creating ? "CREATING…" : "CREATE"}</PixelButton>
          </div>
        </div>
      </PixelModal>

      <PixelModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="DELETE PORTFOLIO">
        <div className="space-y-4">
          <p className="text-[12px]">Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end pt-2">
            <PixelButton variant="secondary" className="text-[10px]" onClick={() => setDeleteTarget(null)}>CANCEL</PixelButton>
            <PixelButton className="text-[10px] bg-destructive border-destructive hover:bg-destructive/90 " onClick={() => deleteTarget && handleDelete(deleteTarget.id)} disabled={deleting}>
              {deleting ? "DELETING…" : "DELETE"}
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </div>
  )
}
