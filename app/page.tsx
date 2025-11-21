"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Coins, Users, Shield } from "lucide-react"
import Header from "@/components/header"
import BalanceCard from "@/components/balance-card"
import CoinCircles from "@/components/coin-circles"
import QuickActions from "@/components/quick-actions"
import TransactionHistory from "@/components/transaction-history"

export default function Home() {
  const router = useRouter()
  const [userType, setUserType] = useState<"user" | "creator" | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(true)

  useEffect(() => {
    // Simulate checking if user is already logged in
    const isLoggedIn = false // Change to true if user is logged in
    if (isLoggedIn) {
      setShowAuthModal(false)
    }
  }, [])

  if (showAuthModal && !userType) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="text-6xl font-bold mb-4 neon-glow">₿</div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Bonocoin</h1>
            <p className="text-muted-foreground text-lg">Support creators. Get rewarded.</p>
          </div>

          <div className="space-y-3 mb-8">
            <Button
              onClick={() => router.push("/user")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold flex items-center justify-center gap-2"
            >
              <Coins className="w-5 h-5" />
              I'm a Supporter
            </Button>
            <Button
              onClick={() => router.push("/creator")}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 text-base font-semibold flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              I'm a Creator
            </Button>
          </div>

          <div className="border-t border-border pt-8">
            <Button
              onClick={() => router.push("/admin")}
              variant="outline"
              className="w-full h-10 text-base font-semibold flex items-center justify-center gap-2 border-border hover:bg-muted"
            >
              <Shield className="w-4 h-4" />
              Admin Access
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8">Secure. Transparent. Fair.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userType={userType} />
      <main className="max-w-md mx-auto p-4 pb-20">
        {userType === "user" ? (
          <>
            <BalanceCard />
            <CoinCircles />
            <QuickActions type="user" />
            <TransactionHistory />
          </>
        ) : (
          <>
            <BalanceCard creatorMode />
            <QuickActions type="creator" />
            <TransactionHistory />
          </>
        )}
      </main>
    </div>
  )
}
