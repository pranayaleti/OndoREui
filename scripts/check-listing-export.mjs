#!/usr/bin/env node
/**
 * Post-build guard for the production deploy: the export must contain listing pages.
 *
 * app/properties/[publicId]/page.tsx emits only /properties/_placeholder/ when the listings API is
 * unreachable at build time, and the sitemap then has no listing URLs. Without this check a
 * transient API outage during the deploy build publishes that degraded site and the deploy goes green.
 *
 * Usage: node scripts/check-listing-export.mjs [outDir] [minListings]
 *   outDir       default: out
 *   minListings  default: ONDO_MIN_LISTINGS env var, else 1. Set it to 0 to switch the check off
 *                (zero live listings is a legitimate state).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

/** Segments under out/properties/ that are not listings. */
const NON_LISTING_SEGMENTS = new Set(["_placeholder", "compare"])

/** Number of exported listing detail directories (everything except the stub and /compare). */
export function countListingPages(outDir) {
  const dir = path.join(outDir, "properties")
  if (!fs.existsSync(dir)) return 0
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !NON_LISTING_SEGMENTS.has(e.name)).length
}

/** Number of /properties/{id}/ URLs across out/sitemap*.xml. */
export function countSitemapListingUrls(outDir) {
  if (!fs.existsSync(outDir)) return 0
  let count = 0
  for (const name of fs.readdirSync(outDir)) {
    if (!/^sitemap.*\.xml$/.test(name)) continue
    const xml = fs.readFileSync(path.join(outDir, name), "utf8")
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const match = /\/properties\/([^/]+)\/?$/.exec(m[1])
      if (match && !NON_LISTING_SEGMENTS.has(match[1])) count += 1
    }
  }
  return count
}

/** Returns a list of problems; empty when the export has at least `minListings` listings. */
export function findListingExportProblems(outDir, minListings) {
  if (!(minListings > 0)) return []
  const problems = []
  const pages = countListingPages(outDir)
  if (pages < minListings) {
    problems.push(`out/properties/ has ${pages} listing page(s), expected at least ${minListings}`)
  }
  const urls = countSitemapListingUrls(outDir)
  if (urls < minListings) {
    problems.push(`out/sitemap*.xml has ${urls} /properties/ URL(s), expected at least ${minListings}`)
  }
  return problems
}

/* eslint-disable no-console -- CLI output */
const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isCli) {
  const outDir = path.resolve(process.argv[2] ?? "out")
  const rawMin = process.argv[3] ?? process.env.ONDO_MIN_LISTINGS ?? "1"
  const minListings = Number.parseInt(rawMin, 10)
  if (!Number.isFinite(minListings) || minListings < 0) {
    console.error(`check-listing-export: invalid minimum listings ${JSON.stringify(rawMin)}`)
    process.exit(1)
  }
  if (!fs.existsSync(outDir)) {
    console.error(`check-listing-export: ${outDir} not found, run the build first`)
    process.exit(1)
  }
  if (minListings === 0) {
    console.log("check-listing-export: minimum is 0, check skipped")
  } else {
    const problems = findListingExportProblems(outDir, minListings)
    if (problems.length > 0) {
      for (const p of problems) console.error(`::error::${p}`)
      console.error(
        "check-listing-export: the listings API was probably unreachable during the build. " +
          "Re-run the deploy. If there are no live listings, set the repository variable ONDO_MIN_LISTINGS to 0.",
      )
      process.exit(1)
    }
    console.log(`check-listing-export: ${countListingPages(outDir)} listing page(s), ${countSitemapListingUrls(outDir)} sitemap URL(s)`)
  }
}
