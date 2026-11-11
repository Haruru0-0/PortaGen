import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { createClient } from "@/utils/supabase/server"
import { getUserBySupabaseId } from "@/lib/db/helpers"

const f = createUploadthing()

/**
 * Browser-to-UploadThing uploads. The file never passes through our server (so Vercel's request size limit does
 * not apply); this only checks that the person is signed in and sets the size and type limits.
 * The uploaded file is recorded in our database by `POST /api/upload`.
 */
export const uploadRouter = {
  assetUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
    audio: { maxFileSize: "64MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const { data: { user: account } } = await (await createClient()).auth.getUser()
      if (!account) throw new UploadThingError("Please sign in to upload files.")
      const user = await getUserBySupabaseId(account.id)
      if (!user) throw new UploadThingError("Account not found.")
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => ({ userId: metadata.userId, key: file.key, url: file.ufsUrl })),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
