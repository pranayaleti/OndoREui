import type { PublicContactInquiryType } from "@/lib/leads-api"

export type ContactAudienceOption = {
  value: PublicContactInquiryType
  before: string
  emphasis: string
  after: string
}

/**
 * Public "How can we help you?" radios. Copy matches the marketing selector;
 * `emphasis` is the role/key term bolded when the row is unselected.
 */
export const CONTACT_AUDIENCE_OPTIONS: readonly ContactAudienceOption[] = [
  {
    value: "tenant_looking_to_rent",
    before: "I am a ",
    emphasis: "tenant",
    after: " looking for a home to rent.",
  },
  {
    value: "agent_referrals",
    before: "I am a ",
    emphasis: "real estate agent",
    after: ", interested in referrals.",
  },
  {
    value: "owner_rental_services",
    before: "I own a ",
    emphasis: "rental property",
    after: ", interested in services.",
  },
  {
    value: "vendor_maintenance",
    before: "I am a ",
    emphasis: "vendor",
    after: ", offering maintenance services.",
  },
  {
    value: "current_resident",
    before: "I am a ",
    emphasis: "current resident",
    after: ".",
  },
]

export function contactAudienceLabel(option: ContactAudienceOption): string {
  return `${option.before}${option.emphasis}${option.after}`
}
