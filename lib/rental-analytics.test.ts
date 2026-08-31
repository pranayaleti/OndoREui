import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/analytics", () => ({
  analytics: {
    trackEvent: vi.fn(),
  },
}))

import { analytics } from "@/lib/analytics"
import { RENTAL_FUNNEL_CATEGORY, trackRentalFunnel } from "./rental-analytics"

describe("trackRentalFunnel", () => {
  it("sends a funnel event with a property id only — no applicant PII", () => {
    trackRentalFunnel("apply_click", "c2e653bf-1b6a-4f0c-9654-82a4896cb137")
    expect(analytics.trackEvent).toHaveBeenCalledWith(
      "rental_apply_click",
      RENTAL_FUNNEL_CATEGORY,
      "c2e653bf-1b6a-4f0c-9654-82a4896cb137",
    )
    const payload = vi.mocked(analytics.trackEvent).mock.calls[0]
    expect(JSON.stringify(payload)).not.toMatch(/@|ssn|lada|ada lovelace/i)
  })
})
