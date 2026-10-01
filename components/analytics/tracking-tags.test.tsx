import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, waitFor } from "@testing-library/react"

vi.mock("next/script", () => ({
  default: ({ id, src }: { id?: string; src?: string }) => <script data-testid="tag" data-id={id} data-src={src} />,
}))
vi.mock("@/lib/region", () => ({ isMarketingRestrictedRegion: () => false }))

import { GeoGatedGoogleTagManagerNoscript, TrackingTags } from "./tracking-tags"

function visit(path: string) {
  window.history.pushState({}, "", path)
}

describe("TrackingTags on bearer-token URLs", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_HUBSPOT_PORTAL_ID", "245076632")
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-ABC123")
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    visit("/")
  })

  it("loads HubSpot on an ordinary page", async () => {
    visit("/buy/")
    const { container } = render(<TrackingTags />)
    await waitFor(() => expect(container.querySelector('[data-id="hubspot-tracking"]')).not.toBeNull())
  })

  it.each(["/apply/co/sampletoken123/", "/visit/schedule/sampletoken456/", "/visit/confirm/sampletoken789/"])(
    "loads no tag on %s",
    async (path) => {
      visit(path)
      const { container } = render(<TrackingTags />)
      // Effects have run once render() returns; nothing may appear afterwards either.
      await new Promise((resolve) => setTimeout(resolve, 20))
      expect(container.querySelector("script")).toBeNull()
    },
  )

  it("loads no GTM noscript iframe on a token URL", async () => {
    visit("/visit/schedule/sampletoken456/")
    const { container } = render(<GeoGatedGoogleTagManagerNoscript />)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(container.querySelector("iframe, noscript")).toBeNull()
  })
})
