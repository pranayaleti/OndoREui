/**
 * Content studio contract — POST /api/content/generate
 *
 * The marketing site does not call this endpoint (portal cookies live on the
 * dashboard origin). Types stay in lockstep with OndoREBackend so agent copy
 * and portal CTAs describe the same six drafts.
 */

export const CONTENT_TYPES = [
  "listing_video_script",
  "local_content_ideas",
  "topic_to_script",
  "buyer_questions",
  "buyer_question_video",
  "market_commentary",
] as const

export type ContentType = (typeof CONTENT_TYPES)[number]
export type MarketAudience = "buyer" | "seller"

export interface GenerateContentRequest {
  contentType: ContentType
  listingId?: string | null
  city?: string | null
  topic?: string | null
  question?: string | null
  extraNotes?: string | null
  audience?: MarketAudience | null
}

export type ContentPayload =
  | {
      type: "listing_video_script"
      title: string
      script: string
      estimatedDurationSeconds: number
      callToAction: string
      wordCount: number
    }
  | {
      type: "local_content_ideas"
      location: string
      categories: Array<{ name: string; ideas: string[] }>
    }
  | {
      type: "topic_to_script"
      title: string
      topic: string
      location: string | null
      script: string
      estimatedDurationSeconds: number
      engagementQuestion: string
      wordCount: number
    }
  | { type: "buyer_questions"; questions: string[] }
  | {
      type: "buyer_question_video"
      title: string
      question: string
      script: string
      estimatedDurationSeconds: number
      callToAction: string
      wordCount: number
    }
  | {
      type: "market_commentary"
      title: string
      audience: MarketAudience
      script: string
      market: string
      dataDate: string | null
      source: string | null
      asOf: string | null
      verifiedFacts: string[]
      educationalContext: string[]
      dataAvailability: "verified" | "unavailable"
    }

export interface GenerateContentResult {
  contentType: ContentType
  body: string
  payload?: ContentPayload
  disclosures: string
  bodyWithDisclosures: string
  complianceWarnings: Array<{
    category: "fairHousing" | "lending" | "valuation"
    term: string
    reason: string
  }>
  listing: { id: string; title: string; city: string } | null
  source: "ai"
}

export function contentStudioPortalPath(role: "manager" | "owner"): string {
  switch (role) {
    case "manager":
      return "/dashboard/content"
    case "owner":
      return "/owner/content"
    default: {
      const _exhaustive: never = role
      return _exhaustive
    }
  }
}
