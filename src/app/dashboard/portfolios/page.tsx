"use client"
import React, {useEffect, useRef, useState} from "react"
import { useRouter } from "next/navigation"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { fetchPortfolios as fetchPortfoliosAPI, createPortfolio, deletePortfolio } from "@/lib/services/portfolioService"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { PixelCharacter } from "@/components/pixel-character"
import LoadingDanceGif from "@/assets/LoadingDance.gif";
import Image from "next/image";

export default function PortfoliosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Array<{ id: number; portfolioName: string; slug: string; isPublished: boolean; createdAt: string }>>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState("MY PORTFOLIO")
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const loadingImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPortfoliosAPI()
      setItems(data?.portfolios || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    const created = await createPortfolio(newName?.trim() || "MY PORTFOLIO")
    setCreating(false)
    if (created?.id) {
      setItems((prev) => [{ id: created.id, portfolioName: created.portfolioName, slug: created.slug, isPublished: false, createdAt: new Date().toISOString() }, ...prev])
      setIsCreateOpen(false)
      setNewName("MY PORTFOLIO")
    }
  }

  const handleDelete = async (id: number) => {
    setDeleting(true)
    const ok = await deletePortfolio(id)
    setDeleting(false)
    if (ok) {
      setItems((prev) => prev.filter((p) => p.id !== id))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold">Your Portfolios</h1>
        <PixelButton className="text-[10px]" onClick={() => setIsCreateOpen(true)}>NEW PORTFOLIO</PixelButton>
      </div>
      {loading ? (
        <PixelCard>
          <div className="flex justify-center items-center">
            <Image
              ref={loadingImageRef}
              src={LoadingDanceGif}
              alt="Cute greeting"
              className="mb-2 animate-float"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
          />
          </div>
        </PixelCard>
      ) : items.length === 0 ? (
        <PixelCard>
          <div className="text-[12px]">No portfolios yet. Create your first one.</div>
        </PixelCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
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
                <p className="text-[10px] text-muted-foreground truncate">{p.slug}</p>
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
          <label className="block text-[10px] uppercase tracking-wider">Portfolio Name</label>
          <PixelInput value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="MY PORTFOLIO" />
          <div className="flex gap-2 justify-end pt-2">
            <PixelButton variant="secondary" className="text-[10px]" onClick={() => setIsCreateOpen(false)}>CANCEL</PixelButton>
            <PixelButton className="text-[10px]" onClick={handleCreate} disabled={creating}>{creating ? "CREATING…" : "CREATE"}</PixelButton>
          </div>
        </div>
      </PixelModal>

      <PixelModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="DELETE PORTFOLIO">
        <div className="space-y-4">
          <p className="text-[12px]">Are you sure you want to delete “{deleteTarget?.name}”? This action cannot be undone.</p>
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
