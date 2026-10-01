/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Per-route <lastmod> for next-sitemap, read from the page's own source.
 *
 * A date is only emitted when the page declares one (`modified` first, then
 * `published`). Routes without a declared date get no <lastmod> at all: Google
 * ignores a lastmod that is always "today" or that never matches the content,
 * so guessing (section constants, build date) costs credibility for nothing.
 */
const fs = require('fs')
const path = require('path')

const DATE_RE = (key) => new RegExp(`\\b${key}\\s*[:=]\\s*["'\`](\\d{4}-\\d{2}-\\d{2})["'\`]`, 'g')

function latestDate(source, key) {
  let latest
  for (const m of source.matchAll(DATE_RE(key))) {
    if (Number.isNaN(Date.parse(m[1]))) continue
    if (!latest || m[1] > latest) latest = m[1]
  }
  return latest
}

/** @param {string} source page.tsx source @returns {string | undefined} YYYY-MM-DD */
function lastmodFromSource(source) {
  return latestDate(source, 'modified') || latestDate(source, 'published')
}

/**
 * @param {string} routePath e.g. "/blog/appraisal-comes-in-low/"
 * @param {string} appDir absolute path to the app/ directory
 * @returns {string | undefined}
 */
function getRouteLastmod(routePath, appDir) {
  const clean = routePath.replace(/^\/+|\/+$/g, '')
  if (clean.includes('..') || clean.includes('[')) return undefined
  const file = path.join(appDir, clean, 'page.tsx')
  try {
    return lastmodFromSource(fs.readFileSync(file, 'utf8'))
  } catch {
    return undefined
  }
}

module.exports = { lastmodFromSource, getRouteLastmod }
