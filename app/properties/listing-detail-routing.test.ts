import { execFileSync } from "node:child_process"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { RESERVED_ROOT_SEGMENTS } from "@/lib/public-property"

const ROOT = join(__dirname, "../..")

describe("public listing detail static-export routing", () => {
  it("does not hard-404 unknown publicIds in next dev via dynamicParams = false", () => {
    for (const file of ["app/properties/[publicId]/page.tsx", "app/[listing]/page.tsx"]) {
      expect(readFileSync(join(ROOT, file), "utf8")).not.toMatch(/export const dynamicParams = false/)
    }
    expect(readFileSync(join(ROOT, "components/properties/listing-page.tsx"), "utf8")).toContain(
      "PropertyListingDetailClient",
    )
  })

  it("keeps address slugs off every top-level route name", () => {
    const appDirs = readdirSync(join(ROOT, "app"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("[") && !d.name.startsWith("_") && !d.name.startsWith(".") && !d.name.includes(".") && !d.name.startsWith("("))
      .map((d) => d.name.toLowerCase())
    for (const dir of appDirs) {
      expect(RESERVED_ROOT_SEGMENTS.has(dir), `app/${dir} missing from RESERVED_ROOT_SEGMENTS`).toBe(true)
    }
  })

  it("rewrites GitHub Pages listing 404s to 200 only after origin 404, without clobbering prerendered HTML", () => {
    const snippet = readFileSync(join(ROOT, "scripts/cloudflare-listing-404-to-200.js"), "utf8")
    const spec = JSON.parse(
      readFileSync(join(ROOT, "scripts/cloudflare-listing-404-to-200.json"), "utf8"),
    ) as { expected_zone_name: string; rule: { expression: string } }
    expect(spec.expected_zone_name).toBe("ondorealestate.com")
    expect(spec.rule.expression).toContain("www.ondorealestate.com")
    expect(spec.rule.expression).toContain("api.ondorealestate.com")
    expect(spec.rule.expression).toContain("^/(properties/[^/]+|[0-9][a-z0-9-]*)/?$")
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
