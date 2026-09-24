/**
 * Routes that render without site chrome: no header, footer, first-visit popup,
 * sticky mobile CTA bar, or floating chat widgets. /links is the link-in-bio page
 * every social profile points at; visitors arrive cold on a phone, and anything
 * layered over the links competes with the one tap they came to make.
 */
const STANDALONE_ROUTES: readonly string[] = ["/links"]

export function isStandaloneRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  return STANDALONE_ROUTES.includes(normalized)
}
