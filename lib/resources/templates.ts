import type { ContactInquiryType } from "@/lib/leads-api"
import { watchForBullets, type WatchForTopicId } from "@/lib/resources/compliance-watch-for"

export const TEMPLATE_KINDS = [
  "base_lease",
  "addendum",
  "disclosure",
  "checklist",
  "playbook",
  "other",
] as const

export type TemplateKind = (typeof TEMPLATE_KINDS)[number]

export const ALL_STATES_FILTER = "all"

export const TEMPLATE_DISCLAIMER =
  "Educational sample for reference only — not legal advice, not a binding form, and not an instant download. Requesting a file asks our team to email materials. It must be reviewed through appropriate legal channels (a licensed attorney for the applicable state) before it can be approved or used."

export interface ResourceTemplate {
  id: string
  title: string
  description: string
  state: string
  kind: TemplateKind
  inquiryType: ContactInquiryType
  details: string[]
  appliesWhen: string
  watchFor: string[]
  disclaimer: string
}

function bullets(state: string, topics: readonly WatchForTopicId[]): string[] {
  return watchForBullets(topics, state)
}

export const RESOURCE_TEMPLATES: readonly ResourceTemplate[] = [
  {
    id: "residential-lease",
    title: "Residential Lease Agreement",
    description:
      "A Utah-oriented residential lease covering rent terms, security deposit rules, maintenance responsibilities, entry notice, and renewal conditions. Written to align with topics in Ondo’s Utah landlord-tenant materials (Title 57 / Fit Premises). This is a sample for request, not a fill-and-sign download.",
    state: "UT",
    kind: "base_lease",
    inquiryType: "owner",
    details: [
      "Utah-oriented statutory topics (not a substitute for counsel)",
      "Security deposit and pet deposit provisions",
      "Entry notice and habitability clauses",
      "Late fee and grace period schedules",
    ],
    appliesWhen:
      "You are leasing a Utah residential dwelling and need a starting packet for attorney review — not a one-click binding contract.",
    watchFor: bullets("UT", [
      "owner_agent_identity",
      "deposit_return",
      "entry_notice",
      "lead_paint",
    ]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "move-in-checklist",
    title: "Move-In / Move-Out Checklist",
    description:
      "A room-by-room condition checklist designed to protect both landlords and tenants at turnover. Includes a photo log section and a signature block for mutual agreement at move-in and move-out.",
    state: "UT",
    kind: "checklist",
    inquiryType: "owner",
    details: [
      "Room-by-room condition fields",
      "Photo log documentation section",
      "Countersigned by owner and tenant",
      "Supports security deposit documentation",
    ],
    appliesWhen:
      "At every Utah turnover: complete it at move-in and again at move-out before you itemize a deposit.",
    watchFor: bullets("UT", ["deposit_return"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "maintenance-request",
    title: "Maintenance Request Form",
    description:
      "A tenant-facing form that categorises issues by urgency tier (emergency, urgent, routine) so your maintenance team can triage and schedule appropriately. This form is integrated into the Ondo owner portal workflow.",
    state: "UT",
    kind: "other",
    inquiryType: "owner",
    details: [
      "Three urgency tiers: emergency / urgent / routine",
      "Entry permission checkbox",
      "Photo attachment support",
      "Auto-routes to vendor assignment",
    ],
    appliesWhen:
      "Whenever a Utah resident reports a repair — especially habitability items (heat, water, weatherproofing) that should be timestamped.",
    watchFor: bullets("UT", ["entry_notice"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "landlord-onboarding-playbook",
    title: "Landlord Onboarding Playbook",
    description:
      "A structured 90-day guide for new Utah landlords covering entity setup, insurance review, banking, screening criteria, lease execution, and systems configuration. Includes a checklist of tools and services to put in place before your first tenant moves in.",
    state: "UT",
    kind: "playbook",
    inquiryType: "owner",
    details: [
      "First 90-day milestone calendar",
      "Legal and insurance setup checklist",
      "Screening and lease execution guide",
      "Systems and automation recommendations",
    ],
    appliesWhen:
      "Before you list a Utah rental for the first time, or when you are taking a self-managed property onto Ondo.",
    watchFor: bullets("UT", ["owner_agent_identity", "lead_paint", "deposit_return"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "listing-prep-showing-feedback",
    title: "Listing-Prep & Showing-Feedback Checklist",
    description:
      "A brokerage checklist for sellers getting a home ready to list and collecting showing notes afterward. We email the file after you request it — this is not a QR code, text-for-info shortcode, or YouTube tour product.",
    state: "UT",
    kind: "checklist",
    inquiryType: "seller",
    details: [
      "Prep before photos: declutter, repairs, curb appeal",
      "Showing-day checklist for occupants",
      "How to record showing feedback we send you",
      "Request the file — we email it, not an instant download",
    ],
    appliesWhen:
      "You are preparing a Utah home to list with Ondo brokerage services, or you want a showing-feedback log after tours.",
    watchFor: [
      "This is a prep checklist, not a listing agreement and not a valuation or appraisal.",
      "It is not a QR code, SMS shortcode, or YouTube-tour product.",
      "Describe the property and its condition — never a preferred occupant or protected class.",
    ],
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "pet-addendum",
    title: "Pet Addendum",
    description:
      "A Utah-oriented addendum that separates refundable deposit, pet rent, animal limits, and damage beyond normal wear. Assistance animals are a Fair Housing topic, not a pet-fee shortcut.",
    state: "UT",
    kind: "addendum",
    inquiryType: "owner",
    details: [
      "Deposit versus monthly pet rent, labeled clearly",
      "Animal limits and waste/damage rules",
      "Photo of animals at move-in when applicable",
      "Reminder that assistance animals are not pets",
    ],
    appliesWhen:
      "The household will keep an animal that is not an assistance animal, or you need written pet terms attached to a Utah lease.",
    watchFor: bullets("UT", ["pet_terms", "deposit_return"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "lead-based-paint-disclosure",
    title: "Lead-Based Paint Disclosure",
    description:
      "Federal lead-based paint disclosure materials for housing built before 1978. Ondo’s Utah landlord-tenant guide lists this among required disclosures. We email the packet after you request it.",
    state: "UT",
    kind: "disclosure",
    inquiryType: "owner",
    details: [
      "Federal pre-1978 housing disclosure topic",
      "Known-hazard acknowledgment fields",
      "Keep a copy with the lease packet",
      "Not a paint inspection or clearance report",
    ],
    appliesWhen:
      "The dwelling (or a portion used as housing) was built before 1978, in Utah or any other U.S. state.",
    watchFor: bullets("UT", ["lead_paint"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "mold-disclosure",
    title: "Mold Disclosure",
    description:
      "A Utah-oriented disclosure for known mold conditions, matching the topic listed in Ondo’s Utah landlord-tenant guide. It is not a moisture inspection and does not certify that a unit is mold-free.",
    state: "UT",
    kind: "disclosure",
    inquiryType: "owner",
    details: [
      "Known-condition disclosure fields",
      "Space to attach inspection or repair notes",
      "Pairs with maintenance request records",
      "Does not replace a qualified inspector",
    ],
    appliesWhen:
      "You know of a mold condition, or you want a written “known conditions” page in a Utah lease packet.",
    watchFor: bullets("UT", ["mold"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "methamphetamine-contamination",
    title: "Methamphetamine Contamination History",
    description:
      "A Utah disclosure topic already cited in Ondo’s landlord-tenant guide (Utah Code § 57-27). Request the educational packet — this is not a lab report and not a finding that contamination occurred.",
    state: "UT",
    kind: "disclosure",
    inquiryType: "owner",
    details: [
      "History / known-condition questions",
      "Attach third-party reports when you have them",
      "Keep with the lease packet, not in an “other” pile",
      "Sample language for attorney review",
    ],
    appliesWhen:
      "You are leasing Utah residential property and need the contamination-history disclosure topic in the packet when it applies.",
    watchFor: bullets("UT", ["meth"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "utility-hoa-addendum",
    title: "Utility and HOA Addendum",
    description:
      "A Utah-oriented addendum that lists who pays which utilities and whether HOA rules apply. Ondo’s first-time landlord checklist asks owners to confirm HOA rental rules before listing.",
    state: "UT",
    kind: "addendum",
    inquiryType: "owner",
    details: [
      "Utility responsibility checklist",
      "HOA / association rule acknowledgment",
      "Trash, water, sewer, gas, electric lines",
      "Not a substitute for recorded CC&Rs",
    ],
    appliesWhen:
      "Utilities are split or the Utah property sits in an HOA, condo, or other association with rental rules.",
    watchFor: bullets("UT", ["utility_hoa"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "nv-lead-based-paint-disclosure",
    title: "Lead-Based Paint Disclosure (federal)",
    description:
      "The same federal pre-1978 lead-based paint disclosure topic, listed here for Nevada readers. This is federal law, not a Nevada-specific statute we drafted. We email the educational packet after you request it.",
    state: "NV",
    kind: "disclosure",
    inquiryType: "owner",
    details: [
      "Federal requirement for pre-1978 housing",
      "Applies in Nevada the same way it applies in other states",
      "Not a Nevada-only form and not a paint inspection",
      "Request the file — we email it",
    ],
    appliesWhen:
      "Nevada housing built before 1978 (federal rule). Use this card when you need the lead packet, not a full Nevada lease.",
    watchFor: bullets("NV", ["lead_paint"]),
    disclaimer: TEMPLATE_DISCLAIMER,
  },
  {
    id: "nv-lease-packet-review",
    title: "Nevada Lease Packet (request a review)",
    description:
      "We do not publish a Nevada fill-in lease as a binding form. Request this card and we can email an educational packet and next steps for attorney review. This is not a statute-specific Nevada lease and not for signature as-is.",
    state: "NV",
    kind: "other",
    inquiryType: "owner",
    details: [
      "Educational packet — not a fill-and-sign Nevada lease",
      "We can introduce counsel review; we do not invent Nevada statutes here",
      "Federal lead-paint still applies to pre-1978 housing",
      "Request is not an instant download",
    ],
    appliesWhen:
      "You have a Nevada rental and need Ondo to send a review packet rather than a Utah form used out of state.",
    watchFor: [
      "Do not reuse a Utah lease in Nevada and assume it is valid.",
      "Federal lead-based paint still applies to pre-1978 housing.",
      "This request is a conversation starter for attorney review — not a downloadable Nevada statute form.",
    ],
    disclaimer: TEMPLATE_DISCLAIMER,
  },
]

export const TEMPLATE_KIND_LABELS: Record<TemplateKind, string> = {
  base_lease: "Lease",
  addendum: "Addendum",
  disclosure: "Disclosure",
  checklist: "Checklist",
  playbook: "Playbook",
  other: "Resource",
}

const STATE_NAMES: Record<string, string> = {
  UT: "Utah",
  NV: "Nevada",
}

export function templateStateLabel(state: string): string {
  return STATE_NAMES[state] ?? state
}

/** Utah first, then remaining states A–Z. */
export function uniqueTemplateStates(templates: readonly ResourceTemplate[]): string[] {
  const states = [...new Set(templates.map((t) => t.state))]
  return states.sort((a, b) => {
    if (a === "UT") return -1
    if (b === "UT") return 1
    return a.localeCompare(b)
  })
}

export function filterTemplatesByState(
  templates: readonly ResourceTemplate[],
  state: string,
): ResourceTemplate[] {
  if (state === ALL_STATES_FILTER || state.trim() === "") {
    return [...templates]
  }
  const code = state.trim().toUpperCase()
  return templates.filter((t) => t.state === code)
}
