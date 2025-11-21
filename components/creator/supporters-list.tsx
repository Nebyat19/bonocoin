"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"

interface Supporter {
  id: string
  supporter_name: string
  total_sent: number
  first_supported_at: string
}

interface SupportersListProps {
  creatorId: number | string
}

export default function SupportersList({ creatorId }: SupportersListProps) {
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const response = await fetch(`/api/creator/supporters?creator_id=${creatorId}`)
        if (response.ok) {
          const data = await response.json()
          setSupporters(data)
        }
      } catch (error) {
        console.error("Error fetching supporters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (creatorId) {
      fetchSupporters()
    }
  }, [creatorId])

  if (isLoading) {
    return (
      <Card className="bg-card border-border p-6">
        <p className="text-muted-foreground text-sm text-center py-8">Loading supporters...</p>
      </Card>
    )
  }

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
              <p className="font-semibold text-foreground text-sm">{supporter.supporter_name}</p>
              <p className="text-xs text-muted-foreground">
                Since {new Date(supporter.first_supported_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-secondary">{supporter.total_sent.toFixed(2)} BONO</p>
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
