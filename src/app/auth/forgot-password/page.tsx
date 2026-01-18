/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelClouds } from "@/components/pixel-clouds"
import { PixelCharacter } from "@/components/pixel-character"

// Validation schemas
const emailSchema = z.object({
  email: z.string().email({ message: "INVALID EMAIL FORMAT" }),
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
        router.push("/auth/login")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "INVALID CODE OR PASSWORD")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <PixelClouds />

      {/* Pixel cityscape background */}
      <div className="fixed bottom-0 left-0 right-0 h-48 z-0">
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#8B5CF6] to-[#EC4899]" />
        <div className="absolute bottom-0 w-full flex justify-around items-end">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="bg-[#6D28D9]"
              style={{
                width: "40px",
                height: `${Math.random() * 60 + 40}px`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <PixelCard>
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <PixelCharacter color="#FBBF24" size={60} />
              </div>
              <h1 className="text-lg pixel-text-shadow">
                {step === "email" && "FORGOT PASSWORD?"}
                {step === "code" && "RESET PASSWORD"}
                {step === "success" && "SUCCESS!"}
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step === "email" && "ENTER YOUR EMAIL TO RESET"}
                {step === "code" && "ENTER CODE AND NEW PASSWORD"}
                {step === "success" && "PASSWORD RESET COMPLETE"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border-2 border-red-500 text-red-500 text-[10px] text-center">
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
                    <p className="text-red-500 text-[10px] mt-1">
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
                <div className="pixel-card bg-accent/20 p-3">
                  <p className="text-[10px] leading-relaxed text-center uppercase">
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
                    <p className="text-red-500 text-[10px] mt-1">
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
                    <p className="text-red-500 text-[10px] mt-1">
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
                    <p className="text-red-500 text-[10px] mt-1">
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
                  <p className="text-[10px] text-muted-foreground">
                    IF YOU RECEIVED A LINK, CLICK IT TO SET YOUR NEW PASSWORD.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-[10px] text-muted-foreground hover:text-primary"
                >
                  ← BACK
                </button>
              </form>
            )}

            {/* Step 3: Success */}
            {step === "success" && (
              <div className="space-y-4">
                <div className="pixel-card bg-green-500/20 border-2 border-green-500 p-4">
                  <p className="text-[10px] leading-relaxed text-center text-green-500">
                    ✓ PASSWORD RESET SUCCESSFUL
                    <br />
                    REDIRECTING TO LOGIN...
                  </p>
                </div>

                <Link href="/auth/login">
                  <PixelButton variant="primary" className="w-full">
                    GO TO LOGIN
                  </PixelButton>
                </Link>
              </div>
            )}

            {/* Back to Login */}
            {step !== "success" && (
              <p className="text-center text-[10px] text-muted-foreground">
                <Link href="/auth/login" className="text-primary hover:underline">
                  ← BACK TO LOGIN
                </Link>
              </p>
            )}
          </div>
        </PixelCard>
      </div>
    </div>
  )
}