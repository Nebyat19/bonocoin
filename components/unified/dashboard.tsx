"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Users, Sparkles } from "lucide-react"
import UnifiedHeader from "./header"
import UserBalance from "@/components/user/balance-card"
import BuyCoins from "@/components/user/buy-coins"
import SendCoins from "@/components/user/send-coins"
import UserTransactionHistory from "@/components/user/transaction-history"
import CreatorBalance from "@/components/creator/balance-card"
import CreatorProfile from "@/components/creator/profile"
import SupportersList from "@/components/creator/supporters-list"
import WithdrawalRequest from "@/components/creator/withdrawal-request"

interface UnifiedDashboardProps {
  user: any
  creator?: any
  onCreatorCreated?: (creator: any) => void
}

export default function UnifiedDashboard({ user, creator, onCreatorCreated }: UnifiedDashboardProps) {
  const [activeTab, setActiveTab] = useState("support")
  const [userBalance, setUserBalance] = useState(user.balance || 0)
  const [creatorBalance, setCreatorBalance] = useState(creator?.balance || 0)
  const [currentCreator, setCurrentCreator] = useState(creator)

  return (
    <div className="min-h-screen bg-background pb-20">
      <UnifiedHeader user={user} creator={creator} />
      <main className="max-w-md mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex w-full h-12 bg-muted/30 mb-6 rounded-lg p-1 gap-1 border border-border/30">
            <TabsTrigger 
              value="support" 
              className="flex-1 flex items-center justify-center gap-2 h-full rounded-md font-semibold text-sm transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:bg-transparent"
            >
              <Coins className="w-4 h-4" />
              <span>Support</span>
            </TabsTrigger>
            {currentCreator && (
              <TabsTrigger 
                value="creator" 
                className="flex-1 flex items-center justify-center gap-2 h-full rounded-md font-semibold text-sm transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:bg-transparent"
              >
                <Users className="w-4 h-4" />
                <span>Creator</span>
              </TabsTrigger>
            )}
            {!currentCreator && (
              <TabsTrigger 
                value="become-creator" 
                className="flex-1 flex items-center justify-center gap-2 h-full rounded-md font-semibold text-sm transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:bg-transparent"
              >
                <Sparkles className="w-4 h-4" />
                <span>Become Creator</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Support Tab - User Features */}
          <TabsContent value="support" className="space-y-6">
            <UserBalance balance={userBalance} />
            <Tabs defaultValue="balance" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted mb-4">
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
              </TabsList>
              <TabsContent value="balance" className="space-y-6">
                <UserTransactionHistory />
              </TabsContent>
              <TabsContent value="buy" className="space-y-6">
                <BuyCoins onSuccess={(amount) => setUserBalance(userBalance + amount)} />
              </TabsContent>
              <TabsContent value="send" className="space-y-6">
                <SendCoins 
                  currentBalance={userBalance} 
                  onSuccess={(amount) => setUserBalance(userBalance - amount)} 
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Creator Tab */}
          {currentCreator && (
            <TabsContent value="creator" className="space-y-6">
              <CreatorBalance balance={creatorBalance} />
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-muted mb-4 text-xs">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="supporters">Supporters</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-6">
                  <CreatorProfile creator={currentCreator} />
                </TabsContent>
                <TabsContent value="supporters" className="space-y-6">
                  <SupportersList creator={currentCreator} />
                </TabsContent>
                <TabsContent value="withdraw" className="space-y-6">
                  <WithdrawalRequest currentBalance={creatorBalance} />
                </TabsContent>
                <TabsContent value="stats" className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-foreground mb-4">Creator Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Supporters</span>
                        <span className="font-semibold text-foreground">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Received</span>
                        <span className="font-semibold text-foreground">{creatorBalance.toFixed(2)} BONO</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support Link</span>
                        <span className="font-semibold text-primary text-xs">
                          /support/{currentCreator.support_link_id}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}

          {/* Become Creator Tab */}
          {!currentCreator && (
            <TabsContent value="become-creator" className="space-y-6">
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-lg p-8 text-center">
                <div className="text-6xl font-bold mb-4 neon-glow animate-bounce-slow">₿</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Become a Creator</h2>
                <p className="text-muted-foreground mb-6">
                  Set up your creator profile to start receiving support from your audience
                </p>
                <button
                  onClick={() => {
                    window.location.href = "/creator"
                  }}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 text-base font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Set Up Creator Profile
                </button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

