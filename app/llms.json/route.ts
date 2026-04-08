import { buildLlmsJsonBody } from "@/lib/site-index"

/** Static export: bake structured LLM index at build time. */
export const dynamic = "force-static"

export function GET() {
  return new Response(buildLlmsJsonBody(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
