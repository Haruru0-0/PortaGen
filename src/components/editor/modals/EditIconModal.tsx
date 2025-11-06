 import { PixelModal } from "@/components/pixel-modal";
import { PixelInput } from "@/components/pixel-input";
import { FileUpload } from "@/components/file-upload";
import { PixelButton } from "@/components/pixel-button";
import { Library } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEditorContext } from "@/contexts/editorContext";
import { Icon, useIconContext } from "@/contexts/iconContext";

interface EditIconModalProps {
  isOpen: boolean;
  icon: Icon | null;
  onClose: () => void;
  onUpdated: (icon?: Icon) => void;
}

export function EditIconModal({ isOpen, icon, onClose, onUpdated }: EditIconModalProps) {
  const { currentPortfolioId, uploadAsset } = useEditorContext()
  const { updateIcon } = useIconContext()
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.string().url('Invalid URL').optional().or(z.literal('')),
    fileId: z.union([z.string(), z.number()]).optional(),
  })
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: '', url: '', fileId: undefined } })
  const [preview, setPreview] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (icon) {
      form.reset({ name: icon.name || "", url: icon.url || "", fileId: icon.iconAssetId })
      setPreview(icon.icon || "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icon])

  const handleUpload = async (file: File) => {
    if (!currentPortfolioId) return
    const { asset } = await uploadAsset(file, "icon", currentPortfolioId)
    form.setValue('fileId', asset.id, { shouldValidate: true })
    setPreview(asset.url)
  }

  const handleUpdate = async () => {
    if (!currentPortfolioId || !icon) return
    setIsSaving(true)
    try {
      const values = form.getValues()
      const updated = await updateIcon({ id: icon.id, ...values, portfolioId: currentPortfolioId })
      onUpdated(updated)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PixelModal isOpen={isOpen} onClose={onClose} title="EDIT ICON">
      <Form {...form}>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdate() }}>
          <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>ICON NAME</FormLabel>
              <FormControl>
                <PixelInput placeholder="ABOUT ME" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <div className="space-y-2">
          <label className="block text-xs uppercase tracking-wider">ICON IMAGE</label>
          {preview && (
            <div className="flex justify-center mb-3">
              <img src={preview} alt="Icon preview" className="w-16 h-16 border-4 border-border object-cover" />
            </div>
          )}
          <FileUpload accept="image/*" onFileSelect={handleUpload} maxSize={1} label={preview ? "REPLACE IMAGE" : "UPLOAD IMAGE"} />
          <PixelButton variant="secondary" className="w-full text-[10px] flex items-center justify-center gap-2" disabled>
            <Library className="w-4 h-4" /> CHOOSE FROM LIBRARY
          </PixelButton>
        </div>
        <FormField name="url" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>LINK URL (OPTIONAL)</FormLabel>
            <FormControl>
              <PixelInput placeholder="https://..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex gap-3 pt-2">
          <PixelButton type="button" variant="secondary" className="flex-1 text-[10px]" onClick={onClose} disabled={isSaving}>
            CANCEL
          </PixelButton>
          <PixelButton type="submit" variant="primary" className="flex-1 text-[10px]" disabled={isSaving}>
            UPDATE
          </PixelButton>
        </div>
        </form>
      </Form>
    </PixelModal>
  )
}
