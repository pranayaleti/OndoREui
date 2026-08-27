import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(__dirname, "../..")

describe("public listing detail static-export routing", () => {
  it("does not hard-404 unknown publicIds in next dev via dynamicParams = false", () => {
    const source = readFileSync(join(ROOT, "app/properties/[publicId]/page.tsx"), "utf8")
    expect(source).not.toMatch(/export const dynamicParams = false/)
    expect(source).toContain("PropertyListingDetailClient")
  })

  it("recovers /properties/{publicId} from the static-export 404 shell", () => {
    const source = readFileSync(join(ROOT, "app/not-found.tsx"), "utf8")
    expect(source).toContain("publicIdFromPathname")
    expect(source).toContain("PropertyListingDetailClient")
  })

  it("rewrites GitHub Pages listing 404s to 200 only after origin 404, without clobbering prerendered HTML", () => {
    const snippet = readFileSync(join(ROOT, "scripts/cloudflare-listing-404-to-200.js"), "utf8")
    const spec = JSON.parse(
      readFileSync(join(ROOT, "scripts/cloudflare-listing-404-to-200.json"), "utf8"),
    ) as { expected_zone_name: string; rule: { expression: string } }
    expect(spec.expected_zone_name).toBe("ondorealestate.com")
    expect(spec.rule.expression).toContain("www.ondorealestate.com")
    expect(spec.rule.expression).toContain("api.ondorealestate.com")
    expect(spec.rule.expression).toMatch(/\^\/properties\/\[\^\/\]\+\/\?\$/)
    expect(snippet).toContain("originResponse.status !== 404")
    expect(snippet).toContain("/404.html")
    expect(snippet).not.toMatch(/return new Response\([^)]*status:\s*200[\s\S]*fetch\(request\)/)
    const paste = execFileSync(
      "python3",
      ["scripts/apply-cloudflare-listing-404-to-200.py", "--print-dashboard"],
      { encoding: "utf8", cwd: ROOT },
    )
    expect(paste).toContain(spec.rule.expression)
    expect(paste).toContain("listing-404-to-200")
    expect(paste).toContain("Never: api.ondorealestate.com, app.ondorealestate.com")
  })
})
