#!/usr/bin/env tsx
/**
 * Post-build guard: while LICENSING_LIVE is off, fail the build if any exported page presents
 * Pranay as a licensed real estate agent or loan officer, or prints an NMLS number.
 * Patterns and their tests: lib/license-claims.ts. Usage: npx tsx scripts/check-license-claims.ts [outDir]
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { findLicenseClaims } from "../lib/license-claims"
import { LICENSING_LIVE } from "../lib/site"

function* exportedFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== "_next") yield* exportedFiles(full)
    } else if (/\.(html|md|txt)$/.test(entry.name)) {
      yield full
    }
  }
}

/* eslint-disable no-console -- CLI output */
const outDir = resolve(process.argv[2] ?? "out")
if (LICENSING_LIVE) {
  console.log("check-license-claims: LICENSING_LIVE is on, licensed titles are allowed")
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
  for (const claim of findLicenseClaims(readFileSync(file, "utf8"), kind)) {
    problems.push(`${relative(outDir, file)} [${claim.rule}] ${claim.excerpt}`)
  }
}
if (problems.length > 0) {
  for (const problem of problems.slice(0, 50)) console.error(problem)
  if (problems.length > 50) console.error(`...and ${problems.length - 50} more`)
  console.error(`check-license-claims: ${problems.length} license claim(s) while LICENSING_LIVE is off`)
  process.exit(1)
}
console.log(`check-license-claims: ${scanned} files, no license claims`)
