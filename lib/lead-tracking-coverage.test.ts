import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(__dirname, "..")
const SKIP_DIRS = new Set(["node_modules", ".next", "out", ".git"])

function sourceFiles(dir: string): string[] {
  const found: string[] = []
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) found.push(...sourceFiles(full))
    else if (/\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name)) found.push(full)
  }
  return found
}

/**
 * Every lead form must report one conversion per saved lead. submitContactLead does it when the
 * caller passes { formName }; a few callers track the result themselves. A new form that does
 * neither would report zero conversions once GA4 and the ad pixels are on.
 */
describe("lead form conversion tracking", () => {
  const callers = ["app", "components", "lib", "pages"]
    .flatMap((d) => sourceFiles(join(ROOT, d)))
    .filter((file) => !file.endsWith(join("lib", "leads-api.ts")))
    .filter((file) => /\bsubmitContactLead\s*\(/.test(readFileSync(file, "utf8")))

  it("finds the lead forms", () => {
    expect(callers.length).toBeGreaterThan(5)
  })

  it.each(callers.map((f) => relative(ROOT, f)))("%s tracks the lead", (rel) => {
    const source = readFileSync(join(ROOT, rel), "utf8")
    expect(source).toMatch(/formName\s*:|trackLeadGeneration\s*\(/)
  })
})
