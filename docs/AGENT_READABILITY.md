# Agent readability runbook

How AI agents discover, fetch, and read OndoREui — and how to verify each layer stays working.

## Layers, at a glance

| Layer | Where it lives | Purpose |
| --- | --- | --- |
| `llms.txt` / `llms-full.txt` / `llms.json` | [app/llms.txt/route.ts](../app/llms.txt/route.ts), [lib/site-index.ts](../lib/site-index.ts) | Curated site map + guidance for AI assistants. |
| Markdown sitemap | [app/sitemap.md/route.ts](../app/sitemap.md/route.ts) | Section-grouped page list. Every HTML URL has a sibling `.md`. |
| First-party `.md` twins | [lib/agent-markdown.ts](../lib/agent-markdown.ts) + [scripts/generate-agent-markdown.ts](../scripts/generate-agent-markdown.ts) | Hand-written `/index.md`, `/properties.md`, `/contact.md`, `/calculators/{slug}.md` for JS-heavy widgets. |
| HTML → Markdown twins | [lib/html-to-agent-markdown.ts](../lib/html-to-agent-markdown.ts) + [scripts/generate-html-markdown-twins.ts](../scripts/generate-html-markdown-twins.ts) | Postbuild: every exported HTML page gets `/path.md` so GitHub Pages can serve Markdown without `Accept` support. |
| Content negotiation | [scripts/cloudflare-markdown-negotiate.js](../scripts/cloudflare-markdown-negotiate.js) (Snippet) or Cloudflare **Markdown for Agents** (Pro+) | Maps `Accept: text/markdown` on HTML URLs to the sibling `.md` file. |
| Discovery `<link rel="alternate">` | [lib/page-canonical.ts](../lib/page-canonical.ts), [lib/seo.ts](../lib/seo.ts) `buildPageMetadata`, [app/layout.tsx](../app/layout.tsx) | Points HTML clients at `.md`, `llms.txt`, and `llms.json`. |
| `robots.txt` | [lib/site-index.ts](../lib/site-index.ts) `buildRobotsTxtBody`, [next-sitemap.config.js](../next-sitemap.config.js) | Allows AI crawlers, declares `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. |
| WebMCP tools | See [WEBMCP.md](./WEBMCP.md) | In-page agent actions (contact, opportunities, mortgage, property search). |

## Sibling Markdown (works on GitHub Pages today)

The origin cannot honor `Accept`. Agents should fetch the twin:

| HTML | Markdown |
| --- | --- |
| `/` | `/index.md` |
| `/about/` | `/about.md` |
| `/calculators/mortgage-payment/` | `/calculators/mortgage-payment.md` |

Hand-written twins win when both exist (calculators, properties, contact, homepage). Everything else is generated from `#main-content` at `postbuild`.

## Cloudflare edge (one-time)

The zone is often **Free Website**. [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) needs Pro+. On Free, use the Snippet.

```bash
python3 scripts/apply-cloudflare-agent-readability.py                 # API, or dashboard paste on 403
python3 scripts/apply-cloudflare-agent-readability.py --print-dashboard
CF_API_TOKEN=... CF_ZONE_ID=... npm run cloudflare:markdown            # Pro only: content_converter=on
```

The Cache Purge + Zone Read deploy token cannot change these settings. Create a token with **Zone Settings Edit**, **Bot Management Write**, and **Snippets Write**, or paste from `--print-dashboard`.

### Stop Cloudflare from blocking AI crawlers

Production `robots.txt` must **not** start with `# BEGIN Cloudflare Managed content` and must **not** `Disallow: /` for GPTBot / ClaudeBot.

Dashboard: **Security → Settings → Bot traffic** → turn **OFF** “Set your preference to block training in robots.txt” (Instruct AI bot traffic with robots.txt).

Origin policy in `buildRobotsTxtBody` is `Content-Signal: search=yes, ai-input=yes, ai-train=yes` plus `Allow: /` for those user-agents. The managed prepend contradicts it.

### Content negotiation

- **Free:** Snippet `markdown-negotiate` (see `scripts/cloudflare-markdown-negotiate.js`). Hosts: www + apex only. Never `api.` or `app.`
- **Pro+:** AI Crawl Control → Markdown for Agents.
- **Cache rule:** exclude `Accept: text/markdown` so HTML and Markdown do not share a cache key (`scripts/cloudflare-cache-html-rule.json`).

Optional Transform Rules (if the token can manage rulesets):

- **`Link:` response header** (RFC 8288): `Link: </llms.txt>; rel="describedby"; type="text/plain"` on HTML responses.
- **`Vary: Accept`**: the Snippet already sets this on Markdown responses.

## Measure crawlers in server logs, not analytics

`GTM`, GA, and other client analytics never see AI crawlers — they don't run JavaScript.

- Cloudflare **AI Crawl Control** (per-zone dashboard) shows per-bot request counts (GPTBot, ClaudeBot, PerplexityBot, etc.).
- Cloudflare **Log Explorer** or **Logpush** are the right places to filter by `User-Agent` and path. Useful filters:
  - `path` matches `/llms.txt`, `/llms-full.txt`, `/sitemap.md`, `/*.md`
  - `User-Agent` matches any name in [lib/agent-discovery-config.json](../lib/agent-discovery-config.json) `aiCrawlerAgents`
  - `Accept` request header contains `text/markdown`
- Do **not** add client-side analytics for crawlers. If you need a client counter, it will undercount by ~100% (bots skip JS).

## Verifying the whole stack

```bash
# llms.txt lists the sibling-.md convention
curl -sI https://www.ondorealestate.com/llms.txt | grep -i content-type
curl -s  https://www.ondorealestate.com/llms.txt | rg -F "sibling"

# Sibling Markdown (origin, no Accept header required)
curl -sI https://www.ondorealestate.com/about.md | grep -i content-type
curl -s  https://www.ondorealestate.com/about.md | head -20

# First-party twins
curl -s  https://www.ondorealestate.com/calculators/mortgage-payment.md | rg -F "Monthly principal + interest"

# Content negotiation (after Snippet or Markdown for Agents)
curl -sIH "Accept: text/markdown" https://www.ondorealestate.com/about/ | grep -i content-type
# Expected: content-type: text/markdown; charset=utf-8

# robots.txt is origin policy only (no Cloudflare managed Disallow)
curl -s https://www.ondorealestate.com/robots.txt | rg -F "BEGIN Cloudflare"   # must be empty
curl -s https://www.ondorealestate.com/robots.txt | rg -F "Content-Signal:"
```

Local:

```bash
npm run generate:agent-md   # hand-written public/*.md
npm run build               # prebuild + postbuild (HTML→MD twins + check:llms-txt)
npm run test:run            # lib/site-index.test.ts + lib/agent-markdown.test.ts + lib/html-to-agent-markdown.test.ts
```

## Verifying locally

[scripts/verify-agent-readability.mjs](../scripts/verify-agent-readability.mjs):

```bash
npm run dev                                                                # in one terminal
npm run verify:agent-readability -- --skip-cf                              # in another

npm run verify:agent-readability -- --base-url=https://www.ondorealestate.com --skip-cf
npm run verify:agent-readability -- --base-url=https://www.ondorealestate.com
```

`--skip-cf` skips only the `Accept: text/markdown` HEAD check. `/about.md` and the managed-robots.txt check still run.

## Where to look when something breaks

- Markdown twins missing after deploy → `postbuild` `generate:html-md` / `check:llms-txt` should have failed. Confirm `prebuild` ran and `public/*.md` plus `out/about.md` exist in the artifact.
- `Accept: text/markdown` still returns HTML → paste the Snippet (Free) or enable Markdown for Agents (Pro). Confirm the HTML cache rule excludes that Accept value.
- `robots.txt` has `# BEGIN Cloudflare Managed content` → turn off managed robots.txt (step 1 above). Origin cannot override the prepend.
- Crawler traffic dropped → check `Content-Signal:` still parses. Verify the crawler UA is still in [lib/agent-discovery-config.json](../lib/agent-discovery-config.json) and that no WAF rule is blocking it.
- Blog posts return an empty Markdown shell → those pages are still server-rendered HTML. If conversion is thin, the page probably lacks headings; verify with `curl -s /blog/... | rg 'id="main-content"'`.
