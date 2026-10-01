/**
 * Compact number formatting for market stats (city hub, guides, market reports).
 * Values under 10,000 keep full precision ("1,450"), so a median rent never collapses to "$1K".
 * Larger values use K and M ("$450K", "$1.2M").
 */
export function formatCompactNumber(n: number): string {
  const abs = Math.abs(n)
  if (abs < 10_000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 })
  const thousands = Math.round(n / 1_000)
  if (Math.abs(thousands) < 1_000) return `${thousands}K`
  return `${(n / 1_000_000).toFixed(1)}M`
}

export function formatCompactUsd(n: number): string {
  return n < 0 ? `-$${formatCompactNumber(-n)}` : `$${formatCompactNumber(n)}`
}
