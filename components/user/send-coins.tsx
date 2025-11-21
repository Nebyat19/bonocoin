"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, ChevronLeft } from "lucide-react"

interface SendCoinsProps {
  currentBalance: number
  onSuccess: (amount: number) => void
}

interface CreatorResult {
  id: string
  display_name: string
  handle: string
  channel_username: string
  support_link_id: string
}

export default function SendCoins({ currentBalance, onSuccess }: SendCoinsProps) {
  const [creatorIdentifier, setCreatorIdentifier] = useState("")
  const [amount, setAmount] = useState("5")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<CreatorResult | null>(null)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [supporterName, setSupporterName] = useState("")
  const [anonymousSupport, setAnonymousSupport] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  const handleSelectCreator = async () => {
    if (!creatorIdentifier.trim()) {
      setLookupError("Please enter a creator username or support link")
      return
    }

    setIsLoading(true)
    setLookupError(null)
    try {
      const response = await fetch(`/api/creator/lookup?identifier=${encodeURIComponent(creatorIdentifier.trim())}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Creator not found")
      }

      const creator = await response.json()
      setSelectedCreator(creator)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Creator not found. Double-check the username or link."
      setLookupError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendCoins = async () => {
    const trimmedName = supporterName.trim()
    if (!anonymousSupport && !trimmedName) {
      setNameError("Please enter a display name or choose to stay anonymous.")
      return
    }

    if (!selectedCreator) {
      setLookupError("Please select a creator first")
      return
    }

    setNameError(null)
    setLookupError(null)

    setIsLoading(true)
    try {
      // Get current user ID from Telegram
      const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
      const telegramId = telegramApp?.initDataUnsafe?.user?.id
      
      if (!telegramId) {
        throw new Error("User not authenticated")
      }

      // Get user from API
      const userResponse = await fetch(`/api/user?telegram_id=${telegramId}`)
      if (!userResponse.ok) {
        throw new Error("Failed to get user information")
      }
      const userData = await userResponse.json()

      // Perform transfer
      const transferResponse = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_user_id: userData.user.id,
          to_creator_id: selectedCreator.id,
          amount: Number.parseFloat(amount),
          message: null,
          supporter_name: anonymousSupport ? null : trimmedName,
        }),
      })

      if (!transferResponse.ok) {
        const errorData = await transferResponse.json().catch(() => ({}))
        throw new Error(errorData.error || "Transfer failed")
      }

      onSuccess(Number.parseFloat(amount))
      setCreatorIdentifier("")
      setAmount("5")
      setSelectedCreator(null)
    } catch (error) {
      console.error("Send error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to send coins"
      if (errorMessage.includes("balance") || errorMessage.includes("Insufficient")) {
        setLookupError("Insufficient balance. Please buy more coins first.")
      } else {
        setLookupError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedCreator) {
    return (
      <Card className="card-glass-secondary neon-border-secondary p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-secondary/20 rounded-xl border border-secondary/30 glow-pink">
            <Heart className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Drop a Bono</h3>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">
              Creator Username or Link
            </label>
            <Input
              value={creatorIdentifier}
              onChange={(e) => setCreatorIdentifier(e.target.value)}
              placeholder="Enter @username or paste support link"
              className="bg-input/50 border-secondary/20 text-foreground focus:border-secondary/50 rounded-xl"
            />
          </div>
          <p className="text-xs text-muted-foreground">
          Use the creator&apos;s username (e.g. <span className="text-secondary font-semibold">@techcreator</span>) or their support link.
          </p>
          {lookupError && <p className="text-xs text-primary">{lookupError}</p>}
        </div>

        <Button
          onClick={handleSelectCreator}
          disabled={!creatorIdentifier.trim() || isLoading}
          className="w-full bg-secondary hover:bg-secondary/90 h-10 text-base font-semibold text-secondary-foreground rounded-lg glow-pink transition-all"
        >
          {isLoading ? "Finding Creator..." : "Find Creator"}
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="card-glass neon-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-2 border-foreground/10 shadow-lg glow-neon">
            <span className="text-foreground font-bold text-lg">{selectedCreator.display_name[0]}</span>
          </div>
          <div>
            <p className="font-bold text-foreground">{selectedCreator.display_name}</p>
            <p className="text-xs text-muted-foreground">Handle: {selectedCreator.handle}</p>
            {selectedCreator.channel_username && (
              <p className="text-xs text-muted-foreground">Channel: {selectedCreator.channel_username}</p>
            )}
            <p className="text-[10px] text-muted-foreground">Support link: /support/{selectedCreator.support_link_id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
                Your Display Name
              </label>
              <button
                type="button"
                onClick={() => {
                  setAnonymousSupport(!anonymousSupport)
                  setNameError(null)
                }}
                className="text-[11px] text-secondary hover:text-secondary/80 underline-offset-2 hover:underline"
              >
                {anonymousSupport ? "Use my name" : "Stay anonymous"}
              </button>
            </div>
            {anonymousSupport ? (
              <p className="text-xs text-muted-foreground">
                You will appear as <span className="font-semibold text-secondary">Anonymous Bonower</span>.
              </p>
            ) : (
              <Input
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                placeholder="e.g. CryptoFan42"
                className="bg-input/50 border-primary/20 text-foreground focus:border-primary/50 rounded-xl"
              />
            )}
            {!anonymousSupport && (
              <p className="text-[11px] text-muted-foreground mt-1">
                Creators will see this name when you send support.
              </p>
            )}
            {nameError && <p className="text-xs text-primary mt-1">{nameError}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">
              Amount to Send (BONO)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-input/50 border-primary/20 text-foreground text-lg focus:border-primary/50 rounded-xl"
            />
          </div>
          <p className="text-xs text-muted-foreground pl-1">
            Balance: <span className="text-primary font-semibold">{currentBalance.toFixed(2)}</span> BONO
          </p>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => setSelectedCreator(null)}
          variant="outline"
          className="flex-1 h-12 border-primary/30 hover:bg-primary/10 rounded-lg font-semibold transition-all"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Change
        </Button>
        <Button
          onClick={handleSendCoins}
          disabled={isLoading || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > currentBalance}
          className="flex-1 bg-secondary hover:bg-secondary/90 h-12 font-bold text-secondary-foreground rounded-lg glow-pink transition-all"
        >
          {isLoading ? "Sending..." : "Send Support"}
        </Button>
      </div>
    </div>
  )
}
