"use client"

import { useState } from "react"
import { LogOut, Share2, Bell, Settings, Coins, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UnifiedHeaderProps {
  user: any
  creator?: any
}

export default function UnifiedHeader({ user, creator }: UnifiedHeaderProps) {
  const router = useRouter()
  const [copyFeedback, setCopyFeedback] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("creator")
    window.location.href = "/"
  }

  const handleShareLink = () => {
    if (creator) {
      const supportLink = `${window.location.origin}/support/${creator.support_link_id}`
      navigator.clipboard.writeText(supportLink)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    }
  }

  return (
    <header className="bg-gradient-to-b from-card/60 to-background/40 backdrop-blur-md border-b border-primary/20 sticky top-0 z-10">
      <div className="max-w-md mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
            <span className="text-2xl font-bold neon-glow">₿</span>
          </div>
          <div>
            <p className="font-bold text-lg text-foreground">
              {creator?.display_name || user.first_name || "User"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {creator && (
            <div className="relative">
              <Button
                onClick={handleShareLink}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 hover:text-secondary transition-all"
                title="Copy support link"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              {copyFeedback && (
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-secondary">
                  Copied!
                </span>
              )}
            </div>
          )}
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

