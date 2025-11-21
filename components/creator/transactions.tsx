"use client"

import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

interface CreatorTransactionsProps {
  creator: any
}

export default function CreatorTransactions({ creator }: CreatorTransactionsProps) {
  // Mock transactions data
  const transactions = [
    {
      id: "1",
      type: "received",
      supporter_name: "Alice",
      amount: 50,
      date: "2 hours ago",
    },
    {
      id: "2",
      type: "received",
      supporter_name: "Bob",
      amount: 25,
      date: "5 hours ago",
    },
    {
      id: "3",
      type: "received",
      supporter_name: "Charlie",
      amount: 100,
      date: "1 day ago",
    },
    {
      id: "4",
      type: "withdrawal",
      amount: 200,
      date: "2 days ago",
    },
  ]

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">All Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      tx.type === "received"
                        ? "bg-primary/15 border-primary/30"
                        : "bg-accent/15 border-accent/30"
                    }`}
                  >
                    {tx.type === "received" ? (
                      <ArrowDownLeft className="w-4 h-4 text-primary" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {tx.type === "received"
                        ? `Received from ${tx.supporter_name}`
                        : "Withdrawal"}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <p
                  className={`font-bold ${
                    tx.type === "received" ? "text-primary" : "text-accent"
                  }`}
                >
                  {tx.type === "received" ? "+" : "-"} {tx.amount} BONO
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

