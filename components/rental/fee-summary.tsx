import { formatCents } from "@/lib/rental-application"
import type { PublicRentalRequirements } from "@/lib/api/rental"

export function FeeSummary({ requirements }: { requirements: PublicRentalRequirements }) {
  const fees = [
    { label: "Application fee", amount: requirements.applicationFees.applicationFeeCents },
    { label: "Screening fee", amount: requirements.applicationFees.screeningFeeCents },
    ...requirements.applicationFees.otherFees.map((fee) => ({ label: fee.label, amount: fee.amountCents })),
  ].filter((row) => row.amount > 0)
  const total = fees.reduce((sum, row) => sum + row.amount, 0)
  if (fees.length === 0) {
    return <p className="text-sm text-muted-foreground">No application fees are listed for this home.</p>
  }
  return (
    <div className="rounded-xl border border-border p-4">
      <h3 className="font-semibold">Fees before you pay</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {fees.map((row) => (
          <li key={row.label} className="flex justify-between">
            <span>{row.label}</span>
            <span className="font-medium">{formatCents(row.amount)}</span>
          </li>
        ))}
        <li className="flex justify-between border-t border-border pt-2 font-semibold">
          <span>Total</span>
          <span>{formatCents(total)}</span>
        </li>
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Card numbers are processed by our payment provider. Ondo does not store raw card data.
      </p>
    </div>
  )
}
