"use client"

import { useEffect, useState } from "react"
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
  Shield,
  AlertCircle
} from "lucide-react"
import { generateSupportLinkId } from "@/lib/utils/crypto"
import type { StoredCreator, StoredUser } from "@/types/models"

// Creator usernames are now stored in the database, no need for localStorage

interface OnboardingResult {
  user: StoredUser
  creator?: StoredCreator
}

interface CreatorFormState {
  handle: string
  channel_username: string
  display_name: string
  bio: string
  links: string[]
}

interface OnboardingProps {
  onSuccess: (data: OnboardingResult) => void
}

declare global {
  interface TelegramWebApp {
    initData?: string
    initDataUnsafe?: {
      user?: {
        id: number
        first_name?: string
        last_name?: string
        username?: string
      }
    }
    ready?: () => void
    expand?: () => void
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

export default function UnifiedOnboarding({ onSuccess }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<StoredUser | null>(null)
  const [creatorData, setCreatorData] = useState<CreatorFormState>({
    handle: "",
    channel_username: "",
    display_name: "",
    bio: "",
    links: [""],
  })
  const [wantsToBeCreator, setWantsToBeCreator] = useState<boolean | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready?.()
      window.Telegram.WebApp.expand?.()
    }
  }, [])

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/creator/check-username?handle=${encodeURIComponent(username)}`)
      if (response.ok) {
        const data = await response.json()
        return data.available === true
      }
      return false
    } catch (error) {
      console.error("Error checking username:", error)
      return false
    }
  }

  const handleTelegramLogin = async () => {
    setIsLoading(true)
    setAuthError(null)
    setFormError(null)
    try {
      const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined

      if (!telegramApp?.initData || !telegramApp.initDataUnsafe?.user) {
        setAuthError("Please open this Mini App inside Telegram to continue.")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/telegram-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData: telegramApp.initData }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setAuthError(payload.error || "Unable to authenticate with Telegram.")
        setIsLoading(false)
        return
      }

      const payload = await response.json()
      setUserData(payload.user as StoredUser)
      setStep(3)
    } catch (error) {
      console.error("Telegram auth error:", error)
      setAuthError("Failed to connect to Telegram. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 1: Welcome with animation
  if (step === 1) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="text-6xl sm:text-8xl font-bold mb-4 neon-glow animate-bounce-slow">₿</div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-primary animate-spin-slow" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
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

            <div className="flex items-start gap-4 animate-slide-in-left" style={{ animationDelay: "0.2s", animationFillMode: "both", opacity: 0 }}>
              <div className="p-3 bg-secondary/10 rounded-xl">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Become a Creator</h3>
                <p className="text-sm text-muted-foreground">Set up your profile and receive support from your audience</p>
              </div>
            </div>

        
          </Card>

          <Button
            onClick={() => setStep(2)}
            className="w-full bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all animate-fade-in"
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
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
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
            <div className="text-4xl sm:text-6xl font-bold mb-4 neon-glow animate-bounce-slow">₿</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Connect with Telegram</h2>
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

          {authError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
              <AlertCircle className="h-4 w-4" />
              <span>{authError}</span>
            </div>
          )}

          <Button
            onClick={handleTelegramLogin}
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
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
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
            <div className="text-4xl sm:text-6xl font-bold mb-4 neon-glow">₿</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Welcome!</h2>
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
                    <h3 className="font-semibold text-foreground mb-1">Yes, I&rsquo;m a Creator</h3>
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
                    <p className="text-sm text-muted-foreground">I&rsquo;ll just support creators for now</p>
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
                if (!userData) {
                  setFormError("Please finish connecting your Telegram account.")
                  return
                }
                onSuccess({ user: userData })
              }
            }}
            disabled={wantsToBeCreator === null}
            className="w-full bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-14 text-lg font-semibold text-primary-foreground shadow-lg disabled:opacity-50"
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
      if (!userData) {
        setFormError("Please connect your Telegram account first.")
        return
      }
      const currentUser: StoredUser = userData

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

      // Check username availability via API
      const isAvailable = await checkUsernameAvailability(normalizedUsername.toLowerCase())
      if (!isAvailable) {
        setUsernameError("That username is already taken.")
        return
      }

      setUsernameError(null)
      setFormError(null)

      setIsLoading(true)
      try {
        // Create creator via API
        const response = await fetch("/api/creator/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUser.id,
            handle: normalizedUsername.toLowerCase(),
            channel_username: creatorData.channel_username.trim(),
            display_name: creatorData.display_name.trim(),
            bio: creatorData.bio || null,
            links: creatorData.links.filter((l) => l.trim()),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to create creator profile")
        }

        const createdCreator = await response.json()
        
        // Small delay to ensure database transaction is committed
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        // Refresh user data to get updated creator info
        const telegramApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined
        const telegramId = telegramApp?.initDataUnsafe?.user?.id || currentUser.telegram_id
        
        // Try to fetch updated user data with retry
        let userData = null
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const userResponse = await fetch(`/api/user?telegram_id=${telegramId}`)
            if (userResponse.ok) {
              userData = await userResponse.json()
              if (userData.creator) {
                break // Creator found, exit retry loop
              }
            }
          } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error)
          }
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 500)) // Wait before retry
          }
        }
        
        if (userData && userData.creator) {
          onSuccess({ user: userData.user, creator: userData.creator })
        } else {
          // Fallback to created creator data if API doesn't return it yet
          onSuccess({ user: currentUser, creator: createdCreator })
        }
      } catch (error) {
        console.error("Registration error:", error)
        setFormError(error instanceof Error ? error.message : "Registration failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
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
            <div className="text-4xl sm:text-6xl font-bold mb-4 neon-glow">₿</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Creator Profile</h2>
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
              {usernameError && <p className="text-xs text-primary mt-1">{usernameError}</p>}
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

          {formError && <p className="text-sm text-primary mb-4">{formError}</p>}

          <Button
            onClick={handleComplete}
            disabled={isLoading}
            className="w-full mt-6 bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-14 text-lg font-semibold text-primary-foreground shadow-lg"
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

