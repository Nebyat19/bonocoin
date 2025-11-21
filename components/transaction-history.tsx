"use client"

import { Card } from "@/components/ui/card"

export default function TransactionHistory() {
  const transactions = [
    { name: "Alice Creative", amount: "+500", type: "received", time: "2 hours ago" },
    { name: "Bought Bonocoins", amount: "-1,200", type: "purchase", time: "1 day ago" },
    { name: "Bob Tech", amount: "+250", type: "received", time: "2 days ago" },
    { name: "Carol Music", amount: "+1,000", type: "received", time: "3 days ago" },
  ]

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground px-1 mb-3">Recent Activity</h3>
      {transactions.map((tx, i) => (
        <Card
          key={i}
          className="card-gradient border-0 p-3 flex items-center justify-between hover:bg-card/80 transition"
        >
          <div>
            <p className="text-sm font-medium">{tx.name}</p>
            <p className="text-xs text-muted-foreground">{tx.time}</p>
          </div>
          <span className={`font-semibold ${tx.type === "received" ? "text-primary" : "text-muted-foreground"}`}>
            {tx.amount}
          </span>
        </Card>
      ))}
    </div>
  )
}
