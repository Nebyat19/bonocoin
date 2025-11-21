"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreatorBalance from "./balance-card"
import CreatorProfile from "./profile"
import WithdrawalRequest from "./withdrawal-request"
import SupportersList from "./supporters-list"
import CreatorHeader from "./header"
import type { StoredCreator } from "@/types/models"

interface CreatorDashboardProps {
  creator: StoredCreator
}

export default function CreatorDashboard({ creator }: CreatorDashboardProps) {
  const [activeTab, setActiveTab] = useState("balance")
  const [creatorData, setCreatorData] = useState<StoredCreator>(creator)
  const balance = useMemo(() => Number(creatorData.balance ?? 0), [creatorData.balance])

  return (
    <div className="min-h-screen bg-background pb-20">
      <CreatorHeader creator={creatorData} />
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
            <CreatorProfile
              creator={creatorData}
              onProfileUpdate={(updated) => {
                setCreatorData(updated)
              }}
            />
          </TabsContent>

          <TabsContent value="supporters" className="space-y-6">
            <SupportersList creatorId={creatorData.id!} />
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <WithdrawalRequest currentBalance={balance} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
