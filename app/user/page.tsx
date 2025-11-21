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
