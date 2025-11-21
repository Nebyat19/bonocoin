"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import UnifiedOnboarding from "@/components/unified/onboarding"
import UnifiedDashboard from "@/components/unified/dashboard"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [creator, setCreator] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const storedCreator = localStorage.getItem("creator")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        }

        if (storedCreator) {
          setCreator(JSON.parse(storedCreator))
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleOnboardingSuccess = (data: { user: any; creator?: any }) => {
    setUser(data.user)
    if (data.creator) {
      setCreator(data.creator)
      localStorage.setItem("creator", JSON.stringify(data.creator))
    }
    localStorage.setItem("user", JSON.stringify(data.user))
    setIsAuthenticated(true)
  }

  const handleCreatorCreated = (creatorData: any) => {
    setCreator(creatorData)
    localStorage.setItem("creator", JSON.stringify(creatorData))
  }

  // Check if creator was just created (e.g., from /creator page)
  useEffect(() => {
    const checkForNewCreator = () => {
      const storedCreator = localStorage.getItem("creator")
      if (storedCreator && !creator) {
        try {
          const creatorData = JSON.parse(storedCreator)
          setCreator(creatorData)
        } catch (error) {
          console.error("Error parsing creator data:", error)
        }
      }
    }
    checkForNewCreator()
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

  return <UnifiedDashboard user={user} creator={creator} onCreatorCreated={handleCreatorCreated} />
}
