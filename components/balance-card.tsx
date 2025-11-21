"use client"

import { TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function BalanceCard({ creatorMode }: { creatorMode?: boolean }) {
  return (
    <Card className="card-gradient border-0 p-6 mb-6 mt-4 overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <p className="text-muted-foreground text-sm mb-2">{creatorMode ? "Earnings" : "Your Balance"}</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-bold">4,011</span>
          <span className="text-primary font-semibold">BONO</span>
        </div>

        {!creatorMode && (
          <div className="flex gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary"></div>
            <div className="w-6 h-6 rounded-full bg-secondary"></div>
            <div className="w-6 h-6 rounded-full bg-secondary"></div>
          </div>
        )}

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-primary" />
          12.5% this week
        </p>
      </div>
    </Card>
  )
}
