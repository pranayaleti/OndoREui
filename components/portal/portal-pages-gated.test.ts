import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const APP_DIR = path.resolve(__dirname, "../../app")
const GATE_PREFIXES = ["owner", "tenant", "platform"]
const GATE_EXPORT = /^export \{ default, metadata \} from "@\/components\/portal\/blocked-(owner|tenant|platform|dashboard)-page"\s*$/

function findPages(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return findPages(full)
    return name === "page.tsx" ? [full] : []
  })
}

const pages = GATE_PREFIXES.flatMap((p) => findPages(path.join(APP_DIR, p)))

describe("portal route pages", () => {
  it("finds the owner, tenant and platform pages", () => {
    expect(pages.length).toBeGreaterThan(20)
  })

  // The layouts redirect before rendering, so any live portal UI imported by a page here only
  // ships dead JS (and would call the production API if the redirect were ever removed).
  it.each(pages.map((p) => [path.relative(APP_DIR, p), p]))("%s only re-exports a portal gate", (_rel, file) => {
    expect(readFileSync(file, "utf8").trim()).toMatch(GATE_EXPORT)
  })
})
