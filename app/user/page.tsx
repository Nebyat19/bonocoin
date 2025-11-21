"use client"

import { useState, useEffect } from "react"
import UserDashboard from "@/components/user/dashboard"
import UserOnboarding from "@/components/user/onboarding"
import type { StoredUser } from "@/types/models"

export default function UserPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for user authentication from Telegram WebApp
    const initUser = async () => {
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
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initUser()
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

  if (!isAuthenticated || !user) {
    return (
      <UserOnboarding
        onSuccess={async (userData) => {
          setUser(userData)
          setIsAuthenticated(true)
          // Refresh from API to ensure consistency
          try {
            const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
            const telegramId = telegramApp?.initDataUnsafe?.user?.id || userData.telegram_id
            if (telegramId) {
              const response = await fetch(`/api/user?telegram_id=${telegramId}`)
              if (response.ok) {
                const apiData = await response.json()
                setUser(apiData.user)
              }
            }
          } catch (error) {
            console.error("Error refreshing user data:", error)
          }
        }}
      />
    )
  }

  return <UserDashboard user={user} />
}
