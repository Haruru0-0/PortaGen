/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'

// Update the type to match your asset system
type AssetType = 'wallpaper' | 'icon' | 'music' | 'sound'

export function useFileUpload() {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)

    const uploadFile = async (
        file: File,
        assetType: AssetType,
        customFileName?: string // Add this parameter
    ) => {
        setUploading(true)
        setError(null)
        setProgress(0)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('assetType', assetType)
            if (customFileName) {
                const nameWithoutExt = customFileName.replace(/\.[^/.]+$/, "")
                formData.append('customFileName', nameWithoutExt)
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Upload failed')
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
            const response = await fetch(`/api/upload/${fileId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Delete failed')
            }

            return { success: true }
        } catch (err: any) {
            setError(err.message)
            return { success: false, error: err.message }
        }
    }

    return { uploadFile, deleteFile, uploading, error, progress }
}