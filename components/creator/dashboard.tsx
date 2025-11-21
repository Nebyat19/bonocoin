"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreatorBalance from "./balance-card"
import CreatorProfile from "./profile"
import WithdrawalRequest from "./withdrawal-request"
import SupportersList from "./supporters-list"
import CreatorHeader from "./header"

interface CreatorDashboardProps {
  creator: any
}

export default function CreatorDashboard({ creator }: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState("balance")
  const [balance, setBalance] = useState(creator.balance || 0)

  return (
    <div className="min-h-screen bg-background pb-20">
      <CreatorHeader creator={creator} />
      <main className="max-w-md mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted mb-6 text-xs">
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="supporters">Supporters</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="space-y-6">
            <CreatorBalance balance={balance} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <CreatorProfile creator={creator} />
          </TabsContent>

          <TabsContent value="supporters" className="space-y-6">
            <SupportersList creator={creator} />
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <WithdrawalRequest currentBalance={balance} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
