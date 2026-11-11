/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, Suspense } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/utils/supabase/client"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { WorkspacePanel as PixelCard } from "@/components/workspace/workspace-primitives"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { UserRound } from "lucide-react"
import { MotionPreferenceControl } from "@/components/workspace/motion-preference-control"
import { FileUpload } from "@/components/file-upload"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useSearchParams } from "next/navigation";

// Password validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "CURRENT PASSWORD REQUIRED" }),
  newPassword: z
    .string()
    .min(8, { message: "PASSWORD MUST BE 8+ CHARACTERS" })
    .regex(/[a-z]/, { message: "NEEDS LOWERCASE" })
    .regex(/[A-Z]/, { message: "NEEDS UPPERCASE" })
    .regex(/[0-9]/, { message: "NEEDS NUMBER" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "PASSWORDS DO NOT MATCH",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

function SettingsContent() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Fetch profile from our DB
        try {
          const res = await fetch('/api/user/profile')
          if (res.ok) {
            const data = await res.json()
            setProfile({
              username: data.username || user.user_metadata?.username || user.email?.split('@')[0] || "",
              email: data.email || user.email || "",
              bio: "PIXEL ART ENTHUSIAST", // We can refine this later if needed
            })
          }
        } catch (e) {
          console.error("Failed to fetch profile:", e)
        }
      }
    }
    fetchUser()
  }, [])

  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [showDeleteAvatar, setShowDeleteAvatar] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('')

  useEffect(() => {
    const error = searchParams.get('error')

    if (error) {
      setMessage(`Error: ${error}`)
      setTimeout(() => setMessage(''), 5000)
    }
  }, [searchParams])

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleAvatarUpload = async (file: File) => {
    if (!user) return
    setMessage('UPLOADING AVATAR...')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      // Update profile in DB
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: publicUrl }),
      })

      if (res.ok) {
        setAvatarPreview(publicUrl)
        window.dispatchEvent(new Event('profile-updated'))
        setMessage('AVATAR UPDATED')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('FAILED TO SYNC AVATAR TO PROFILE')
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      setMessage(`UPLOAD FAILED: ${err.message}`)
    }
  }

  const handleDeleteAvatar = async () => {
    if (!user || !avatarPreview) return

    try {
      // Logic for deleting from storage would go here if we tracked the path
      // For now, just clear from profile record
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: null }),
      })

      if (res.ok) {
        setAvatarPreview("")
        setShowDeleteAvatar(false)
        window.dispatchEvent(new Event('profile-updated'))
        setMessage('AVATAR REMOVED')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handlePasswordChange = async (data: PasswordFormValues) => {
    if (!user) return

    setPasswordLoading(true)
    setPasswordError("")
    setPasswordSuccess(false)

    try {
      // Update password with Supabase
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      })
      if (error) throw error

      setPasswordSuccess(true)
      passwordForm.reset()

      // Hide success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: any) {
      setPasswordError(
        err.errors?.[0]?.message ||
        "FAILED TO UPDATE PASSWORD. CHECK YOUR CURRENT PASSWORD."
      )
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    setMessage('')
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profile.username }),
      })
      if (res.ok) {
        window.dispatchEvent(new Event('profile-updated'))
        setMessage('PROFILE UPDATED SUCCESSFULLY')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await res.json()
        setMessage(`ERROR: ${error.error || 'FAILED TO UPDATE PROFILE'}`)
      }
    } catch (e) {
      console.error("Failed to update profile:", e)
      setMessage('ERROR: CONNECTION FAILED')
    }
  }

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("ARE YOU ABSOLUTELY SURE? THIS WILL PERMANENTLY DELETE YOUR ACCOUNT.")
    if (!confirm) return

    try {
      const res = await fetch('/api/auth/delete-account', { method: 'POST' })
      if (res.ok) {
        await supabase.auth.signOut()
        window.location.href = '/'
      }
    } catch (err: any) {
      console.error("Failed to delete account:", err)
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="persona-page-title" data-page-heading>Settings</h1>
            <p className="font-[family-name:var(--font-workspace-body)] text-sm text-muted-foreground">MANAGE YOUR ACCOUNT</p>
          </div>
        </div>
        {message && (
          <div className={`p-3 border font-[family-name:var(--font-workspace-body)] text-sm text-center ${/error|failed/i.test(message)
            ? 'bg-red-500/20 border-red-700 text-[#ffb2c5]'
            : 'bg-green-500/20 border-green-500 text-[#83efbd]'
            }`}>
            {message}
          </div>
        )}
        <PixelCard><h2 className="text-xl font-semibold mb-4">Appearance</h2><MotionPreferenceControl /></PixelCard>
        {/* Profile Settings */}
        <PixelCard>
          <div className="space-y-6">
            <h3 className="text-sm ">PROFILE</h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex flex-col items-center gap-3 mx-auto sm:mx-0">
                {avatarPreview ? (
                  <div className="relative group">
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-24 h-24 border border-border object-cover"
                    />
                    <button
                      aria-label="Delete avatar" onClick={() => setShowDeleteAvatar(true)}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-destructive border border-border flex items-center justify-center opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-destructive-foreground" />
                    </button>
                  </div>
                ) : (
                  <div className="size-24 flex items-center justify-center bg-[#0b2358]"><UserRound className="size-12 text-[#44e4ff]" /></div>
                )}
                <div className="w-full">
                  <FileUpload
                    accept="image/*"
                    onFileSelect={handleAvatarUpload}
                    maxSize={2}
                    label={avatarPreview ? "REPLACE" : "UPLOAD"}
                  />
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                <PixelInput
                  label="USERNAME"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
                <PixelInput
                  label="EMAIL"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled
                />
                <p className="font-[family-name:var(--font-workspace-body)] text-sm text-muted-foreground">
                  Your email cannot be changed here.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <PixelButton variant="primary" className="w-full sm:w-auto" onClick={handleProfileUpdate}>
                SAVE CHANGES
              </PixelButton>
            </div>
          </div>
        </PixelCard>

        {/* Password Settings */}
        <PixelCard>
          <div className="space-y-6">
            <h3 className="text-sm ">CHANGE PASSWORD</h3>

            {passwordError && (
              <div role="alert" className="p-3 bg-red-500/20 border border-red-700 text-[#ffb2c5] font-[family-name:var(--font-workspace-body)] text-sm text-center">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-green-500/20 border border-green-500 text-[#83efbd] font-[family-name:var(--font-workspace-body)] text-sm text-center">
                ✓ PASSWORD UPDATED SUCCESSFULLY
              </div>
            )}

            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
              <div>
                <PixelInput
                  label="CURRENT PASSWORD"
                  type="password"
                  autoComplete="current-password"
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <PixelInput
                  label="NEW PASSWORD"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <PixelInput
                  label="CONFIRM NEW PASSWORD"
                  type="password"
                  autoComplete="new-password"
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <PixelButton
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "UPDATING..." : "UPDATE PASSWORD"}
                </PixelButton>
              </div>
            </form>
          </div>
        </PixelCard>

        {/* Danger Zone */}
        <PixelCard className="border-red-700">
          <div className="space-y-4">
            <h3 className="text-sm  text-[#ffb2c5]">DANGER ZONE</h3>
            <p className="font-[family-name:var(--font-workspace-body)] text-sm text-muted-foreground leading-relaxed">
              ONCE YOU DELETE YOUR ACCOUNT, THERE IS NO GOING BACK. PLEASE BE CERTAIN.
            </p>
            <PixelButton
              variant="primary"
              className="bg-red-700 border-red-700 text-white w-full sm:w-auto"
              onClick={() => setShowDeleteAccount(true)}
            >
              DELETE ACCOUNT
            </PixelButton>
          </div>
        </PixelCard>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteAvatar}
        onClose={() => setShowDeleteAvatar(false)}
        onConfirm={handleDeleteAvatar}
        title="DELETE AVATAR"
        message="ARE YOU SURE YOU WANT TO DELETE YOUR AVATAR?"
      />

      <DeleteConfirmationModal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={handleDeleteAccount}
        title="DELETE ACCOUNT"
        message="THIS ACTION CANNOT BE UNDONE. ALL YOUR DATA WILL BE PERMANENTLY DELETED."
      />
    </>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="font-[family-name:var(--font-workspace-body)] text-sm animate-pulse">LOADING SETTINGS...</div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
