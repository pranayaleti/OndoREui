/**
 * Posted ONDO Notary fees. Remote online notarization (RON) is the offered
 * service. Utah Code 46-1-12 caps remote notarial acts at $25.
 *
 * Confirm dollar amounts with the notary before changing this file.
 *
 * Do not add scheduling surcharges (same-day, after-hours, weekend) on top of
 * NOTARY_RON_ACT_USD: Utah Code 46-1-12 allows a travel fee only, and this
 * service is remote only, so no published per-act total may exceed the cap.
 * Scheduling is best-effort and carries no extra charge until the Utah notary
 * office confirms in writing that a surcharge is permitted.
 */

export const NOTARY_RON_ACT_USD = 25
/** Utah statutory maximum for an in-person notarial act (immigration-form cap). */
export const NOTARY_IN_PERSON_ACT_USD = 10
export const NOTARY_WITNESS_USD = 40

export const NOTARY_LOAN_PURCHASE_REFINANCE = "$125–$200"
export const NOTARY_LOAN_SELLER = "$75–$150"
export const NOTARY_LOAN_RANGE = "$75–$200"
export const NOTARY_LOAN_SAME_DAY_USD = 50

export const NOTARY_CANCEL_NOTICE_HOURS = 2
export const NOTARY_LATE_CANCEL_USD = 40
export const NOTARY_NO_SHOW_USD = 50

export const NOTARY_HOURS_LABEL = "Mon–Fri 9 AM – 7 PM MT"
/** Same hours as NOTARY_HOURS_LABEL, for schema.org hoursAvailable. */
export const NOTARY_HOURS_SPEC = {
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "09:00",
  closes: "19:00",
}
export const NOTARY_AFTER_HOURS_START = "7 PM"

export const NOTARY_PRICING_SUMMARY =
  `Remote online notarization is $${NOTARY_RON_ACT_USD} per act (Utah remote maximum; platform included). Loan signing packages typically range from ${NOTARY_LOAN_RANGE}. We do not offer in-office or mobile travel appointments. See the posted schedule on /notary#fees, we quote the total before we book.`

export const NOTARY_EXAMPLE_QUOTES = [
  {
    title: "Remote online: 1 act",
    detail: `RON $${NOTARY_RON_ACT_USD}. Total $${NOTARY_RON_ACT_USD}.`,
  },
  {
    title: "Remote online: 3 acts",
    detail: `3 acts at $${NOTARY_RON_ACT_USD} each. Total $${NOTARY_RON_ACT_USD * 3}.`,
  },
] as const
