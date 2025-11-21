"use client"

import { Card } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface CreatorBalanceProps {
  balance: number
}

export default function CreatorBalance({ balance }: CreatorBalanceProps) {
  const estimatedEarnings = balance * 0.95 // After fees

  return (
    <Card className="bg-gradient-to-br from-secondary/20 to-accent/20 border-secondary/30 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10">
        <div className="w-40 h-40 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total Earnings</p>
            <p className="text-4xl font-bold text-secondary mt-1">{balance.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">BONO Coins</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-lg">
            <BarChart3 className="w-8 h-8 text-secondary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="font-bold text-primary text-lg">{estimatedEarnings.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Platform Fee</p>
            <p className="font-bold text-accent text-lg">{(balance * 0.05).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
