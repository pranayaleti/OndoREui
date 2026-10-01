import { describe, it, expect, vi, afterEach } from "vitest"
import { render } from "@testing-library/react"
import { WebMCPOpportunitiesTool, listSampleOpportunities, findSampleOpportunity } from "./webmcp-opportunities-tool"
import { MOCK_OPPORTUNITIES } from "@/lib/investments-data"
import { fetchOpportunitiesClient, fetchOpportunityBySlugClient } from "@/lib/investments-api"

type Tool = { name: string; execute: (input: unknown) => Promise<{ content: { text: string }[] }> }

afterEach(() => {
  vi.unstubAllGlobals()
  Reflect.deleteProperty(navigator, "modelContext")
})

function registerTools() {
  const tools: Record<string, Tool> = {}
  Object.defineProperty(navigator, "modelContext", {
    configurable: true,
    value: { registerTool: (t: Tool) => (tools[t.name] = t), unregisterTool: vi.fn() },
  })
  render(<WebMCPOpportunitiesTool />)
  return tools
}

describe("WebMCP investment tools", () => {
  it("list returns the same sample records the page renders, without any network call", async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal("fetch", fetchSpy)
    const tools = registerTools()
    const out = JSON.parse((await tools.list_investment_opportunities.execute({})).content[0].text)
    expect(out.sample).toBe(true)
    expect(out.count).toBe(MOCK_OPPORTUNITIES.length)
    expect(out.count).toBeGreaterThan(0)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("get returns a sample by slug and a not-found error otherwise", async () => {
    const tools = registerTools()
    const slug = MOCK_OPPORTUNITIES[0].slug
    const found = JSON.parse((await tools.get_investment_opportunity.execute({ slug })).content[0].text)
    expect(found.slug).toBe(slug)
    expect(found.sample).toBe(true)
    const missing = JSON.parse((await tools.get_investment_opportunity.execute({ slug: "nope" })).content[0].text)
    expect(missing.error).toBe("Opportunity not found")
  })

  it("status filter only applies to known statuses", () => {
    expect(listSampleOpportunities("bogus")).toHaveLength(MOCK_OPPORTUNITIES.length)
    expect(listSampleOpportunities("open").every((o) => o.status === "open")).toBe(true)
    expect(findSampleOpportunity("nope")).toBeUndefined()
  })
})

describe("investments API client", () => {
  it("throws on non-2xx instead of returning an empty list", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    await expect(fetchOpportunitiesClient()).rejects.toThrow("404")
  })

  it("slug fetch returns null on 404 but throws on 5xx", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    await expect(fetchOpportunityBySlugClient("x")).resolves.toBeNull()
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }))
    await expect(fetchOpportunityBySlugClient("x")).rejects.toThrow("503")
  })
})
