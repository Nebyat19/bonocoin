"use client"

import { Bell, Settings } from "lucide-react"

export default function Header() {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-10">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            ₿
          </div>
          <span className="font-bold text-lg">Bonocoin</span>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition">
            <Bell className="w-4 h-4 text-foreground" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition">
            <Settings className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
