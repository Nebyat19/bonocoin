"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogIn, Zap } from "lucide-react"
import type { StoredUser } from "@/types/models"

interface UserOnboardingProps {
  onSuccess: (user: StoredUser) => void
}

export default function UserOnboarding({ onSuccess }: UserOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleTelegramLogin = async () => {
    setIsLoading(true)
    try {
      // Simulate Telegram login
      const mockUser = {
        id: Math.random().toString(),
        telegram_id: "123456789",
        username: "supporter_user",
        first_name: "John",
        last_name: "Doe",
        balance: 0,
        type: "user",
      }
      onSuccess(mockUser)
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl font-bold mb-4 neon-glow">₿</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bonocoin</h1>
          <p className="text-muted-foreground text-sm">Support your favorite creators instantly</p>
        </div>

        <Card className="bg-card border-border p-6 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="text-primary mt-1">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Buy Bonocoins</h3>
              <p className="text-sm text-muted-foreground">Purchase coins to support creators</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-secondary mt-1">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Send Support</h3>
              <p className="text-sm text-muted-foreground">Send coins to creators you love</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-accent mt-1">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Track Support</h3>
              <p className="text-sm text-muted-foreground">See all your support history</p>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleTelegramLogin}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold text-primary-foreground"
        >
          <LogIn className="w-5 h-5 mr-2" />
          {isLoading ? "Connecting..." : "Login with Telegram"}
        </Button>
      </div>
    </div>
  )
}
