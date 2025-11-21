"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import PublicCreatorPage from "@/components/public/creator-page"
import type { StoredCreator } from "@/types/models"

type PublicCreator = StoredCreator & {
  balance: number
  is_active: boolean
}

export default function SupportPage() {
  const params = useParams()
  const linkId = params.linkId as string
  const [creator, setCreator] = useState<PublicCreator | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCreator = async () => {
      try {
        // Mock loading creator by support link ID
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockCreator: PublicCreator = {
          id: "1",
          display_name: "Tech Creator",
          channel_username: "@techcreator",
          bio: "Creating amazing tech content for everyone",
          links: ["https://youtube.com/techcreator", "https://twitter.com/techcreator"],
          support_link_id: linkId,
          balance: 1250,
          is_active: true,
        }

        setCreator(mockCreator)
      } catch (loadError) {
        console.error("Failed to load creator", loadError)
        setError("Creator not found")
      } finally {
        setIsLoading(false)
      }
    }

    loadCreator()
  }, [linkId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="text-4xl">₿</div>
          </div>
          <p className="text-muted-foreground">Loading creator profile...</p>
        </div>
      </div>
    )
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Creator Not Found</h1>
          <p className="text-muted-foreground mb-6">The support link you&rsquo;re looking for doesn&rsquo;t exist.</p>
          <Link href="/" className="text-primary hover:text-primary/80 font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return <PublicCreatorPage creator={creator} />
}
