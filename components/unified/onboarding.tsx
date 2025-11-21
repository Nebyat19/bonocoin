"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Coins, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Plus, 
  Trash2,
  Zap,
  Heart,
  TrendingUp,
  Shield
} from "lucide-react"
import { generateSupportLinkId } from "@/lib/utils/crypto"

const CREATOR_USERNAMES_KEY = "bonocoin_creator_usernames"

interface OnboardingProps {
  onSuccess: (data: { user: any; creator?: any }) => void
}

export default function UnifiedOnboarding({ onSuccess }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [creatorData, setCreatorData] = useState({
    handle: "",
    channel_username: "",
    display_name: "",
    bio: "",
    links: [""],
  })
  const [wantsToBeCreator, setWantsToBeCreator] = useState<boolean | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const loadReservedUsernames = () => {
    try {
      const stored = localStorage.getItem(CREATOR_USERNAMES_KEY)
      return stored ? (JSON.parse(stored) as string[]) : []
    } catch (error) {
      console.error("Failed to read reserved usernames", error)
      return []
    }
  }

  const reserveUsername = (username: string) => {
    const list = loadReservedUsernames()
    if (!list.includes(username)) {
      localStorage.setItem(CREATOR_USERNAMES_KEY, JSON.stringify([...list, username]))
    }
  }

  // Step 1: Welcome with animation
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="text-8xl font-bold mb-4 neon-glow animate-bounce-slow">₿</div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-primary animate-spin-slow" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to Bonocoin
            </h1>
            <p className="text-muted-foreground text-lg">Support creators. Get rewarded. Be both.</p>
          </div>

          <Card className="bg-card/80 backdrop-blur-md border-border p-8 mb-6 space-y-6 shadow-2xl">
            <div className="flex items-start gap-4 animate-slide-in-left">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Support Creators</h3>
                <p className="text-sm text-muted-foreground">Buy coins and support your favorite creators instantly</p>
              </div>
            </div>

            <div className="flex items-start gap-4 animate-slide-in-left" style={{ animationDelay: '0.2s', animationFillMode: 'both', opacity: 0 }}>
              <div className="p-3 bg-secondary/10 rounded-xl">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Become a Creator</h3>
                <p className="text-sm text-muted-foreground">Set up your profile and receive support from your audience</p>
              </div>
            </div>

            <div className="flex items-start gap-4 animate-slide-in-left" style={{ animationDelay: '0.4s', animationFillMode: 'both', opacity: 0 }}>
              <div className="p-3 bg-accent/10 rounded-xl">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Dual Roles</h3>
                <p className="text-sm text-muted-foreground">You can be both a supporter and a creator at the same time</p>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => setStep(2)}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all animate-fade-in"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

      </div>
    )
  }

  // Step 2: Telegram Login
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4 neon-glow animate-bounce-slow">₿</div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Connect with Telegram</h2>
            <p className="text-muted-foreground">Secure login with your Telegram account</p>
          </div>

          <Card className="bg-card/80 backdrop-blur-md border-border p-8 mb-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Secure & Private</p>
                  <p className="text-xs text-muted-foreground">Your data is encrypted and safe</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <Zap className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-semibold text-foreground">Instant Access</p>
                  <p className="text-xs text-muted-foreground">No passwords needed</p>
                </div>
              </div>
            </div>
          </Card>

          <Button
            onClick={async () => {
              setIsLoading(true)
              try {
                await new Promise((resolve) => setTimeout(resolve, 1500))
                const mockUser = {
                  id: Math.random().toString(),
                  telegram_id: "123456789",
                  username: "user_" + Date.now(),
                  first_name: "User",
                  last_name: "Name",
                  balance: 0,
                  type: "user",
                }
                setUserData(mockUser)
                setStep(3)
              } catch (error) {
                console.error("Login error:", error)
              } finally {
                setIsLoading(false)
              }
            }}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 h-14 text-lg font-semibold text-primary-foreground shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2">₿</div>
                Connecting...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Login with Telegram
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: Ask if they want to be a creator
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(2)}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4 neon-glow">₿</div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome!</h2>
            <p className="text-muted-foreground">Would you like to set up a creator profile?</p>
          </div>

          <Card className="bg-card/80 backdrop-blur-md border-border p-8 mb-6 shadow-2xl">
            <div className="space-y-4">
              <button
                onClick={() => setWantsToBeCreator(true)}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  wantsToBeCreator === true
                    ? "border-secondary bg-secondary/10 shadow-lg"
                    : "border-border hover:border-secondary/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Yes, I'm a Creator</h3>
                    <p className="text-sm text-muted-foreground">Set up your profile to receive support</p>
                  </div>
                  {wantsToBeCreator === true && (
                    <CheckCircle2 className="w-6 h-6 text-secondary" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setWantsToBeCreator(false)}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  wantsToBeCreator === false
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Not Now</h3>
                    <p className="text-sm text-muted-foreground">I'll just support creators for now</p>
                  </div>
                  {wantsToBeCreator === false && (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  )}
                </div>
              </button>
            </div>
          </Card>

          <Button
            onClick={() => {
              if (wantsToBeCreator === true) {
                setStep(4)
              } else {
                onSuccess({ user: userData })
              }
            }}
            disabled={wantsToBeCreator === null}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-14 text-lg font-semibold text-primary-foreground shadow-lg disabled:opacity-50"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  // Step 4: Creator Profile Setup
  if (step === 4) {
    const handleAddLink = () => {
      setCreatorData({
        ...creatorData,
        links: [...creatorData.links, ""],
      })
    }

    const handleRemoveLink = (index: number) => {
      setCreatorData({
        ...creatorData,
        links: creatorData.links.filter((_, i) => i !== index),
      })
    }

    const handleLinkChange = (index: number, value: string) => {
      const newLinks = [...creatorData.links]
      newLinks[index] = value
      setCreatorData({ ...creatorData, links: newLinks })
    }

    const handleComplete = async () => {
      if (!creatorData.display_name.trim()) {
        setFormError("Display name is required")
        return
      }

      const usernameInput = creatorData.handle.trim()
      if (!usernameInput) {
        setUsernameError("Username is required")
        return
      }

      const normalizedUsername = usernameInput.startsWith("@") ? usernameInput.slice(1) : usernameInput
      const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/
      if (!usernamePattern.test(normalizedUsername)) {
        setUsernameError("Use 3-20 letters, numbers, or underscores.")
        return
      }

      const reserved = loadReservedUsernames()
      if (reserved.includes(normalizedUsername.toLowerCase())) {
        setUsernameError("That username is already taken.")
        return
      }

      setUsernameError(null)
      setFormError(null)

      const formattedUsername = `@${normalizedUsername}`

      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const mockCreator = {
          id: Math.random().toString(),
          user_id: userData.id,
          handle: formattedUsername,
          channel_username: creatorData.channel_username.trim(),
          display_name: creatorData.display_name.trim(),
          bio: creatorData.bio,
          links: creatorData.links.filter((l) => l.trim()),
          support_link_id: generateSupportLinkId(),
          balance: 0,
          type: "creator",
        }

        reserveUsername(normalizedUsername.toLowerCase())
        onSuccess({ user: userData, creator: mockCreator })
      } catch (error) {
        console.error("Registration error:", error)
        setFormError("Registration failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(3)}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4 neon-glow">₿</div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Creator Profile</h2>
            <p className="text-muted-foreground">Set up your profile to start receiving support</p>
          </div>

          <Card className="bg-card/80 backdrop-blur-md border-border p-6 space-y-5 shadow-2xl">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                 Username (permanent) *
              </label>
              <Input
                value={creatorData.handle}
                onChange={(e) => {
                  setCreatorData({
                    ...creatorData,
                    handle: e.target.value,
                  })
                  setUsernameError(null)
                }}
                placeholder="@mycreatorname"
                className="bg-input border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Choose a short unique handle (e.g. @techcreator). Usernames must be unique and cannot be changed later.
              </p>
              {usernameError && <p className="text-xs text-destructive mt-1">{usernameError}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Display Name *
              </label>
              <Input
                value={creatorData.display_name}
                onChange={(e) =>
                  setCreatorData({ ...creatorData, display_name: e.target.value })
                }
                placeholder="Your Name"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                Telegram Channel or Group
              </label>
              <Input
                value={creatorData.channel_username}
                onChange={(e) =>
                  setCreatorData({ ...creatorData, channel_username: e.target.value })
                }
                placeholder="@mytelegramchannel or https://t.me/mychannel"
                className="bg-input border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">Let supporters find your Telegram presence.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-2 block">Bio</label>
              <Textarea
                value={creatorData.bio}
                onChange={(e) => setCreatorData({ ...creatorData, bio: e.target.value })}
                placeholder="Tell your supporters about you..."
                className="bg-input border-border text-foreground text-sm resize-none"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-muted-foreground">Links</label>
                <Button
                  onClick={handleAddLink}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary h-7"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {creatorData.links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder="https://example.com"
                      className="bg-input border-border text-foreground text-sm flex-1"
                    />
                    {creatorData.links.length > 1 && (
                      <Button
                        onClick={() => handleRemoveLink(index)}
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {formError && <p className="text-sm text-destructive mb-4">{formError}</p>}

          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-14 text-lg font-semibold text-primary-foreground shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2">₿</div>
                Setting up...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2" />
                Complete Setup
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return null
}

