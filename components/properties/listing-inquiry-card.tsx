import Link from "next/link"
import type { CostRow } from "@/lib/listing-presentation"
import { GetScreenedCta } from "@/components/properties/get-screened-cta"

type ListingInquiryCardProps = {
  costRows: CostRow[]
  propertyId?: string
}

export function ListingInquiryCard({ costRows, propertyId }: ListingInquiryCardProps) {
  return (
    <aside className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Listed costs</h2>
      <ul className="mt-4 space-y-3">
        {costRows.map((row) => (
          <li key={row.id} className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {row.label}
            </span>
            <span className="text-lg font-semibold text-foreground">{row.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        These figures come from the listing. Other move-in costs are confirmed with leasing
        before you apply — we do not estimate them here.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <a
          href="#ask-leasing"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground hover:opacity-90"
        >
          Request a showing
        </a>
        {propertyId ? <GetScreenedCta propertyId={propertyId} /> : null}
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-input px-5 font-medium hover:bg-muted"
        >
          Contact
        </Link>
      </div>
    </aside>
  )
}
