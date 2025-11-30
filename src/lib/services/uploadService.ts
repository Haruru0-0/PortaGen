import { Asset } from "@/lib/types"

export const uploadFile = async (file: File, portfolioId: number): Promise<Asset | null> => {
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('portfolioId', portfolioId.toString())

        // Determine asset type based on file type
        let assetType = 'other'
        if (file.type.startsWith('image/')) assetType = 'image'
        else if (file.type.startsWith('audio/')) assetType = 'audio'
        else if (file.type.startsWith('video/')) assetType = 'video'

        formData.append('assetType', assetType)

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Upload failed')
        }

        const data = await response.json()
        return data.asset
    } catch (error) {
        console.error('Error uploading file:', error)
        return null
    }
}
