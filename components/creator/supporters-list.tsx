"use client"

import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function SupportersList() {
  // Mock supporters data
  const supporters = [
    {
      id: "1",
      name: "Anonymous",
      total_sent: 100,
      first_supported_at: "2024-01-15",
    },
    {
      id: "2",
      name: "John Supporter",
      total_sent: 250,
      first_supported_at: "2024-01-10",
    },
    {
      id: "3",
      name: "Jane Enthusiast",
      total_sent: 75,
      first_supported_at: "2024-01-20",
    },
  ]

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        Your Supporters ({supporters.length})
      </h3>

      <div className="space-y-3">
        {supporters.map((supporter) => (
          <div
            key={supporter.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
          >
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">{supporter.name}</p>
              <p className="text-xs text-muted-foreground">
                Since {new Date(supporter.first_supported_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-secondary">{supporter.total_sent} BONO</p>
              <p className="text-xs text-muted-foreground">total</p>
            </div>
          </div>
        ))}
      </div>

      {supporters.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-8">No supporters yet. Share your support link!</p>
      )}
    </Card>
  )
}
