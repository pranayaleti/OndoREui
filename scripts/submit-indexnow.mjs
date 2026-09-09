#!/usr/bin/env node
/**
 * IndexNow submitter for the static export.
 *
 * Bing (and therefore Copilot / ChatGPT's Bing-backed retrieval) picks up
 * changes from an IndexNow ping in hours instead of waiting on a crawl cycle.
 * IndexNow is meant for *changed* URLs, so this hashes each exported page and
 * only submits the ones whose bytes actually moved since the last successful
 * submit. State lives in .indexnow-cache/ (git-ignored; restored in CI via
 * actions/cache). A cold cache falls back to a full submit, which is safe.
 *
 * Run AFTER `npm run build` — it reads out/ and out/sitemap*.xml.
 *
 *   node scripts/submit-indexnow.mjs            # changed URLs only
 *   node scripts/submit-indexnow.mjs --all      # every indexable URL
 *   node scripts/submit-indexnow.mjs --dry-run  # print, submit nothing
 */

import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const OUT_DIR = 'out'
const STATE_DIR = '.indexnow-cache'
const STATE_FILE = path.join(STATE_DIR, 'indexnow-state.json')
const ENDPOINT = 'https://api.indexnow.org/IndexNow'
const MAX_URLS_PER_REQUEST = 10000

const args = new Set(process.argv.slice(2))
const DRY_RUN = args.has('--dry-run')
const SUBMIT_ALL = args.has('--all')

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ondorealestate.com').replace(/\/+$/, '')
const KEY = process.env.INDEXNOW_KEY || 'f3a3f9012d6d9f3e60e701c8849dc1e1'
const HOST = new URL(SITE_URL).host
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`

function log(...m) { console.log('[indexnow]', ...m) }
function warn(...m) { console.warn('[indexnow]', ...m) }

/** Collect <loc> values from out/sitemap*.xml, following the sitemap index. */
async function collectSitemapUrls() {
  const entries = await readdir(OUT_DIR).catch(() => [])
  const files = entries.filter((f) => /^sitemap.*\.xml$/.test(f))
  if (files.length === 0) throw new Error(`No sitemap found in ${OUT_DIR}/. Run \`npm run build\` first.`)

  const urls = new Set()
  for (const file of files) {
    const xml = await readFile(path.join(OUT_DIR, file), 'utf8')
    // A sitemap index lists other sitemaps; those are already on disk, so skip
    // the index's own <loc>s and take page URLs from the child sitemaps.
    const isIndex = /<sitemapindex/i.test(xml)
    if (isIndex) continue
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.add(m[1].trim())
    }
  }
  return [...urls]
}

/** Map a public URL back to the file the static export wrote for it. */
function fileForUrl(url) {
  let pathname
  try { pathname = new URL(url).pathname } catch { return null }
  if (pathname === '/' || pathname === '') return path.join(OUT_DIR, 'index.html')
  const clean = pathname.replace(/^\/+/, '').replace(/\/+$/, '')
  // File-like path (llms.txt, index.md) → the file itself.
  if (/\.[a-z0-9]{2,8}$/i.test(clean)) return path.join(OUT_DIR, clean)
  // trailingSlash: true → every route is a directory with index.html.
  return path.join(OUT_DIR, clean, 'index.html')
}

async function hashUrl(url) {
  const file = fileForUrl(url)
  if (!file || !existsSync(file)) return null
  const buf = await readFile(file)
  return createHash('sha256').update(buf).digest('hex')
}

async function loadState() {
  try {
    const raw = await readFile(STATE_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed.hashes === 'object' ? parsed.hashes : {}
  } catch {
    return {}
  }
}

async function saveState(hashes) {
  await mkdir(STATE_DIR, { recursive: true })
  await writeFile(
    STATE_FILE,
    JSON.stringify({ updatedAt: new Date().toISOString(), host: HOST, hashes }, null, 2) + '\n',
    'utf8',
  )
}

/**
 * Confirm the key file is actually served before submitting anything.
 *
 * IndexNow proves ownership by fetching keyLocation. If that 404s, every
 * submission is rejected -- and because the deploy step is continue-on-error,
 * the rejection is invisible and the site simply stops getting instant-indexed.
 * That is exactly what happened: the key file sat untracked in git, so CI never
 * checked it out, it never shipped, and the pings had been failing silently.
 * Fail loudly here instead.
 */
async function verifyKeyIsServed() {
  let res
  try {
    res = await fetch(KEY_LOCATION, { redirect: 'follow' })
  } catch (err) {
    throw new Error(`IndexNow key file unreachable at ${KEY_LOCATION}: ${err.message}`)
  }
  if (!res.ok) {
    throw new Error(
      `IndexNow key file returned HTTP ${res.status} at ${KEY_LOCATION}. ` +
      `Bing cannot verify ownership, so every submission would be rejected. ` +
      `Ensure public/${KEY}.txt is committed and deployed.`,
    )
  }
  const served = (await res.text()).trim()
  if (served !== KEY) {
    throw new Error(
      `IndexNow key mismatch at ${KEY_LOCATION}: served "${served.slice(0, 64)}" but submitting "${KEY}". ` +
      `The INDEXNOW_KEY secret and the deployed key file must match.`,
    )
  }
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  })
  const body = await res.text().catch(() => '')
  return { status: res.status, body: body.slice(0, 400) }
}

/** robots.txt and the sitemaps themselves are crawler plumbing, not content. */
function isSubmittable(url) {
  let pathname
  try { pathname = new URL(url).pathname } catch { return false }
  if (pathname === '/robots.txt') return false
  if (/^\/sitemap[^/]*\.xml$/.test(pathname)) return false
  return true
}

async function main() {
  const all = await collectSitemapUrls()

  // A build made without NEXT_PUBLIC_SITE_URL emits localhost URLs. Submitting
  // those would burn the key's reputation on garbage, so refuse outright rather
  // than filtering silently — it means out/ is stale and needs a real rebuild.
  const foreign = all.filter((u) => { try { return new URL(u).host !== HOST } catch { return true } })
  if (foreign.length) {
    throw new Error(
      `${foreign.length}/${all.length} sitemap URLs are not on ${HOST} (e.g. ${foreign[0]}). ` +
      `Rebuild with NEXT_PUBLIC_SITE_URL=${SITE_URL} before submitting.`,
    )
  }

  const urls = all.filter(isSubmittable)
  log(`${urls.length} indexable URLs in the sitemap (${all.length - urls.length} skipped as crawler plumbing)`)

  const previous = await loadState()
  const current = {}
  const changed = []
  let missing = 0

  for (const url of urls) {
    const hash = await hashUrl(url)
    if (!hash) { missing += 1; continue }
    current[url] = hash
    if (SUBMIT_ALL || previous[url] !== hash) changed.push(url)
  }

  if (missing) warn(`${missing} sitemap URLs had no matching file in ${OUT_DIR}/ (skipped)`)

  const coldStart = Object.keys(previous).length === 0
  if (coldStart && !SUBMIT_ALL) log('no previous state — treating this as a full submit')

  if (changed.length === 0) {
    log('nothing changed since the last submit; no ping sent')
    return
  }

  log(`${changed.length} URL(s) to submit`)
  for (const u of changed.slice(0, 20)) log('  •', u)
  if (changed.length > 20) log(`  … and ${changed.length - 20} more`)

  // Ownership check before the first POST, and before the dry-run bails, since a
  // missing key file is precisely what a dry run should be able to catch. A
  // rejected batch would otherwise look like a transient failure and retry forever.
  await verifyKeyIsServed()
  log(`key file verified at ${KEY_LOCATION}`)

  if (DRY_RUN) { log('--dry-run: stopping before the POST'); return }

  for (let i = 0; i < changed.length; i += MAX_URLS_PER_REQUEST) {
    const batch = changed.slice(i, i + MAX_URLS_PER_REQUEST)
    const { status, body } = await submit(batch)
    // 200 = accepted, 202 = accepted, key validation pending.
    if (status === 200 || status === 202) {
      log(`submitted ${batch.length} URL(s) → HTTP ${status}`)
    } else {
      warn(`submit failed → HTTP ${status} ${body}`)
      warn('state not advanced; the next run will retry these URLs')
      process.exitCode = 1
      return
    }
  }

  await saveState(current)
  log('state saved:', STATE_FILE)
}

main().catch((err) => {
  // A failed ping must never fail a deploy that already shipped.
  warn('error:', err?.message || err)
  process.exitCode = 1
})
