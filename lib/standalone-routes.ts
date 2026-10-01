/**
 * Routes that render without site chrome: no header, footer, first-visit popup,
 * sticky mobile CTA bar, or floating chat widgets. /links is the link-in-bio page
 * every social profile points at; visitors arrive cold on a phone, and anything
 * layered over the links competes with the one tap they came to make.
 *
 * /go/<placement>/ (lib/qr-placements.ts) are the printed QR short links. They only redirect to
 * /links, so they match by prefix and ship no chrome: on cellular every extra byte delays the hop.
 */
const STANDALONE_ROUTES: readonly string[] = ["/links"]
const STANDALONE_PREFIXES: readonly string[] = ["/go"]

export function isStandaloneRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  if (STANDALONE_ROUTES.includes(normalized)) return true
  return STANDALONE_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))
}
