"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle, Clock } from "lucide-react"

export default function AdminWithdrawals() {
  // Mock withdrawal requests
  const [withdrawals, setWithdrawals] = useState([
    {
      id: "1",
      creator_name: "Tech Creator",
      amount: 500,
      status: "pending",
      requested_at: "2024-01-18",
    },
    {
      id: "2",
      creator_name: "Music Creator",
      amount: 300,
      status: "pending",
      requested_at: "2024-01-19",
    },
    {
      id: "3",
      creator_name: "Art Creator",
      amount: 200,
      status: "approved",
      requested_at: "2024-01-15",
    },
  ])

  const handleApprove = (id: string) => {
    setWithdrawals(withdrawals.map((w) => (w.id === id ? { ...w, status: "approved" } : w)))
  }

  const pendingCount = withdrawals.filter((w) => w.status === "pending").length
  const totalPending = withdrawals.filter((w) => w.status === "pending").reduce((sum, w) => sum + w.amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-primary">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Pending</p>
              <p className="text-3xl font-bold text-secondary">{totalPending.toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-bold text-secondary">
                {withdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString()}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Withdrawal Requests</h3>
        </div>
        <div className="space-y-3 p-6">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${withdrawal.status === "approved" ? "bg-primary/10" : "bg-secondary/10"}`}
                  >
                    {withdrawal.status === "approved" ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <Clock className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{withdrawal.creator_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested on {new Date(withdrawal.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right mr-4">
                <p className="font-bold text-secondary">{withdrawal.amount} BONO</p>
                <p className="text-xs text-muted-foreground">{withdrawal.status}</p>
              </div>

              {withdrawal.status === "pending" && (
                <Button
                  onClick={() => handleApprove(withdrawal.id)}
                  className="bg-primary hover:bg-primary/90 h-9 text-sm text-primary-foreground"
                >
                  Approve
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
