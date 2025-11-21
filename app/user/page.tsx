"use client"

import { useState, useEffect } from "react"
import UserDashboard from "@/components/user/dashboard"
import UserOnboarding from "@/components/user/onboarding"
import type { StoredCreator, StoredUser } from "@/types/models"

const parseItem = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch (error) {
    console.error(`Failed to parse ${key}`, error)
    return null
  }
}

export default function UserPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for user authentication from Telegram WebApp
    const initUser = async () => {
      try {
        // In a real app, this would validate the Telegram Web App data
        const storedUser = parseItem<StoredUser>("user")
        if (storedUser) {
          setUser(storedUser)
          setIsAuthenticated(true)
        } else {
          // If no user but creator exists, create a user entry from creator
          const storedCreator = parseItem<StoredCreator>("creator")
          if (storedCreator) {
            // Create a user object from creator data
            const creatorId = storedCreator.user_id ?? storedCreator.id ?? ""
            const userFromCreator: StoredUser = {
              id: String(creatorId),
              telegram_id: String(creatorId),
              username: storedCreator.handle ?? storedCreator.channel_username ?? null,
              display_name: storedCreator.display_name ?? storedCreator.handle ?? null,
              first_name: storedCreator.display_name ?? "Creator",
              balance: 0, // User balance is separate from creator balance
              type: "user",
            }
            setUser(userFromCreator)
            setIsAuthenticated(true)
            localStorage.setItem("user", JSON.stringify(userFromCreator))
          }
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
        onSuccess={(userData) => {
          setUser(userData)
          setIsAuthenticated(true)
          localStorage.setItem("user", JSON.stringify(userData))
        }}
      />
    )
  }

  return <UserDashboard user={user} />
}
