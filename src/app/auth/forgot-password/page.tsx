/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import Link from "@/components/workspace/workspace-link"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { useWorkspaceExperience } from "@/components/workspace/workspace-experience-provider"
import { AuthScene } from "@/components/workspace/auth-scene"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"

// Validation schemas
const emailSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
})

const resetSchema = z.object({
  code: z.string().length(6, { message: "CODE MUST BE 6 DIGITS" }),
  password: z
    .string()
    .min(8, { message: "PASSWORD MUST BE 8+ CHARACTERS" })
    .regex(/[a-z]/, { message: "NEEDS LOWERCASE" })
    .regex(/[A-Z]/, { message: "NEEDS UPPERCASE" })
    .regex(/[0-9]/, { message: "NEEDS NUMBER" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "PASSWORDS DO NOT MATCH",
  path: ["confirmPassword"],
})

type EmailFormValues = z.infer<typeof emailSchema>
type ResetFormValues = z.infer<typeof resetSchema>

export default function ForgotPasswordPage() {
  const { cancelPendingTransition } = useWorkspaceExperience()
  const supabase = createClient()
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"email" | "code" | "success">("email")
  const [email, setEmail] = useState("")

  // Handle redirect from reset email link
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('step') === 'code') {
      setStep('code')
    }
  }, [])

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  })

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  })

  // Step 1: Send reset code
  const onEmailSubmit = async (data: EmailFormValues) => {
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/forgot-password?step=code`,
      })
      if (error) throw error

      setEmail(data.email)
      setStep("code")
    } catch (err: any) {
      setError(err.message || "FAILED TO SEND RESET CODE")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Reset password with code
  const onResetSubmit = async (data: ResetFormValues) => {
    setLoading(true)
    setError("")

    try {
      // Check if we already have a session (meaning we came from a recovery link)
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // No session, so we MUST verify the OTP code first
        if (!data.code) throw new Error("RESET CODE IS REQUIRED")

        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token: data.code,
          type: 'recovery'
        })
        if (verifyError) throw verifyError
      }

      // Update password (works for both link-based session and newly verified OTP session)
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password
      })
      if (updateError) throw updateError

      setStep("success")
      // Redirect after 2 seconds
      setTimeout(() => {
        cancelPendingTransition()
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "INVALID CODE OR PASSWORD")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScene artwork="/artwork/eighty-six/reference-set/05-lena-salute.webp" title={step === "success" ? "Password reset" : "Reset your password"} description={step === "email" ? "Get back to your portfolio." : step === "code" ? "Enter your code and new password." : "Your password has been updated."}>
          <div className="space-y-6">
            {/* Header */}


            {/* Error Message */}
            {error && (
              <div role="alert" className="p-3 bg-red-500/20 border border-red-500 text-[#ffb2c5] font-[family-name:var(--font-workspace-body)] text-sm text-center">
                {error}
              </div>
            )}

            {/* Step 1: Email Form */}
            {step === "email" && (
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <div>
                  <PixelInput
                    label="EMAIL"
                    type="email"
                    placeholder="YOU@EXAMPLE.COM"
                    {...emailForm.register("email")}
                  />
                  {emailForm.formState.errors.email && (
                    <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <PixelButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "SENDING..." : "SEND RESET CODE"}
                </PixelButton>
              </form>
            )}

            {/* Step 2: Reset Code & New Password */}
            {step === "code" && (
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <div className="workspace-panel bg-accent/20 p-3">
                  <p className="text-sm leading-relaxed text-center uppercase">
                    Check your email for a reset link or enter the 6-digit code below with your new password.
                  </p>
                </div>

                <div>
                  <PixelInput
                    label="RESET CODE (IF SENT)"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    {...resetForm.register("code")}
                  />
                  {resetForm.formState.errors.code && (
                    <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                      {resetForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <div>
                  <PixelInput
                    label="NEW PASSWORD"
                    type="password"
                    placeholder="********"
                    {...resetForm.register("password")}
                  />
                  {resetForm.formState.errors.password && (
                    <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                      {resetForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <PixelInput
                    label="CONFIRM PASSWORD"
                    type="password"
                    placeholder="********"
                    {...resetForm.register("confirmPassword")}
                  />
                  {resetForm.formState.errors.confirmPassword && (
                    <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <PixelButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "RESETTING..." : "RESET WITH CODE"}
                </PixelButton>

                <div className="text-center">
                  <p className="font-[family-name:var(--font-workspace-body)] text-sm text-[#bdd3f3]">
                    IF YOU RECEIVED A LINK, CLICK IT TO SET YOUR NEW PASSWORD.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-sm text-[#bdd3f3] hover:text-[#44e4ff]"
                >
                  ← BACK
                </button>
              </form>
            )}

            {/* Step 3: Success */}
            {step === "success" && (
              <div className="space-y-4">
                <div className="workspace-panel bg-green-500/20 border border-green-500 p-4">
                  <p className="font-[family-name:var(--font-workspace-body)] text-sm leading-relaxed text-center text-[#83efbd]">
                    ✓ PASSWORD RESET SUCCESSFUL
                    <br />
                    REDIRECTING TO LOGIN...
                  </p>
                </div>

                <PixelButton asChild variant="primary" className="w-full">
                  <Link href="/auth/login">Go to login</Link>
                </PixelButton>
              </div>
            )}

            {/* Back to Login */}
            {step !== "success" && (
              <p className="font-[family-name:var(--font-workspace-body)] text-center text-sm text-[#bdd3f3]">
                <Link href="/auth/login" className="text-[#44e4ff] hover:underline">
                  ← BACK TO LOGIN
                </Link>
              </p>
            )}
          </div>
        </AuthScene>
  )
}
