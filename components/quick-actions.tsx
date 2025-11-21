"use client"

import { CreditCard, Heart, Link2, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function QuickActions({ type }: { type: "user" | "creator" }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {type === "user" ? (
        <>
          <Card className="card-gradient border-0 p-4 cursor-pointer hover:bg-card/80 transition">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-semibold">Buy Bonocoins</p>
            <p className="text-xs text-muted-foreground">via Chapa</p>
          </Card>
          <Card className="card-gradient border-0 p-4 cursor-pointer hover:bg-card/80 transition">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-sm font-semibold">Support Creator</p>
            <p className="text-xs text-muted-foreground">Send coins</p>
          </Card>
        </>
      ) : (
        <>
          <Card className="card-gradient border-0 p-4 cursor-pointer hover:bg-card/80 transition">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-semibold">Share Link</p>
            <p className="text-xs text-muted-foreground">Get supporters</p>
          </Card>
          <Card className="card-gradient border-0 p-4 cursor-pointer hover:bg-card/80 transition">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center mb-2">
              <Wallet className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-sm font-semibold">Withdraw</p>
            <p className="text-xs text-muted-foreground">Cash out</p>
          </Card>
        </>
      )}
    </div>
  )
}
