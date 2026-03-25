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

export function backendUrl(pathname: string) {
  const base = BACKEND_BASE_URL.replace(/\/$/, "")
  // Strip legacy /api prefix — the Edge Function is named "api" so that segment is already
  // consumed by Supabase routing. Routes inside Hono are at / (not /api/).
  const stripped = pathname.replace(/^\/api(?=\/|$)/, "")
  const path = stripped.startsWith("/") ? stripped : `/${stripped}`
  return `${base}${path}`
}

