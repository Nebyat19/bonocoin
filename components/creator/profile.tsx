"use client"

import { Card } from "@/components/ui/card"
import { LinkIcon, FileText } from "lucide-react"

interface CreatorProfileProps {
  creator: any
}

export default function CreatorProfile({ creator }: CreatorProfileProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-card border-border p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Profile Information
        </h3>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Display Name</p>
            <p className="font-semibold text-foreground">{creator.display_name}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Channel</p>
            <p className="font-semibold text-foreground">{creator.channel_username}</p>
          </div>

          {creator.bio && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Bio</p>
              <p className="text-foreground text-sm">{creator.bio}</p>
            </div>
          )}
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
