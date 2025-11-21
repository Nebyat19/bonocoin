"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CreatorDashboard from "@/components/creator/dashboard"
import CreatorOnboarding from "@/components/creator/onboarding"
import type { StoredCreator } from "@/types/models"

export default function CreatorPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [creator, setCreator] = useState<StoredCreator | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initCreator = async () => {
      try {
        const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
        const telegramId = telegramApp?.initDataUnsafe?.user?.id

        if (!telegramId) {
          setIsLoading(false)
          return
        }

        // Fetch user data from API
        const response = await fetch(`/api/user?telegram_id=${telegramId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.creator) {
            setCreator(data.creator)
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error("Creator auth check error:", error)
        setError("Failed to load creator data")
      } finally {
        setIsLoading(false)
      }
    }

    initCreator()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="text-4xl">₿</div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-foreground mb-2">Oops!</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setIsLoading(true)
              window.location.reload()
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !creator) {
    return (
      <CreatorOnboarding
        onSuccess={async (creatorData) => {
          setCreator(creatorData)
          setIsAuthenticated(true)
          // Refresh from API to ensure consistency
          try {
            const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
            const telegramId = telegramApp?.initDataUnsafe?.user?.id
            if (telegramId) {
              const response = await fetch(`/api/user?telegram_id=${telegramId}`)
              if (response.ok) {
                const apiData = await response.json()
                if (apiData.creator) {
                  setCreator(apiData.creator)
                }
              }
            }
          } catch (error) {
            console.error("Error refreshing creator data:", error)
          }
          // Redirect to home page to use unified dashboard
          router.push("/")
        }}
      />
    )
  }

  return <CreatorDashboard creator={creator} />
}
