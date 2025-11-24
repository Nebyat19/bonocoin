"use client"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Coins, Heart, LinkIcon, LogIn, Share2, Wallet } from "lucide-react"

import type { StoredCreator, StoredUser } from "@/types/models"
import { getSupportShareLink } from "@/lib/support-link"

interface CreatorPageProps {
  creator: StoredCreator & {
    balance: number
    is_active?: boolean
  }
  viewer?: StoredUser | null
  isViewerLoading?: boolean
  onRequireAuth?: () => void
  onBuyCoins?: () => void
  onViewerBalanceChange?: (newBalance: number) => void
}

export default function PublicCreatorPage({
  creator,
  viewer,
  isViewerLoading = false,
  onRequireAuth,
  onBuyCoins,
  onViewerBalanceChange,
}: CreatorPageProps) {
  const [showSupportForm, setShowSupportForm] = useState(false)
  const [supportAmount, setSupportAmount] = useState("10")
  const [supporterName, setSupporterName] = useState("")
  const [supportMessage, setSupportMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [supportStatus, setSupportStatus] = useState<string | null>(null)
  const [supportError, setSupportError] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const [viewerBalance, setViewerBalance] = useState<number>(viewer?.balance ?? 0)

  useEffect(() => {
    setViewerBalance(viewer?.balance ?? 0)
  }, [viewer?.balance])

  const shareUrl = useMemo(() => getSupportShareLink(creator.support_link_id || ""), [creator.support_link_id])

  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator
          .share({
            title: `${creator.display_name || "Creator"} on Bonocoin`,
            text: "Support this creator on Bonocoin",
            url: shareUrl,
          })
          .catch(() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(shareUrl)
            }
          })
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl)
      }
      setShareStatus("Link copied!")
      setTimeout(() => setShareStatus(null), 2000)
    } catch (error) {
      console.error("Share error:", error)
    }
  }

  const handleSendSupport = async () => {
    setSupportError(null)

    if (!viewer) {
      onRequireAuth?.()
      return
    }

    const parsedAmount = Number.parseFloat(supportAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setSupportError("Please enter a valid amount.")
      return
    }

    if (parsedAmount > viewerBalance) {
      setSupportError("You don’t have enough BONO. Please buy more coins first.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_user_id: viewer.id,
          to_creator_id: creator.id,
          amount: parsedAmount,
          message: supportMessage.trim() || null,
          supporter_name: supporterName.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to send support")
      }

      const newBalance = viewerBalance - parsedAmount
      setViewerBalance(newBalance)
      onViewerBalanceChange?.(newBalance)

      setShowSupportForm(false)
      setSupportAmount("10")
      setSupporterName("")
      setSupportMessage("")
      setSupportStatus("Thank you! Your BONO is on the way.")
    } catch (error) {
      console.error("Support error:", error)
      setSupportError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

            <div className="bg-background/60 border border-border rounded-lg p-3 text-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Available balance</p>
                <p className="font-semibold text-foreground">{viewerBalance.toFixed(2)} BONO</p>
              </div>
              <Button variant="outline" size="sm" onClick={onBuyCoins} className="text-xs">
                <Coins className="w-4 h-4 mr-1" />
                Buy coins
              </Button>
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
            {supportError && <p className="text-sm text-primary text-center mt-2">{supportError}</p>}
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
              <LinkIcon className="w-5 h-5 text-secondary" />
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

        <Card className="bg-card border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Your BONO Wallet</p>
              <p className="text-lg font-semibold text-foreground">
                {viewer ? `${viewerBalance.toFixed(2)} BONO` : "Connect to view"}
              </p>
            </div>
          </div>

          {isViewerLoading ? (
            <p className="text-sm text-muted-foreground">Checking your wallet...</p>
          ) : !viewer ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign in with Telegram to send BONO coins to {creator.display_name}.
              </p>
              <Button onClick={onRequireAuth} className="w-full bg-primary hover:bg-primary/90">
                <LogIn className="w-4 h-4 mr-2" />
                Start Supporting
              </Button>
            </div>
          ) : viewerBalance <= 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You have 0 BONO coins. Top up to support {creator.display_name}.
              </p>
              <Button onClick={onBuyCoins} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Coins className="w-4 h-4 mr-2" />
                Buy BONO Coins
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Ready to send BONO to {creator.display_name}?</p>
              <Button
                onClick={() => setShowSupportForm(true)}
                className="w-full bg-secondary hover:bg-secondary/90 h-12 text-base font-semibold text-secondary-foreground"
              >
                <Heart className="w-5 h-5 mr-2" />
                Send Support
              </Button>
            </div>
          )}
        </Card>
        {supportStatus && <p className="text-center text-sm text-primary">{supportStatus}</p>}
      </main>
    </div>
  )
}
