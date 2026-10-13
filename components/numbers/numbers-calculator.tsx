"use client"

import { useId, useMemo, useRef, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { NumberField } from "@/components/calculators/number-field"
import {
  EMPTY_CONTACT,
  LeadContactFields,
  LeadFormError,
  LeadSentNotice,
  contactErrors,
  contactPayload,
  focusFirstInvalid,
  leadInputClass,
  useLeadSubmission,
  type ContactValues,
} from "@/components/lead-contact-fields"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { LEAD_MESSAGE_MAX_LENGTH } from "@/lib/leads-api"
import {
  LOAN_TERMS,
  NUMBERS_DEFAULTS,
  NUMBERS_TABS,
  calculateNumbers,
  formatUsd0,
  numbersLeadMessage,
  type NumbersInputs,
  type NumbersResult,
  type NumbersTab,
} from "@/lib/numbers-calculator"
import { withConsentRecord } from "@/lib/text-consent"

function Receipt({ result }: { result: NumbersResult }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 font-mono text-sm md:p-6" aria-live="polite">
      <p className="border-b border-dashed border-border pb-3 text-center text-xs text-muted-foreground">
        Ondo Real Estate
      </p>
      <p className="mt-4 text-base font-bold">{result.headline}</p>
      <dl className="mt-3">
        {result.lines.map((line) => (
          <div key={line.label} className="flex justify-between gap-4 py-1.5">
            <dt className="text-muted-foreground">{line.label}</dt>
            <dd className="font-semibold tabular-nums">{formatUsd0(line.amount)}</dd>
          </div>
        ))}
        <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-dashed border-foreground pt-3 text-base md:text-lg">
          <dt className="font-bold">{result.total.label}</dt>
          <dd className="font-extrabold tabular-nums text-destructive-emphasis">{formatUsd0(result.total.amount)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">{result.note}</p>
    </div>
  )
}

export function NumbersCalculator() {
  const [tab, setTab] = useState<NumbersTab>("rate")
  const [inputs, setInputs] = useState<NumbersInputs>(NUMBERS_DEFAULTS)
  const [contact, setContact] = useState<ContactValues>(EMPTY_CONTACT)
  const [submitted, setSubmitted] = useState(false)
  const { status, error, send } = useLeadSubmission("numbers_calculator")
  const formRef = useRef<HTMLFormElement>(null)
  const idPrefix = useId()
  const fieldId = (key: string) => `${idPrefix}-${tab}-${key}`

  const result = useMemo(() => calculateNumbers(tab, inputs), [tab, inputs])
  const errors = submitted ? contactErrors(contact) : {}

  function set<T extends NumbersTab>(which: T, patch: Partial<NumbersInputs[T]>) {
    setInputs((prev) => ({ ...prev, [which]: { ...prev[which], ...patch } }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(contactErrors(contact)).length > 0) {
      focusFirstInvalid(formRef.current)
      return
    }
    await send({
      ...contactPayload(contact),
      source: "social",
      inquiryType: NUMBERS_TABS.find((t) => t.id === tab)?.inquiryType ?? "other",
      message: withConsentRecord(numbersLeadMessage(tab, inputs), contact).slice(0, LEAD_MESSAGE_MAX_LENGTH),
      attribution: getAttributionPayloadForApi(),
    })
  }

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as NumbersTab)}>
      <TabsList aria-label="Choose a calculator" className="grid h-auto w-full grid-cols-3 sm:inline-grid sm:w-auto">
        {NUMBERS_TABS.map((t) => (
          <TabsTrigger key={t.id} value={t.id} className="whitespace-normal px-3 py-2 text-sm">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-6 grid gap-8 md:grid-cols-[5fr_6fr] md:gap-10">
        <div>
          <TabsContent value="rate" className="mt-0 space-y-4">
            <NumberField id={fieldId("loan")} label="Loan amount" kind="currency" min={0} value={inputs.rate.loan} onChange={(loan) => set("rate", { loan })} />
            <NumberField id={fieldId("low")} label="Lower rate" kind="rate" min={0} max={25} value={inputs.rate.rateLow} onChange={(rateLow) => set("rate", { rateLow })} />
            <NumberField id={fieldId("high")} label="Higher rate" kind="rate" min={0} max={25} value={inputs.rate.rateHigh} onChange={(rateHigh) => set("rate", { rateHigh })} />
            <div>
              <label htmlFor={fieldId("years")} className="text-sm font-medium">
                Loan term
              </label>
              <select
                id={fieldId("years")}
                value={inputs.rate.years}
                onChange={(e) => set("rate", { years: Number(e.target.value) })}
                className={leadInputClass}
              >
                {LOAN_TERMS.map((years) => (
                  <option key={years} value={years}>
                    {years} years
                  </option>
                ))}
              </select>
            </div>
          </TabsContent>

          <TabsContent value="vacancy" className="mt-0 space-y-4">
            <NumberField id={fieldId("rent")} label="Monthly rent" kind="currency" min={0} value={inputs.vacancy.rent} onChange={(rent) => set("vacancy", { rent })} />
            <NumberField id={fieldId("months")} label="Months sitting empty" kind="count" step={1} min={0} max={24} value={inputs.vacancy.months} onChange={(months) => set("vacancy", { months })} />
            <NumberField
              id={fieldId("turnover")}
              label="Turnover costs"
              kind="currency"
              min={0}
              hint="Cleaning, utilities, and marketing while it's empty"
              value={inputs.vacancy.turnover}
              onChange={(turnover) => set("vacancy", { turnover })}
            />
          </TabsContent>

          <TabsContent value="pricing" className="mt-0 space-y-4">
            <NumberField id={fieldId("price")} label="List price" kind="currency" min={0} value={inputs.pricing.price} onChange={(price) => set("pricing", { price })} />
            <NumberField
              id={fieldId("carry")}
              label="Monthly carrying cost"
              kind="currency"
              min={0}
              hint="Mortgage, taxes, insurance, HOA, and utilities"
              value={inputs.pricing.carry}
              onChange={(carry) => set("pricing", { carry })}
            />
            <NumberField id={fieldId("days")} label="Extra days on market" kind="days" min={0} max={365} value={inputs.pricing.days} onChange={(days) => set("pricing", { days })} />
            <NumberField
              id={fieldId("cut")}
              label="Extra discount at the end"
              kind="percent"
              min={0}
              max={30}
              hint="Listings that sit often sell for less than a well-priced launch would"
              value={inputs.pricing.cut}
              onChange={(cut) => set("pricing", { cut })}
            />
          </TabsContent>
        </div>

        <div className="space-y-8">
          <Receipt result={result} />

          {status === "sent" ? (
            <LeadSentNotice>
              Sent. You&apos;ll get a personal review of your numbers at {contact.email.trim()}.
            </LeadSentNotice>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <h2 className="font-outfit text-lg font-semibold">Want someone to look at your real numbers?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send this breakdown and get a personal review. No pressure, no sales pitch.
                </p>
              </div>
              <LeadContactFields value={contact} onChange={setContact} topic="your numbers" errors={errors} />
              <LeadFormError message={error} />
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                Send my numbers
              </button>
            </form>
          )}
        </div>
      </div>
    </Tabs>
  )
}
