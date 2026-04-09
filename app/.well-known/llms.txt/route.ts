import { buildLlmsTxtBody } from "@/lib/site-index"

/**
 * Some agents probe `/.well-known/llms.txt` (RFC 8615-style discovery). Same body as `/llms.txt`.
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
