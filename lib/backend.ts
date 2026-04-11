/**
 * Base URL for the runtime backend used by the static export.
 * Keep this as a public env var so it works client-side.
 * Points to the Supabase Edge Function — Supabase strips the /functions/v1/api prefix
 * before passing the request to Hono, so routes inside the function start at /.
 *
 * IMPORTANT: NEXT_PUBLIC_BACKEND_BASE_URL must be set in the environment.
 * In local dev: set in .env.local
 * In CI/deploy: set as a build arg or environment variable
 */
export const BACKEND_BASE_URL: string =
  process.env['NEXT_PUBLIC_BACKEND_BASE_URL'] || ''

if (typeof window !== 'undefined' && !BACKEND_BASE_URL && process.env.NODE_ENV === 'development') {
  console.warn('[OndoRE] NEXT_PUBLIC_BACKEND_BASE_URL is not set — API calls will use relative paths')
}

/** True when base URL's path already ends with `/api` (Supabase …/functions/v1/api or http://localhost:3000/api). */
function baseAlreadyIncludesApiSegment(base: string): boolean {
  try {
    const pathname = new URL(base).pathname.replace(/\/+$/, "") || "/"
    return pathname.endsWith("/api")
  } catch {
    return false
  }
}

export function backendUrl(pathname: string) {
  const base = BACKEND_BASE_URL.replace(/\/$/, "")
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  // Same-origin Next.js API routes: keep /api prefix when no external base is set.
  if (!base) {
    return path
  }
  // Only strip `/api` from the pathname when the base URL already ends with `/api`
  // (Supabase Edge function URL). For `http://localhost:3000` without `/api`, keep `/api/...`.
  const pathToJoin = baseAlreadyIncludesApiSegment(base)
    ? pathname.replace(/^\/api(?=\/|$)/, "")
    : pathname
  const normalized = pathToJoin.startsWith("/") ? pathToJoin : `/${pathToJoin}`
  return `${base}${normalized}`
}

