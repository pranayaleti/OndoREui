import { buildLlmsTxtBody } from "@/lib/site-index"

/** Static export: bake LLM brief at build time from `NEXT_PUBLIC_*` env. */
export const dynamic = "force-static"

export function GET() {
  const body = buildLlmsTxtBody()
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
