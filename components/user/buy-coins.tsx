"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreditCard } from "lucide-react"

interface BuyCoinsProps {
  onSuccess: (amount: number) => void
}

export default function BuyCoins({ onSuccess }: BuyCoinsProps) {
  const [amount, setAmount] = useState("10")
  const [isLoading, setIsLoading] = useState(false)

  const presets = [10, 25, 50, 100]
  const usdPrice = Number.parseFloat(amount) * 0.01 // Mock: $0.01 per coin

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      // Simulate payment processing with Chapa
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onSuccess(Number.parseFloat(amount))
      setAmount("10")
      // Show success toast
    } catch (error) {
      console.error("Purchase error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="card-glass neon-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/20 rounded-xl border border-primary/30 glow-neon">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Buy Bonocoins</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">
              Amount (BONO)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-input/50 border-primary/20 text-foreground text-lg focus:border-primary/50 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {presets.map((preset) => (
              <Button
                key={preset}
                variant={amount === preset.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => setAmount(preset.toString())}
                className={`text-sm font-semibold rounded-lg transition-all ${
                  amount === preset.toString()
                    ? "bg-primary text-primary-foreground glow-neon"
                    : "bg-card/50 border-primary/20 hover:border-primary/50"
                }`}
              >
                {preset}
              </Button>
            ))}
          </div>

          <div className="bg-gradient-primary p-4 rounded-xl border border-primary/20">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Price per coin</span>
              <span className="text-foreground font-semibold">$0.01</span>
            </div>
            <div className="flex justify-between text-sm border-t border-primary/20 pt-2">
              <span className="text-muted-foreground">Total</span>
              <span className="text-primary font-bold neon-glow">${usdPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Button
        onClick={handlePurchase}
        disabled={isLoading || Number.parseFloat(amount) <= 0}
        className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-bold text-primary-foreground rounded-xl glow-neon transition-all"
      >
        {isLoading ? "Processing..." : `Pay $${usdPrice.toFixed(2)}`}
      </Button>
    </div>
  )
}
