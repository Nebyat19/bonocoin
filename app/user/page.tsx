"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import UserDashboard from "@/components/user/dashboard"
import UserOnboarding from "@/components/user/onboarding"

export default function UserPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for user authentication from Telegram WebApp
    const initUser = async () => {
      try {
        // In a real app, this would validate the Telegram Web App data
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        } else {
          // If no user but creator exists, create a user entry from creator
          const storedCreator = localStorage.getItem("creator")
          if (storedCreator) {
            const creator = JSON.parse(storedCreator)
            // Create a user object from creator data
            const userFromCreator = {
              id: creator.user_id || creator.id,
              telegram_id: creator.user_id || creator.id,
              username: creator.channel_username,
              first_name: creator.display_name,
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
