"use client"

import { useEffect } from "react"
import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/nextjs"
import { PixelClouds } from "@/components/pixel-clouds"
import { PixelCard } from "@/components/pixel-card"
import { PixelCharacter } from "@/components/pixel-character"

export default function SSOCallbackPage() {
  const { userId, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded && userId) {
      ;(async () => {
        try {
          await fetch("/api/users/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          })
        } catch (err) {
          console.error("Error syncing OAuth user:", err)
        }
      })()
    }
  }, [isLoaded, userId])

  return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <PixelClouds />

        <div className="relative z-10 w-full max-w-md">
          <PixelCard>
            <div className="flex flex-col items-center space-y-6 text-center">
              <PixelCharacter color="#8B5CF6" size={70} />
              <h1 className="text-xl pixel-text-shadow">AUTHENTICATING...</h1>
              <p className="text-xs text-muted-foreground">
                Please wait while we sign you in securely.
              </p>

              {/* This handles Clerk OAuth redirect completion */}
              <AuthenticateWithRedirectCallback
                  signInFallbackRedirectUrl="/dashboard"
                  signUpFallbackRedirectUrl="/dashboard"
              />

              <div className="animate-pulse text-sm mt-2">🤗</div>
            </div>
          </PixelCard>
        </div>
      </div>
  )
}
