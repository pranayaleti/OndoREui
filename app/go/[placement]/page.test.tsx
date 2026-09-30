import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { QR_PLACEMENTS } from "@/lib/qr-placements"

// jsdom cannot navigate; the meta refresh and the fallback link carry the behavior under test.
vi.mock("./qr-redirect", () => ({ QrRedirect: () => null }))

import QrRedirectPage, { generateStaticParams } from "./page"

describe("/go/[placement]", () => {
  it("builds one redirect page per placement", () => {
    expect(generateStaticParams().map(({ placement }) => placement)).toEqual(QR_PLACEMENTS.map(({ id }) => id))
  })

  it("forwards a business-card scan to /links with its tracking tags", async () => {
    render(await QrRedirectPage({ params: Promise.resolve({ placement: "card" }) }))
    const target = "/links/?utm_source=business_card&utm_medium=qr&utm_campaign=links"
    expect(document.querySelector('meta[http-equiv="refresh"]')).toHaveAttribute("content", `0;url=${target}`)
    expect(screen.getByRole("link", { name: /ondo real estate/i })).toHaveAttribute("href", target)
  })
})
