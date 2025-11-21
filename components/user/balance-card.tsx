"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface UserBalanceProps {
  balance: number
}

export default function UserBalance({ balance }: UserBalanceProps) {
  return (
    <Card className="card-glass-secondary neon-border p-8 relative overflow-hidden rounded-2xl">
      <div className="absolute top-0 right-0 opacity-20">
        <div className="w-40 h-40 bg-primary rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-15">
        <div className="w-32 h-32 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Your Balance</p>
          <TrendingUp className="w-5 h-5 text-primary glow-neon" />
        </div>

        <div className="space-y-3">
          <p className="text-5xl font-bold text-primary neon-glow">{balance.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">BONO Coins Available</p>
        </div>

        <div className="mt-6 pt-6 border-t border-border/30 text-xs text-muted-foreground">
          ↓ {(balance * 0.05).toFixed(2)} in pending rewards
        </div>
      </div>
    </Card>
  )
}
