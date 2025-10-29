/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import Link from "next/link"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelClouds } from "@/components/pixel-clouds"
import { PixelCharacter } from "@/components/pixel-character"

// Validation schema
const signupSchema = z.object({
  email: z.string().email({ message: "INVALID EMAIL FORMAT" }),
  password: z
      .string()
      .min(8, { message: "PASSWORD MUST BE 8+ CHARACTERS" })
      .regex(/[a-z]/, { message: "PASSWORD NEEDS LOWERCASE LETTER" })
      .regex(/[A-Z]/, { message: "PASSWORD NEEDS UPPERCASE LETTER" })
      .regex(/[0-9]/, { message: "PASSWORD NEEDS NUMBER" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "PASSWORDS DO NOT MATCH",
  path: ["confirmPassword"],
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 25
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25
    return strength
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("password", e.target.value)
    setPasswordStrength(calculatePasswordStrength(e.target.value))
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-yellow-500"
    if (passwordStrength <= 75) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "WEAK"
    if (passwordStrength <= 50) return "FAIR"
    if (passwordStrength <= 75) return "GOOD"
    return "STRONG"
  }

  const onSubmit = async (data: SignupFormValues) => {
    if (!isLoaded) return

    setLoading(true)
    setError("")

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      })

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      setVerifying(true)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "SIGNUP FAILED")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)
    setError("")

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "INVALID CODE")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (strategy: "oauth_google" | "oauth_github") => {
    if (!isLoaded) return

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "OAUTH FAILED")
    }
  }

  // OTP Verification View
  if (verifying) {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
          <PixelClouds />

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
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <PixelCharacter color="#8B5CF6" size={60} />
                  </div>
                  <h1 className="text-xl pixel-text-shadow">VERIFY EMAIL</h1>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ENTER THE CODE SENT TO YOUR EMAIL
                  </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/20 border-2 border-red-500 text-red-500 text-[10px] text-center">
                      {error}
                    </div>
                )}

                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <PixelInput
                      label="VERIFICATION CODE"
                      type="text"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                  />

                  <PixelButton
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={loading || code.length !== 6}
                  >
                    {loading ? "VERIFYING..." : "VERIFY & CONTINUE"}
                  </PixelButton>

                  <button
                      type="button"
                      onClick={() => setVerifying(false)}
                      className="w-full text-[10px] text-muted-foreground hover:text-primary"
                  >
                    ← BACK TO SIGNUP
                  </button>
                </form>
              </div>
            </PixelCard>
          </div>
        </div>
    )
  }

  // Signup Form View
  return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <PixelClouds />

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

        <div className="relative z-10 w-full max-w-lg">
          <PixelCard>
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <PixelCharacter color="#8B5CF6" size={60} />
                </div>
                <h1 className="text-xl pixel-text-shadow">SIGN UP</h1>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  CREATE YOUR PIXEL PORTFOLIO
                </p>
              </div>

              {error && (
                  <div className="p-3 bg-red-500/20 border-2 border-red-500 text-red-500 text-[10px] text-center">
                    {error}
                  </div>
              )}

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

                <div className={"flex justify-between items-start gap-3"}>
                <div>
                  <PixelInput
                      label="PASSWORD"
                      type="password"
                      placeholder="********"
                      {...form.register("password")}
                      onChange={handlePasswordChange}
                  />
                  {form.formState.errors.password && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {form.formState.errors.password.message}
                      </p>
                  )}

                  {form.watch("password") && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                              <div
                                  key={i}
                                  className={`h-2 flex-1 border-2 border-border ${
                                      i < passwordStrength / 25 ? getStrengthColor() : "bg-muted"
                                  }`}
                              />
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          STRENGTH: {getStrengthText()}
                        </p>
                      </div>
                  )}
                </div>

                <div>
                  <PixelInput
                      label="CONFIRM PASSWORD"
                      type="password"
                      placeholder="********"
                      {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                  )}
                </div>
                </div>
                <PixelButton
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={loading || !isLoaded}
                >
                  {loading ? "CREATING..." : "CREATE ACCOUNT"}
                </PixelButton>
              </form>

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
                      onClick={() => handleOAuthSignUp("oauth_google")}
                      disabled={!isLoaded}
                      type="button"
                  >
                    GOOGLE
                  </PixelButton>
                  <PixelButton
                      variant="secondary"
                      className="w-full text-[10px]"
                      onClick={() => handleOAuthSignUp("oauth_github")}
                      disabled={!isLoaded}
                      type="button"
                  >
                    GITHUB
                  </PixelButton>
                </div>
              </div>

              <p className="text-center text-[10px] text-muted-foreground leading-relaxed">
                ALREADY HAVE AN ACCOUNT?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  LOG IN
                </Link>
              </p>
            </div>
          </PixelCard>
        </div>
      </div>
  )
}