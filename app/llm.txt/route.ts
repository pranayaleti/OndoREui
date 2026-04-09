import { buildLlmsTxtBody } from "@/lib/site-index"

/**
 * Singular alias for `/llms.txt` (common typo). Same body — one canonical brief for agents.
 * @see https://llmstxt.org/
 */
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
