/**
 * SOURCE OF TRUTH for public “watch for” copy on /resources/templates
 * and the in-product lease-packet summary.
 *
 * Backend seed (`OndoREBackend/supabase/migrations/20260827181652_seed_utah_disclosure_rules.sql`)
 * must stay aligned with these titles and watch-for bullets. Do not invent
 * statutes here, and do not generate this copy with an LLM per user.
 *
 * This is educational material, not legal advice.
 */

export type WatchForTopicId =
  | "lead_paint"
  | "mold"
  | "meth"
  | "deposit_return"
  | "entry_notice"
  | "pet_terms"
  | "utility_hoa"
  | "owner_agent_identity"

export interface ComplianceWatchForRule {
  id: string
  topicId: WatchForTopicId
  /** 2-letter state, or "US" for federal rules that apply in every state. */
  jurisdiction: string
  title: string
  description: string
  watchFor: string[]
  ruleType: "disclosure"
  /** Citation already used in Ondo blog copy — not a newly invented statute. */
  sourceNote?: string
}

export const COMPLIANCE_WATCH_FOR_RULES: readonly ComplianceWatchForRule[] = [
  {
    id: "us-lead-paint",
    topicId: "lead_paint",
    jurisdiction: "US",
    title: "Lead-based paint disclosure (federal, pre-1978)",
    description:
      "Federal law requires a lead-based paint disclosure for housing built before 1978. Ondo’s Utah landlord-tenant guide lists this as a required lease disclosure.",
    watchFor: [
      "Confirm whether the dwelling was built before 1978 before skipping a lead packet.",
      "Disclose any known lead-based paint hazards — this is a federal requirement, not a state form you can omit.",
      "Keep copies of what the resident received; a missing disclosure is a common closing-day and turnover gap.",
    ],
    ruleType: "disclosure",
    sourceNote: "OndoREui/app/blog/utah-landlord-tenant-law-guide (federal lead-based paint)",
  },
  {
    id: "ut-mold",
    topicId: "mold",
    jurisdiction: "UT",
    title: "Mold disclosure (known conditions)",
    description:
      "Ondo’s Utah landlord-tenant guide lists a mold disclosure when any mold condition is known. This is educational, not a finding that mold is present.",
    watchFor: [
      "Disclose known mold conditions rather than waiting for a dispute.",
      "If you have not inspected recently, say so — do not imply a clean bill of health you cannot support.",
      "Pair this with maintenance records; habitability issues often show up first as moisture complaints.",
    ],
    ruleType: "disclosure",
    sourceNote: "OndoREui/app/blog/utah-landlord-tenant-law-guide (required lease disclosures)",
  },
  {
    id: "ut-meth",
    topicId: "meth",
    jurisdiction: "UT",
    title: "Methamphetamine contamination history",
    description:
      "Ondo’s Utah landlord-tenant guide lists methamphetamine contamination history when applicable, citing Utah Code § 57-27 as already published on that page.",
    watchFor: [
      "Ask whether the property has a known methamphetamine contamination history before using a generic lease.",
      "If a history exists, it belongs in the packet — do not bury it in an “other” folder.",
      "This card is not a determination that contamination occurred; it flags the disclosure topic already cited in Ondo copy.",
    ],
    ruleType: "disclosure",
    sourceNote: "OndoREui/app/blog/utah-landlord-tenant-law-guide (Utah Code § 57-27)",
  },
  {
    id: "ut-deposit-return",
    topicId: "deposit_return",
    jurisdiction: "UT",
    title: "Security deposit return timing",
    description:
      "Ondo’s Utah landlord-tenant guide describes a 30-day return after the tenant vacates and returns the keys, with itemized deductions and no deductions for normal wear and tear.",
    watchFor: [
      "Plan the 30-day return clock from move-out and key return — not from the day you “get around to it.”",
      "Any deduction needs a written, itemized list of what was taken and why.",
      "Normal wear and tear is not a deduction; photo logs and a signed move-in form are the usual defense.",
    ],
    ruleType: "disclosure",
    sourceNote: "OndoREui/app/blog/utah-landlord-tenant-law-guide (security deposits)",
  },
  {
    id: "ut-entry-notice",
    topicId: "entry_notice",
    jurisdiction: "UT",
    title: "Entry notice",
    description:
      "Ondo’s Utah landlord-tenant guide states that landlords must give reasonable notice before entering, generally interpreted as 24 hours, with exceptions for genuine emergencies.",
    watchFor: [
      "Write the entry-notice policy into the lease so both sides know the default.",
      "Treat 24 hours as the usual reasonable-notice baseline described in Ondo’s Utah guide — emergencies are the exception.",
      "Self-help lockouts and utility shutoffs are illegal in Utah per that same guide; they are not a workaround for entry or eviction.",
    ],
    ruleType: "disclosure",
    sourceNote: "OndoREui/app/blog/utah-landlord-tenant-law-guide (entry rights)",
  },
  {
    id: "ut-pet-terms",
    topicId: "pet_terms",
    jurisdiction: "UT",
    title: "Pet deposit versus pet rent",
    description:
      "Ondo’s Utah lease and first-time landlord materials treat pets as a lease term (deposit, rent, limits). Assistance animals are a Fair Housing accommodation, not a “pet fee” topic.",
    watchFor: [
      "Say whether money is a refundable deposit, non-refundable fee, or monthly pet rent — mixed labels cause deposit disputes.",
      "Spell out animal limits and that damage beyond normal wear can be charged.",
      "Assistance animals for a disability are not pets; apply the same screening criteria to people, not to the presence of a trained assistance animal.",
    ],
    ruleType: "disclosure",
    sourceNote: "OndoREui/app/blog/first-time-landlord-checklist-utah (lease terms) + Fair Housing section of the Utah law guide",
  },
  {
    id: "ut-utility-hoa",
    topicId: "utility_hoa",
    jurisdiction: "UT",
    title: "Utilities and HOA rules",
    description:
      "Ondo’s first-time landlord checklist tells owners to confirm HOA rental rules and to decide which utilities the resident pays before listing.",
    watchFor: [
      "List who pays water, sewer, trash, gas, and electric — “utilities included” without a list is a dispute.",
      "Confirm the HOA allows the rental and whether residents must follow additional rules or approvals.",
      "This addendum is not a substitute for the association’s recorded documents.",
    ],
    ruleType: "disclosure",
    sourceNote: "OndoREui/app/blog/first-time-landlord-checklist-utah (HOA, utilities)",
  },
  {
    id: "ut-owner-agent",
    topicId: "owner_agent_identity",
    jurisdiction: "UT",
    title: "Owner or agent name and address for notices",
    description:
      "Ondo’s Utah landlord-tenant guide and first-time landlord checklist require the owner or authorized agent name and address for receiving notices and process of service.",
    watchFor: [
      "The lease packet should name who receives legal notices — owner or authorized agent — with a service address.",
      "A P.O. box-only contact without a service address is a common gap called out in Ondo’s Utah materials.",
    ],
    ruleType: "disclosure",
    sourceNote: "OndoREui/app/blog/utah-landlord-tenant-law-guide + first-time-landlord-checklist-utah",
  },
]

export function watchForRulesForState(state: string): ComplianceWatchForRule[] {
  const code = state.trim().toUpperCase()
  return COMPLIANCE_WATCH_FOR_RULES.filter(
    (rule) => rule.jurisdiction === code || rule.jurisdiction === "US",
  )
}

export function watchForBullets(topicIds: readonly WatchForTopicId[], state: string): string[] {
  const wanted = new Set(topicIds)
  const bullets: string[] = []
  const seen = new Set<string>()
  for (const rule of watchForRulesForState(state)) {
    if (!wanted.has(rule.topicId)) continue
    for (const line of rule.watchFor) {
      if (seen.has(line)) continue
      seen.add(line)
      bullets.push(line)
    }
  }
  return bullets
}
