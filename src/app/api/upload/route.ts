// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { uploadToUserDrive, decryptToken, refreshAccessToken, encryptToken } from '@/lib/services/google-drive'
import { db } from '@/lib/db'
import { users, uploadedAssets } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user from database
        const user = await db.query.users.findFirst({
            where: eq(users.clerkUserId, userId),
        })

        if (!user || !user.googleDriveConnected || !user.googleAccessToken || !user.googleRefreshToken) {
            return NextResponse.json(
                { error: 'Google Drive not connected' },
                { status: 400 }
            )
        }

        const formData = await req.formData()
        const file = formData.get('file') as File
        const assetType = formData.get('assetType') as string
        const portfolioId = formData.get('portfolioId') as string
        const customFileName = formData.get('customFileName') as string

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file size
        const maxSize = assetType === 'audio' ? 50 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large' }, { status: 400 })
        }

        // Handle file naming
        const originalExtension = file.name.split('.').pop() || ''

        // Use custom file name if provided, otherwise use original name without extension
        let finalFileName = customFileName || file.name.replace(/\.[^/.]+$/, "")

        // Add extension if not already present
        if (originalExtension && !finalFileName.endsWith(`.${originalExtension}`)) {
            finalFileName = `${finalFileName}.${originalExtension}`
        }

        // Ensure the name is not empty
        if (!finalFileName.trim()) {
            finalFileName = `asset_${Date.now()}.${originalExtension}`
        }

        // Decrypt tokens
        let accessToken = decryptToken(user.googleAccessToken)
        const refreshToken = decryptToken(user.googleRefreshToken)

        // Check if token needs refresh
        if (user.googleTokenExpiry && new Date() >= user.googleTokenExpiry) {
            const refreshed = await refreshAccessToken(refreshToken)
            accessToken = refreshed.accessToken

            // Update tokens in database
            await db
                .update(users)
                .set({
                    googleAccessToken: encryptToken(accessToken),
                    googleTokenExpiry: refreshed.expiryDate ? new Date(refreshed.expiryDate) : null,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, user.id))
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to user's Google Drive
        const uploadResult = await uploadToUserDrive(
            accessToken,
            refreshToken,
            buffer,
            finalFileName, // Use the final file name here
            file.type
        )

        // Save metadata to database
        const [asset] = await db
            .insert(uploadedAssets)
            .values({
                userId: user.id,
                portfolioId: portfolioId ? parseInt(portfolioId) : null,
                assetType,
                fileId: uploadResult.fileId,
                fileName: finalFileName, // Store the final file name
                fileUrl: uploadResult.fileUrl,
                thumbnailUrl: uploadResult.thumbnailUrl,
                mimeType: file.type,
                fileSize: uploadResult.fileSize,
            })
            .returning()

        return NextResponse.json({
            success: true,
            asset: {
                id: asset.id,
                fileId: uploadResult.fileId,
                name: finalFileName,
                type: assetType,
                fileSize: uploadResult.fileSize,
                date: asset.uploadedAt.toISOString(),
                url: uploadResult.displayUrl,
                thumbnailUrl: uploadResult.thumbnailUrl,
                portfolioId: portfolioId ? parseInt(portfolioId) : null,
            },
        })
    } catch (error: any) {
        console.error('Upload error:', error)

        if (error.message === 'REFRESH_TOKEN_NEEDED') {
            return NextResponse.json(
                { error: 'Please reconnect your Google Drive' },
                { status: 401 }
            )
        }

        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
}