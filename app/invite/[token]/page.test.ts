import { describe, expect, it } from "vitest"
import agentDiscoveryConfig from "@/lib/agent-discovery-config.json"
import { toCanonicalPageUrl } from "@/lib/page-canonical"
import { metadata } from "./page"

describe("/invite/[token] metadata", () => {
  it("is noindex and canonical to the one built placeholder URL", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false })
    expect(metadata.alternates?.canonical).toBe(toCanonicalPageUrl("/invite/_/"))
  })
})

describe("robots.txt disallow list", () => {
  it("does not block /feedback, so its noindex tag can be read", () => {
    expect(agentDiscoveryConfig.extraDisallow).not.toContain("/feedback")
  })

  it("still blocks the private invite stub", () => {
    expect(agentDiscoveryConfig.extraDisallow).toContain("/invite")
  })
})
