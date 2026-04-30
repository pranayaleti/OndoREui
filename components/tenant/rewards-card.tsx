"use client"

import { useState, useEffect } from "react"
import { getTenantRewards, getRewardHistory, redeemRewardPoints, unwrapData } from "../../lib/api/tenant-services"

interface RewardData {
  balance: number
  tier?: string
  totalEarned?: number
}

interface HistoryItem {
  id: string
  points: number
  description: string
  createdAt: string
  type: "earned" | "redeemed" | string
}

interface RewardsCardProps {
  propertyId?: string
}

const TIERS = [
  { name: "Bronze", min: 0, color: "bg-orange-100 text-orange-700", next: 1000 },
  { name: "Silver", min: 1000, color: "bg-muted text-gray-700", next: 5000 },
  { name: "Gold", min: 5000, color: "bg-yellow-100 text-yellow-700", next: 10000 },
  { name: "Platinum", min: 10000, color: "bg-purple-100 text-purple-700", next: null },
]

function getTier(balance: number) {
  return (
    [...TIERS].reverse().find((t) => balance >= t.min) ?? TIERS[0]
  )
}

export function RewardsCard({ propertyId }: RewardsCardProps) {
  const [rewards, setRewards] = useState<RewardData | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showRedeem, setShowRedeem] = useState(false)
  const [redeemPoints, setRedeemPoints] = useState("")
  const [redeemDesc, setRedeemDesc] = useState("")
  const [redeeming, setRedeeming] = useState(false)
  const [redeemError, setRedeemError] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [rwRes, histRes] = await Promise.all([
          getTenantRewards(propertyId),
          getRewardHistory(propertyId),
        ])
        setRewards(unwrapData<RewardData>(rwRes) ?? (rwRes as RewardData | null) ?? null)
        const h = unwrapData<HistoryItem[]>(histRes) ?? (histRes as HistoryItem[] | null) ?? []
        setHistory(Array.isArray(h) ? h : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rewards")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [propertyId])

  const handleRedeem = async () => {
    const pts = parseInt(redeemPoints, 10)
    if (!pts || pts <= 0) return
    setRedeeming(true)
    setRedeemError("")
    try {
      await redeemRewardPoints({ points: pts, description: redeemDesc })
      setRewards((prev) => prev ? { ...prev, balance: prev.balance - pts } : prev)
      setShowRedeem(false)
      setRedeemPoints("")
      setRedeemDesc("")
    } catch (err) {
      setRedeemError(err instanceof Error ? err.message : "Redemption failed")
    } finally {
      setRedeeming(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center text-gray-400 text-sm">
        Loading rewards...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border rounded-lg p-4">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  const balance = rewards?.balance ?? 0
  const tier = getTier(balance)
  const nextTierPts = tier.next !== null ? tier.next - balance : null

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      {/* Balance & Tier */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Points Balance</p>
          <p className="text-3xl font-bold text-gray-900">{balance.toLocaleString()}</p>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${tier.color}`}>
          {tier.name}
        </span>
      </div>

      {/* Progress to next tier */}
      {nextTierPts !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{tier.name}</span>
            <span>{nextTierPts.toLocaleString()} pts to next tier</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  ((balance - tier.min) / (tier.next! - tier.min)) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      )}
      {nextTierPts === null && (
        <p className="text-xs text-purple-600 font-medium">You are at the highest tier!</p>
      )}

      {/* Redeem button */}
      <button
        onClick={() => setShowRedeem((v) => !v)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        {showRedeem ? "Cancel" : "Redeem Points"}
      </button>

      {/* Redeem form */}
      {showRedeem && (
        <div className="border rounded-lg p-3 space-y-2 bg-muted">
          <div>
            <label htmlFor="rewards-redeem-points" className="block text-xs font-medium text-gray-700 mb-1">Points to Redeem</label>
            <input
              id="rewards-redeem-points"
              type="number"
              min={1}
              max={balance}
              value={redeemPoints}
              onChange={(e) => setRedeemPoints(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter points"
            />
          </div>
          <div>
            <label htmlFor="rewards-redeem-description" className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <input
              id="rewards-redeem-description"
              type="text"
              value={redeemDesc}
              onChange={(e) => setRedeemDesc(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What are you redeeming for?"
            />
          </div>
          {redeemError && <p className="text-xs text-red-500">{redeemError}</p>}
          <button
            onClick={handleRedeem}
            disabled={redeeming || !redeemPoints}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {redeeming ? "Redeeming..." : "Confirm Redemption"}
          </button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Points History</h3>
          <div className="space-y-1.5">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-800">{item.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    item.type === "redeemed" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {item.type === "redeemed" ? "-" : "+"}
                  {Math.abs(item.points).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
