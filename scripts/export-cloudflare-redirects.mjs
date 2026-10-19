#!/usr/bin/env node
/**
 * Export public/_redirects as a Cloudflare Bulk Redirect CSV.
 *
 * GitHub Pages cannot send a 301, so the stubs written by generate-legacy-redirects.mjs
 * only forward in the browser. Upload this CSV as a Bulk Redirect list (Cloudflare
 * dashboard: Bulk Redirects, or `cloudflare:redirects-csv` then the API) so the edge
 * answers the old URL with a real 301 before the request reaches the origin.
 *
 * Usage: node scripts/export-cloudflare-redirects.mjs [out/cloudflare-redirects.csv]
 */
/* eslint-disable no-console -- CLI output */
import fs from 'node:fs'
import path from 'node:path'
import { parseRedirects, resolveFinalTarget } from './generate-legacy-redirects.mjs'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ondorealestate.com').replace(/\/+$/, '')
const REDIRECTS_FILE = path.resolve('public/_redirects')
const outFile = path.resolve(process.argv[2] || 'out/cloudflare-redirects.csv')

const isAbsolute = (value) => /^https?:\/\//i.test(value)
const withSlash = (p) => (p.endsWith('/') || /\.[a-z0-9]+$/i.test(p) ? p : `${p}/`)

const rules = parseRedirects(fs.readFileSync(REDIRECTS_FILE, 'utf8'))
const rows = [['source_url', 'target_url', 'status_code', 'preserve_query_string', 'include_subdomains', 'subpath_matching', 'preserve_path_suffix']]
for (const { from, to } of rules) {
  // Same hop-collapsing the stub generator does (legacy calculator paths, pages that already forward).
  const resolved = resolveFinalTarget(to)
  const target = isAbsolute(resolved) ? resolved : `${SITE_URL}${withSlash(resolved)}`
  // Two sources per rule: with and without the trailing slash, so either form of the old URL is caught.
  for (const source of [`${SITE_URL}${from}`, `${SITE_URL}${from}/`]) {
    rows.push([source, target, '301', 'true', 'false', 'false', 'false'])
  }
}
fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, rows.map((r) => r.join(',')).join('\n') + '\n')
console.log(`cloudflare-redirects: wrote ${rows.length - 1} rows for ${rules.length} rules to ${path.relative(process.cwd(), outFile)}`)
