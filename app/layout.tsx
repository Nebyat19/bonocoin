import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Bonocoin - Support Your Creators",
  description: "Support creators with bonocoins on Telegram",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} ${geistMono.variable} antialiased bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
