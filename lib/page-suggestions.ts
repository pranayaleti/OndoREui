/**
 * "Did you mean" suggestions for the 404 page.
 *
 * scripts/generate-discovery-files.ts writes /page-index.json (path + title of every indexable
 * page) after the build; the 404 page fetches it only when someone actually lands on a missing
 * URL, so no other page pays for it.
 */
export type PageIndexEntry = { p: string; t: string }

const BRAND_SUFFIX = /\s*\|\s*(Ondo RE|Ondo Real Estate|ONDO Notary)\s*$/i

function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
}

/** Index entry for one exported page, or null for redirects, noindex pages and untitled pages. */
export function extractPageIndexEntry(html: string, path: string): PageIndexEntry | null {
  if (/<meta\b[^>]*http-equiv=["']?refresh/i.test(html)) return null
  if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) return null
  const raw = /<title>([^<]*)<\/title>/i.exec(html)?.[1]
  if (!raw) return null
  let title = decodeEntities(raw).trim()
  // Titles can carry the brand twice ("... | Ondo RE | Ondo RE"); strip until it is gone.
  while (BRAND_SUFFIX.test(title)) title = title.replace(BRAND_SUFFIX, "").trim()
  return title ? { p: path, t: title } : null
}

function normalizePath(pathname: string): string {
  let path = pathname
  try {
    path = decodeURIComponent(pathname)
  } catch {
    // keep the raw path when it is not valid percent-encoding
  }
  return path.toLowerCase().split(/[?#]/)[0]!.replace(/\/{2,}/g, "/").replace(/\/+$/, "")
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(current[j - 1]! + 1, previous[j]! + 1, previous[j - 1]! + cost)
    }
    previous = current
  }
  return previous[b.length]!
}

const tokensOf = (segments: string[]) => new Set(segments.flatMap((segment) => segment.split(/[-_.]+/)).filter((token) => token.length > 1))

/** Minimum score for a page to be offered; below it, the popular pages on the 404 page do the job. */
const MIN_SCORE = 0.5

/** Pages most likely meant by a URL that does not exist, best first. */
export function rankPageSuggestions(requestedPath: string, index: readonly PageIndexEntry[], limit = 4): PageIndexEntry[] {
  const requested = normalizePath(requestedPath)
  const requestedSegments = requested.split("/").filter(Boolean)
  const last = requestedSegments[requestedSegments.length - 1]
  if (!last) return []
  const requestedTokens = tokensOf(requestedSegments)

  const scored: Array<{ entry: PageIndexEntry; score: number }> = []
  for (const entry of index) {
    const segments = normalizePath(entry.p).split("/").filter(Boolean)
    const entryLast = segments[segments.length - 1]
    if (!entryLast) continue
    // Typos in the final segment ("/calculators/mortage-payment").
    const lastSimilarity = 1 - levenshtein(last, entryLast) / Math.max(last.length, entryLast.length)
    // A known page name under another section ("/lehi" -> "/locations/lehi/").
    const namedSection = segments.includes(last) ? 0.95 : 0
    const tokens = tokensOf(segments)
    let shared = 0
    for (const token of requestedTokens) if (tokens.has(token)) shared++
    const overlap = shared / (requestedTokens.size + tokens.size - shared || 1)
    const sameSection = segments[0] === requestedSegments[0] ? 0.1 : 0
    const score = Math.max(lastSimilarity, namedSection) * 0.65 + overlap * 0.35 + sameSection
    if (score >= MIN_SCORE) scored.push({ entry, score })
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.p.length - b.entry.p.length || a.entry.p.localeCompare(b.entry.p))
    .slice(0, limit)
    .map(({ entry }) => entry)
}
