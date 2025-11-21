"use client"

import { useState } from "react"
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

  const handleSelectCreator = async () => {
    if (!creatorIdentifier.trim()) {
      setLookupError("Please enter a creator username or support link")
      return
    }

    setIsLoading(true)
    setLookupError(null)
    try {
      // Simulate looking up creator by username or link
      await new Promise((resolve) => setTimeout(resolve, 800))
      const input = creatorIdentifier.trim()

      if (input.length < 3) {
        throw new Error("Identifier too short")
      }

      let mockCreator: CreatorResult

      if (input.startsWith("http") || input.includes("/support/")) {
        const parts = input.split("/")
        const linkId = parts.filter(Boolean).pop() || "support_link"
        mockCreator = {
          id: linkId,
          handle: `@${linkId.slice(0, 12)}`,
          display_name: "Creator " + linkId.slice(0, 4).toUpperCase(),
          channel_username: `@${linkId.slice(0, 10)}`,
          support_link_id: linkId,
        }
      } else {
        const username = input.startsWith("@") ? input : `@${input}`
        mockCreator = {
          id: username,
          handle: username,
          display_name: username.replace("@", "").replace(/_/g, " "),
          channel_username: username,
          support_link_id: `support_${username.replace("@", "")}`,
        }
      }

      setSelectedCreator(mockCreator)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Creator not found. Double-check the username or link."
      setLookupError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendCoins = async () => {
    setIsLoading(true)
    try {
      // Simulate transfer
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSuccess(Number.parseFloat(amount))
      setCreatorIdentifier("")
      setAmount("5")
      setSelectedCreator(null)
    } catch (error) {
      console.error("Send error:", error)
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
          <h3 className="font-bold text-lg text-foreground">Send Support</h3>
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
          {lookupError && <p className="text-xs text-destructive">{lookupError}</p>}
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

        <div className="space-y-3">
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
