/** The fields of a stored asset that decide where its file lives. */
export interface AssetLike {
  fileId?: string | null
  url?: string | null
}

/**
 * The public address of an uploaded asset.
 * New uploads live on UploadThing and carry their address in `url`. Assets uploaded before the move to UploadThing
 * only have a Google Drive file id, so they keep resolving to Drive until they are re-uploaded.
 */
export function assetUrl(asset?: AssetLike | null, size?: "thumbnail"): string {
  if (!asset) return ""
  if (asset.url) return asset.url
  if (!asset.fileId) return ""
  return size === "thumbnail"
    ? `https://drive.google.com/thumbnail?id=${asset.fileId}&sz=w300-h300`
    : `https://drive.google.com/uc?id=${asset.fileId}`
}
