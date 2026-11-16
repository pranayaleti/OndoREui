#!/usr/bin/env node
/**
 * Dev-only: copy the last build's sitemap into public/ so `next dev` serves /sitemap.xml.
 * next-sitemap runs in postbuild and writes to out/, which the dev server never reads, so
 * localhost:3000/sitemap.xml 404s while production serves it fine. The copies are gitignored
 * and as fresh as the last `npm run build`; next build overwrites them in out/ anyway.
 *
 * Usage: node scripts/dev-sitemap.mjs   (runs automatically as predev)
 */
import fs from "node:fs"
import path from "node:path"

const OUT = "out"
const PUBLIC = "public"

for (const name of fs.readdirSync(PUBLIC)) {
  if (/^sitemap(-\d+)?\.xml$/.test(name)) fs.rmSync(path.join(PUBLIC, name))
}

const sitemaps = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((name) => /^sitemap(-\d+)?\.xml$/.test(name)) : []
if (sitemaps.length === 0) {
  console.log("dev-sitemap: no out/sitemap.xml yet; run `npm run build` once to serve /sitemap.xml in dev")
} else {
  for (const name of sitemaps) fs.copyFileSync(path.join(OUT, name), path.join(PUBLIC, name))
  console.log(`dev-sitemap: copied ${sitemaps.join(", ")} from out/ into public/`)
}
