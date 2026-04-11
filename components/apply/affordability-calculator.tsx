"use client"

import { useState } from "react"
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
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {t("applyFlow.affordability.title")}
      </h4>
      <p className="text-xs text-slate-500">
        {t("applyFlow.affordability.requirement", {
          ratio: requiredRatio,
          amount: currencyFormatter.format(requiredIncome),
        })}
      </p>
      <div>
        <label className="text-xs text-slate-500 block mb-1">
          {t("applyFlow.affordability.inputLabel")}
        </label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder={t("applyFlow.affordability.placeholder")}
          className="w-full px-3 py-2 border rounded-md text-sm bg-card dark:bg-card dark:border-slate-600"
        />
      </div>
      {income && (
        <div className={`text-sm font-medium rounded-md px-3 py-2 ${
          meets
            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
        }`}>
          {meets
            ? t("applyFlow.affordability.meets", { ratio: ratio.toFixed(1) })
            : t("applyFlow.affordability.below", {
                ratio: ratio.toFixed(1),
                requiredRatio,
              })}
        </div>
      )}
    </div>
  )
}
