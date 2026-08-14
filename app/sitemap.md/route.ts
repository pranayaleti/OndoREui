import { buildSitemapMdBody } from "@/lib/site-index"

/**
 * Markdown-format sitemap for AI agents. Grouped by section from site-index.ts;
 * calculator entries link to their `.md` twins as recommended by the
 * [Vercel agent-readability spec](https://vercel.com/kb/guide/agent-readability-spec).
 *
 * Headers mirror the other machine-readable routes:
 *  - `Vary: Accept` so an upstream cache can safely serve a different body when
 *    Cloudflare Markdown for Agents converts sibling HTML on `Accept: text/markdown`.
 *  - Permissive CORS so browser-based assistants and extensions can fetch the
 *    file directly.
 */
export const dynamic = "force-static"

export function GET() {
  return new Response(buildSitemapMdBody(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      Vary: "Accept",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  })
}
