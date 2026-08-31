/** Build-time shells for `output: "export"` — tokens are not enumerable at build time. */
export const SCHEDULE_EXPORT_SHELL = "__ondo_schedule_export_shell__"
export const CONFIRM_EXPORT_SHELL = "__ondo_visit_export_shell__"

function lastSegment(pathname: string, prefix: string, placeholder: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/"
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = new RegExp(`^${escaped}/([^/]+)$`).exec(normalized)
  if (!match?.[1]) return null
  let id = match[1]
  try {
    id = decodeURIComponent(id)
  } catch {
    return null
  }
  if (!id || id === placeholder) return null
  return id
}

export function scheduleTokenFromPathname(pathname: string): string | null {
  return lastSegment(pathname, "/visit/schedule", SCHEDULE_EXPORT_SHELL)
}

export function confirmTokenFromPathname(pathname: string): string | null {
  return lastSegment(pathname, "/visit/confirm", CONFIRM_EXPORT_SHELL)
}

export type VisitClientRoute =
  | { kind: "schedule"; token: string }
  | { kind: "confirm"; token: string }

/** Used by the static-export 404 shell the same way listings use publicIdFromPathname. */
export function visitClientRouteFromPathname(pathname: string): VisitClientRoute | null {
  const scheduleToken = scheduleTokenFromPathname(pathname)
  if (scheduleToken) return { kind: "schedule", token: scheduleToken }
  const confirmToken = confirmTokenFromPathname(pathname)
  if (confirmToken) return { kind: "confirm", token: confirmToken }
  return null
}

/** Prefer an explicit 404-recovery token; otherwise the App Router `[token]` param. */
export function tokenFromRouteParam(
  tokenProp: string | undefined,
  param: string | string[] | undefined,
): string {
  if (tokenProp) return tokenProp
  if (typeof param === "string") return param
  if (Array.isArray(param) && typeof param[0] === "string") return param[0]
  return ""
}
