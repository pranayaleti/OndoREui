/**
 * Cloudflare Snippet: GitHub Pages 404 → 200 for listing detail.
 *
 * Hosting is GitHub Pages behind the ondorealestate.com Cloudflare proxy
 * (cache purge + HTML cache rule). Do not migrate to Cloudflare Pages.
 * A naive /properties/:id → /404.html rewrite would clobber prerendered
 * listing HTML. Only substitute when origin already returned 404.
 *
 * Apply: python3 scripts/apply-cloudflare-listing-404-to-200.py
 * Dashboard: Rules → Snippets (www + apex only; never api. or app.)
 */
const listing404To200 = {
  async fetch(request) {
    const url = new URL(request.url);
    const listing = /^\/properties\/([^/]+)\/?$/.exec(url.pathname);
    const originResponse = await fetch(request);

    if (!listing) return originResponse;

    const id = decodeURIComponent(listing[1] ?? "");
    if (!id || id === "_placeholder") return originResponse;
    if (request.method !== "GET" && request.method !== "HEAD") return originResponse;
    if (originResponse.status !== 404) return originResponse;

    const shell = await fetch(new Request(new URL("/404.html", url.origin), {
      method: "GET",
      headers: request.headers,
    }));
    const headers = new Headers(shell.headers);
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    return new Response(request.method === "HEAD" ? null : shell.body, {
      status: 200,
      statusText: "OK",
      headers,
    });
  },
};

export default listing404To200;
