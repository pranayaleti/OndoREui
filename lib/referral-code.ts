/**
 * Remembers a friend's Ondo referral code in this browser, so a visitor who
 * lands on /referral/?ref=CODE and later starts a rental application gets the
 * code filled in for them. The server re-checks every code; this is only a
 * convenience, so storage failures (private mode, blocked storage) are ignored.
 */
const KEY = "ondo_referral_code"
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000

/** Uppercase, no spaces. Mirrors normalizeReferralCode on the server. */
export function normalizeReferralCode(raw: string | null | undefined): string | null {
  const code = (raw ?? "").replace(/\s+/g, "").toUpperCase()
  return code.length >= 4 && code.length <= 32 && /^[A-Z0-9_-]+$/.test(code) ? code : null
}

export function rememberReferralCode(raw: string | null | undefined, now = Date.now()): void {
  const code = normalizeReferralCode(raw)
  if (!code) return
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ code, savedAt: now }))
  } catch {
    // Storage blocked: the visitor can still type the code.
  }
}

export function readReferralCode(now = Date.now()): string | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { code?: string; savedAt?: number }
    if (typeof parsed.savedAt !== "number" || now - parsed.savedAt > MAX_AGE_MS) return null
    return normalizeReferralCode(parsed.code)
  } catch {
    return null
  }
}

/** The code in the current URL (?ref=), else the remembered one. */
export function referralCodeForThisVisit(search: string, now = Date.now()): string | null {
  const fromUrl = normalizeReferralCode(new URLSearchParams(search).get("ref"))
  if (fromUrl) {
    rememberReferralCode(fromUrl, now)
    return fromUrl
  }
  return readReferralCode(now)
}
