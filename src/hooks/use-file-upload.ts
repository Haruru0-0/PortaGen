/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useUploadThing } from '@/lib/uploadthing'

type AssetType = 'wallpaper' | 'icon' | 'music' | 'sound'

export interface UploadedAsset {
    id: number
    fileId: string
    url: string
    name: string
    type: AssetType
    fileSize: number
    date: string
}

export function useFileUpload() {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const { startUpload } = useUploadThing('assetUploader', {
        onUploadProgress: (value) => setProgress(value),
    })

    const uploadFile = async (
        file: File,
        assetType: AssetType,
        customFileName?: string
    ): Promise<{ success: boolean; data?: UploadedAsset; error?: string }> => {
        setUploading(true)
        setError(null)
        setProgress(0)

        try {
            // Same limits as before: 50MB for audio, 10MB for images.
            const isAudio = assetType === 'music' || assetType === 'sound'
            const maxSize = isAudio ? 50 * 1024 * 1024 : 10 * 1024 * 1024
            if (file.size > maxSize) throw new Error('File too large')

            const originalName = file.name.replace(/\.[^/.]+$/, '')
            const baseName = (customFileName ? customFileName.replace(/\.[^/.]+$/, '') : originalName).trim() || `asset_${Date.now()}`
            const extension = file.name.includes('.') ? file.name.split('.').pop() : ''
            const named = new File([file], extension ? `${baseName}.${extension}` : baseName, { type: file.type })

            // The file goes straight from the browser to UploadThing; our server only records it afterwards.
            const uploaded = await startUpload([named])
            const result = uploaded?.[0]
            if (!result) throw new Error('Upload failed')

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: result.key,
                    url: result.ufsUrl,
                    name: baseName,
                    assetType,
                    mimeType: file.type || undefined,
                    fileSize: file.size,
                }),
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.error || 'Upload failed')
            }

            const data = await response.json()
            setProgress(100)
            return { success: true, data: data.asset }
        } catch (err: any) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setUploading(false)
        }
    }

    const deleteFile = async (fileId: string) => {
        try {
            const response = await fetch(`/api/upload/${fileId}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Delete failed')
            return { success: true }
        } catch (err: any) {
            setError(err.message)
            return { success: false, error: err.message }
        }
    }

    return { uploadFile, deleteFile, uploading, error, progress }
}
