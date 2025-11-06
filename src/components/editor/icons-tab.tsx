import React, {useEffect} from "react"
import {PixelCard} from "@/components/pixel-card"
import {PixelButton} from "@/components/pixel-button"
import {Edit2, Plus, Trash2} from "lucide-react"
import Placeholder from "@/assets/Placeholder.png"
import Image from "next/image";
import {Icon, useIconContext} from "@/contexts/iconContext";
import {useEditorContext} from "@/contexts/editorContext";
import {DeleteConfirmationModal} from "@/components/delete-confirmation-modal";
import {AddIconModal} from "@/components/editor/modals/AddIconModal";
import {EditIconModal} from "@/components/editor/modals/EditIconModal";

export function IconsTab() {
    const {icons = [], deleteIcon, setIcons, getAllIcons} = useIconContext()
    const {currentPortfolioId} = useEditorContext()

    useEffect(() => {
        if (currentPortfolioId) {
            void getAllIcons()
        }
    }, [currentPortfolioId])

    const [openAdd, setOpenAdd] = React.useState(false)
    const [openEdit, setOpenEdit] = React.useState(false)
    const [editingIcon, setEditingIcon] = React.useState<Icon | null>(null)
    const [deleteTarget, setDeleteTarget] = React.useState<number | null>(null)

    const handleAdd = () => {
        setOpenAdd(true)
    }
    const handleEdit = (icon: Icon) => {
        setEditingIcon(icon)
        setOpenEdit(true)
    }
    const handleDelete = (id: number) => setDeleteTarget(id)

    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm pixel-text-shadow">DESKTOP ICONS</h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {(icons || []).map((icon: Icon) => (
                        <div
                            key={icon.id}
                            className="flex items-center justify-between p-3 border-2 border-border bg-muted hover:bg-accent transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={icon.icon || Placeholder}
                                    alt={icon.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 object-cover border-2 border-border"
                                />
                                <span className="text-[10px]">{icon.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(icon)}
                                    className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                                >
                                    <Edit2 className="w-3 h-3"/>
                                </button>
                                <button
                                    onClick={() => handleDelete(icon.id)}
                                    className="w-8 h-8 border-2 border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                                >
                                    <Trash2 className="w-3 h-3"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <PixelButton
                    variant="secondary"
                    className="w-full text-[10px] flex items-center justify-center gap-2"
                    onClick={handleAdd}
                >
                    <Plus className="w-4 h-4"/>
                    ADD ICON
                </PixelButton>
            </div>

            {/* Modals */}
            <AddIconModal
                isOpen={openAdd}
                onClose={() => setOpenAdd(false)}
                onCreated={(created?: Icon) => {
                    if (created) setIcons([...(icons as Icon[]), created])
                    setOpenAdd(false)
                }}
            />
            <EditIconModal
                isOpen={openEdit}
                icon={editingIcon}
                onClose={() => {
                    setOpenEdit(false);
                    setEditingIcon(null)
                }}
                onUpdated={(updated?: Icon) => {
                    if (updated) setIcons((icons as Icon[]).map((i: Icon) => (i.id === updated.id ? updated : i)))
                    setOpenEdit(false)
                    setEditingIcon(null)
                }}
            />
            <DeleteConfirmationModal
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                title="DELETE ICON"
                message="ARE YOU SURE YOU WANT TO DELETE THIS ICON?"
                onConfirm={async () => {
                    if (deleteTarget) {
                        const ok = await deleteIcon(deleteTarget)
                        if (ok) setIcons((icons as Icon[]).filter((i: Icon) => i.id !== deleteTarget))
                        setDeleteTarget(null)
                    }
                }}
            />
        </PixelCard>
    )
}
