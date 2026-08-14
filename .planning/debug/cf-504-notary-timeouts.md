# Cloudflare 504s on GitHub Pages HTML (2026-08-12)

**Root cause:** Cache-MISS GETs to GitHub Pages returned `originResponseStatus 0`; Cloudflare surfaced that as 504 (not 524). `/notary/` was the hottest path in a large static SEO tree — not a request-time Next/Supabase/Calendly hang.

**Do not:** change `/notary/` or Calendly, turn off Under Attack Mode, grey-cloud DNS via API, or migrate this site to Cloudflare Pages.

**Mitigation in this repo:**
- Cache Rule: www + apex, GET/HEAD, skip `/api/` and `api.`/`app.` hosts, 2h edge TTL (4xx no-cache, 5xx no-store). See `scripts/cloudflare-cache-html-rule.json`.
- After GitHub Pages deploy: purge **by hostname** for `www.ondorealestate.com` and `ondorealestate.com` only. Same zone also serves `api.` / `app.` — do not `purge_everything`.

**Remaining (dashboard / secrets):**
1. GitHub Actions secrets: `CF_API_TOKEN` + `CF_ZONE_ID` (aliases `CLOUDFLARE_*`). Token needs Zone Cache Purge.
2. Deploy the Cache Rule: `python3 scripts/apply-cloudflare-cache-html-rule.py` (needs Zone Cache Rules Edit; Analytics:Read is not enough) or Caching → Cache Rules in the dashboard using the JSON expression.
3. Confirm: `curl -sI https://www.ondorealestate.com/notary/` shows `cf-cache-status: HIT` (or EXPIRED/UPDATING), not DYNAMIC. Next-day 504s near zero.

Credentials live in gitignored `scripts/cf.env`. Never commit or paste tokens.
