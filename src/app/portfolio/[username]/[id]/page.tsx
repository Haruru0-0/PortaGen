"use client"

import { LockScreen } from "@/components/portfolio/lock-screen"
import { useRouter, useParams } from "next/navigation"

export default function LockScreenPage() {
  const router = useRouter()
  const params = useParams<{ username: string, id: string }>()

  const handleUnlock = () => {
    router.push(`/portfolio/${params.username}/${params.id}/home`)
  }

  return (
    <LockScreen onUnlock={handleUnlock} />
  )
}