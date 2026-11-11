import { eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { desktopSettings, icons, lockScreenSettings, portfolios } from '@/lib/db/schema'

/**
 * Where each of a user's assets is in use right now, as readable text such as
 * "My Portfolio (lock screen wallpaper)". Keyed by asset id.
 */
export async function getAssetUsage(userId: number): Promise<Map<number, string[]>> {
  const owned = await db.select({ id: portfolios.id, name: portfolios.portfolioName }).from(portfolios).where(eq(portfolios.userId, userId))
  const usage = new Map<number, string[]>()
  if (!owned.length) return usage
  const names = new Map(owned.map(p => [p.id, p.name]))
  const ids = owned.map(p => p.id)

  const note = (assetId: number | null, portfolioId: number, slot: string) => {
    if (assetId == null) return
    const name = names.get(portfolioId)
    if (!name) return
    const list = usage.get(assetId) ?? []
    const entry = `${name} (${slot})`
    if (!list.includes(entry)) list.push(entry)
    usage.set(assetId, list)
  }

  const [desktops, locks, iconRows] = await Promise.all([
    db.select().from(desktopSettings).where(inArray(desktopSettings.portfolioId, ids)),
    db.select().from(lockScreenSettings).where(inArray(lockScreenSettings.portfolioId, ids)),
    db.select({ portfolioId: icons.portfolioId, assetId: icons.iconAssetId, name: icons.name }).from(icons).where(inArray(icons.portfolioId, ids)),
  ])
  for (const d of desktops) {
    note(d.wallpaperAssetId, d.portfolioId, 'desktop wallpaper')
    note(d.mobileWallpaperAssetId, d.portfolioId, 'mobile wallpaper')
    note(d.desktopGifAssetId, d.portfolioId, 'desktop GIF')
    note(d.widget1AssetId, d.portfolioId, 'mobile widget 1')
    note(d.widget2AssetId, d.portfolioId, 'mobile widget 2')
    note(d.musicPlayerIconAssetId, d.portfolioId, 'music player icon')
    note(d.menubarIconAssetId, d.portfolioId, 'menu bar icon')
  }
  for (const l of locks) {
    note(l.wallpaperAssetId, l.portfolioId, 'lock screen wallpaper')
    note(l.mobileWallpaperAssetId, l.portfolioId, 'mobile lock screen wallpaper')
  }
  for (const i of iconRows) note(i.assetId, i.portfolioId, `icon "${i.name}"`)
  return usage
}
