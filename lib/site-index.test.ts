import { describe, expect, it } from "vitest"
import { buildLlmsFullTxtBody, buildLlmsTxtBody, buildRobotsTxtBody, LLMS_DISCLOSURES_BLOCK } from "./site-index"

describe("LLM briefs", () => {
  it("keeps identical disclosures on llms.txt and llms-full.txt", () => {
    const brief = buildLlmsTxtBody()
    const full = buildLlmsFullTxtBody()
    expect(LLMS_DISCLOSURES_BLOCK).toContain("## Required disclosures")
    expect(brief).toContain(LLMS_DISCLOSURES_BLOCK)
    expect(full).toContain(LLMS_DISCLOSURES_BLOCK)
  })

  it("does not invent NMLS numbers or imply a credit decision", () => {
    const combined = `${buildLlmsTxtBody()}\n${buildLlmsFullTxtBody()}`
    expect(combined).toContain("NMLS ID on file")
    expect(combined).not.toMatch(/NMLS\s*#?\s*123456/i)
    expect(combined).not.toMatch(/pre-?approved/i)
  })

  it("points crawlers at the generated briefs instead of a per-city index.txt tree", () => {
    expect(buildLlmsTxtBody()).toMatch(/\/loans\/heloc\/index\.txt is a pointer only/)
    expect(buildLlmsFullTxtBody()).toMatch(/\/loans\/heloc\/index\.txt is a pointer only/)
  })
})

describe("robots.txt", () => {
  it("explicitly allows the LLM briefs", () => {
    const robots = buildRobotsTxtBody()
    expect(robots).toContain("Allow: /llms.txt")
    expect(robots).toContain("Allow: /llms-full.txt")
    expect(robots).toContain("Allow: /.well-known/llms.txt")
  })
})
