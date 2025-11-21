"use client"

import { LogOut, Share2, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CreatorHeaderProps {
  creator: any
}

export default function CreatorHeader({ creator }: CreatorHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("creator")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleShareLink = () => {
    const supportLink = `${window.location.origin}/support/${creator.support_link_id}`
    navigator.clipboard.writeText(supportLink)
    alert("Support link copied to clipboard!")
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
          <Button
            onClick={handleShareLink}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary"
            title="Copy support link"
          >
            <Share2 className="w-5 h-5" />
          </Button>
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
