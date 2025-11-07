import { PixelModal } from "@/components/pixel-modal";
import { PixelInput } from "@/components/pixel-input";
import { FileUpload } from "@/components/file-upload";
import { PixelButton } from "@/components/pixel-button";
import { Library } from "lucide-react";
import { useState } from "react";
import { useIconContext } from "@/contexts/iconContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useParams } from "next/navigation";
import { useFileUpload } from "@/hooks/use-file-upload";

interface AddIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (icon?: { id: number; name: string; icon: string; url?: string }) => void;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  fileId: z.union([z.string(), z.number()]).optional(),
})

export function AddIconModal({ isOpen, onClose, onCreated }: AddIconModalProps) {
  const { addIcon, loading } = useIconContext()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "", url: "", fileId: undefined } })
  const [preview, setPreview] = useState<string>("")
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)

  const { uploadFile, uploading } = useFileUpload()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = (file: File) => {
    setSelectedFile(file)
    try {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    } catch {
      // fallback: keep previous preview
    }
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!currentPortfolioId) return
    let payload: z.infer<typeof schema> = { ...values }
    // If a local file is selected and no fileId yet, upload it using the icon name
    if (selectedFile && !payload.fileId) {
      const customName = (values.name || selectedFile.name.replace(/\.[^/.]+$/, "")).trim()
      const res = await uploadFile(selectedFile, "icon", customName)
      if (!res?.success || !res.data?.id) {
        alert(res?.error || "Upload failed")
        return
      }
      payload = { ...payload, fileId: res.data.id }
      // Use uploaded URL as preview (keeps in sync after creation)
      if (res.data.url) setPreview(res.data.url)
    }
    const created = await addIcon(currentPortfolioId, payload)
    onCreated(created)
    form.reset({ name: "", url: "", fileId: undefined })
    setPreview("")
    setSelectedFile(null)
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
            <PixelButton type="button" variant="secondary" className="flex-1 text-[10px]" onClick={onClose} disabled={loading || uploading}>
              CANCEL
            </PixelButton>
            <PixelButton type="submit" variant="primary" className="flex-1 text-[10px]" disabled={loading || uploading}>
              {loading || uploading ? "ADDING..." : "ADD"}
            </PixelButton>
          </div>
        </form>
      </Form>

    </PixelModal>
  )
}
