import { describe, expect, it } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { SITE_PHONE } from "./site"

const ROOT = path.resolve(__dirname, "..")
const SCAN_DIRS = ["app", "components", "pages"]

function sourceFiles(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full))
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name)) out.push(full)
  }
  return out
}

// Matches SITE_PHONE.replace(/pattern/flags, "") where the pattern is written in source.
const REPLACE_CALL = /SITE_PHONE\.replace\(\/((?:\\.|[^/\\])+)\/([a-z]*),\s*(["'`])\3\)/g

describe("tel: links built from SITE_PHONE", () => {
  const calls = SCAN_DIRS.flatMap((dir) => sourceFiles(path.join(ROOT, dir))).flatMap((file) => {
    const text = readFileSync(file, "utf8")
    return [...text.matchAll(REPLACE_CALL)].map((m) => ({
      file: path.relative(ROOT, file),
      source: m[1] as string,
      flags: m[2] as string,
    }))
  })

  it("finds the call sites it is meant to guard", () => {
    expect(calls.length).toBeGreaterThan(5)
  })

  // Commit 9958844ad fixed /[^+\\d]/g (keeps only "+", "\" and "d", so href="tel:+") on the 404 page;
  // the same typo survived on three About pages. Any stripper that leaves under 10 digits is a dead call button.
  it.each(calls.map((c) => [c.file, c.source, c.flags] as const))(
    "%s: /%s/%s leaves a dialable number",
    (_file, source, flags) => {
      const result = SITE_PHONE.replace(new RegExp(source, flags), "")
      expect(result.replace(/\D/g, "").length).toBeGreaterThanOrEqual(10)
    },
  )
})
