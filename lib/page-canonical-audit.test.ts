import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { listPublicPagesMissingCanonical } from "./page-canonical-audit"

const appDir = join(import.meta.dirname, "..", "app")

describe("public page canonicals", () => {
  it("gives every indexable App Router page its own self-canonical", () => {
    const missing = listPublicPagesMissingCanonical(appDir)
    expect(missing.map((page) => page.route)).toEqual([])
  })
})
