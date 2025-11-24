"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface UnifiedBalanceCardProps {
  totalBalance: number
  boughtBalance: number
  receivedBalance: number
}

export default function UnifiedBalanceCard({ totalBalance, boughtBalance, receivedBalance }: UnifiedBalanceCardProps) {
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
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Total Balance</p>
          <TrendingUp className="w-5 h-5 text-primary glow-neon" />
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-5xl font-bold text-primary neon-glow">{totalBalance.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">BONO Coins Available</p>
        </div>

        {/* Breakdown */}
        <div className="mt-6 pt-6 border-t border-border/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
              <span className="text-xs text-muted-foreground">Bought</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{boughtBalance.toFixed(2)}</span>
          </div>
          {receivedBalance > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary block" />
                <span className="text-xs text-muted-foreground">Received</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{receivedBalance.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

