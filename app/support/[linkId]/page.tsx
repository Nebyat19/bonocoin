"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

import PublicCreatorPage from "@/components/public/creator-page"
import type { StoredCreator, StoredUser } from "@/types/models"

type PublicCreator = StoredCreator & {
  balance: number
  is_active?: boolean
}

export default function SupportPage() {
  const params = useParams()
  const linkId = params.linkId as string
  const [creator, setCreator] = useState<PublicCreator | null>(null)
  const [viewer, setViewer] = useState<StoredUser | null>(null)
  const [isCreatorLoading, setIsCreatorLoading] = useState(true)
  const [isViewerLoading, setIsViewerLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCreator = async () => {
      try {
        setIsCreatorLoading(true)
        const response = await fetch(`/api/public/creator/${linkId}`)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Creator not found")
        }
        const data = await response.json()
        setCreator({
          ...data,
          links: Array.isArray(data.links) ? data.links : [],
        })
        setError(null)
      } catch (loadError) {
        console.error("Failed to load creator", loadError)
        setError(loadError instanceof Error ? loadError.message : "Creator not found")
      } finally {
        setIsCreatorLoading(false)
      }
    }

    if (linkId) {
      loadCreator()
    }
  }, [linkId])

  useEffect(() => {
    const initViewer = async () => {
      try {
        const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
        const isDevMode =
          typeof window !== "undefined" &&
          (process.env.NEXT_PUBLIC_DEV_MODE === "true" || window.location.hostname === "localhost")
        const telegramId = telegramApp?.initDataUnsafe?.user?.id

        if (isDevMode && !telegramId) {
          const devAuthResponse = await fetch("/api/dev-auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              telegram_id: "123456789",
              first_name: "Test",
              last_name: "User",
              username: "testuser",
            }),
          })

          if (devAuthResponse.ok) {
            const devData = await devAuthResponse.json()
            setViewer(devData.user)
            return
          }
        }

        if (!telegramId) {
          return
        }

        const response = await fetch(`/api/user?telegram_id=${telegramId}`)
        if (response.ok) {
          const data = await response.json()
          setViewer(data.user)
        }
      } catch (authError) {
        console.error("Failed to load viewer:", authError)
      } finally {
        setIsViewerLoading(false)
      }
    }

    initViewer()
  }, [])

  const handleRequireAuth = () => {
    if (typeof window === "undefined") return
    const returnUrl = encodeURIComponent(`/support/${linkId}`)
    window.location.href = `/?fromSupport=${returnUrl}`
  }

  const handleBuyCoins = () => {
    if (typeof window === "undefined") return
    const returnUrl = encodeURIComponent(`/support/${linkId}`)
    window.location.href = `/?tab=buy&fromSupport=${returnUrl}`
  }

  const handleBalanceUpdate = (newBalance: number) => {
    setViewer((prev) => (prev ? { ...prev, balance: newBalance } : prev))
  }

  if (isCreatorLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="text-4xl">₿</div>
          </div>
          <p className="text-muted-foreground">Loading creator profile...</p>
        </div>
      </div>
    )
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Creator Not Found</h1>
          <p className="text-muted-foreground mb-6">The support link you&rsquo;re looking for doesn&rsquo;t exist.</p>
          <Link href="/" className="text-primary hover:text-primary/80 font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PublicCreatorPage
      creator={creator}
      viewer={viewer}
      isViewerLoading={isViewerLoading}
      onRequireAuth={handleRequireAuth}
      onBuyCoins={handleBuyCoins}
      onViewerBalanceChange={handleBalanceUpdate}
    />
  )
}
