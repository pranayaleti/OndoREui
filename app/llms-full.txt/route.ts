import { buildLlmsFullTxtBody } from "@/lib/site-index"

/** Static export: bake full LLM brief at build time. */
export const dynamic = "force-static"

export function GET() {
  const body = buildLlmsFullTxtBody()
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
