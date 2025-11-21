"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminUsers from "@/components/admin/users"
import AdminCreators from "@/components/admin/creators"
import AdminTransactions from "@/components/admin/transactions"
import AdminWithdrawals from "@/components/admin/withdrawals"
import AdminHeader from "@/components/admin/header"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simplified admin auth check - in production use proper token validation
        const adminToken = localStorage.getItem("adminToken")
        if (adminToken === "admin_secret_123") {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="text-4xl">₿</div>
          </div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-4 neon-glow">₿</div>
            <h1 className="text-3xl font-bold text-foreground">Admin Access</h1>
          </div>

          <button
            onClick={() => {
              localStorage.setItem("adminToken", "admin_secret_123")
              window.location.reload()
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            Demo Login (Test Only)
          </button>

          <p className="text-xs text-muted-foreground text-center mt-6">
            This is a demo admin interface. In production, use proper authentication.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AdminHeader />
      <main className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="creators">
            <AdminCreators />
          </TabsContent>

          <TabsContent value="transactions">
            <AdminTransactions />
          </TabsContent>

          <TabsContent value="withdrawals">
            <AdminWithdrawals />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
