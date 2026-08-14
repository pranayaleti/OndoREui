#!/usr/bin/env node
/**
 * Static export must emit real .txt / .md files (not `<name>/index.html`).
 * GitHub Pages keys Content-Type off the file extension, so any accidental
 * directorification would break AI-agent fetches.
 */
import fs from "node:fs"
import path from "node:path"

/** Files that must contain the lending/Fair Housing disclosures block. */
const disclosureFiles = ["out/llms.txt", "out/llms-full.txt", "out/.well-known/llms.txt", "out/llm.txt"]

/** Markdown files that must exist as flat files (no disclosure requirement — the sitemap is a link index). */
const markdownFiles = [
  "out/sitemap.md",
  "out/index.md",
  "out/properties.md",
  "out/contact.md",
]

for (const rel of disclosureFiles) {
  const abs = path.resolve(rel)
  if (!fs.existsSync(abs)) {
    console.error(`missing ${rel} — App Router route did not export`)
    process.exit(1)
  }
  if (fs.statSync(abs).isDirectory()) {
    console.error(`${rel} is a directory; expected a plain-text file`)
    process.exit(1)
  }
  const text = fs.readFileSync(abs, "utf8")
  if (/<!DOCTYPE|<html[\s>]/i.test(text)) {
    console.error(`${rel} looks like HTML; expected text/plain`)
    process.exit(1)
  }
  if (!text.includes("## Required disclosures") || !text.includes("NMLS ID on file")) {
    console.error(`${rel} is missing the required disclosures block`)
    process.exit(1)
  }
}

for (const rel of markdownFiles) {
  const abs = path.resolve(rel)
  if (!fs.existsSync(abs)) {
    console.error(`missing ${rel} — first-party Markdown twin did not export`)
    process.exit(1)
  }
  if (fs.statSync(abs).isDirectory()) {
    console.error(`${rel} is a directory; expected a Markdown file`)
    process.exit(1)
  }
  const text = fs.readFileSync(abs, "utf8")
  if (/<!DOCTYPE|<html[\s>]/i.test(text)) {
    console.error(`${rel} looks like HTML; expected Markdown`)
    process.exit(1)
  }
  if (!/^\s*#/.test(text) && !text.startsWith("---")) {
    console.error(`${rel} does not start with an H1 or YAML frontmatter`)
    process.exit(1)
  }
}

// Calculator .md twins — at least one representative file must exist so a
// mistake in the generator script (e.g. writing to the wrong dir) is caught.
const sampleCalculatorMd = "out/calculators/mortgage-payment.md"
if (!fs.existsSync(path.resolve(sampleCalculatorMd))) {
  console.error(`missing ${sampleCalculatorMd} — calculator Markdown generator did not run`)
  process.exit(1)
}

console.log("llms.txt + Markdown twin static export ok (plain text + disclosures + .md files)")
