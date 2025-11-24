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
        // Check dev mode - in browser, we check if we're in development
        const isDevMode = typeof window !== "undefined" && 
          (process.env.NEXT_PUBLIC_DEV_MODE === "true" || 
           window.location.hostname === "localhost" || 
           window.location.hostname === "127.0.0.1")
        const telegramId = telegramApp?.initDataUnsafe?.user?.id

        // In dev mode, try to authenticate if no Telegram data
        if (isDevMode && !telegramId) {
          try {
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
              setUser(devData.user)
              setIsAuthenticated(true)
              setIsLoading(false)
              
              // Load creator data separately (non-blocking)
              loadCreatorData(devData.user.id)
              return
            }
          } catch (devError) {
            console.error("Dev auth error:", devError)
          }
        }

        if (!telegramId) {
          setIsLoading(false)
          return
        }

        // Fetch user data from API - show dashboard immediately
        const response = await fetch(`/api/user?telegram_id=${telegramId}`)
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setIsAuthenticated(true)
          setIsLoading(false) // Show dashboard immediately
          
          // Set creator if available, otherwise load it separately (non-blocking)
          if (data.creator) {
            setCreator(data.creator)
          } else {
            // Load creator separately so it doesn't block the UI
            loadCreatorData(data.user.id)
          }
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsLoading(false)
      }
    }

    // Separate function to load creator data (non-blocking)
    const loadCreatorData = async (userId: number | string) => {
      try {
        const userIdNum = typeof userId === "string" ? Number.parseInt(userId, 10) : userId
        if (isNaN(userIdNum)) return

        // Use a timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

        const creatorResponse = await fetch(`/api/creator/by-user?user_id=${userIdNum}`, {
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        if (creatorResponse.ok) {
          const creatorData = await creatorResponse.json()
          if (creatorData) {
            setCreator(creatorData)
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error loading creator data:", error)
        }
        // Silently fail - user can still use the app
      }
    }

    initAuth()

    // Also listen for focus events to refresh data when page becomes visible
    const handleFocus = async () => {
      try {
        const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
        const telegramId = telegramApp?.initDataUnsafe?.user?.id
        if (telegramId) {
          const response = await fetch(`/api/user?telegram_id=${telegramId}`)
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            if (data.creator) {
              setCreator(data.creator)
            }
          }
        }
      } catch (error) {
        console.error("Error refreshing data:", error)
      }
    }
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  // Check if we should switch to creator tab after redirect
  useEffect(() => {
    if (creator && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get("created") === "true") {
        // Clean up URL
        window.history.replaceState({}, "", window.location.pathname)
      }
    }
  }, [creator])

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
