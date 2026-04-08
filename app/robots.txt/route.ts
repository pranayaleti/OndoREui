import { buildRobotsTxtBody } from "@/lib/site-index"

/** Static export: serve crawl policy directly in dev and build. */
export const dynamic = "force-static"

export function GET() {
  return new Response(buildRobotsTxtBody(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
