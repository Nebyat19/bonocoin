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
            <div className="text-4xl sm:text-5xl font-bold mb-4 neon-glow">₿</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Access</h1>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
        <Tabs defaultValue="users" className="w-full">
          <div className="overflow-x-auto -mx-2 sm:mx-0 mb-6">
            <TabsList className="inline-flex min-w-full rounded-lg bg-muted p-1 gap-2 sm:grid sm:grid-cols-4 sm:p-2">
              <TabsTrigger
                value="users"
                className="px-4 py-2 text-sm font-semibold whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="creators"
                className="px-4 py-2 text-sm font-semibold whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Creators
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="px-4 py-2 text-sm font-semibold whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="withdrawals"
                className="px-4 py-2 text-sm font-semibold whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Withdrawals
              </TabsTrigger>
            </TabsList>
          </div>

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
