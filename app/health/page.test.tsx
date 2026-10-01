import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderToString } from "react-dom/server"
import { render, screen, waitFor } from "@testing-library/react"
import HealthPage from "./page"

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{"ok":true}' }))
})
afterEach(() => vi.unstubAllGlobals())

describe("HealthPage", () => {
  it("renders no clock value or origin on the server, so hydration matches", () => {
    const html = renderToString(<HealthPage />)
    expect(html).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:/)
    expect(html.replace(/<!-- -->/g, "")).toContain("Checked at: ...")
  })

  it("fills in the timestamp after mount", async () => {
    render(<HealthPage />)
    await waitFor(() => expect(screen.getByText(/Checked at: \d{4}-\d{2}-\d{2}T/)).toBeTruthy())
  })
})
