"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LogIn, Plus, Trash2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { StoredCreator } from "@/types/models"

interface CreatorOnboardingProps {
  onSuccess: (creator: StoredCreator) => void
}

interface CreatorFormState {
  handle: string
  channel_username: string
  display_name: string
  bio: string
  links: string[]
}

export default function CreatorOnboarding({ onSuccess }: CreatorOnboardingProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreatorFormState>({
    handle: "",
    channel_username: "",
    display_name: "",
    bio: "",
    links: [""],
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [handleError, setHandleError] = useState<string | null>(null)

  const handleAddLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, ""],
    })
  }

  const handleRemoveLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    })
  }

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links]
    newLinks[index] = value
    setFormData({ ...formData, links: newLinks })
  }

  const handleRegister = async () => {
    if (!formData.handle || !formData.channel_username || !formData.display_name) {
      setFormError("Please fill in all required fields.")
      return
    }

    const normalizedHandle = formData.handle.startsWith("@")
      ? formData.handle.slice(1)
      : formData.handle

    const handlePattern = /^[a-zA-Z0-9_]{3,20}$/
    if (!handlePattern.test(normalizedHandle)) {
      setHandleError("Use 3-20 letters, numbers, or underscores.")
      return
    }

    setHandleError(null)
    setFormError(null)
    setIsLoading(true)

    try {
      // Get current user ID from Telegram or dev mode
      const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
      const isDevMode = typeof window !== "undefined" && 
        (process.env.NEXT_PUBLIC_DEV_MODE === "true" || 
         window.location.hostname === "localhost" || 
         window.location.hostname === "127.0.0.1")
      
      let userId: number | string | null = null

      if (isDevMode || telegramApp?.initDataUnsafe?.user?.id) {
        const telegramId = telegramApp?.initDataUnsafe?.user?.id || "123456789"
        
        // Get user from API
        const userResponse = await fetch(`/api/user?telegram_id=${telegramId}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          userId = userData.user.id
        } else if (isDevMode) {
          // In dev mode, try to create user first
          const devAuthResponse = await fetch("/api/dev-auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              telegram_id: "123456789",
              first_name: "Test",
              last_name: "User",
              username: "testuser",
            }),
          })
          if (devAuthResponse.ok) {
            const devData = await devAuthResponse.json()
            userId = devData.user.id
          }
        }
      }

      if (!userId) {
        throw new Error("User not found. Please log in first.")
      }

      // Check username availability
      const checkResponse = await fetch(`/api/creator/check-username?handle=${encodeURIComponent(normalizedHandle.toLowerCase())}`)
      if (checkResponse.ok) {
        const checkData = await checkResponse.json()
        if (!checkData.available) {
          setHandleError("That username is already taken.")
          setIsLoading(false)
          return
        }
      }

      // Create creator via API
      const response = await fetch("/api/creator/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          handle: normalizedHandle.toLowerCase(),
          channel_username: formData.channel_username.trim(),
          display_name: formData.display_name.trim(),
          bio: formData.bio || null,
          links: formData.links.filter((l) => l.trim()),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create creator profile")
      }

      const createdCreator = await response.json()
      
      // Return the created creator immediately - no need to wait
      // The parent component will refresh in the background
      onSuccess(createdCreator)
    } catch (error) {
      console.error("Registration error:", error)
      setFormError(error instanceof Error ? error.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="text-center mb-8">
          <div className="text-4xl sm:text-5xl font-bold mb-4 neon-glow">₿</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Creator Profile</h1>
          <p className="text-muted-foreground text-sm">Set up your profile to start receiving support</p>
        </div>

        <Card className="bg-card border-border p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Creator Username (permanent) *</label>
            <Input
              value={formData.handle}
              onChange={(e) => {
                setFormData({ ...formData, handle: e.target.value })
                setHandleError(null)
                setFormError(null)
              }}
              placeholder="@mycreatorname"
              className="bg-input border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Choose a unique handle (e.g. @techcreator). This cannot be changed later.
            </p>
            {handleError && <p className="text-xs text-primary mt-1">{handleError}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Channel Username *</label>
            <Input
              value={formData.channel_username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  channel_username: e.target.value,
                })
              }
              placeholder="@mychannel"
              className="bg-input border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Your Telegram channel name</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Display Name *</label>
            <Input
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Your Name"
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell your supporters about you..."
              className="bg-input border-border text-foreground text-sm resize-none"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-muted-foreground">Links</label>
              <Button onClick={handleAddLink} variant="ghost" size="sm" className="text-primary hover:text-primary h-7">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {formData.links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    placeholder="https://example.com"
                    className="bg-input border-border text-foreground text-sm flex-1"
                  />
                  {formData.links.length > 1 && (
                    <Button
                      onClick={() => handleRemoveLink(index)}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary hover:text-primary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Button
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full mt-6 bg-secondary hover:bg-secondary/90 h-12 text-base font-semibold text-secondary-foreground"
        >
          <LogIn className="w-5 h-5 mr-2" />
          {isLoading ? "Setting up..." : "Create Creator Profile"}
        </Button>

        {formError && <p className="text-sm text-primary text-center mt-3">{formError}</p>}

        <p className="text-xs text-muted-foreground text-center mt-4">
          Your unique support link will be generated after setup
        </p>
      </div>
    </div>
  )
}
