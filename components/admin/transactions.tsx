"use client"

import { Card } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp } from "lucide-react"

export default function AdminTransactions() {
  // Mock transactions
  const transactions = [
    {
      id: "1",
      from_user: "user_one",
      to_creator: "Tech Creator",
      amount: 100,
      admin_fee: 5,
      created_at: "2024-01-20",
    },
    {
      id: "2",
      from_user: "supporter_jane",
      to_creator: "Music Creator",
      amount: 50,
      admin_fee: 2.5,
      created_at: "2024-01-20",
    },
    {
      id: "3",
      from_user: "crypto_fan",
      to_creator: "Art Creator",
      amount: 75,
      admin_fee: 3.75,
      created_at: "2024-01-19",
    },
    {
      id: "4",
      from_user: "creator_supporter",
      to_creator: "Tech Creator",
      amount: 200,
      admin_fee: 10,
      created_at: "2024-01-19",
    },
  ]

  const stats = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalFees: transactions.reduce((sum, t) => sum + t.admin_fee, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-primary">{stats.totalTransactions}</p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Volume</p>
              <p className="text-3xl font-bold text-secondary">{stats.totalVolume.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Admin Fees</p>
              <p className="text-3xl font-bold text-accent">{stats.totalFees.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">All Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground font-semibold">
                <th className="p-4 text-left">From</th>
                <th className="p-4 text-left">To Creator</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Fee</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-4 text-foreground text-xs">{tx.from_user}</td>
                  <td className="p-4 text-muted-foreground">{tx.to_creator}</td>
                  <td className="p-4 text-right text-primary font-semibold">{tx.amount}</td>
                  <td className="p-4 text-right text-accent">{tx.admin_fee.toFixed(2)}</td>
                  <td className="p-4 text-muted-foreground text-xs">{new Date(tx.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
