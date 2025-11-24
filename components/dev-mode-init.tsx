"use client"

import { useEffect } from "react"
import { isDevMode, createMockTelegramWebApp } from "@/lib/dev-mode"

export default function DevModeInit() {
  useEffect(() => {
    if (isDevMode && typeof window !== "undefined") {
      // Wait a bit for Telegram script to load (or not)
      setTimeout(() => {
        if (!window.Telegram?.WebApp?.initData) {
          createMockTelegramWebApp()
        }
      }, 100)
    }
  }, [])

  return null
}

