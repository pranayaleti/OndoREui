"use client"

import { useId, useMemo, useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  calculateListingInvestorIllustration,
  LISTING_INVESTOR_LOAN_TERM_YEARS,
} from "@/lib/listing-investor-worksheet"
import { formatMonthlyRent } from "@/lib/listing-presentation"
import { STICKY_HEADER_SCROLL_MARGIN_CLASS } from "@/lib/scroll-margins"
import { ARRIVAL_FAIR_HOUSING, ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"
import { STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS } from "@/components/sticky-mobile-cta-bar"
import { cn } from "@/lib/utils"

type ListingInvestorWorksheetProps = {
  listedMonthlyRent: number
}

type AssumptionFields = {
  purchasePrice: string
  downPaymentPercent: string
  closingCostsPercent: string
  mortgageRatePercent: string
  taxPercent: string
  insurancePercent: string
  hoaPercent: string
  vacancyPercent: string
  managementPercent: string
}

const EMPTY_ASSUMPTIONS: AssumptionFields = {
  purchasePrice: "",
  downPaymentPercent: "",
  closingCostsPercent: "",
  mortgageRatePercent: "",
  taxPercent: "",
  insurancePercent: "",
  hoaPercent: "",
  vacancyPercent: "",
  managementPercent: "",
}

function parseAssumption(raw: string): number {
  const trimmed = raw.trim()
  if (!trimmed) return 0
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : 0
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export function ListingInvestorWorksheet({ listedMonthlyRent }: ListingInvestorWorksheetProps) {
  const instanceId = useId().replace(/:/g, "")
  const [fields, setFields] = useState<AssumptionFields>(EMPTY_ASSUMPTIONS)
  const rateHelpId = `underwrite-rate-help-${instanceId}`
  const rateAprId = `underwrite-rate-apr-${instanceId}`

  const illustration = useMemo(() => {
    if (!fields.purchasePrice.trim()) return null
    return calculateListingInvestorIllustration({
      listedMonthlyRent,
      purchasePrice: parseAssumption(fields.purchasePrice),
      downPaymentPercent: parseAssumption(fields.downPaymentPercent),
      closingCostsPercent: parseAssumption(fields.closingCostsPercent),
      mortgageRatePercent: parseAssumption(fields.mortgageRatePercent),
      taxPercent: parseAssumption(fields.taxPercent),
      insurancePercent: parseAssumption(fields.insurancePercent),
      hoaPercent: parseAssumption(fields.hoaPercent),
      vacancyPercent: parseAssumption(fields.vacancyPercent),
      managementPercent: parseAssumption(fields.managementPercent),
    })
  }, [fields, listedMonthlyRent])

  const setField = (key: keyof AssumptionFields) => (event: ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }))
  }

  return (
    <section
      id="underwrite"
      className={cn(
        "mb-8 scroll-mt-24 rounded-xl border border-border bg-card",
        STICKY_HEADER_SCROLL_MARGIN_CLASS,
        STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS,
      )}
      aria-labelledby="listing-underwrite-heading"
    >
      <div className="h-1 rounded-t-xl bg-gradient-to-r from-orange-500 to-red-800" aria-hidden="true" />
      <div className="px-5 pt-5 pb-24 md:pb-5">
        <h2 id="listing-underwrite-heading" className="text-xl font-semibold">
          Illustrative investor worksheet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This section is an illustration and an estimate using this listing&apos;s monthly rent and
          your assumptions. It is not a guarantee, not a quote, not advice, and not a loan offer.
          You are not required to use Ondo to finance. {ARRIVAL_FAIR_HOUSING}
        </p>

        <p className="mt-4">
          <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Listed rent (this listing)
          </span>
          <span className="text-lg font-semibold">{formatMonthlyRent(listedMonthlyRent)}/mo</span>
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              onClick={() => setFields(EMPTY_ASSUMPTIONS)}
            >
              Reset assumptions
            </Button>
            <a
              href="#listing-inquire"
              className={cn(
                "inline-flex min-h-11 items-center justify-center rounded-md border border-input px-5 font-medium hover:bg-muted",
                STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS,
              )}
            >
              Request information
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`purchase-price-${instanceId}`}>Purchase price (assumption)</Label>
              <Input
                id={`purchase-price-${instanceId}`}
                name="purchasePrice"
                type="number"
                inputMode="decimal"
                min={0}
                step="1000"
                value={fields.purchasePrice}
                onChange={setField("purchasePrice")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`down-payment-${instanceId}`}>Down payment (assumption, %)</Label>
              <Input
                id={`down-payment-${instanceId}`}
                name="downPaymentPercent"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step="0.1"
                value={fields.downPaymentPercent}
                onChange={setField("downPaymentPercent")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`closing-costs-${instanceId}`}>Closing costs (assumption, %)</Label>
              <Input
                id={`closing-costs-${instanceId}`}
                name="closingCostsPercent"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.1"
                value={fields.closingCostsPercent}
                onChange={setField("closingCostsPercent")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`mortgage-rate-${instanceId}`}>Mortgage rate (assumption, %)</Label>
              <Input
                id={`mortgage-rate-${instanceId}`}
                name="mortgageRatePercent"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={fields.mortgageRatePercent}
                onChange={setField("mortgageRatePercent")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
                aria-describedby={`${rateHelpId} ${rateAprId}`}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`tax-${instanceId}`}>Property tax (assumption, annual % of purchase price)</Label>
              <Input
                id={`tax-${instanceId}`}
                name="taxPercent"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={fields.taxPercent}
                onChange={setField("taxPercent")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`insurance-${instanceId}`}>Insurance (assumption, annual % of purchase price)</Label>
              <Input
                id={`insurance-${instanceId}`}
                name="insurancePercent"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={fields.insurancePercent}
                onChange={setField("insurancePercent")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`hoa-${instanceId}`}>HOA (assumption, annual % of purchase price)</Label>
              <Input
                id={`hoa-${instanceId}`}
                name="hoaPercent"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={fields.hoaPercent}
                onChange={setField("hoaPercent")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`vacancy-${instanceId}`}>Vacancy (assumption, % of listed rent)</Label>
              <Input
                id={`vacancy-${instanceId}`}
                name="vacancyPercent"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.1"
                value={fields.vacancyPercent}
                onChange={setField("vacancyPercent")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor={`management-${instanceId}`}>Management (assumption, % of listed rent)</Label>
              <Input
                id={`management-${instanceId}`}
                name="managementPercent"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.1"
                value={fields.managementPercent}
                onChange={setField("managementPercent")}
                className={cn("min-h-11", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
              />
            </div>
          </div>

          <p id={rateAprId} className="text-xs text-muted-foreground">
            The typed rate is not a quote or APR. Estimated principal and interest uses a{" "}
            {LISTING_INVESTOR_LOAN_TERM_YEARS}-year fixed term assumption. Empty expense fields are
            treated as 0% — we do not fill market defaults.
          </p>
          <p id={rateHelpId} className="text-xs leading-relaxed text-muted-foreground">
            {ARRIVAL_LENDING_DISCLOSURE}
          </p>
        </form>

        {illustration ? (
          <div
            className="mt-5 rounded-lg border border-border bg-muted/40 p-4"
            role="region"
            aria-label="Illustration results"
          >
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Est. P&amp;I (monthly)
                </dt>
                <dd className="text-lg font-semibold">{formatUsd(illustration.monthlyPI)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Est. NOI (annual)
                </dt>
                <dd className="text-lg font-semibold">{formatUsd(illustration.noi)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Est. cap rate
                </dt>
                <dd className="text-lg font-semibold">{formatPercent(illustration.capRatePercent)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Est. cash-on-cash
                </dt>
                <dd className="text-lg font-semibold">
                  {illustration.cashOnCashPercent == null
                    ? "n/a"
                    : formatPercent(illustration.cashOnCashPercent)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Yields are illustrative only and change with your assumptions. They are not a quote
              from Ondo and not a projection of actual performance.
            </p>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Enter a purchase price assumption to see an illustration.
          </p>
        )}
      </div>
    </section>
  )
}
