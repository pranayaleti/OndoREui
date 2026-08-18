import { describe, expect, it, vi } from "vitest"
import {
  isAgentInvokedSubmit,
  respondToAgent,
  toolEventMatches,
  webmcpFormAttrs,
  webmcpParamAttrs,
} from "./webmcp-attrs"

describe("webmcpFormAttrs", () => {
  it("sets toolname and tooldescription", () => {
    expect(webmcpFormAttrs("search_cars", "Search the catalog")).toEqual({
      toolname: "search_cars",
      tooldescription: "Search the catalog",
    })
  })

  it("adds toolautosubmit only when requested", () => {
    expect(webmcpFormAttrs("search_cars", "Search", { autoSubmit: true })).toEqual({
      toolname: "search_cars",
      tooldescription: "Search",
      toolautosubmit: "",
    })
    expect(webmcpFormAttrs("submit_lead", "Send a lead")).not.toHaveProperty("toolautosubmit")
  })
})

describe("webmcpParamAttrs", () => {
  it("sets description and optional title override", () => {
    expect(webmcpParamAttrs("Utah ZIP code")).toEqual({
      toolparamdescription: "Utah ZIP code",
    })
    expect(webmcpParamAttrs("Utah ZIP code", "zip_code")).toEqual({
      toolparamdescription: "Utah ZIP code",
      toolparamtitle: "zip_code",
    })
  })
})

describe("agent submit helpers", () => {
  it("detects agentInvoked on the native submit event", () => {
    expect(isAgentInvokedSubmit(new Event("submit"))).toBe(false)
    const agentEvent = new Event("submit") as Event & { agentInvoked: boolean }
    agentEvent.agentInvoked = true
    expect(isAgentInvokedSubmit(agentEvent)).toBe(true)
  })

  it("forwards the result promise via respondWith when the agent invoked submit", async () => {
    const respondWith = vi.fn()
    const event = new Event("submit") as Event & {
      agentInvoked: boolean
      respondWith: typeof respondWith
    }
    event.agentInvoked = true
    event.respondWith = respondWith
    const result = Promise.resolve({ ok: true })
    respondToAgent(event, result)
    expect(respondWith).toHaveBeenCalledWith(result)
  })

  it("does not call respondWith for human submits", () => {
    const respondWith = vi.fn()
    const event = new Event("submit") as Event & { respondWith: typeof respondWith }
    event.respondWith = respondWith
    respondToAgent(event, Promise.resolve({}))
    expect(respondWith).not.toHaveBeenCalled()
  })

  it("matches toolactivated events by toolName, treating a missing name as a match", () => {
    expect(toolEventMatches(new Event("toolactivated"), "submit_contact_lead")).toBe(true)
    const named = new Event("toolactivated") as Event & { toolName: string }
    named.toolName = "submit_contact_lead"
    expect(toolEventMatches(named, "submit_contact_lead")).toBe(true)
    named.toolName = "other_tool"
    expect(toolEventMatches(named, "submit_contact_lead")).toBe(false)
  })
})
