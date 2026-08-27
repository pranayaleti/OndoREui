/**
 * Content negotiation for AI agents on the GitHub Pages origin.
 *
 * Hosting is GitHub Pages behind the ondorealestate.com Cloudflare proxy.
 * The origin cannot honor `Accept`. When the client asks for text/markdown,
 * fetch the sibling `.md` twin (`/about/` → `/about.md`) and return it.
 *
 * Keep path mapping in sync with lib/html-to-agent-markdown.ts
 * (`htmlPathToMarkdownPath`).
 *
 * Apply: python3 scripts/apply-cloudflare-agent-readability.py
 * Dashboard: Rules → Snippets (www + apex only; never api. or app.)
 */
function markdownPath(pathname) {
  if (pathname === "/" || pathname === "") return "/index.md";
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  if (trimmed === "/") return "/index.md";
  if (/\.[a-z0-9]{2,8}$/i.test(trimmed)) return null;
  return `${trimmed}.md`;
}

const markdownNegotiate = {
  async fetch(request) {
    const accept = request.headers.get("Accept") || "";
    if (!accept.toLowerCase().includes("text/markdown")) {
      return fetch(request);
    }

    const url = new URL(request.url);
    const mdPath = markdownPath(url.pathname);
    if (!mdPath) return fetch(request);

    const mdUrl = new URL(mdPath, url.origin);
    const mdRes = await fetch(new Request(mdUrl, {
      method: request.method === "HEAD" ? "HEAD" : "GET",
    }));
    if (!mdRes.ok) return fetch(request);

    const headers = new Headers(mdRes.headers);
    headers.set("Content-Type", "text/markdown; charset=utf-8");
    headers.set("Vary", "Accept");
    headers.append("Link", '</llms.txt>; rel="describedby"; type="text/plain"');
    headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    return new Response(request.method === "HEAD" ? null : mdRes.body, {
      status: 200,
      statusText: "OK",
      headers,
    });
  },
};

export default markdownNegotiate;
