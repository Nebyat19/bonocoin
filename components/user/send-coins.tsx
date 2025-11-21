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

export default function SendCoins({ currentBalance, onSuccess }: SendCoinsProps) {
  const [creatorLink, setCreatorLink] = useState("")
  const [amount, setAmount] = useState("5")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState(null)

  const handleSelectCreator = async () => {
    setIsLoading(true)
    try {
      // Simulate looking up creator by link
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSelectedCreator({
        id: "1",
        display_name: "Sample Creator",
        channel_username: "@sample_creator",
      })
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
      setCreatorLink("")
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

        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">
            Creator Support Link
          </label>
          <Input
            value={creatorLink}
            onChange={(e) => setCreatorLink(e.target.value)}
            placeholder="Paste creator link..."
            className="bg-input/50 border-secondary/20 text-foreground focus:border-secondary/50 rounded-xl"
          />
        </div>

        <Button
          onClick={handleSelectCreator}
          disabled={!creatorLink || isLoading}
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
            <p className="text-xs text-muted-foreground">{selectedCreator.channel_username}</p>
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
