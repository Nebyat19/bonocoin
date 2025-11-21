"use client"

import { useState, useEffect } from "react"
import UnifiedOnboarding from "@/components/unified/onboarding"
import UnifiedDashboard from "@/components/unified/dashboard"
import type { StoredCreator, StoredUser } from "@/types/models"

interface OnboardingResult {
  user: StoredUser
  creator?: StoredCreator
}

const parseStoredItem = <T,>(key: string): T | null => {
  try {
    const storedValue = localStorage.getItem(key)
    return storedValue ? (JSON.parse(storedValue) as T) : null
  } catch (error) {
    console.error(`Failed to parse stored item "${key}"`, error)
    return null
  }
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)
  const [creator, setCreator] = useState<StoredCreator | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication
    const initAuth = async () => {
      try {
        const storedUser = parseStoredItem<StoredUser>("user")
        const storedCreator = parseStoredItem<StoredCreator>("creator")

        if (storedUser) {
          setUser(storedUser)
          setIsAuthenticated(true)
        }

        if (storedCreator) {
          setCreator(storedCreator)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleOnboardingSuccess = (data: OnboardingResult) => {
    setUser(data.user)
    if (data.creator) {
      setCreator(data.creator)
      localStorage.setItem("creator", JSON.stringify(data.creator))
    }
    localStorage.setItem("user", JSON.stringify(data.user))
    setIsAuthenticated(true)
  }

  // Check if creator was just created (e.g., from /creator page)
  useEffect(() => {
    if (!creator) {
      const storedCreator = parseStoredItem<StoredCreator>("creator")
      if (storedCreator) {
        setCreator(storedCreator)
      }
    }
  }, [creator])

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
