#!/usr/bin/env tsx
/**
 * Post-build guard: for every license whose switch in lib/site.ts is off, fail the build if any
 * exported page presents Pranay with that license's title or prints its number (an NMLS ID, the
 * real estate license number, the notary commission). A live license's claims are allowed; the
 * other lines are still scanned, so the real estate license can go live without unlocking loan
 * officer claims. Patterns and their tests: lib/license-claims.ts.
 * Usage: npx tsx scripts/check-license-claims.ts [outDir]
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { findLicenseClaims, type LicenseLine } from "../lib/license-claims"
import { LICENSING } from "../lib/site"

function* exportedFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== "_next") yield* exportedFiles(full)
    } else if (/\.(html|md|txt|json|xml|vcf)$/.test(entry.name)) {
      yield full
    }
  }
}

/* eslint-disable no-console -- CLI output */
const outDir = resolve(process.argv[2] ?? "out")
const pending = (Object.keys(LICENSING) as LicenseLine[]).filter((line) => !LICENSING[line])
if (pending.length === 0) {
  console.log("check-license-claims: every license switch is on, licensed titles are allowed")
  process.exit(0)
}
if (!existsSync(outDir)) {
  console.error(`check-license-claims: ${outDir} not found, run the build first`)
  process.exit(1)
}
const problems: string[] = []
let scanned = 0
for (const file of exportedFiles(outDir)) {
  scanned += 1
  const kind = file.endsWith(".html") ? "html" : "text"
  for (const claim of findLicenseClaims(readFileSync(file, "utf8"), kind, LICENSING)) {
    problems.push(`${relative(outDir, file)} [${claim.line}:${claim.rule}] ${claim.excerpt}`)
  }
}
if (problems.length > 0) {
  for (const problem of problems.slice(0, 50)) console.error(problem)
  if (problems.length > 50) console.error(`...and ${problems.length - 50} more`)
  console.error(
    `check-license-claims: ${problems.length} claim(s) for a license that is not live (pending: ${pending.join(", ")})`,
  )
  process.exit(1)
}
console.log(`check-license-claims: ${scanned} files, no claims for pending licenses (${pending.join(", ")})`)
