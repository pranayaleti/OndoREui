"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Gift, Loader2, Users, Check } from "lucide-react"
import { getMyReferralCode, getReferralStats, type ReferralCode, type ReferralStats } from "@/lib/api/referrals"
import { useToast } from "@/hooks/use-toast"

export function ReferralCard() {
  const [code, setCode] = useState<ReferralCode | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    Promise.all([getMyReferralCode(), getReferralStats()])
      .then(([codeRes, statsRes]) => {
        setCode(codeRes)
        setStats(statsRes)
      })
      .catch(() => {
        // Not authenticated or feature unavailable
      })
      .finally(() => setLoading(false))
  }, [])

  async function copyCode() {
    if (!code) return
    const url = `${window.location.origin}/referral/${code.code}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast({ title: "Link copied!", description: "Share this link with friends" })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Gift className="h-4 w-4" />
          Refer a Friend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : code ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="bg-muted px-3 py-1 rounded text-sm font-mono flex-1">
                {code.code}
              </code>
              <Button size="sm" variant="outline" onClick={copyCode}>
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            {stats && (
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span>{stats.totalReferrals} referred</span>
                </div>
                <Badge variant="secondary">
                  {stats.creditsEarned} credits earned
                </Badge>
                {stats.leaderboardPosition > 0 && (
                  <span className="text-muted-foreground">
                    #{stats.leaderboardPosition} on leaderboard
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sign in to get your referral code</p>
        )}
      </CardContent>
    </Card>
  )
}
