import { PixelModal } from "@/components/pixel-modal";
import { PixelInput } from "@/components/pixel-input";
import { FileUpload } from "@/components/file-upload";
import { PixelButton } from "@/components/pixel-button";
import { Library } from "lucide-react";
import { useState } from "react";
import { useEditorContext } from "@/contexts/editorContext";
import { useIconContext } from "@/contexts/iconContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (icon?: { id: number; name: string; icon: string; url?: string }) => void;
}

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  fileId: z.union([z.string(), z.number()]).optional(),
})

export function AddIconModal({ isOpen, onClose, onCreated }: AddIconModalProps) {
  const { currentPortfolioId, uploadAsset } = useEditorContext()
  const { addIcon } = useIconContext()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: '', url: '', fileId: undefined } })
  const [preview, setPreview] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const handleUpload = async (file: File) => {
    if (!currentPortfolioId) return
    const { asset } = await uploadAsset(file, "icon", currentPortfolioId)
    form.setValue('fileId', asset.id, { shouldValidate: true })
    setPreview(asset.url)
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!currentPortfolioId) return
    setIsSaving(true)
    try {
      const created = await addIcon({ ...values, portfolioId: currentPortfolioId })
      onCreated(created)
      form.reset({ name: '', url: '', fileId: undefined })
      setPreview("")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PixelModal isOpen={isOpen} onClose={onClose} title="ADD ICON">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              ADD
            </PixelButton>
          </div>
        </form>
      </Form>
    </PixelModal>
  )
}
