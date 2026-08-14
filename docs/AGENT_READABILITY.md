# Agent readability runbook

How AI agents discover, fetch, and read OndoREui — and how to verify each layer stays working.

## Layers, at a glance

| Layer | Where it lives | Purpose |
| --- | --- | --- |
| `llms.txt` / `llms-full.txt` / `llms.json` | [app/llms.txt/route.ts](../app/llms.txt/route.ts), [lib/site-index.ts](../lib/site-index.ts) | Curated site map + guidance for AI assistants. |
| Markdown sitemap | [app/sitemap.md/route.ts](../app/sitemap.md/route.ts) | Section-grouped page list linking to `.md` twins where they exist. |
| First-party `.md` twins | [lib/agent-markdown.ts](../lib/agent-markdown.ts) + [scripts/generate-agent-markdown.ts](../scripts/generate-agent-markdown.ts) | `/index.md`, `/properties.md`, `/contact.md`, `/calculators/{slug}.md`. Generated at `prebuild` into `public/`. |
| Site-wide Markdown on-demand | Cloudflare **Markdown for Agents** (see [Cloudflare docs](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)) | Converts every HTML page to Markdown when the client sends `Accept: text/markdown`. |
| Discovery `<link rel="alternate">` | [app/layout.tsx](../app/layout.tsx), [lib/seo.ts](../lib/seo.ts) `buildPageMetadata`, individual page metadata | Points HTML clients at `.md`, `llms.txt`, and `llms.json`. |
| `robots.txt` | [lib/site-index.ts](../lib/site-index.ts) `buildRobotsTxtBody`, [next-sitemap.config.js](../next-sitemap.config.js) | Allows AI crawlers, declares `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. |
| WebMCP tools | See [WEBMCP.md](./WEBMCP.md) | In-page agent actions (contact, opportunities, mortgage, property search). |

## Enable Cloudflare Markdown for Agents (one-time)

The origin is GitHub Pages, which cannot honor `Accept` headers. Content negotiation happens at Cloudflare.

- **Dashboard**: [Cloudflare dashboard](https://dash.cloudflare.com/) → select the `ondorealestate.com` zone → **AI Crawl Control** → toggle **Markdown for Agents**. Requires a Pro or higher plan.
- **API** (needs Zone Settings Edit permission — the current deploy token is Cache Purge + Zone Read only):
  ```bash
  curl -X PATCH "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/content_converter" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"value":"on"}'
  ```

### Helper script

For repeatable use, [scripts/enable-cloudflare-markdown.mjs](../scripts/enable-cloudflare-markdown.mjs) wraps that API call:

```bash
CF_API_TOKEN=... CF_ZONE_ID=... npm run cloudflare:markdown            # turn on (default)
CF_API_TOKEN=... CF_ZONE_ID=... npm run cloudflare:markdown -- off     # turn off
CF_API_TOKEN=... CF_ZONE_ID=... npm run cloudflare:markdown -- --dry-run
```

The token must have **Zone.Zone Settings:Edit** — the deploy token used by CI (Cache Purge + Zone Read) is not sufficient. Create a new token at [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) scoped to the `ondorealestate.com` zone.

Once enabled, every public HTML page returns Markdown for clients that send `Accept: text/markdown`. JSON-LD is preserved. Private prefixes stay disallowed via [lib/agent-discovery-config.json](../lib/agent-discovery-config.json) `privateRoutePrefixes`.

### Optional Cloudflare Transform Rules

- **`Link:` response header** (RFC 8288 discovery): `Link: </llms.txt>; rel="describedby"; type="text/plain"` on HTML responses. Complements the `<link>` tag in `<head>`.
- **`Vary: Accept`**: recommended when Markdown for Agents is enabled so caches distinguish HTML from Markdown responses.

Both live in Cloudflare Rules → Transform Rules (Modify Response Header). Not committed here because the deploy token cannot manage rulesets.

## Measure crawlers in server logs, not analytics

`GTM`, GA, and other client analytics never see AI crawlers — they don't run JavaScript.

- Cloudflare **AI Crawl Control** (per-zone dashboard) shows per-bot request counts (GPTBot, ClaudeBot, PerplexityBot, etc.).
- Cloudflare **Log Explorer** or **Logpush** are the right places to filter by `User-Agent` and path. Useful filters:
  - `path` matches `/llms.txt`, `/llms-full.txt`, `/sitemap.md`, `/*.md`
  - `User-Agent` matches any name in [lib/agent-discovery-config.json](../lib/agent-discovery-config.json) `aiCrawlerAgents`
  - `Accept` request header contains `text/markdown`
- Do **not** add client-side analytics for crawlers. If you need a client counter, it will undercount by ~100% (bots skip JS).

## Verifying the whole stack

Run these against production after any change that touches this layer.

```bash
# llms.txt is text/plain and lists the Markdown twins
curl -sI https://www.ondorealestate.com/llms.txt | grep -i content-type
curl -s  https://www.ondorealestate.com/llms.txt | rg -F "How to fetch Markdown"

# Markdown sitemap
curl -sI https://www.ondorealestate.com/sitemap.md | grep -i content-type
curl -s  https://www.ondorealestate.com/sitemap.md | head -20

# First-party twins
curl -s  https://www.ondorealestate.com/calculators/mortgage-payment.md | rg -F "Monthly principal + interest"

# Cloudflare Markdown for Agents (once enabled)
curl -sIH "Accept: text/markdown" https://www.ondorealestate.com/about/ | grep -i content-type
# Expected: content-type: text/markdown; charset=utf-8

# robots.txt has Content-Signal and ClaudeBot
curl -s https://www.ondorealestate.com/robots.txt | rg -F "Content-Signal:"
curl -s https://www.ondorealestate.com/robots.txt | rg "^User-agent: ClaudeBot"
```

Local equivalents:

```bash
npm run generate:agent-md   # regenerate public/*.md
npm run build               # includes prebuild + postbuild (check:llms-txt validates .md files)
npm run test:run            # lib/site-index.test.ts + lib/agent-markdown.test.ts
```

## Verifying locally

[scripts/verify-agent-readability.mjs](../scripts/verify-agent-readability.mjs) automates every check in the previous section against a running site. It requires a live server (either `npm run dev` for local, or a deployed origin) — it does not spin one up itself.

```bash
# Against a local dev server (skip the Cloudflare-only Markdown-for-Agents check)
npm run dev                                                                # in one terminal
npm run verify:agent-readability -- --skip-cf                              # in another

# Against production, without Cloudflare Markdown for Agents enabled yet
npm run verify:agent-readability -- --base-url=https://www.ondorealestate.com --skip-cf

# Against production once Cloudflare Markdown for Agents is enabled
npm run verify:agent-readability -- --base-url=https://www.ondorealestate.com
```

The script prints a `[PASS]`/`[FAIL]`/`[SKIP]` line per check, always runs the full suite (failures don't abort), and exits non-zero if any required check fails. Drop `--skip-cf` once the Cloudflare toggle is on so the `Accept: text/markdown` negotiation is enforced.

## Where to look when something breaks

- Markdown twins missing after deploy → `postbuild` `check:llms-txt` should have failed. Confirm `prebuild` ran and `public/*.md` exists in the artifact.
- Cloudflare returns HTML on `Accept: text/markdown` → confirm Markdown for Agents is enabled in **AI Crawl Control**, then check for a Configuration Rule that disables it for the path.
- Crawler traffic dropped → check `Content-Signal:` still parses (strict RFC 9309 validators warn but must not error). Verify the crawler UA is still in [lib/agent-discovery-config.json](../lib/agent-discovery-config.json) and that no upstream firewall or WAF rule is blocking it.
- Blog posts return an empty Markdown shell → those pages are still server-rendered HTML. If Cloudflare returns thin Markdown, the page probably lacks headings; verify with `curl -s /blog/... | rg '^<h[12]'`.
