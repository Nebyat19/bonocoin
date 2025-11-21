"use client"

import { Card } from "@/components/ui/card"
import { Users, TrendingUp } from "lucide-react"

export default function AdminUsers() {
  // Mock users data
  const users = [
    {
      id: "1",
      username: "user_one",
      balance: 450,
      total_spent: 500,
      created_at: "2024-01-10",
    },
    {
      id: "2",
      username: "supporter_jane",
      balance: 200,
      total_spent: 300,
      created_at: "2024-01-12",
    },
    {
      id: "3",
      username: "crypto_fan",
      balance: 1200,
      total_spent: 1500,
      created_at: "2024-01-08",
    },
    {
      id: "4",
      username: "creator_supporter",
      balance: 750,
      total_spent: 1000,
      created_at: "2024-01-15",
    },
  ]

  const stats = {
    totalUsers: users.length,
    totalBalance: users.reduce((sum, u) => sum + u.balance, 0),
    totalSpent: users.reduce((sum, u) => sum + u.total_spent, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Users</p>
              <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
              <p className="text-3xl font-bold text-secondary">{stats.totalBalance.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-accent">{stats.totalSpent.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground font-semibold">
                <th className="p-4 text-left">Username</th>
                <th className="p-4 text-right">Balance</th>
                <th className="p-4 text-right">Total Spent</th>
                <th className="p-4 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-4 text-foreground">{user.username}</td>
                  <td className="p-4 text-right text-primary font-semibold">{user.balance}</td>
                  <td className="p-4 text-right text-foreground">{user.total_spent}</td>
                  <td className="p-4 text-muted-foreground text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
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
