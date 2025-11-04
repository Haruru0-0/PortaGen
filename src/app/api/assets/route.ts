// app/api/assets/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { uploadedAssets } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserByClerkId(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { searchParams } = new URL(req.url)
        const portfolioId = searchParams.get('portfolioId')

        const assets = await db.query.uploadedAssets.findMany({
            where: portfolioId
                ? and(
                    eq(uploadedAssets.userId, user.id)
                )
                : eq(uploadedAssets.userId, user.id),
            orderBy: (uploadedAssets, { desc }) => [desc(uploadedAssets.uploadedAt)],
        })

        const formattedAssets = assets.map(asset => ({
            id: asset.id,
            fileId: asset.fileId,
            name: asset.fileName,
            type: asset.assetType,
            size: formatFileSize(asset.fileSize || 0),
            fileSize: asset.fileSize || 0,
            date: asset.uploadedAt.toISOString(),
            url: asset.displayUrl,
            thumbnailUrl: asset.thumbnailUrl,
            mimeType: asset.mimeType
        }))

        return NextResponse.json({ assets: formattedAssets })
    } catch (error) {
        console.error('Assets fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserByClerkId(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { searchParams } = new URL(req.url)
        const assetId = searchParams.get('assetId')

        if (!assetId) {
            return NextResponse.json({ error: 'Asset ID required' }, { status: 400 })
        }

        await db
            .delete(uploadedAssets)
            .where(
                and(
                    eq(uploadedAssets.id, parseInt(assetId)),
                    eq(uploadedAssets.userId, user.id)
                )
            )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Asset delete error:', error)
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
    }
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}