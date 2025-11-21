"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, LinkIcon, Share2, ArrowLeft } from "lucide-react"
import type { StoredCreator } from "@/types/models"

interface CreatorPageProps {
  creator: StoredCreator & {
    balance: number
    is_active?: boolean
  }
}

export default function PublicCreatorPage({ creator }: CreatorPageProps) {
  const [showSupportForm, setShowSupportForm] = useState(false)
  const [supportAmount, setSupportAmount] = useState("10")
  const [supporterName, setSupporterName] = useState("")
  const [supportMessage, setSupportMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [supportStatus, setSupportStatus] = useState<string | null>(null)
  const [supportError, setSupportError] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)

  const handleSendSupport = async () => {
    setIsLoading(true)
    setSupportError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setShowSupportForm(false)
      setSupportAmount("10")
      setSupporterName("")
      setSupportMessage("")
      setSupportStatus("Thank you for your support! Your BONO is on the way.")
    } catch (error) {
      console.error("Support error:", error)
      setSupportError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl)
    setShareStatus("Link copied!")
    setTimeout(() => setShareStatus(null), 2000)
  }

  if (showSupportForm) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={() => setShowSupportForm(false)}
            variant="ghost"
            size="icon"
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Card className="bg-card border-border p-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Support {creator.display_name}</h2>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Enter your details</p>
              <p className="font-semibold text-foreground">{creator.display_name}</p>
              <p className="text-sm text-muted-foreground">{creator.channel_username}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Your Name (Optional)</label>
              <Input
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
                placeholder="Enter your name"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Support Amount (BONO) *</label>
              <Input
                type="number"
                value={supportAmount}
                onChange={(e) => setSupportAmount(e.target.value)}
                placeholder="Amount"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Message (Optional)</label>
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Tell them why you support them..."
                className="w-full bg-input border border-border text-foreground p-3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            <Button
              onClick={handleSendSupport}
              disabled={isLoading || !supportAmount}
              className="w-full bg-secondary hover:bg-secondary/90 h-12 text-base font-semibold text-secondary-foreground"
            >
              <Heart className="w-5 h-5 mr-2" />
              {isLoading ? "Sending..." : `Send ${supportAmount} BONO`}
            </Button>
            {supportError && <p className="text-sm text-destructive text-center mt-2">{supportError}</p>}
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-b from-primary/20 to-background p-4 relative">
        <div className="max-w-md mx-auto flex justify-end gap-2 items-center">
          {shareStatus && <span className="text-xs text-primary">{shareStatus}</span>}
          <Button
            onClick={handleShare}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="max-w-md mx-auto text-center -mt-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl font-bold text-foreground">
              {creator.display_name?.charAt(0) || creator.handle?.replace("@", "").charAt(0) || "₿"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{creator.display_name || creator.handle || "Creator"}</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mb-2">{creator.channel_username || "Channel not provided"}</p>
        </div>
      </div>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {creator.bio && (
          <Card className="bg-card border-border p-6">
            <p className="text-foreground text-center">{creator.bio}</p>
          </Card>
        )}

        <Card className="bg-gradient-to-r from-secondary/20 to-accent/20 border-secondary/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Support</p>
              <p className="text-3xl font-bold text-secondary">{creator.balance}</p>
              <p className="text-xs text-muted-foreground">BONO Coins</p>
            </div>
            <Heart className="w-12 h-12 text-secondary opacity-50" />
          </div>
        </Card>

        {creator.links && creator.links.length > 0 && (
          <Card className="bg-card border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-accent" />
              Links
            </h3>
            <div className="space-y-2">
              {creator.links.map((link: string, index: number) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-muted hover:bg-muted/80 rounded-lg text-sm text-primary hover:text-primary/80 truncate transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </Card>
        )}

        <Button
          onClick={() => setShowSupportForm(true)}
          className="w-full bg-secondary hover:bg-secondary/90 h-12 text-base font-semibold text-secondary-foreground sticky bottom-4"
        >
          <Heart className="w-5 h-5 mr-2" />
          Send Support
        </Button>
        {supportStatus && <p className="text-center text-sm text-primary">{supportStatus}</p>}
      </main>
    </div>
  )
}
