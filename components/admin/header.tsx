"use client"

import { LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    window.location.href = "/"
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
