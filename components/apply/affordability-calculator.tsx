"use client"

import { useId, useState } from "react"
import { useTranslation } from "react-i18next"

interface AffordabilityCalculatorProps {
  monthlyRent: number
  requiredRatio?: number
}

export function AffordabilityCalculator({
  monthlyRent,
  requiredRatio = 3.0,
}: AffordabilityCalculatorProps) {
  const { t, i18n } = useTranslation()
  const [income, setIncome] = useState("")
  const incomeId = useId()

  const annualIncome = Number(income) || 0
  const monthlyIncome = annualIncome / 12
  const ratio = monthlyRent > 0 ? monthlyIncome / monthlyRent : 0
  const meets = ratio >= requiredRatio
  const requiredIncome = monthlyRent * requiredRatio * 12
  const locale = i18n.resolvedLanguage || i18n.language || "en"
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

  return (
    <div className="bg-muted dark:bg-card rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-semibold text-foreground">
        {t("applyFlow.affordability.title")}
      </h4>
      <p className="text-xs text-muted-foreground">
        {t("applyFlow.affordability.requirement", {
          ratio: requiredRatio,
          amount: currencyFormatter.format(requiredIncome),
        })}
      </p>
      <div>
        <label htmlFor={incomeId} className="text-xs text-muted-foreground block mb-1">
          {t("applyFlow.affordability.inputLabel")}
        </label>
        <input
          id={incomeId}
          type="number"
          inputMode="numeric"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder={t("applyFlow.affordability.placeholder")}
          className="w-full px-3 py-2 border border-input rounded-md text-base md:text-sm bg-card text-foreground"
        />
      </div>
      {/* Always rendered so the live region exists before its text changes. */}
      <div role="status">
        {income && (
          <p
            className={`text-sm font-medium rounded-md px-3 py-2 ${
              meets
                ? "bg-success-emphasis/10 text-success-emphasis"
                : "bg-destructive/10 text-destructive-emphasis"
            }`}
          >
            {meets
              ? t("applyFlow.affordability.meets", { ratio: ratio.toFixed(1) })
              : t("applyFlow.affordability.below", {
                  ratio: ratio.toFixed(1),
                  requiredRatio,
                })}
          </p>
        )}
      </div>
    </div>
  )
}
