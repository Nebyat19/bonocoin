"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

export default function UserTransactionHistory() {
  // Mock data
  const transactions = [
    {
      id: "1",
      type: "send",
      creator: "Tech Creator",
      amount: 25,
      date: "2 hours ago",
    },
    {
      id: "2",
      type: "buy",
      description: "Purchased 50 BONO",
      amount: 50,
      date: "1 day ago",
    },
    {
      id: "3",
      type: "send",
      creator: "Music Creator",
      amount: 10,
      date: "3 days ago",
    },
  ]

  return (
    <Card className="card-glass neon-border p-6 rounded-2xl">
      <h3 className="font-bold text-lg text-foreground mb-5">Recent Activity</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-3 px-3 rounded-lg bg-background/30 hover:bg-background/50 transition-all border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg border ${
                  tx.type === "send"
                    ? "bg-secondary/15 border-secondary/30 glow-pink"
                    : "bg-primary/15 border-primary/30 glow-neon"
                }`}
              >
                {tx.type === "send" ? (
                  <ArrowUpRight className="w-4 h-4 text-secondary" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {tx.type === "send" ? `Support ${tx.creator}` : tx.description}
                </p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
            </div>
            <p className={`font-bold ${tx.type === "send" ? "text-secondary" : "text-primary"}`}>
              {tx.type === "send" ? "-" : "+"} {tx.amount}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
