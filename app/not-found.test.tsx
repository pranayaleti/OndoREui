import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({ usePathname: () => "/about-us/" }))

import NotFound from "@/app/not-found"
import { SITE_PHONE } from "@/lib/site"

const pageIndex = [
  { p: "/about/", t: "About Ondo" },
  { p: "/sell/", t: "Sell Your Home" },
]

describe("404 page", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(pageIndex), { status: 200, headers: { "content-type": "application/json" } })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("offers the page the visitor most likely meant instead of silently redirecting", async () => {
    render(<NotFound />)
    const suggestion = await screen.findByRole("link", { name: /About Ondo/ })
    expect(suggestion).toHaveAttribute("href", "/about/")
    expect(suggestion).toHaveAttribute("data-analytics-event", "not_found_suggestion_click")
    expect(fetch).toHaveBeenCalledWith("/page-index.json")
  })

  // The old pattern /[^+\\d]/ stripped the digits, leaving a bare "tel:" link that called nobody.
  it("dials the real number from the call button", async () => {
    render(<NotFound />)
    const call = await screen.findByRole("link", { name: SITE_PHONE })
    expect(call).toHaveAttribute("href", `tel:${SITE_PHONE.replace(/[^+\d]/g, "")}`)
    expect(call.getAttribute("href")).toMatch(/^tel:\+?\d{10,}$/)
  })

  it("shows nothing extra when the page index cannot load", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 404 })))
    render(<NotFound />)
    await screen.findByRole("heading", { name: /Page Not Found/i })
    expect(screen.queryByRole("heading", { name: /looking for one of these/i })).not.toBeInTheDocument()
  })
})
