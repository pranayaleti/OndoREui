#!/usr/bin/env node
/**
 * Post-build accessibility check: every exported page must have exactly one <main> landmark.
 * app/layout.tsx does NOT render a <main> (it only owns the #main-content skip-link target), so each
 * page or template supplies its own. Zero means screen-reader users cannot jump to the content;
 * more than one means a nested or duplicated landmark.
 *
 * Usage: node scripts/check-main-landmark.mjs [outDir]   (default: out)
 * Meta-refresh redirect stubs (public/_redirects twins) are skipped: they render no content.
 * Pages that bail out to client-side rendering (useSearchParams under Suspense, token shells) ship no
 * body HTML, so their <main> only exists after hydration; a zero count there is not a problem. A count
 * above one is still reported for them.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

/** Count opening <main> tags in rendered HTML. Ignores <mainfoo> and text mentions inside comments. */
export function countMainLandmarks(html) {
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, "")
  return (withoutComments.match(/<main[\s>]/gi) ?? []).length
}

/** A static redirect page (meta refresh) has no content landmarks by design. */
export function isRedirectStub(html) {
  return /<meta[^>]+http-equiv=["']refresh["']/i.test(html)
}

/** Static shell whose content renders only in the browser (Next.js client-side rendering bailout). */
export function isClientRenderedShell(html) {
  return html.includes("BAILOUT_TO_CLIENT_SIDE_RENDERING")
}

function* htmlFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* htmlFiles(full)
    else if (entry.name === "index.html" || entry.name === "404.html") yield full
  }
}

export function findLandmarkProblems(outDir) {
  const problems = []
  for (const file of htmlFiles(outDir)) {
    const html = fs.readFileSync(file, "utf8")
    if (isRedirectStub(html)) continue
    const count = countMainLandmarks(html)
    if (count === 0 && isClientRenderedShell(html)) continue
    if (count !== 1) problems.push({ file: path.relative(outDir, file), count })
  }
  return problems
}

/* eslint-disable no-console -- CLI output */
const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isCli) {
  const outDir = path.resolve(process.argv[2] ?? "out")
  if (!fs.existsSync(outDir)) {
    console.error(`check-main-landmark: ${outDir} not found, run the build first`)
    process.exit(1)
  }
  const problems = findLandmarkProblems(outDir)
  if (problems.length > 0) {
    for (const p of problems.slice(0, 50)) console.error(`${p.count} <main> in ${p.file}`)
    if (problems.length > 50) console.error(`...and ${problems.length - 50} more`)
    console.error(`check-main-landmark: ${problems.length} page(s) without exactly one <main>`)
    process.exit(1)
  }
  console.log("check-main-landmark: every page has exactly one <main>")
}
