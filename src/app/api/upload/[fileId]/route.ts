// app/api/upload/[fileId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { UTApi } from 'uploadthing/server'
import { and, eq } from 'drizzle-orm'
import { createClient } from '@/utils/supabase/server'
import { getUserBySupabaseId } from '@/lib/db/helpers'
import { db } from '@/lib/db'
import { uploadedAssets } from '@/lib/db/schema'

export const runtime = 'nodejs'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  try {
    const { data: { user: account } } = await (await createClient()).auth.getUser()
    if (!account) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserBySupabaseId(account.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { fileId } = await params
    const asset = await db.query.uploadedAssets.findFirst({
      where: and(eq(uploadedAssets.fileId, fileId), eq(uploadedAssets.userId, user.id)),
    })
    if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 })

    // Files uploaded before the move to UploadThing live in the owner's Google Drive and are not removed from there.
    if (asset.url) await new UTApi().deleteFiles(asset.fileId)
    await db.delete(uploadedAssets).where(eq(uploadedAssets.id, asset.id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
