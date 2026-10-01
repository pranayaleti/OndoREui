# Security headers (Cloudflare Transform Rules)

The site is a static export on GitHub Pages, behind Cloudflare (zone `ondorealestate.com`). GitHub Pages cannot send custom response headers and ignores `public/_headers`, so the only way to send real security headers is a Cloudflare rule. Until the rule below is deployed, the only CSP is the `<meta http-equiv>` tag in `app/layout.tsx`, and a meta CSP cannot carry `frame-ancestors`. Today the site can be framed by any other site.

This is a manual dashboard step (the owner applies it). It is not done by anything in this repo.

## Rule

Dashboard: **Rules > Transform Rules > Modify Response Header > Create rule**.

- Name: `Security headers www and apex`
- When incoming requests match (custom filter expression):

  ```
  http.host in {"www.ondorealestate.com" "ondorealestate.com"}
  ```

  Do not match `api.` or `app.`: they share the zone but are other apps with their own header needs.

- Then, set static response headers:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), usb=(), display-capture=()` |
| `Strict-Transport-Security` | `max-age=31536000` |

Deploy, then verify (see below).

### Why each value

- **`Content-Security-Policy: frame-ancestors 'none'`** is a header-only directive: it is ignored in a `<meta>` tag. It stops other sites framing the lead forms, the assistant and the apply flow (clickjacking). It is deliberately the only directive in the header. The full policy (script, style, connect, frame sources) stays in the `<meta>` tag in `app/layout.tsx`, which is the single place to edit it. When a page has both a header and a meta CSP, the browser enforces both, so the result is the meta policy plus `frame-ancestors`. If a partner ever needs to frame a page, change `'none'` to `'self' https://partner.example`.
- **`X-Content-Type-Options: nosniff`** stops browsers guessing a type for a file and running it as script or style.
- **`Referrer-Policy: strict-origin-when-cross-origin`** sends only the origin to other sites, never full paths. This matters for token URLs (apply, showing, visit, co-applicant).
- **`Permissions-Policy`** switches off camera, microphone, geolocation, USB and screen capture, none of which the site uses (checked in the code on 2026-09-30). `payment` is intentionally left out: the old `_headers` value `payment=()` would block the Payment Request API inside the Stripe iframes. `navigator.share` is not governed by this header.
- **`Strict-Transport-Security`**: start with a year and without `includeSubDomains` or `preload`, because the same zone serves `api.` and `app.`. Cloudflare can also send this itself under **SSL/TLS > Edge Certificates > HSTS**. Use one place, not both. Only add `includeSubDomains` after checking every subdomain in the zone serves HTTPS, and only add `preload` if the owner means to submit the domain to the preload list (hard to undo).

`X-Frame-Options` is not needed: `frame-ancestors 'none'` replaces it in every current browser. `X-XSS-Protection` is obsolete and is not sent.

## Verify

```bash
curl -sI https://www.ondorealestate.com/ | grep -iE 'content-security-policy|x-content-type|referrer-policy|permissions-policy|strict-transport'
curl -sI https://ondorealestate.com/contact/ | grep -i content-security-policy
```

Then in a browser: open the site, load `/contact/`, open a calculator page and the Stripe payment step on `/apply/` (if live), and check the console for new CSP or Permissions-Policy violations. To confirm framing is blocked, a page on another origin with `<iframe src="https://www.ondorealestate.com/">` should show a blocked frame.

## Later: drop `'unsafe-inline'` from `script-src`

The meta CSP still allows inline scripts, so it does not stop an injected inline script. The static export inlines Next.js bootstrap scripts, so removing it needs a post-build step that hashes every inline script and writes the hashes into the CSP (a nonce is not possible on a static host). This is a larger change and is optional. The host list in the CSP was pruned on 2026-09-30 (`pro.ip-api.com` and `r2cdn.perplexity.ai` had no use in the code). Revisit the rest of the list whenever a tracker is removed from Google Tag Manager.

## Caching

`public/_headers` also holds cache rules. They are inert on GitHub Pages too. The live cache behaviour comes from Cloudflare Cache Rules (`scripts/cloudflare-cache-html-rule.json`). A rule for `/_next/static/` (long edge and browser TTL) is a separate follow-up.
