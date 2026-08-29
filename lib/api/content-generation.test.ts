import { describe, expect, it } from "vitest"
import { CONTENT_TYPES, contentStudioPortalPath } from "./content-generation"
import { APP_PORTAL_URL } from "../site"

describe("content studio contract", () => {
  it("lists the six product content types", () => {
    expect(CONTENT_TYPES).toEqual([
      "listing_video_script",
      "local_content_ideas",
      "topic_to_script",
      "buyer_questions",
      "buyer_question_video",
      "market_commentary",
    ])
  })

  it("points managers and owners at the dashboard studio, not a public generator", () => {
    expect(contentStudioPortalPath("manager")).toBe("/dashboard/content")
    expect(contentStudioPortalPath("owner")).toBe("/owner/content")
    expect(`${APP_PORTAL_URL}${contentStudioPortalPath("manager")}`).toMatch(/\/dashboard\/content$/)
  })
})
