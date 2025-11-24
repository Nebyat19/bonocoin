"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle } from "lucide-react"

interface WithdrawalRequest {
  id: string
  amount: number
  status: "pending" | "approved" | "rejected"
  requested_at: string
  approved_at?: string | null
  bank_account?: any
}

interface WithdrawalRequestsListProps {
  creatorId: number | string
  refreshTrigger?: number
}

export default function WithdrawalRequestsList({ creatorId, refreshTrigger }: WithdrawalRequestsListProps) {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/creator/withdrawals?creator_id=${creatorId}`)
        if (response.ok) {
          const data = await response.json()
          setWithdrawalRequests(data)
        }
      } catch (error) {
        console.error("Error fetching withdrawals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (creatorId) {
      fetchWithdrawals()
    }
  }, [creatorId, refreshTrigger])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-primary" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-primary" />
      default:
        return <Clock className="w-5 h-5 text-secondary" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-primary/10 border-primary/20"
      case "rejected":
        return "bg-primary/10 border-primary/20"
      default:
        return "bg-secondary/10 border-secondary/20"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="bg-card border-border p-6">
          <p className="text-muted-foreground text-sm text-center py-8">Loading withdrawal requests...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Withdrawal Requests</h3>
        {withdrawalRequests.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No withdrawal requests yet
          </p>
        ) : (
          <div className="space-y-3">
            {withdrawalRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 rounded-lg border ${getStatusColor(request.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {request.amount.toFixed(2)} BONO
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.requested_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      request.status === "approved"
                        ? "bg-primary/20 text-primary"
                        : request.status === "rejected"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/20 text-secondary"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                {request.status === "approved" && request.approved_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Approved on{" "}
                    {new Date(request.approved_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

