// app/api/upload/route.ts
// Records a file that the browser already uploaded to UploadThing, after checking it really exists there.
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { UTApi } from 'uploadthing/server'
import { createClient } from '@/utils/supabase/server'
import { getUserBySupabaseId } from '@/lib/db/helpers'
import { db } from '@/lib/db'
import { uploadedAssets } from '@/lib/db/schema'
import { logActivity, completeChecklistTask } from '@/lib/activity'

export const runtime = 'nodejs'

const input = z.object({
  key: z.string().min(1).max(255),
  url: z.string().url().max(2048),
  name: z.string().max(200).optional(),
  assetType: z.enum(['wallpaper', 'icon', 'music', 'sound', 'image', 'audio']),
  mimeType: z.string().max(100).optional(),
  fileSize: z.number().int().nonnegative().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { data: { user: account } } = await (await createClient()).auth.getUser()
    if (!account) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserBySupabaseId(account.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const parsed = input.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Invalid upload details' }, { status: 400 })
    const { key, url, assetType, mimeType, fileSize } = parsed.data

    // The address must be an UploadThing file address that contains the key, and the key must exist there.
    const address = new URL(url)
    if (!address.hostname.endsWith('.ufs.sh') && address.hostname !== 'utfs.io') {
      return NextResponse.json({ error: 'Invalid file address' }, { status: 400 })
    }
    if (!address.pathname.includes(key)) return NextResponse.json({ error: 'Invalid file address' }, { status: 400 })
    const { data: found } = await new UTApi().getFileUrls(key)
    if (!found?.length) return NextResponse.json({ error: 'File not found' }, { status: 404 })

    const name = (parsed.data.name ?? '').trim() || `asset_${Date.now()}`
    const [asset] = await db
      .insert(uploadedAssets)
      .values({ userId: user.id, assetType, fileId: key, url, fileName: name, mimeType: mimeType ?? null, fileSize: fileSize ?? null })
      .returning()

    await logActivity(user.id, 'UPLOADED', `Uploaded ${assetType}: ${name}`)
    if (assetType === 'wallpaper') await completeChecklistTask(user.id, 'UPLOAD_WALLPAPER')

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        fileId: asset.fileId,
        url: asset.url,
        name,
        type: assetType,
        fileSize: asset.fileSize ?? 0,
        date: asset.uploadedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Upload registration error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
