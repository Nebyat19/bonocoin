"use client"

import { useState } from "react"
import { LogOut, Share2, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { StoredCreator } from "@/types/models"
import { getSupportShareLink } from "@/lib/support-link"

interface CreatorHeaderProps {
  creator: StoredCreator
}

export default function CreatorHeader({ creator }: CreatorHeaderProps) {
  const router = useRouter()
  const [copyFeedback, setCopyFeedback] = useState(false)

  const handleLogout = () => {
    // Clear session by redirecting (Telegram will handle re-auth)
    window.location.href = "/"
  }

  const handleShareLink = () => {
    const supportLink = getSupportShareLink(creator.support_link_id || "")
    navigator.clipboard.writeText(supportLink)
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2000)
  }

  const handleSwitchToUser = () => {
    router.push("/user")
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="max-w-md mx-auto flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-muted-foreground">Creator Dashboard</p>
          <p className="font-semibold text-foreground">{creator.display_name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSwitchToUser}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary"
            title="Support Other Creators"
          >
            <Coins className="w-5 h-5" />
          </Button>
          <div className="relative">
            <Button
              onClick={handleShareLink}
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-primary"
              title="Copy support link"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            {copyFeedback && (
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-primary">
                Copied!
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
