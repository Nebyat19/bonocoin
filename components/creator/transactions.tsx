"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

interface Transaction {
  id: string
  type: "received" | "withdrawal"
  supporter_name?: string
  amount: number
  date: string
}

interface CreatorTransactionsProps {
  creatorId: number | string
}

export default function CreatorTransactions({ creatorId }: CreatorTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/creator/transactions?creator_id=${creatorId}`)
        if (response.ok) {
          const data = await response.json()
          setTransactions(data)
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (creatorId) {
      fetchTransactions()
    }
  }, [creatorId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="bg-card border-border p-6">
          <p className="text-muted-foreground text-sm text-center py-8">Loading transactions...</p>
        </Card>
      </div>
    )
  }

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
                        : "bg-secondary/15 border-secondary/30"
                    }`}
                  >
                    {tx.type === "received" ? (
                      <ArrowDownLeft className="w-4 h-4 text-primary" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-secondary" />
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
                    tx.type === "received" ? "text-primary" : "text-secondary"
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

