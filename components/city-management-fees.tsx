import { DollarSign, CheckCircle2 } from "lucide-react"
import {
  DEFAULT_EXAMPLE_MONTHLY_RENT,
  GROWTH_MGMT_RATE,
  GROWTH_MIN_UNITS,
  LEASING_FEE_RATE,
  PORTFOLIO_MIN_UNITS,
  STARTER_MAX_UNITS,
  STARTER_MGMT_RATE,
} from "@/lib/fee-comparison"
import { VENDOR_INVOICE_POLICY } from "@/lib/pricing-included"
import { cityMarketData } from "@/lib/city-market-data"

function fmtUsd(n: number): string {
  return "$" + n.toLocaleString("en-US")
}

/**
 * Ondo's published fee schedule, shown on /property-management/<city>/ (anchor #fees).
 * It used to live on /pricing/<city>/, which split "<city> property management fees"
 * across two URLs; that route now redirects here.
 */
export function CityManagementFees({ cityName }: { cityName: string }) {
  const market = cityMarketData[cityName]

  // Same constants /pricing/ uses. The example is the Starter rate on this city's
  // median rent (1 unit), not a quote.
  const pct = (rate: number) => `${Math.round(rate * 100)}%`
  const exampleRent = market ? market.medianRent : DEFAULT_EXAMPLE_MONTHLY_RENT
  const pmFees = {
    monthlyMgmt: {
      pct: `${pct(STARTER_MGMT_RATE)} (1–${STARTER_MAX_UNITS} units), ${pct(GROWTH_MGMT_RATE)} (${GROWTH_MIN_UNITS}–${PORTFOLIO_MIN_UNITS - 1} units)`,
      example: Math.round(exampleRent * STARTER_MGMT_RATE),
    },
    leasing: `${pct(LEASING_FEE_RATE)} of first month's rent, one-time`,
    vacancy: "No separate vacancy fee. Management is a percentage of collected rent.",
    maintenance: `${VENDOR_INVOICE_POLICY} on vendor invoices`,
    eviction: "Not part of the published fee schedule. Ask us.",
  }

  return (
    <section id="fees" className="scroll-mt-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-primary" />
        Property Management Fees in {cityName}
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center rounded-lg border p-4">
          <div>
            <p className="font-medium">Monthly Management Fee</p>
            <p className="text-sm text-foreground/60">Rent collection, tenant communication, reporting</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{pmFees.monthlyMgmt.pct}</p>
            <p className="text-sm text-foreground/60">≈ {fmtUsd(pmFees.monthlyMgmt.example)}/mo at {pct(STARTER_MGMT_RATE)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center rounded-lg border p-4">
          <div>
            <p className="font-medium">Tenant Placement / Leasing Fee</p>
            <p className="text-sm text-foreground/60">Marketing, screening, lease execution</p>
          </div>
          <p className="font-bold text-right">{pmFees.leasing}</p>
        </div>
        <div className="flex justify-between items-center rounded-lg border p-4">
          <div>
            <p className="font-medium">Vacancy Fee</p>
            <p className="text-sm text-foreground/60">Cost during vacant periods</p>
          </div>
          <p className="font-bold text-right">{pmFees.vacancy}</p>
        </div>
        <div className="flex justify-between items-center rounded-lg border p-4">
          <div>
            <p className="font-medium">Maintenance Coordination</p>
            <p className="text-sm text-foreground/60">Vendor dispatch, quality check, invoicing</p>
          </div>
          <p className="font-bold text-right">{pmFees.maintenance}</p>
        </div>
        <div className="flex justify-between items-center rounded-lg border p-4">
          <div>
            <p className="font-medium">Eviction Management</p>
            <p className="text-sm text-foreground/60">Legal coordination, filing, court appearance</p>
          </div>
          <p className="font-bold text-right">{pmFees.eviction}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-primary/5 p-6">
        <h3 className="font-semibold mb-2">What&apos;s included with Ondo RE</h3>
        <ul className="space-y-2">
          {[
            "Online rent collection with direct deposit",
            "24/7 emergency maintenance line",
            "Monthly financial statements and tax-ready reports",
            "Tenant screening (credit, criminal, eviction, income)",
            "Real-time owner dashboard with AI insights",
            "Annual property inspections",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
