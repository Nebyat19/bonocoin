"use client"

import { Card } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle } from "lucide-react"

interface WithdrawalRequestsListProps {
  creator: any
}

export default function WithdrawalRequestsList({ creator }: WithdrawalRequestsListProps) {
  // Mock withdrawal requests data
  const withdrawalRequests = [
    {
      id: "1",
      amount: 500,
      status: "pending",
      requested_at: "2024-01-18T10:30:00",
      account_holder: "John Doe",
    },
    {
      id: "2",
      amount: 300,
      status: "approved",
      requested_at: "2024-01-15T14:20:00",
      approved_at: "2024-01-16T09:15:00",
      account_holder: "John Doe",
    },
    {
      id: "3",
      amount: 200,
      status: "rejected",
      requested_at: "2024-01-10T11:00:00",
      account_holder: "John Doe",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-primary" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-destructive" />
      default:
        return <Clock className="w-5 h-5 text-accent" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-primary/10 border-primary/20"
      case "rejected":
        return "bg-destructive/10 border-destructive/20"
      default:
        return "bg-accent/10 border-accent/20"
    }
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
                        {new Date(request.requested_at).toLocaleDateString("en-US", {
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
                          ? "bg-destructive/20 text-destructive"
                          : "bg-accent/20 text-accent"
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

