"use client"

import { LockScreen } from "@/components/portfolio/lock-screen"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"

export default function LockScreenPage() {
  const router = useRouter()
  const params = useParams<{ username: string, id: string }>()

  const handleUnlock = () => {
    router.push(`/portfolio/${params.username}/${params.id}/home`)
  }

  useEffect(() => {
    // Increment views
    if (params.id) {
      fetch("/api/portfolio/view", {
        method: "POST",
        body: JSON.stringify({ portfolioId: params.id }),
      }).catch(err => console.error("Failed to count view", err));
    }
  }, [params.id]);

  return (
    <LockScreen onUnlock={handleUnlock} />
  )
}