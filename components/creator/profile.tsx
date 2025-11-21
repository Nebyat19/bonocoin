"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LinkIcon, FileText, Copy, Check, Plus, Trash2 } from "lucide-react"
import type { StoredCreator } from "@/types/models"

interface CreatorProfileProps {
  creator: StoredCreator
  onProfileUpdate?: (updatedCreator: StoredCreator) => void
}

interface ProfileFormState {
  handle: string
  channel_username: string
  display_name: string
  bio: string
  links: string[]
}

export default function CreatorProfile({ creator, onProfileUpdate }: CreatorProfileProps) {
  const [copied, setCopied] = useState(false)
  const [copiedUsername, setCopiedUsername] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileFormState>({
    handle: creator.handle || creator.channel_username || "",
    channel_username: creator.channel_username || "",
    display_name: creator.display_name || "",
    bio: creator.bio || "",
    links: Array.isArray(creator.links) ? creator.links : [],
  })

  useEffect(() => {
    setProfileData({
      handle: creator.handle || creator.channel_username || "",
      channel_username: creator.channel_username || "",
      display_name: creator.display_name || "",
      bio: creator.bio || "",
      links: Array.isArray(creator.links) ? creator.links : [],
    })
  }, [creator])

  const handleCopyLink = () => {
    const supportLink = `${window.location.origin}/support/${creator.support_link_id}`
    navigator.clipboard.writeText(supportLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyUsername = () => {
    const fallback = profileData.channel_username || profileData.display_name || ""
    const base = profileData.handle && profileData.handle.length > 0 ? profileData.handle : fallback
    const username = base.startsWith("@") ? base : `@${base}`
    navigator.clipboard.writeText(username)
    setCopiedUsername(true)
    setTimeout(() => setCopiedUsername(false), 2000)
  }

  const handleSaveProfile = () => {
    if (!profileData.display_name.trim()) {
      setFormError("Display name is required")
      return
    }

    const formattedUsername = profileData.handle.startsWith("@")
      ? profileData.handle
      : `@${profileData.handle}`

    const cleanedLinks = profileData.links.map((link) => link.trim()).filter(Boolean)

    const updatedCreator = {
      ...creator,
      handle: formattedUsername,
      channel_username: profileData.channel_username.trim(),
      display_name: profileData.display_name.trim(),
      bio: profileData.bio,
      links: cleanedLinks,
    }

    try {
      localStorage.setItem("creator", JSON.stringify(updatedCreator))
    } catch (error) {
      console.error("Failed to save creator profile:", error)
    }

    onProfileUpdate?.(updatedCreator)
    setProfileData({
      ...profileData,
      handle: formattedUsername,
      links: cleanedLinks,
    })
    setFormError(null)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setProfileData({
      handle: creator.handle || creator.channel_username || "",
      channel_username: creator.channel_username || "",
      display_name: creator.display_name || "",
      bio: creator.bio || "",
      links: Array.isArray(creator.links) ? creator.links : [],
    })
    setFormError(null)
    setIsEditing(false)
  }

  const handleAddLink = () => {
    setProfileData({
      ...profileData,
      links: [...profileData.links, ""],
    })
  }

  const handleRemoveLink = (index: number) => {
    setProfileData({
      ...profileData,
      links: profileData.links.filter((_, i) => i !== index),
    })
  }

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...profileData.links]
    newLinks[index] = value
    setProfileData({ ...profileData, links: newLinks })
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Profile Information
          </h3>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveProfile}>
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormError(null)
                  setIsEditing(true)
                }}
              >
                Edit
              </Button>
            )}
          </div>
        </div>

        {formError && <p className="text-sm text-destructive mb-4">{formError}</p>}

        {!isEditing ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Display Name</p>
              <p className="font-semibold text-foreground">{profileData.display_name}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Creator Username</p>
              <p className="font-semibold text-foreground">
                {(profileData.handle && profileData.handle.startsWith("@")) ? profileData.handle : `@${profileData.handle || "creator"}`}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Channel</p>
              <p className="font-semibold text-foreground">
                {profileData.channel_username || "Not provided"}
              </p>
            </div>

            {profileData.bio && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Bio</p>
                <p className="text-foreground text-sm">{profileData.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Display Name</label>
              <Input
                value={profileData.display_name}
                onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                placeholder="Creator Name"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Creator Username</label>
              <Input value={profileData.handle} disabled className="bg-muted cursor-not-allowed" />
              <p className="text-[11px] text-muted-foreground mt-1">Usernames are unique and cannot be changed.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Channel</label>
              <Input
                value={profileData.channel_username}
                onChange={(e) => setProfileData({ ...profileData, channel_username: e.target.value })}
                placeholder="@mytelegramchannel or https://t.me/mychannel"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Bio</label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell your supporters about you..."
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground">Links</label>
                <Button variant="ghost" size="sm" className="h-7" onClick={handleAddLink}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {profileData.links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder="https://example.com"
                      className="flex-1"
                    />
                    {profileData.links.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLink(index)}
                        className="h-10 w-10 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {profileData.links.length === 0 && (
                  <Button variant="outline" className="w-full" onClick={handleAddLink}>
                    Add your first link
                  </Button>
                )}
              </div>
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
        )}

        <div className="space-y-2 pt-4">
          <p className="text-xs text-muted-foreground">Creator Username</p>
          <Button
            onClick={handleCopyUsername}
            className="w-full mb-3 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 h-11 font-semibold transition-all"
            disabled={isEditing}
          >
            {copiedUsername ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Username Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                {(profileData.handle && profileData.handle.startsWith("@")) ? profileData.handle : `@${profileData.handle || profileData.channel_username || "creator"}`}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">Support Link</p>
          <Button
            onClick={handleCopyLink}
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-11 font-semibold transition-all"
            disabled={isEditing}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Support Link
              </>
            )}
          </Button>
        </div>
      </Card>

      {profileData.links && profileData.links.length > 0 && (
        <Card className="bg-card border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-accent" />
            Links
          </h3>

          <div className="space-y-2">
            {profileData.links.map((link: string, index: number) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-muted/50 hover:bg-muted rounded-lg text-sm text-primary hover:text-primary/80 truncate transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
