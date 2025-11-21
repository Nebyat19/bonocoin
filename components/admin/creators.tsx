"use client"

import { Card } from "@/components/ui/card"
import { Users, BarChart3 } from "lucide-react"

export default function AdminCreators() {
  // Mock creators data
  const creators = [
    {
      id: "1",
      display_name: "Tech Creator",
      channel_username: "@techcreator",
      balance: 2500,
      supporters: 45,
      created_at: "2024-01-05",
    },
    {
      id: "2",
      display_name: "Music Creator",
      channel_username: "@musiccreator",
      balance: 1800,
      supporters: 38,
      created_at: "2024-01-10",
    },
    {
      id: "3",
      display_name: "Art Creator",
      channel_username: "@artcreator",
      balance: 950,
      supporters: 22,
      created_at: "2024-01-15",
    },
  ]

  const stats = {
    totalCreators: creators.length,
    totalEarnings: creators.reduce((sum, c) => sum + c.balance, 0),
    totalSupporters: creators.reduce((sum, c) => sum + c.supporters, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Creators</p>
              <p className="text-3xl font-bold text-primary">{stats.totalCreators}</p>
            </div>
            <Users className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-secondary">{stats.totalEarnings.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Supporters</p>
              <p className="text-3xl font-bold text-accent">{stats.totalSupporters}</p>
            </div>
            <Users className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">All Creators</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground font-semibold">
                <th className="p-4 text-left">Creator</th>
                <th className="p-4 text-left">Channel</th>
                <th className="p-4 text-right">Balance</th>
                <th className="p-4 text-right">Supporters</th>
                <th className="p-4 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((creator) => (
                <tr key={creator.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-4 text-foreground font-semibold">{creator.display_name}</td>
                  <td className="p-4 text-muted-foreground text-xs">{creator.channel_username}</td>
                  <td className="p-4 text-right text-secondary font-semibold">{creator.balance}</td>
                  <td className="p-4 text-right text-accent">{creator.supporters}</td>
                  <td className="p-4 text-muted-foreground text-xs">
                    {new Date(creator.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
