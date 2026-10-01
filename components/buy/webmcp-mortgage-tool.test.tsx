import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"
import { WebMCPMortgageTool } from "@/components/buy/webmcp-mortgage-tool"

type Tool = {
  execute: (input: { principal?: number; annualRatePercent?: number; termYears?: number }) => Promise<{
    content: { text: string }[]
  }>
}

function registerTool(): Tool {
  const registerTool = vi.fn()
  Object.defineProperty(navigator, "modelContext", {
    configurable: true,
    value: { registerTool, unregisterTool: vi.fn() },
  })
  render(<WebMCPMortgageTool />)
  return registerTool.mock.calls[0][0] as Tool
}

describe("WebMCPMortgageTool", () => {
  afterEach(() => {
    delete (navigator as unknown as { modelContext?: unknown }).modelContext
  })

  it("returns the monthly P&I for valid input", async () => {
    const tool = registerTool()
    const result = await tool.execute({ principal: 400000, annualRatePercent: 6.5, termYears: 30 })
    expect(JSON.parse(result.content[0].text).monthlyPaymentPandI).toBeCloseTo(2528.27, 2)
  })

  it("rejects a negative rate instead of returning a payment", async () => {
    const tool = registerTool()
    const result = await tool.execute({ principal: 100000, annualRatePercent: -5, termYears: 30 })
    const body = JSON.parse(result.content[0].text)
    expect(body.error).toBeTruthy()
    expect(body.monthlyPaymentPandI).toBeUndefined()
  })
})
