import { SITE_NAME } from "@/lib/site"

/**
 * One wording for every form that asks to text or call a phone number. Counsel reviews this
 * text before deploy (47 CFR 64.1200 consent: seller named, topic, automated technology, not
 * a condition of purchase, frequency, rates, STOP and HELP).
 */
export function textConsentText(topic: string): string {
  return (
    `By checking this box, you agree ${SITE_NAME} may text and call you at this number about ${topic} ` +
    `using automated technology. Consent is not a condition of any purchase or service. ` +
    `Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for help.`
  )
}

/** One-line notice for forms that collect a phone number without a texting checkbox. */
export const CONTACT_NOTICE_TEXT = `${SITE_NAME} will use your details to answer this request, by email or phone.`

export type ConsentRecordFields = {
  phone: string
  textConsent: boolean
  consentText?: string
  consentAt?: string
}

/**
 * Lines that store what the person agreed to and when, for the lead message. Empty unless the
 * box is checked and there is a number to text, so a stray tick never records consent.
 */
export function consentRecordLines(contact: ConsentRecordFields): string[] {
  if (!contact.textConsent || contact.phone.trim().length === 0) return []
  return [
    `Text consent given: ${contact.consentAt ?? "time not recorded"}`,
    `Consent text shown: ${contact.consentText ?? "not recorded"}`,
  ]
}

/** Appends the consent record to a lead message, when there is one. */
export function withConsentRecord(message: string, contact: ConsentRecordFields): string {
  const lines = consentRecordLines(contact)
  return lines.length > 0 ? `${message}\n${lines.join("\n")}` : message
}
