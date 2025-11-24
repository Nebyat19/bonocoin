"use client"

import { useState, useEffect } from "react"
import UnifiedOnboarding from "@/components/unified/onboarding"
import UnifiedDashboard from "@/components/unified/dashboard"
import type { StoredCreator, StoredUser } from "@/types/models"

interface OnboardingResult {
  user: StoredUser
  creator?: StoredCreator
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)
  const [creator, setCreator] = useState<StoredCreator | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication via Telegram
    const initAuth = async () => {
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
          setUser(data.user)
          if (data.creator) {
            setCreator(data.creator)
          }
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Also listen for focus events to refresh data when page becomes visible
    const handleFocus = () => {
      initAuth()
    }
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  const handleOnboardingSuccess = async (data: OnboardingResult) => {
    setUser(data.user)
    if (data.creator) {
      setCreator(data.creator)
    }
    setIsAuthenticated(true)
    
    // Refresh data from API to ensure consistency
    // Add a small delay to ensure database is ready
    setTimeout(async () => {
      try {
        const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
        const telegramId = telegramApp?.initDataUnsafe?.user?.id || data.user.telegram_id
        if (telegramId) {
          const response = await fetch(`/api/user?telegram_id=${telegramId}`)
          if (response.ok) {
            const apiData = await response.json()
            setUser(apiData.user)
            if (apiData.creator) {
              setCreator(apiData.creator)
            }
          }
        }
      } catch (error) {
        console.error("Error refreshing user data:", error)
      }
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="text-6xl neon-glow">₿</div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <UnifiedOnboarding onSuccess={handleOnboardingSuccess} />
  }

  return <UnifiedDashboard user={user} creator={creator} />
}
