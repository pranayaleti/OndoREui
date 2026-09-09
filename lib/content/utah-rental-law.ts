/**
 * Utah residential landlord-tenant rules used across FAQs and resource pages.
 *
 * Sourced from published summaries that cite the Utah Code:
 * - https://www.turbotenant.com/rental-lease-agreement/utah/laws/
 * - https://www.avail.com/education/laws/utah-landlord-tenant-law
 *
 * VERIFICATION LIMIT, read before adding to this file:
 * the statutory text at le.utah.gov is JavaScript-rendered and the usual
 * mirrors (Justia, FindLaw, Casetext) and utcourts.gov all refuse automated
 * fetches, so these entries were NOT machine-checked against primary law.
 * Each carries its Utah Code citation so a reader can confirm it directly.
 * Anything the two sources disagreed on, or that could not be corroborated,
 * lives in UTAH_RENTAL_LAW_UNVERIFIED below and is deliberately NOT published
 * as fact -- a wrong late-fee cap on a property-management site is something an
 * owner would act on.
 *
 * Follows the lending-facts.ts convention: dated, cited, and explicitly not advice.
 */

export const UTAH_RENTAL_LAW_AS_OF = "2026-09"

/** Disclosure is a template property, never written per entry. */
export const UTAH_RENTAL_LAW_DISCLAIMER =
  "Educational summary of Utah law as of " +
  UTAH_RENTAL_LAW_AS_OF +
  ", not legal advice and not a substitute for a licensed Utah attorney. Statutes change and courts read them in context; confirm the current text at le.utah.gov before relying on any figure here. Fair Housing and Equal Housing Opportunity rules apply to every Utah rental."

export const UTAH_CODE_BASE = "https://le.utah.gov/xcode/"

export type UtahRentalLawTopic =
  | "deposits"
  | "entry"
  | "notice"
  | "eviction"
  | "habitability"
  | "disclosures"
  | "termination"

export interface UtahRentalLawRule {
  /** Stable id, also used as the FAQ anchor. */
  id: string
  topic: UtahRentalLawTopic
  /** Phrased as a real search query, which is how these surface in AI answers. */
  question: string
  /** Plain-language answer. No invented figures: every number traces to `citation`. */
  answer: string
  /** Utah Code section, exactly as cited by the source. */
  citation: string
  /** Who this matters to, for routing between tenant and owner FAQ pages. */
  audience: "tenant" | "owner" | "both"
}

export const UTAH_RENTAL_LAW_RULES: readonly UtahRentalLawRule[] = [
  {
    id: "deposit-return-deadline",
    topic: "deposits",
    question: "How long does a landlord have to return a security deposit in Utah?",
    answer:
      "A Utah landlord must return the deposit within 30 days of the end of the tenancy, or within 15 days of receiving the tenant's forwarding address, whichever comes later. The refund has to arrive with a written itemized statement of any deductions.",
    citation: "Utah Code § 57-17-3",
    audience: "both",
  },
  {
    id: "deposit-deductions",
    topic: "deposits",
    question: "What can a Utah landlord deduct from a security deposit?",
    answer:
      "Utah allows deductions for unpaid rent, cleaning costs, damage beyond normal wear and tear, and other losses caused by the tenant breaching the lease. Ordinary wear from living in the unit is not deductible, and every deduction has to appear on the written itemized statement.",
    citation: "Utah Code § 57-17-2",
    audience: "both",
  },
  {
    id: "deposit-penalty",
    topic: "deposits",
    question: "What happens if a Utah landlord does not return the deposit on time?",
    answer:
      "A landlord who fails to meet the statutory deadline and itemization requirement can be required to refund the full deposit plus an additional $100. Keeping dated proof of when the itemized statement was sent is the practical defense.",
    citation: "Utah Code § 57-17-2",
    audience: "both",
  },
  {
    id: "entry-notice",
    topic: "entry",
    question: "How much notice must a Utah landlord give before entering a rental?",
    answer:
      "At least 24 hours' advance notice, unless the lease sets a different agreed term or there is a genuine emergency. Entry also has to be at a reasonable time and for a legitimate purpose such as repairs or an inspection.",
    citation: "Utah Code § 57-22-4",
    audience: "both",
  },
  {
    id: "month-to-month-notice",
    topic: "notice",
    question: "How much notice ends a month-to-month lease in Utah?",
    answer:
      "At least 15 days' written notice before the end of the rental period ends a month-to-month tenancy in Utah. A fixed-term lease instead runs to its end date, and the lease itself governs how non-renewal is handled.",
    citation: "Utah Code § 78B-6-802",
    audience: "both",
  },
  {
    id: "eviction-nonpayment-notice",
    topic: "eviction",
    question: "How many days notice does an eviction require in Utah?",
    answer:
      "Nonpayment of rent starts with a 3-day notice to pay or vacate, and a lease violation likewise starts with a 3-day notice to comply or vacate. A tenant at will with no lease gets a 5-day notice to vacate. The notice is only the first step: a landlord cannot remove a tenant without a court order.",
    citation: "Utah Code § 78B-6-802",
    audience: "both",
  },
  {
    id: "abandoned-property",
    topic: "eviction",
    question: "What happens to belongings left behind after a Utah eviction?",
    answer:
      "After an Order of Restitution the tenant has a short window to retrieve belongings, and if property is still unclaimed after 15 days the landlord may dispose of it. Storage costs can be charged in the interim.",
    citation: "Utah Code § 78B-6-812",
    audience: "both",
  },
  {
    id: "fit-premises",
    topic: "habitability",
    question: "What must a Utah landlord repair under the Fit Premises Act?",
    answer:
      "The Utah Fit Premises Act requires a rental to be habitable: working plumbing and electrical, adequate heating, a structurally sound and reasonably safe unit, and freedom from pests the landlord is responsible for. Report problems in writing and keep a copy, because the written notice is what starts the landlord's obligation to act.",
    citation: "Utah Code § 57-22",
    audience: "both",
  },
  {
    id: "required-disclosures",
    topic: "disclosures",
    question: "What must a Utah landlord disclose before a lease starts?",
    answer:
      "Utah landlords must give the landlord's or agent's name and address, provide a move-in condition checklist, and disclose any known methamphetamine contamination history. Federal law separately requires a lead-based paint disclosure for housing built before 1978.",
    citation: "Utah Code §§ 57-22-4, 57-27-201; 42 U.S.C. § 4852d",
    audience: "both",
  },
  {
    id: "early-termination",
    topic: "termination",
    question: "When can a Utah tenant break a lease without penalty?",
    answer:
      "Utah recognizes several protected reasons, including active-duty military orders under the federal Servicemembers Civil Relief Act, a unit the landlord will not make habitable, and documented domestic violence circumstances. Each has its own notice and documentation requirements, so confirm the specific provision before relying on it.",
    citation: "Utah Code §§ 57-22-6, 57-22-5.1; 50 U.S.C. § 3955",
    audience: "both",
  },
]

/**
 * Claims the two sources made that are NOT published as fact.
 *
 * The sources contradict each other on whether Utah has a rent grace period,
 * and the late-fee cap could not be corroborated against the statute. Both are
 * numbers an owner would act on, so they stay here until a Utah attorney or the
 * primary text confirms them.
 */
export const UTAH_RENTAL_LAW_UNVERIFIED: readonly {
  topic: string
  claim: string
  conflict: string
}[] = [
  {
    topic: "Rent grace period",
    claim: "TurboTenant states Utah has no grace period for late rent.",
    conflict: "Avail's summary indicates a grace period does exist. The two sources directly disagree.",
  },
  {
    topic: "Late fee cap",
    claim: "TurboTenant states late fees are capped at the greater of 10% of monthly rent or $75.",
    conflict: "Could not be corroborated against the Utah Code text; no citation was given for the figure.",
  },
]

export function utahRulesForAudience(
  audience: "tenant" | "owner",
): readonly UtahRentalLawRule[] {
  return UTAH_RENTAL_LAW_RULES.filter((r) => r.audience === audience || r.audience === "both")
}

export function utahRulesByTopic(topic: UtahRentalLawTopic): readonly UtahRentalLawRule[] {
  return UTAH_RENTAL_LAW_RULES.filter((r) => r.topic === topic)
}

/** Shape the FAQ pages and FAQPage JSON-LD both consume. */
export function utahRulesAsFaqs(
  audience: "tenant" | "owner",
): { question: string; answer: string }[] {
  return utahRulesForAudience(audience).map((r) => ({
    question: r.question,
    answer: `${r.answer} (${r.citation}.)`,
  }))
}
