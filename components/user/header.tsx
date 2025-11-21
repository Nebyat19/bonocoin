"use client"

import { LogOut, Settings, Bell, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserHeaderProps {
  user: any
}

export default function UserHeader({ user }: UserHeaderProps) {
  const router = useRouter()
  const [isCreator, setIsCreator] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Check if user is also a creator
    const storedCreator = localStorage.getItem("creator")
    setIsCreator(!!storedCreator)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("creator")
    window.location.href = "/"
  }

  const handleSwitchToCreator = () => {
    router.push("/creator")
  }

  return (
    <header className="bg-gradient-to-b from-card/60 to-background/40 backdrop-blur-md border-b border-primary/20 sticky top-0 z-10">
      <div className="max-w-md mx-auto flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Welcome back</p>
          <p className="font-bold text-lg text-foreground">{user.first_name || "Supporter"}</p>
        </div>
        <div className="flex gap-2">
          {isCreator ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwitchToCreator}
              className="h-10 w-10 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 hover:text-secondary transition-all"
              title="Switch to Creator Dashboard"
            >
              <Users className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwitchToCreator}
              className="h-10 w-10 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 hover:text-secondary transition-all"
              title="Become a Creator"
            >
              <Users className="w-5 h-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowSettings(false)
            }}
            className="h-10 w-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary glow-neon transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowSettings(!showSettings)
              setShowNotifications(false)
            }}
            className="h-10 w-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-all"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-10 w-10 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive transition-all"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
      {showNotifications && (
        <div className="max-w-md mx-auto px-4">
          <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
            <p>No notifications yet. We’ll keep you posted when creators respond.</p>
          </div>
        </div>
      )}
      {showSettings && (
        <div className="max-w-md mx-auto px-4">
          <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Settings</p>
            <p>Profile & preferences coming soon.</p>
          </div>
        </div>
      )}
    </header>
  )
}
