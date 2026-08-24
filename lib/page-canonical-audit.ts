import { existsSync, readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import agentDiscoveryConfig from "@/lib/agent-discovery-config.json"

const PRIVATE_PREFIXES = [
  ...agentDiscoveryConfig.privateRoutePrefixes,
  ...agentDiscoveryConfig.extraDisallow,
]

export type MissingCanonicalPage = {
  route: string
  file: string
}

function walkPageFiles(dir: string, acc: string[] = []): string[] {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name)
    if (ent.isDirectory()) walkPageFiles(p, acc)
    else if (ent.name === "page.tsx") acc.push(p)
  }
  return acc
}

function routeFromPageFile(appDir: string, file: string): string {
  const rel = file.slice(appDir.length).replace(/\\/g, "/")
  const route = rel.replace(/\/page\.tsx$/, "")
  return route === "" ? "/" : route
}

function hasCanonicalMarker(content: string): boolean {
  return /canonical|buildPageMetadata|pageCanonicalMetadata|toCanonicalPageUrl/.test(content)
}

function hasNoindex(content: string): boolean {
  return /index:\s*false/.test(content)
}

function isPrivateRoute(route: string): boolean {
  return PRIVATE_PREFIXES.some((prefix) => route === prefix || route.startsWith(`${prefix}/`))
}

function ancestorDeclaresNoindex(appDir: string, file: string): boolean {
  let dir = dirname(file)
  while (dir.startsWith(appDir)) {
    const layout = join(dir, "layout.tsx")
    if (existsSync(layout) && hasNoindex(readFileSync(layout, "utf8"))) return true
    if (dir === appDir) break
    dir = dirname(dir)
  }
  return false
}

/**
 * Public, indexable App Router pages that do not declare their own canonical.
 * Root `app/layout.tsx` must not count, a homepage canonical there leaks to
 * every child and Google Search Console reports
 * "Duplicate without user-selected canonical".
 */
export function listPublicPagesMissingCanonical(appDir: string): MissingCanonicalPage[] {
  const missing: MissingCanonicalPage[] = []
  for (const file of walkPageFiles(appDir)) {
    const route = routeFromPageFile(appDir, file)
    const content = readFileSync(file, "utf8")
    if (isPrivateRoute(route)) continue
    if (hasNoindex(content) || ancestorDeclaresNoindex(appDir, file)) continue
    if (hasCanonicalMarker(content)) continue
    missing.push({ route, file })
  }
  return missing.sort((a, b) => a.route.localeCompare(b.route))
}
