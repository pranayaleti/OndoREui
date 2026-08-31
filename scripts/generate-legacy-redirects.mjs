/**
 * Materialise `public/_redirects` as static redirect pages in `out/`.
 *
 * The site is served by GitHub Pages behind the Cloudflare CDN. `_redirects` is a
 * Cloudflare Pages / Netlify feature and neither of those serves this site, so the
 * file is inert: every legacy PascalCase calculator URL it lists returns 404 in
 * production. A static host cannot emit a real 301, so we use the same idiom the
 * Pages Router calculators already use — `<meta http-equiv="refresh">` plus a
 * canonical pointing at the destination.
 *
 * Each stub is `noindex` and is not added to the sitemap: it exists to rescue old
 * inbound links, not to be crawled as content.
 *
 * `_redirects` stays the single source of truth for the mapping (and keeps working
 * as-is if the site ever moves to a host that honours it). Redirect targets are
 * followed through to their final destination so old links do not land on a
 * redirect chain.
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT_DIR = process.env.OUT_DIR || 'out'
const REDIRECTS_FILE = path.join('public', '_redirects')

/** `/calculators/affordability-calculator` → `/calculators/affordability/` (App Router home). */
function resolveLegacyCalculatorPath(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  const match = normalized.match(/^\/calculators\/([^/]+)-calculator$/)
  return match ? `/calculators/${match[1]}/` : null
}

function withTrailingSlash(p) {
  if (/\.[a-z0-9]{2,8}$/i.test(p)) return p
  return p.endsWith('/') ? p : `${p}/`
}

/** Follow a redirect target through further hops so stubs point at the final URL. */
function resolveFinalTarget(target, seen = new Set()) {
  if (seen.has(target)) return target
  seen.add(target)
  const next = resolveLegacyCalculatorPath(target)
  return next ? resolveFinalTarget(next, seen) : withTrailingSlash(target)
}

function parseRedirects(text) {
  const rules = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const [from, to, code] = line.split(/\s+/)
    if (!from || !to || !from.startsWith('/')) continue
    if (code && code !== '301' && code !== '308') continue
    rules.push({ from: from.replace(/\/+$/, ''), to })
  }
  return rules
}

function redirectHtml(target, siteUrl) {
  const absolute = `${siteUrl.replace(/\/+$/, '')}${target}`
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting to ${target}</title>
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0;url=${target}">
<link rel="canonical" href="${absolute}">
<script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body>
<p>This page has moved to <a href="${target}">${target}</a>.</p>
</body>
</html>
`
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error(`legacy-redirects: ${OUT_DIR}/ not found — run after next build`)
    process.exit(1)
  }
  if (!fs.existsSync(REDIRECTS_FILE)) {
    console.log('legacy-redirects: no public/_redirects, nothing to do')
    return
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ondorealestate.com'
  const rules = parseRedirects(fs.readFileSync(REDIRECTS_FILE, 'utf8'))

  let written = 0
  let skipped = 0
  const targets = []
  for (const { from, to } of rules) {
    const dir = path.join(OUT_DIR, from.replace(/^\//, ''))
    const file = path.join(dir, 'index.html')
    // Never clobber a real page that the build already emitted at this path.
    if (fs.existsSync(file)) {
      skipped += 1
      continue
    }
    const target = resolveFinalTarget(to)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(file, redirectHtml(target, siteUrl))
    targets.push(`${from}/ -> ${target}`)
    written += 1
  }
  console.log(`legacy-redirects: wrote ${written} redirect stub(s), skipped ${skipped} (real page exists)`)
  for (const t of targets) console.log(`  ${t}`)
}

main()
