"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface Transaction {
  id: string
  type: "send" | "buy"
  creator?: string
  description?: string
  amount: number
  date: string
}

interface UserTransactionHistoryProps {
  userId: number | string
  refreshTrigger?: number // Trigger refresh when this changes
}

export default function UserTransactionHistory({ userId, refreshTrigger }: UserTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/user/transactions?user_id=${userId}`)
        if (response.ok) {
          const data = await response.json()
          // Format dates to relative time
          const formatted = data.map((tx: Transaction) => {
            const date = new Date(tx.date)
            const now = new Date()
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
            let relativeTime: string

            if (diffInSeconds < 60) {
              relativeTime = "Just now"
            } else if (diffInSeconds < 3600) {
              const minutes = Math.floor(diffInSeconds / 60)
              relativeTime = `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
            } else if (diffInSeconds < 86400) {
              const hours = Math.floor(diffInSeconds / 3600)
              relativeTime = `${hours} ${hours === 1 ? "hour" : "hours"} ago`
            } else if (diffInSeconds < 604800) {
              const days = Math.floor(diffInSeconds / 86400)
              relativeTime = `${days} ${days === 1 ? "day" : "days"} ago`
            } else {
              relativeTime = date.toLocaleDateString()
            }

            return {
              ...tx,
              date: relativeTime,
            }
          })
          setTransactions(formatted)
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchTransactions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refreshTrigger])

  if (isLoading) {
    return (
      <Card className="card-glass neon-border p-6 rounded-2xl">
        <h3 className="font-bold text-lg text-foreground mb-5">Recent Activity</h3>
        <p className="text-muted-foreground text-sm text-center py-4">Loading transactions...</p>
      </Card>
    )
  }

  return (
    <Card className="card-glass neon-border p-6 rounded-2xl">
      <h3 className="font-bold text-lg text-foreground mb-5">Recent Activity</h3>
      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">No transactions yet</p>
      ) : (
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
                {tx.type === "send" ? "-" : "+"} {tx.amount} BONO
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
