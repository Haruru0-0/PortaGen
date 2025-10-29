/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {useEffect, useState} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useUser } from "@clerk/nextjs"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelCharacter } from "@/components/pixel-character"
import { FileUpload } from "@/components/file-upload"
import {Trash2, Eye, Cloud, CheckCircle, XCircle} from "lucide-react"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import Link from "next/link"
import {useSearchParams} from "next/navigation";
import {useGoogleDrive} from "@/hooks/use-google-drive";

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

export default function SettingsPage() {
  const { user } = useUser()
  const [profile, setProfile] = useState({
    username: user?.username || "PLAYER_ONE",
    email: user?.emailAddresses[0]?.emailAddress || "player@example.com",
    bio: "PIXEL ART ENTHUSIAST",
  })

  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [showDeleteAvatar, setShowDeleteAvatar] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const searchParams = useSearchParams()
  const { connected, loading, connecting, connectDrive, disconnectDrive } = useGoogleDrive()
  const [message, setMessage] = useState('')

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    if (success === 'google_connected') {
      setMessage('Google Drive connected successfully!')
      setTimeout(() => setMessage(''), 5000)
    } else if (error) {
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

  const handleAvatarUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  const handleDeleteAvatar = () => {
    setAvatarPreview("")
    setShowDeleteAvatar(false)
  }

  const handlePasswordChange = async (data: PasswordFormValues) => {
    if (!user) return

    setPasswordLoading(true)
    setPasswordError("")
    setPasswordSuccess(false)

    try {
      // Update password with Clerk
      await user.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

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

  const handleDeleteAccount = async () => {
    if (!user) return

    try {
      await user.delete()
      // User will be redirected automatically by Clerk
    } catch (err: any) {
      console.error("Failed to delete account:", err)
    }
  }

  return (
      <>
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg pixel-text-shadow mb-2">SETTINGS</h2>
              <p className="text-[10px] text-muted-foreground">MANAGE YOUR ACCOUNT</p>
            </div>
            <Link href="/portfolio/preview">
              <PixelButton variant="primary" className="w-full flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                PREVIEW PORTFOLIO
              </PixelButton>
            </Link>
          </div>
          {message && (
              <div className={`p-3 border-2 text-[10px] text-center ${
                  message.includes('Error')
                      ? 'bg-red-500/20 border-red-500 text-red-500'
                      : 'bg-green-500/20 border-green-500 text-green-500'
              }`}>
                {message}
              </div>
          )}
          {/* Profile Settings */}
          <PixelCard>
            <div className="space-y-6">
              <h3 className="text-sm pixel-text-shadow">PROFILE</h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex flex-col items-center gap-3 mx-auto sm:mx-0">
                  {avatarPreview ? (
                      <div className="relative group">
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-24 h-24 border-4 border-border object-cover"
                        />
                        <button
                            onClick={() => setShowDeleteAvatar(true)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-destructive border-2 border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-destructive-foreground" />
                        </button>
                      </div>
                  ) : (
                      <PixelCharacter color="#8B5CF6" size={96} />
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
                  <p className="text-[8px] text-muted-foreground">
                    EMAIL CANNOT BE CHANGED HERE. CONTACT SUPPORT.
                  </p>
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider">BIO</label>
                    <textarea
                        className="w-full px-4 py-3 text-xs bg-input border-4 border-border focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <PixelButton variant="primary" className="w-full sm:w-auto">
                  SAVE CHANGES
                </PixelButton>
              </div>
            </div>
          </PixelCard>

          <PixelCard>
            <div className="space-y-6">
              <h3 className="text-sm pixel-text-shadow">GOOGLE DRIVE INTEGRATION</h3>

              <div className="flex items-center justify-between p-4 border-2 border-border bg-muted">
                <div className="flex items-center gap-3">
                  <Cloud className="w-6 h-6" />
                  <div>
                    <p className="text-[10px] font-bold">GOOGLE DRIVE STATUS</p>
                    <p className="text-[8px] text-muted-foreground">
                      {loading ? 'Checking...' : connected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>

                {!loading && (
                    <div className="flex items-center gap-2">
                      {connected ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <PixelButton
                                variant="secondary"
                                className="text-[10px]"
                                onClick={disconnectDrive}
                            >
                              DISCONNECT
                            </PixelButton>
                          </>
                      ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-500" />
                            <PixelButton
                                variant="primary"
                                className="text-[10px]"
                                onClick={connectDrive}
                                disabled={connecting}
                            >
                              {connecting ? 'CONNECTING...' : 'CONNECT DRIVE'}
                            </PixelButton>
                          </>
                      )}
                    </div>
                )}
              </div>

              <div className="p-3 bg-accent/20 border-2 border-border">
                <p className="text-[10px] leading-relaxed">
                  <strong>WHY CONNECT GOOGLE DRIVE?</strong>
                  <br />
                  • Your files are stored in YOUR Google Drive
                  <br />
                  • You have full control over your assets
                  <br />
                  • No file storage limits from us
                  <br />
                  • Files are automatically backed up
                  <br />
                  • Easy to manage and organize
                </p>
              </div>

              {connected && (
                  <div className="p-3 bg-green-500/10 border-2 border-green-500">
                    <p className="text-[10px] text-green-500">
                      ✓ Your portfolio files will be saved to a &#34;Portfolio Assets&#34; folder in your Google Drive
                    </p>
                  </div>
              )}
            </div>
          </PixelCard>

          {/* Password Settings */}
          <PixelCard>
            <div className="space-y-6">
              <h3 className="text-sm pixel-text-shadow">CHANGE PASSWORD</h3>

              {passwordError && (
                  <div className="p-3 bg-red-500/20 border-2 border-red-500 text-red-500 text-[10px] text-center">
                    {passwordError}
                  </div>
              )}

              {passwordSuccess && (
                  <div className="p-3 bg-green-500/20 border-2 border-green-500 text-green-500 text-[10px] text-center">
                    ✓ PASSWORD UPDATED SUCCESSFULLY
                  </div>
              )}

              <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                <div>
                  <PixelInput
                      label="CURRENT PASSWORD"
                      type="password"
                      placeholder="********"
                      {...passwordForm.register("currentPassword")}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                  )}
                </div>

                <div>
                  <PixelInput
                      label="NEW PASSWORD"
                      type="password"
                      placeholder="********"
                      {...passwordForm.register("newPassword")}
                  />
                  {passwordForm.formState.errors.newPassword && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                  )}
                </div>

                <div>
                  <PixelInput
                      label="CONFIRM NEW PASSWORD"
                      type="password"
                      placeholder="********"
                      {...passwordForm.register("confirmPassword")}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-[10px] mt-1">
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
          <PixelCard className="border-destructive">
            <div className="space-y-4">
              <h3 className="text-sm pixel-text-shadow text-destructive">DANGER ZONE</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                ONCE YOU DELETE YOUR ACCOUNT, THERE IS NO GOING BACK. PLEASE BE CERTAIN.
              </p>
              <PixelButton
                  variant="primary"
                  className="bg-destructive border-destructive w-full sm:w-auto"
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