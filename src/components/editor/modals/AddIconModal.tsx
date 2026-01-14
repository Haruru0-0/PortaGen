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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParams } from "next/navigation";
import { useFileUpload } from "@/hooks/use-file-upload";
import Image from "next/image";
import { AssetPicker } from "@/components/common/asset-picker";
import { Asset } from "@/lib/types";

interface AddIconModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (icon?: { id: number; name: string; icon: Asset | null; url?: string; linkType?: 'window' | 'url' }) => void;
}

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    linkType: z.enum(["window", "url"]).default("window"),
    url: z.string().url("Invalid URL").optional().or(z.literal("")),
    fileId: z.union([z.string(), z.number()]).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.linkType === "url" && !val.url) {
      ctx.addIssue({ path: ["url"], code: z.ZodIssueCode.custom, message: "Enter a URL" })
    }
  })

export function AddIconModal({ isOpen, onClose, onCreated }: AddIconModalProps) {
  const { addIcon, loading } = useIconContext()
  const form = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", linkType: "window", url: "", fileId: undefined },
  })
  const [preview, setPreview] = useState<string>("")
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)

  const { uploadFile, uploading } = useFileUpload()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [assetPickerOpen, setAssetPickerOpen] = useState(false)

  const handleUpload = (file: File) => {
    setSelectedFile(file)
    try {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    } catch {
      // ignore preview error
    }
  }

  const onSubmit = async (values: z.input<typeof schema>) => {
    if (!currentPortfolioId) return
    let payload: z.input<typeof schema> = { ...values }
    if (selectedFile && !payload.fileId) {
      const customName = (values.name || selectedFile.name.replace(/\.[^/.]+$/, "")).trim()
      const res = await uploadFile(selectedFile, "icon", customName)
      if (!res?.success || !res.data?.id) {
        alert(res?.error || "Upload failed")
        return
      }
      payload = { ...payload, fileId: res.data.id }
      if (res.data.fileId) setPreview(`https://drive.google.com/uc?id=${res.data.fileId}`)
    }
    const created = await addIcon(currentPortfolioId, {
      name: payload.name,
      fileId: payload.fileId,
      linkType: payload.linkType ?? 'window',
      url: payload.linkType === "url" ? payload.url : "",
    })
    onCreated(created)
    form.reset({ name: "", linkType: "window", url: "", fileId: undefined })
    setPreview("")
    setSelectedFile(null)
  }

  const handleAssetSelect = async (asset: Asset) => {
    form.setValue("fileId", asset.id)
    setPreview(`https://drive.google.com/thumbnail?id=${asset.fileId}` || `https://drive.google.com/uc?id=${asset.fileId}`)
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
                <Image src={preview} width={64} height={64} alt="Icon preview" className="border-4 border-border object-cover" />
              </div>
            )}
            <FileUpload accept="image/*" onFileSelect={handleUpload} maxSize={1} label={preview && "REPLACE IMAGE"} />
            <PixelButton
              variant="secondary"
              className="w-full text-[10px] flex items-center justify-center gap-2"
              onClick={() => setAssetPickerOpen(true)}
              type="button"
            >
              <Library className="w-4 h-4" /> CHOOSE FROM LIBRARY
            </PixelButton>
          </div>
          <FormField name="linkType" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>LINK TYPE</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-2 gap-2 p-2 border-2 border-border bg-card"
                >
                  <label className="flex items-center gap-2 px-2 py-1 text-[10px] border-2 border-border bg-muted cursor-pointer">
                    <RadioGroupItem value="window" className="border-2 border-border" />
                    Link to Window
                  </label>
                  <label className="flex items-center gap-2 px-2 py-1 text-[10px] border-2 border-border bg-muted cursor-pointer">
                    <RadioGroupItem value="url" className="border-2 border-border" />
                    Link to URL
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          {form.watch('linkType') === 'url' && (
            <FormField name="url" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>LINK URL</FormLabel>
                <FormControl>
                  <PixelInput placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

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
      <AssetPicker
        isOpen={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        onSelect={handleAssetSelect}
        type="image"
      />
    </PixelModal>
  )
}
