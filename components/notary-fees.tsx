import Link from "next/link"
import {
  NOTARY_AFTER_HOURS_START,
  NOTARY_AFTER_HOURS_USD,
  NOTARY_CANCEL_NOTICE_HOURS,
  NOTARY_EXAMPLE_QUOTES,
  NOTARY_HOURS_LABEL,
  NOTARY_IN_PERSON_ACT_USD,
  NOTARY_LATE_CANCEL_USD,
  NOTARY_LOAN_PURCHASE_REFINANCE,
  NOTARY_LOAN_SAME_DAY_USD,
  NOTARY_LOAN_SELLER,
  NOTARY_NO_SHOW_USD,
  NOTARY_RON_ACT_USD,
  NOTARY_SAME_DAY_USD,
  NOTARY_WEEKEND_USD,
  NOTARY_WITNESS_USD,
} from "@/lib/notary-fees"

function FeeRow({ label, note, amount }: { label: string; note?: string; amount: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-700 py-3 last:border-b-0">
      <div>
        <p className="text-white font-medium">{label}</p>
        {note ? <p className="text-gray-400 text-sm mt-0.5">{note}</p> : null}
      </div>
      <span className="text-primary font-semibold shrink-0">{amount}</span>
    </div>
  )
}

export function NotaryFees() {
  return (
    <>
      <section id="fees" className="scroll-mt-24 py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            ONDO Notary Fees & Availability
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Utah-compliant remote online notarization, quoted before we book. No in-office visits
            and no published travel schedule, sessions are completed by secure video.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <div>
              <h3 className="text-2xl text-primary font-semibold mb-2">Remote online (RON)</h3>
              <p className="text-gray-400 text-sm mb-4">
                Available nationwide. Confirm the receiving party accepts electronic notarization
                before you book.
              </p>
              <FeeRow
                label="Remote notarial act"
                note="Utah remote maximum. Platform access is included in this fee."
                amount={`$${NOTARY_RON_ACT_USD} per act`}
              />
            </div>

            <div>
              <h3 className="text-2xl text-primary font-semibold mb-2">Hours</h3>
              <p className="text-gray-300 mb-4">
                {NOTARY_HOURS_LABEL}
                <br />
                Weekends by appointment
              </p>
              <p className="text-sm text-gray-400">
                Same-day is best-effort when capacity allows, not a guaranteed SLA.{" "}
                <Link href="/notary/on-demand" className="text-primary underline-offset-4 hover:underline">
                  On-demand details
                </Link>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <div>
              <h3 className="text-2xl text-primary font-semibold mb-2">Convenience add-ons</h3>
              <FeeRow
                label="Same-day / on-demand"
                note="When we can take the request. Not a same-day guarantee."
                amount={`+$${NOTARY_SAME_DAY_USD}`}
              />
              <FeeRow
                label={`After hours (after ${NOTARY_AFTER_HOURS_START})`}
                amount={`+$${NOTARY_AFTER_HOURS_USD}`}
              />
              <FeeRow label="Weekend or holiday" amount={`+$${NOTARY_WEEKEND_USD}`} />
              <FeeRow
                label="Witness coordination"
                note="When we provide a remote witness. They must have valid ID."
                amount={`$${NOTARY_WITNESS_USD} per witness`}
              />
            </div>

            <div>
              <h3 className="text-2xl text-primary font-semibold mb-2">Loan signing</h3>
              <p className="text-gray-400 text-sm mb-4">
                Remote signing-agent sessions for packages your title company or lender accepts by
                RON. Notarial acts inside the package stay at ${NOTARY_RON_ACT_USD} each. Title and
                escrow invoices welcome.
              </p>
              <FeeRow label="Purchase or refinance package" amount={NOTARY_LOAN_PURCHASE_REFINANCE} />
              <FeeRow label="Seller package" amount={NOTARY_LOAN_SELLER} />
              <FeeRow label="HELOC, investor, or reverse mortgage" amount="Quoted by page count" />
              <FeeRow label="Same-day signing" amount={`+$${NOTARY_LOAN_SAME_DAY_USD}`} />
            </div>
          </div>

          <div className="p-6 bg-muted border border-border rounded-lg mb-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">Wills, POA, and estate documents</h3>
            <p className="text-foreground/80 text-sm leading-relaxed">
              We notarize wills, powers of attorney, directives, and trust-related signatures by RON
              at ${NOTARY_RON_ACT_USD} per remote notarial act, plus same-day or after-hours fees when
              they apply. Confirm the receiving party accepts electronic notarization. ONDO Notary
              does not prepare legal documents or provide legal advice. Have documents drafted by an
              attorney before your session.
            </p>
          </div>

          <div className="p-6 bg-background border border-primary rounded-lg">
            <h3 className="text-xl text-primary font-semibold mb-4">Example quotes</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              {NOTARY_EXAMPLE_QUOTES.map((quote) => (
                <li key={quote.title}>
                  <strong className="text-white">{quote.title}.</strong> {quote.detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="policies" className="scroll-mt-24 py-16 md:py-24 bg-card dark:bg-background border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Policies & what to expect
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Posted so there are no surprises at the appointment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-muted border border-border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Cancellation & no-show</h3>
              <ul className="text-sm text-foreground space-y-2">
                <li>• More than {NOTARY_CANCEL_NOTICE_HOURS} hours&apos; notice: no charge</li>
                <li>• Less than {NOTARY_CANCEL_NOTICE_HOURS} hours: ${NOTARY_LATE_CANCEL_USD} cancellation fee</li>
                <li>• Missed session / no-show: ${NOTARY_NO_SHOW_USD}</li>
                <li>• Missed or abandoned RON sessions may be billed as a cancellation</li>
                <li>• One complimentary reschedule may be offered at our discretion</li>
              </ul>
            </div>

            <div className="p-6 bg-muted border border-border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Payment & appointments</h3>
              <ul className="text-sm text-foreground space-y-2">
                <li>• Payment is due at or before the session</li>
                <li>• We confirm accepted methods when you book (card, app pay, or title invoice)</li>
                <li>• Remote online only, no walk-in office and no mobile travel appointments</li>
              </ul>
            </div>

            <div className="p-6 bg-background border border-primary rounded-lg md:col-span-2">
              <h3 className="text-xl text-primary font-semibold mb-4">Limits we follow</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  • ONDO Notary does not prepare legal documents or provide legal, tax, or lending
                  advice.
                </li>
                <li>
                  • We will not notarize documents in which Ondo Real Estate or the notary has a
                  beneficial interest (for example, a listing or a loan we originated).
                </li>
                <li>
                  • We cannot notarize incomplete documents, vital records (birth/death/marriage
                  certificates), or papers with blank spaces meant to be filled in later.
                </li>
                <li>
                  • Immigration-status forms are capped at ${NOTARY_IN_PERSON_ACT_USD} per person under
                  Utah law.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
