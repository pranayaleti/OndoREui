import { networkFirstGet, postJson } from "@/lib/api/http"

export interface ReferralCode {
  id: string
  userId: string | null
  code: string
  source: "user_referral" | "affiliate"
  maxCredits: number
  totalReferrals: number
  isActive: boolean
  createdAt: string
}

export interface ReferralStats {
  code: string
  totalReferrals: number
  creditsEarned: number
  creditsAvailable: number
  maxCredits: number
  sweepstakesEntries: number
  leaderboardPosition: number
}

export interface ReferralHistoryEntry {
  id: string
  referredEmail: string | null
  status: "clicked" | "signed_up" | "converted"
  createdAt: string
  convertedAt: string | null
}

export interface LeaderboardEntry {
  userId: string | null
  code: string
  totalReferrals: number
  displayName: string
}

export async function getMyReferralCode(): Promise<ReferralCode> {
  return networkFirstGet<ReferralCode>(
    "/api/referrals/my-code",
    "referral-my-code"
  )
}

export async function getReferralStats(): Promise<ReferralStats> {
  return networkFirstGet<ReferralStats>(
    "/api/referrals/stats",
    "referral-stats"
  )
}

export async function getReferralHistory(
  page = 1,
  limit = 20
): Promise<{ data: ReferralHistoryEntry[]; total: number }> {
  return networkFirstGet<{ data: ReferralHistoryEntry[]; total: number }>(
    `/api/referrals/history?page=${page}&limit=${limit}`,
    `referral-history-${page}`
  )
}

export async function redeemCredits(
  count: number
): Promise<{ message: string }> {
  return postJson<{ message: string }>(
    "/api/referrals/redeem",
    { count }
  )
}

export async function trackReferralClick(
  code: string,
  referredEmail?: string
): Promise<{ tracked: boolean }> {
  return postJson<{ tracked: boolean }>(
    "/api/referrals/track",
    { code, referredEmail }
  )
}

export async function getLeaderboard(
  limit = 10
): Promise<LeaderboardEntry[]> {
  return networkFirstGet<LeaderboardEntry[]>(
    `/api/referrals/leaderboard?limit=${limit}`,
    "referral-leaderboard"
  )
}
