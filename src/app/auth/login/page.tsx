/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "@/components/workspace/workspace-link"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { useWorkspaceExperience } from "@/components/workspace/workspace-experience-provider"
import { AuthScene } from "@/components/workspace/auth-scene"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { WorkspacePasswordInput as PixelPasswordInput } from "@/components/workspace/workspace-primitives"
import { useState } from "react"

// Validation schema
const loginSchema = z.object({
  identifier: z.string().min(1, { message: "Enter your email or username" }),
  password: z.string().min(1, { message: "Enter your password" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { cancelPendingTransition } = useWorkspaceExperience()
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
      const email = data.identifier

      // Check if identifier is an email. If not, treat as username and find email.
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier)

      if (!isEmail) {
        // The username lookup and sign-in happen on the server, so the browser never reads the users table.
        const response = await fetch("/api/auth/username-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: data.identifier, password: data.password }),
        })
        if (!response.ok) {
          const detail = await response.json().catch(() => null)
          throw new Error(detail?.error || "INVALID CREDENTIALS")
        }
        cancelPendingTransition()
        router.push("/dashboard")
        router.refresh()
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: data.password,
      })

      if (error) throw error

      cancelPendingTransition()
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
    <AuthScene artwork="/artwork/eighty-six/reference-set/05-lena-salute.webp" title="Sign in" description="Welcome back. Continue building your world.">
          <div className="space-y-6">
            {/* Header */}


            {/* Error Message */}
            {error && (
              <div role="alert" className="p-3 bg-red-500/20 border border-red-500 text-[#ffb2c5] font-[family-name:var(--font-workspace-body)] text-sm text-center">
                {error}
              </div>
            )}

            {/* Form with React Hook Form */}
            <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <PixelInput
                  label="EMAIL OR USERNAME"
                  type="text"
                  placeholder="EMAIL OR USERNAME"
                  {...form.register("identifier")} aria-invalid={!!form.formState.errors.identifier} autoComplete="username"
                />
                {form.formState.errors.identifier && (
                  <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                    {form.formState.errors.identifier.message}
                  </p>
                )}
              </div>

              <div>
                <PixelPasswordInput
                  label="PASSWORD"
                  placeholder="********"
                  {...form.register("password")} aria-invalid={!!form.formState.errors.password} autoComplete="current-password"
                />
                {form.formState.errors.password && (
                  <p role="alert" className="font-[family-name:var(--font-workspace-body)] text-[#ffb2c5] text-sm mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="inline-block py-2 font-[family-name:var(--font-workspace-body)] text-sm text-[#44e4ff] hover:underline"
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
                {loading ? "LOADING..." : "Sign in"}
              </PixelButton>
            </form>

            {/* Social Login */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-border" />
                </div>
                <div className="relative flex justify-center font-[family-name:var(--font-workspace-body)] text-sm">
                  <span className="bg-[#071657] px-2 text-[#bdd3f3]">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PixelButton
                  variant="secondary"
                  className="w-full text-sm"
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={loading}
                  type="button"
                >
                  GOOGLE
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  className="w-full text-sm"
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={loading}
                  type="button"
                >
                  GITHUB
                </PixelButton>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="font-[family-name:var(--font-workspace-body)] text-center text-sm text-[#bdd3f3] leading-relaxed">
              NEW PLAYER?{" "}
              <Link href="/auth/signup" className="text-[#44e4ff] hover:underline">
                CREATE ACCOUNT
              </Link>
              <br />
              Read our{" "}
              <Link href="/privacy?from=Login" className="text-[#44e4ff] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </AuthScene>
  )
}
