import Link from "next/link"
import {
  NOTARY_CANCEL_NOTICE_HOURS,
  NOTARY_HOURS_LABEL,
  NOTARY_IN_PERSON_ACT_USD,
  NOTARY_LATE_CANCEL_USD,
  NOTARY_LOAN_PURCHASE_REFINANCE,
  NOTARY_LOAN_SAME_DAY_USD,
  NOTARY_LOAN_SELLER,
  NOTARY_NO_SHOW_USD,
  NOTARY_RON_ACT_USD,
  NOTARY_WITNESS_USD,
} from "@/lib/notary-fees"

function FeeRow({ label, note, amount }: { label: string; note?: string; amount: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <div>
        <p className="text-foreground font-medium">{label}</p>
        {note ? <p className="text-muted-foreground text-sm mt-0.5">{note}</p> : null}
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            ONDO Notary Fees & Availability
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Quoted before we book. Every session is by secure video.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <div>
              <h3 className="text-2xl text-primary font-semibold mb-2">Remote online (RON)</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Confirm the receiving party accepts electronic notarization before you book.
              </p>
              <FeeRow
                label="Remote notarial act"
                note="Utah remote maximum. Platform access is included in this fee."
                amount={`$${NOTARY_RON_ACT_USD} per act`}
              />
            </div>

            <div>
              <h3 className="text-2xl text-primary font-semibold mb-2">Hours</h3>
              <p className="text-foreground/80 mb-4">
                {NOTARY_HOURS_LABEL}
                <br />
                Weekends by appointment
              </p>
              <p className="text-sm text-muted-foreground">
                <Link href="/notary/on-demand" className="text-primary underline underline-offset-4 hover:no-underline">
                  Same-day sessions
                </Link>{" "}
                when there is room.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <div>
              <h3 className="text-2xl text-primary font-semibold mb-2">Scheduling and witnesses</h3>
              <p className="text-muted-foreground text-sm mb-4">
                No scheduling surcharge on a remote notarial act, including same-day.
              </p>
              <FeeRow
                label="Witness coordination"
                note="When we provide a remote witness. They must have valid ID."
                amount={`$${NOTARY_WITNESS_USD} per witness`}
              />
            </div>

            <div>
              <h3 className="text-2xl text-primary font-semibold mb-2">Loan signing</h3>
              <p className="text-muted-foreground text-sm mb-4">
                For packages your title company or lender accepts by RON. Title and escrow invoices welcome.
              </p>
              <FeeRow label="Purchase or refinance package" amount={NOTARY_LOAN_PURCHASE_REFINANCE} />
              <FeeRow label="Seller package" amount={NOTARY_LOAN_SELLER} />
              <FeeRow label="HELOC, investor, or reverse mortgage" amount="Quoted by page count" />
              <FeeRow label="Same-day signing" amount={`+$${NOTARY_LOAN_SAME_DAY_USD}`} />
            </div>
          </div>

          <p className="text-sm text-foreground/70">
            Wills, powers of attorney and trust signatures are ${NOTARY_RON_ACT_USD} per act. Have them drafted by an attorney first.
          </p>
        </div>
      </section>

      <section id="policies" className="scroll-mt-24 border-y border-border bg-card py-12 dark:bg-background">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Policies</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            Cancel more than {NOTARY_CANCEL_NOTICE_HOURS} hours ahead at no charge; later it is ${NOTARY_LATE_CANCEL_USD}, and a
            no-show is ${NOTARY_NO_SHOW_USD}. Payment is due by the session. We do not notarize documents we have an
            interest in, incomplete documents or vital records, and we do not give legal advice. Immigration forms are
            capped at ${NOTARY_IN_PERSON_ACT_USD} per person under Utah law.
          </p>
        </div>
      </section>
    </>
  )
}
