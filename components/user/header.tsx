"use client"

import { LogOut, Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserHeaderProps {
  user: any
}

export default function UserHeader({ user }: UserHeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <header className="bg-gradient-to-b from-card/60 to-background/40 backdrop-blur-md border-b border-primary/20 sticky top-0 z-10">
      <div className="max-w-md mx-auto flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Welcome back</p>
          <p className="font-bold text-lg text-foreground">{user.first_name || "Supporter"}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary glow-neon transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
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
    </header>
  )
}
