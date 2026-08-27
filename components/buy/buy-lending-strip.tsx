"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateMonthlyPI } from "@/lib/mortgage-utils"
import { ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"
import { LICENSING_HREF } from "@/lib/social-proof-stats"

const EXAMPLE_PRINCIPAL = 400000
const EXAMPLE_RATE = 6.5
const EXAMPLE_TERM = 30

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function BuyLendingStrip() {
  const { t } = useTranslation()
  const [principal, setPrincipal] = useState(String(EXAMPLE_PRINCIPAL))
  const [rate, setRate] = useState(String(EXAMPLE_RATE))
  const [term, setTerm] = useState(String(EXAMPLE_TERM))
  const [submitted, setSubmitted] = useState(false)

  const monthly = useMemo(() => {
    const p = Number(principal)
    const r = Number(rate)
    const y = Number(term)
    if (!Number.isFinite(p) || !Number.isFinite(r) || !Number.isFinite(y) || p < 0 || y <= 0) {
      return null
    }
    return Math.round(calculateMonthlyPI(p, r, y))
  }, [principal, rate, term])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      className="border-b border-border bg-muted py-12"
      aria-labelledby="buy-lending-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {t("buyLending.eyebrow")}
            </p>
            <h2 id="buy-lending-heading" className="mb-3 text-3xl font-bold text-foreground">
              {t("buyLending.title")}
            </h2>
            <p className="mb-6 max-w-xl text-foreground/70">{t("buyLending.body")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/loans">{t("buyLending.loansCta")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/calculators/mortgage-payment">{t("buyLending.paymentCta")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/calculators/affordability">{t("buyLending.affordabilityCta")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/calculators/rent-vs-own">{t("buyLending.rentVsOwnCta")}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/calculators">{t("buyLending.calculatorsCta")}</Link>
              </Button>
            </div>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-foreground/60">
              {ARRIVAL_LENDING_DISCLOSURE}{" "}
              <Link
                href={LICENSING_HREF}
                className="font-medium text-primary underline underline-offset-4"
              >
                {t("buyLending.licensing")}
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("buyLending.piTitle")}</CardTitle>
              <CardDescription>{t("buyLending.piNote")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="buy-pi-principal">{t("buyLending.principal")}</Label>
                  <Input
                    id="buy-pi-principal"
                    inputMode="decimal"
                    value={principal}
                    onChange={(event) => {
                      setPrincipal(event.target.value)
                      setSubmitted(false)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buy-pi-rate">{t("buyLending.rate")}</Label>
                  <Input
                    id="buy-pi-rate"
                    inputMode="decimal"
                    value={rate}
                    onChange={(event) => {
                      setRate(event.target.value)
                      setSubmitted(false)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buy-pi-term">{t("buyLending.term")}</Label>
                  <Input
                    id="buy-pi-term"
                    inputMode="numeric"
                    value={term}
                    onChange={(event) => {
                      setTerm(event.target.value)
                      setSubmitted(false)
                    }}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit" className="w-full">
                    {t("buyLending.calculate")}
                  </Button>
                </div>
              </form>
              {submitted && monthly != null ? (
                <p className="mt-4 text-sm font-medium text-foreground" role="status">
                  {t("buyLending.result", { amount: formatUsd(monthly) })}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
