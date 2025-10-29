/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelClouds } from "@/components/pixel-clouds"
import { PixelCharacter } from "@/components/pixel-character"
import { useState } from "react"

// Validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "INVALID EMAIL FORMAT" }),
  password: z.string().min(8, { message: "PASSWORD MUST BE 8+ CHARACTERS" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Initialize React Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    if (!isLoaded) return

    setLoading(true)
    setError("")

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      })

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "INVALID CREDENTIALS")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (strategy: "oauth_google" | "oauth_github") => {
    if (!isLoaded) return

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "OAUTH FAILED")
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
                      label="EMAIL"
                      type="email"
                      placeholder="YOU@EXAMPLE.COM"
                      {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {form.formState.errors.email.message}
                      </p>
                  )}
                </div>

                <div>
                  <PixelInput
                      label="PASSWORD"
                      type="password"
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
                    disabled={loading || !isLoaded}
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
                      onClick={() => handleOAuthSignIn("oauth_google")}
                      disabled={!isLoaded}
                      type="button"
                  >
                    GOOGLE
                  </PixelButton>
                  <PixelButton
                      variant="secondary"
                      className="w-full text-[10px]"
                      onClick={() => handleOAuthSignIn("oauth_github")}
                      disabled={!isLoaded}
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
              </p>
            </div>
          </PixelCard>
        </div>
      </div>
  )
}