import { createRequire } from "node:module"
import { describe, expect, it } from "vitest"
import agentDiscoveryConfig from "./agent-discovery-config.json"
import {
  AGENT_MARKDOWN_TWINS,
  AI_CRAWLER_AGENTS,
  buildLlmsFullTxtBody,
  buildLlmsJsonData,
  buildLlmsTxtBody,
  buildRobotsTxtBody,
  buildSitemapMdBody,
  LLMS_DISCLOSURES_BLOCK,
} from "./site-index"

// next-sitemap.config.js is CJS; load it once for the drift tests below so we
// verify the two robots.txt producers stay in lockstep.
const requireCjs = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextSitemapConfig = requireCjs("../next-sitemap.config.js") as {
  robotsTxtOptions: {
    policies: Array<{ userAgent: string; allow: string[]; disallow: string[] }>
    transformRobotsTxt: (config: { siteUrl: string }, robotsTxt: string) => Promise<string>
  }
}

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

  it("tells agents how to fetch Markdown via Accept: text/markdown", () => {
    const brief = buildLlmsTxtBody()
    expect(brief).toMatch(/How to fetch Markdown/i)
    expect(brief).toMatch(/Accept: text\/markdown/)
    expect(brief).toMatch(/sibling `?\.md`? file/i)
    expect(brief).toContain("/about.md")
    for (const twin of AGENT_MARKDOWN_TWINS) {
      expect(brief).toContain(twin.md)
    }
  })

  it("lists sitemap.md and calculator Markdown twins in the extended brief", () => {
    const full = buildLlmsFullTxtBody()
    expect(full).toContain("/sitemap.md")
    expect(full).toContain("/calculators/{slug}.md")
  })
})

describe("robots.txt", () => {
  it("explicitly allows the LLM briefs and Markdown twins", () => {
    const robots = buildRobotsTxtBody()
    expect(robots).toContain("Allow: /llms.txt")
    expect(robots).toContain("Allow: /llms-full.txt")
    expect(robots).toContain("Allow: /.well-known/llms.txt")
    expect(robots).toContain("Allow: /sitemap.md")
    expect(robots).toContain("Allow: /index.md")
  })

  it("declares Content-Signal (search, ai-input, ai-train) inside the UA=* group", () => {
    const robots = buildRobotsTxtBody()
    expect(robots).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=yes")
    const uaStar = robots.slice(robots.indexOf("User-agent: *"))
    expect(uaStar).toMatch(/Content-Signal:/)
  })

  it("includes ClaudeBot alongside legacy Claude-Web / Anthropic-AI entries", () => {
    expect(AI_CRAWLER_AGENTS).toContain("ClaudeBot")
    expect(AI_CRAWLER_AGENTS).toContain("Claude-Web")
    expect(AI_CRAWLER_AGENTS).toContain("Anthropic-AI")
    const robots = buildRobotsTxtBody()
    expect(robots).toMatch(/^User-agent: ClaudeBot$/m)
  })
})

describe("robots.txt drift between App Router route and next-sitemap", () => {
  // In production, `postbuild → next-sitemap` overwrites `out/robots.txt`.
  // In dev and any environment where next-sitemap doesn't run, the App Router
  // route wins. Both must serve the same policy, otherwise crawlers see
  // different rules depending on which build ran last.
  it("uses the same AI crawler user-agent list in both producers", () => {
    const uaFromConfig = new Set(
      nextSitemapConfig.robotsTxtOptions.policies
        .map((p) => p.userAgent)
        .filter((ua) => ua !== "*"),
    )
    const uaFromCode = new Set(AI_CRAWLER_AGENTS)
    expect([...uaFromConfig].sort()).toEqual([...uaFromCode].sort())
  })

  it("both allow the LLM briefs and Markdown twins", () => {
    const uaStar = nextSitemapConfig.robotsTxtOptions.policies.find((p) => p.userAgent === "*")
    expect(uaStar).toBeDefined()
    for (const path of ["/llms.txt", "/llms-full.txt", "/.well-known/llms.txt", "/sitemap.md", "/index.md"]) {
      expect(uaStar!.allow).toContain(path)
    }
  })

  it("both disallow the same private prefixes", () => {
    const uaStar = nextSitemapConfig.robotsTxtOptions.policies.find((p) => p.userAgent === "*")
    expect(uaStar).toBeDefined()
    const expected = new Set([
      ...agentDiscoveryConfig.privateRoutePrefixes,
      ...agentDiscoveryConfig.extraDisallow,
    ])
    expect(new Set(uaStar!.disallow)).toEqual(expected)
  })

  it("next-sitemap's transform injects Content-Signal directly after UA=*", async () => {
    const sample = "# *\nUser-agent: *\nAllow: /\nDisallow: /admin\n\n# GPTBot\nUser-agent: GPTBot\nAllow: /\n"
    const out = await nextSitemapConfig.robotsTxtOptions.transformRobotsTxt(
      { siteUrl: "https://example.com" },
      sample,
    )
    expect(out).toContain("Content-Signal: search=yes, ai-input=yes, ai-train=yes")
    const lines = out.split("\n")
    const uaStar = lines.findIndex((l) => l === "User-agent: *")
    const csIdx = lines.findIndex((l) => l.startsWith("Content-Signal:"))
    expect(csIdx).toBe(uaStar + 1)
  })
})

describe("sitemap.md", () => {
  it("renders an H1, blockquote description, and Markdown links", () => {
    const body = buildSitemapMdBody()
    expect(body).toMatch(/^# Ondo Real Estate, Markdown sitemap/m)
    expect(body).toMatch(/^> Curated index of every public page/m)
    expect(body).toMatch(/\[.+\]\(https?:\/\/.+\)/)
  })

  it("links calculator entries to their Markdown twins", () => {
    const body = buildSitemapMdBody()
    expect(body).toMatch(/\/calculators\/mortgage-payment\/\)/)
    expect(body).toMatch(/\/calculators\/mortgage-payment\.md\)/)
  })

  it("lists every first-party Markdown twin", () => {
    const body = buildSitemapMdBody()
    for (const twin of AGENT_MARKDOWN_TWINS) {
      expect(body).toContain(twin.md)
    }
  })
})

describe("llms.json", () => {
  it("exposes content negotiation metadata and Markdown twins", () => {
    const data = buildLlmsJsonData()
    expect(data.contentNegotiation.acceptHeader).toBe("text/markdown")
    expect(data.resources.markdownSitemap).toMatch(/\/sitemap\.md$/)
    expect(data.contentNegotiation.firstPartyMarkdownTwins.length).toBe(AGENT_MARKDOWN_TWINS.length)
  })
})
