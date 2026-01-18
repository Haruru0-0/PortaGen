/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelPasswordInput } from "@/components/pixel-password-input"
import { PixelClouds } from "@/components/pixel-clouds"
import { PixelCharacter } from "@/components/pixel-character"
import { useState } from "react"

// Validation schema
const loginSchema = z.object({
  identifier: z.string().min(1, { message: "IDENTIFIER IS REQUIRED" }),
  password: z.string().min(8, { message: "PASSWORD MUST BE 8+ CHARACTERS" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Initialize React Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError("")

    try {
      let email = data.identifier

      // Check if identifier is an email. If not, treat as username and find email.
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier)

      if (!isEmail) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', data.identifier)
          .single()

        if (userError || !userData) {
          throw new Error("PLAYER NOT FOUND. CHECK YOUR USERNAME.")
        }
        email = userData.email
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: data.password,
      })

      if (error) throw error

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "INVALID CREDENTIALS")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/sso-callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "OAUTH FAILED")
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
                <PixelCharacter color="#EC4899" size={60} />
              </div>
              <h1 className="text-xl pixel-text-shadow">LOG IN</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                WELCOME BACK, PLAYER!
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border-2 border-red-500 text-red-500 text-[10px] text-center">
                {error}
              </div>
            )}

            {/* Form with React Hook Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <PixelInput
                  label="EMAIL OR USERNAME"
                  type="text"
                  placeholder="YOU@EXAMPLE.COM OR YOUR USERNAME"
                  {...form.register("identifier")}
                />
                {form.formState.errors.identifier && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {form.formState.errors.identifier.message}
                  </p>
                )}
              </div>

              <div>
                <PixelPasswordInput
                  label="PASSWORD"
                  placeholder="********"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] text-primary hover:underline"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>

              <PixelButton
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? "LOADING..." : "START GAME"}
              </PixelButton>
            </form>

            {/* Social Login */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-border" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-card px-2 text-muted-foreground">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PixelButton
                  variant="secondary"
                  className="w-full text-[10px]"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={loading}
                  type="button"
                >
                  GOOGLE
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  className="w-full text-[10px]"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={loading}
                  type="button"
                >
                  GITHUB
                </PixelButton>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-[10px] text-muted-foreground leading-relaxed">
              NEW PLAYER?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                CREATE ACCOUNT
              </Link>
              <br />
              Read our{" "}
              <Link href="/privacy?from=Login" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </PixelCard>
      </div>
    </div>
  )
}