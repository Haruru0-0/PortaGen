"use client"

import Image from "next/image"
import { Check, Download, FileImage, Music, Pencil, Trash2 } from "lucide-react"
import { WorkspacePanel, WorkspaceAction } from "@/components/workspace/workspace-primitives"
import { Asset } from "@/lib/types"

export default function AssetCard(props: {
  onToggle: () => void; selectedAssets: number[]; asset: Asset; assetIcon: string;
  onRename: () => void; fileSize: string; onView: () => void; onDownload: () => void; onDelete: () => void
}) {
  const selected = props.selectedAssets.includes(props.asset.id)
  const audio = props.asset.type === "music" || props.asset.type === "sound"
  return <WorkspacePanel className={`relative min-w-0 space-y-4 ${selected ? "ring-2 ring-[#44e4ff]" : ""}`}>
    <div className="aspect-[4/3] bg-[#0b2358] flex items-center justify-center overflow-hidden relative">
      {props.asset.fileId && !audio ? <Image src={`https://drive.google.com/uc?id=${props.asset.fileId}`} alt={props.asset.name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" /> : audio ? <Music className="size-12 text-[#44e4ff]" /> : <FileImage className="size-12 text-[#44e4ff]" />}
      <button type="button" onClick={props.onToggle} aria-pressed={selected} aria-label={`${selected ? "Deselect" : "Select"} ${props.asset.name}`} className="absolute top-2 left-2 min-w-11 min-h-11 bg-[#061039] border border-[#44e4ff] text-white flex items-center justify-center gap-2 px-2">
        {selected ? <><Check className="size-4" /><span className="text-sm">Selected</span></> : <span className="text-sm">Select</span>}
      </button>
    </div>
    <div><h3 className="font-semibold break-words">{props.asset.name}</h3><p className="mt-1 text-sm text-muted-foreground">{props.asset.type} · {props.fileSize}</p><p className="text-sm text-muted-foreground">{new Date(props.asset.date).toLocaleDateString()}</p></div>
    <div className="flex flex-wrap items-center gap-1">
      <WorkspaceAction variant="secondary" onClick={props.onView}>View</WorkspaceAction>
      <button type="button" className="ws-action ws-action--secondary px-3" aria-label={`Rename ${props.asset.name}`} title="Rename" onClick={props.onRename}><Pencil className="size-4" /></button>
      <button type="button" className="ws-action ws-action--secondary px-3" aria-label={`Download ${props.asset.name}`} title="Download" onClick={props.onDownload}><Download className="size-4" /></button>
      <button type="button" className="ws-action ws-action--secondary px-3 text-[#ffb2c5]" aria-label={`Delete ${props.asset.name}`} title="Delete" onClick={props.onDelete}><Trash2 className="size-4" /></button>
    </div>
  </WorkspacePanel>
}
