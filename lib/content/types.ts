/**
 * Structured mortgage / education content model.
 * Add a node here (and the matching route) so related modules, search, and
 * the topic hub stay in sync. Do not invent rates, limits, or approvals.
 */

export const CONTENT_KINDS = [
  "pillar",
  "guide",
  "faq",
  "program",
  "calculator",
  "conversion",
  "commercial",
] as const

export type ContentKind = (typeof CONTENT_KINDS)[number]

export const CONTENT_INTENTS = [
  "informational",
  "commercial",
  "transactional",
] as const

export type ContentIntent = (typeof CONTENT_INTENTS)[number]

export const TOPIC_CLUSTER_IDS = [
  "variable-income",
  "first-time-buyer",
  "loan-programs",
  "va",
  "fha",
  "conventional",
  "refinance",
  "home-equity",
  "credit",
  "closing",
  "investment",
  "rates",
  "nonqm",
] as const

export type TopicClusterId = (typeof TOPIC_CLUSTER_IDS)[number]

export const AUDIENCE_IDS = [
  "fthb",
  "repeat",
  "veteran",
  "self_employed",
  "contract_1099",
  "commission",
  "investor",
  "high_income",
  "gift_funds",
  "imperfect_credit",
] as const

export type AudienceId = (typeof AUDIENCE_IDS)[number]

export const LOAN_PROGRAM_IDS = [
  "conventional",
  "fha",
  "va",
  "usda",
  "jumbo",
  "arm",
  "heloc",
  "nonqm",
  "refinance",
  "reverse",
] as const

export type LoanProgramId = (typeof LOAN_PROGRAM_IDS)[number]

export type ContentCta = {
  label: string
  href: string
}

export type ContentNode = {
  id: string
  /** Canonical site path, no trailing slash (callers add slash for metadata). */
  path: string
  title: string
  description: string
  kind: ContentKind
  cluster: TopicClusterId
  audiences: readonly AudienceId[]
  programs: readonly LoanProgramId[]
  intent: ContentIntent
  /** Other node ids. Keep this a small, editorial set, not a dump. */
  related: readonly string[]
  cta?: ContentCta
  category?: string
  published?: string
  modified?: string
  author?: string
}

export type TopicCluster = {
  id: TopicClusterId
  title: string
  description: string
  pillarId: string
}
