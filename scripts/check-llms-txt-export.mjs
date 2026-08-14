#!/usr/bin/env node
/**
 * Static export must emit real .txt files (text/plain at the origin), not
 * llms.txt/index.html. GitHub Pages keys Content-Type off the file extension.
 */
import fs from "node:fs"
import path from "node:path"

const files = ["out/llms.txt", "out/llms-full.txt", "out/.well-known/llms.txt", "out/llm.txt"]

for (const rel of files) {
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

console.log("llms.txt static export ok (plain text + disclosures)")
