"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoanProgram, calculateMonthlyPI, clampCreditScore, getProgramMI, DEFAULT_MORTGAGE_RATE } from '@/lib/mortgage-utils';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field"
import { ARM_CAPS, DTI_HOA } from "@/lib/content/lending-facts"

/** 7/6 = seven years fixed, then the rate may adjust every six months. */
type RateStructure = 'fixed' | 'arm-7-6'

/** Field defaults, kept in one place so each input can show "Est." and offer a revert. */
const DEFAULTS = {
  homePrice: 300000,
  downPayment: 60000,
  loanAmount: 240000,
  interestRate: DEFAULT_MORTGAGE_RATE,
  loanTerm: 30,
  propertyTax: 3000,
  insurance: 1200,
  hoaMonthly: 0,
  creditScore: 740,
  armInitialCap: 2,
  armPeriodicCap: 1,
  armLifetimeCap: 5,
} as const

interface MortgageData {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  insurance: number;
  /** Monthly association dues. Housing expense for DTI, not an "other debt". */
  hoaMonthly: number;
  pmi: number;
  program: LoanProgram;
  creditScore: number;
  financeUpfront: boolean;
  rateStructure: RateStructure;
  /** Percentage-point caps from the note. Only meaningful when rateStructure is an ARM. */
  armInitialCap: number;
  armPeriodicCap: number;
  armLifetimeCap: number;
}

interface PaymentBreakdown {
  principal: number;
  interest: number;
  tax: number;
  insurance: number;
  pmi: number;
  hoa: number;
  monthlyPI: number;
  totalMonthly: number;
  /** Worst-case P&I once an ARM may adjust, at the note's caps. Null for fixed. */
  armFirstAdjustmentPI: number | null;
  armLifetimeMaxPI: number | null;
  totalYearly: number;
  totalCost: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

const MortgagePaymentCalculator: React.FC = () => {
  const [formData, setFormData] = useState<MortgageData>({
    homePrice: 300000,
    downPayment: 60000,
    loanAmount: 240000,
    interestRate: DEFAULT_MORTGAGE_RATE,
    loanTerm: 30,
    propertyTax: 3000,
    insurance: 1200,
    hoaMonthly: DEFAULTS.hoaMonthly,
    pmi: 0,
    program: 'conventional',
    creditScore: 740,
    financeUpfront: true,
    rateStructure: 'fixed',
    armInitialCap: DEFAULTS.armInitialCap,
    armPeriodicCap: DEFAULTS.armPeriodicCap,
    armLifetimeCap: DEFAULTS.armLifetimeCap,
  });

  const [results, setResults] = useState<PaymentBreakdown | null>(null);
  const [showAmortization, setShowAmortization] = useState(true);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch: only run calculations after mount
  useEffect(() => { setIsMounted(true) }, []);

  const calculateMortgage = useCallback(() => {
    const { homePrice, downPayment, loanAmount, interestRate, loanTerm, propertyTax, insurance, hoaMonthly, program } = formData;

    // Calculate monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    // Program MI and upfront fees
    const credit = clampCreditScore(formData.creditScore);
    const { monthlyMI, upfrontFee, description: _miDesc } = getProgramMI(program, loanAmount, homePrice, credit, loanTerm, downPayment);
    const financedLoanAmount = formData.financeUpfront ? loanAmount + upfrontFee : loanAmount;

    // P&I computed on the actual financed amount (includes rolled-in upfront fee)
    const monthlyPayment = calculateMonthlyPI(financedLoanAmount, formData.interestRate, formData.loanTerm);

    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const monthlyPmi = monthlyMI;
    const monthlyHoa = Math.max(0, hoaMonthly);

    const totalMonthly = monthlyPayment + monthlyTax + monthlyInsurance + monthlyPmi + monthlyHoa;
    const totalYearly = totalMonthly * 12;
    const totalCost = totalYearly * loanTerm;
    const totalInterest = (monthlyPayment * totalPayments) - financedLoanAmount;

    const amortizationSchedule = [];
    let remainingBalance = financedLoanAmount;

    // Was Math.min(360, ...), which silently truncated any term beyond 30 years —
    // a 50-year schedule stopped at year 30 and never reached a zero balance.
    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      if (remainingBalance < 0) remainingBalance = 0;

      amortizationSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }

    const firstMonthInterest = financedLoanAmount * monthlyRate;

    // ARM worst case. These are NOT forecasts: they are arithmetic on the caps the
    // borrower's own note carries. After the fixed period the rate is index plus
    // margin, limited by those caps — the index is unknowable, the ceiling is not.
    // Payments are re-amortized over the balance remaining when the fixed period ends.
    let armFirstAdjustmentPI: number | null = null;
    let armLifetimeMaxPI: number | null = null;
    if (formData.rateStructure === 'arm-7-6') {
      const fixedYears = 7;
      const monthsFixed = Math.min(fixedYears * 12, totalPayments);
      const balanceAtReset =
        amortizationSchedule[monthsFixed - 1]?.remainingBalance ?? financedLoanAmount;
      const yearsRemaining = (totalPayments - monthsFixed) / 12;
      if (balanceAtReset > 0 && yearsRemaining > 0) {
        const firstAdjustRate = interestRate + Math.max(0, formData.armInitialCap);
        const lifetimeMaxRate = interestRate + Math.max(0, formData.armLifetimeCap);
        armFirstAdjustmentPI = calculateMonthlyPI(balanceAtReset, firstAdjustRate, yearsRemaining);
        armLifetimeMaxPI = calculateMonthlyPI(balanceAtReset, lifetimeMaxRate, yearsRemaining);
      }
    }

    setResults({
      principal: monthlyPayment - firstMonthInterest,
      interest: firstMonthInterest,
      tax: monthlyTax,
      insurance: monthlyInsurance,
      pmi: monthlyPmi,
      hoa: monthlyHoa,
      monthlyPI: monthlyPayment,
      totalMonthly,
      armFirstAdjustmentPI,
      armLifetimeMaxPI,
      totalYearly,
      totalCost,
      totalInterest,
      amortizationSchedule
    });
    setHasCalculated(true);
  }, [formData]);

  useEffect(() => {
    if (isMounted) calculateMortgage();
  }, [isMounted, calculateMortgage]);

  const handleInputChange = (field: keyof MortgageData, value: number | string) => {
    const newData = { ...formData, [field]: value };

    // Auto-calculate loan amount if home price or down payment changes
    if (field === 'homePrice' || field === 'downPayment') {
      newData.loanAmount = Math.max(0, newData.homePrice - newData.downPayment);
    }

    setFormData(newData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/calculators" className="text-primary hover:text-primary">
                <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to all calculators</span>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Utah Mortgage Payment Calculator</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Information</h2>

            <div className="space-y-6">
              <NumberField
                id="homePrice"
                label="Home Price"
                kind="currency"
                min={0}
                step={5000}
                value={formData.homePrice}
                defaultValue={DEFAULTS.homePrice}
                onChange={(next) => handleInputChange('homePrice', next)}
              />

              {/* Down payment: amount and percent are two views of one number, so
                  each is edited independently and written back through the other. */}
              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberField
                    id="downPaymentAmount"
                    label="Down Payment"
                    kind="currency"
                    min={0}
                    max={formData.homePrice}
                    step={1000}
                    value={formData.downPayment}
                    defaultValue={DEFAULTS.downPayment}
                    onChange={(next) => handleInputChange('downPayment', next)}
                  />
                  <NumberField
                    id="downPaymentPercent"
                    label="Down Payment %"
                    kind="percent"
                    min={0}
                    max={100}
                    value={
                      formData.homePrice > 0
                        ? Math.round((formData.downPayment / formData.homePrice) * 1000) / 10
                        : 0
                    }
                    onChange={(percent) =>
                      handleInputChange(
                        'downPayment',
                        Math.round((percent / 100) * formData.homePrice),
                      )
                    }
                    hint="Linked to the amount"
                  />
                </div>
                {formData.downPayment < formData.homePrice * 0.2 ? (
                  <p className="mt-2 text-sm text-foreground/70">
                    Under 20% down, a conventional loan generally carries PMI.
                  </p>
                ) : null}
              </div>

              <NumberField
                id="loanAmount"
                label="Loan Amount"
                kind="currency"
                min={0}
                step={1000}
                value={formData.loanAmount}
                defaultValue={DEFAULTS.loanAmount}
                onChange={(next) => handleInputChange('loanAmount', next)}
              />

              <NumberField
                id="interestRate"
                label="Interest Rate"
                kind="rate"
                min={0}
                max={25}
                value={formData.interestRate}
                defaultValue={DEFAULTS.interestRate}
                onChange={(next) => handleInputChange('interestRate', next)}
                hint="Arrow keys move in eighths, the way rate sheets are priced."
              />

              {/* Loan Term */}
              <div>
                <label htmlFor="loanTerm" className="block text-sm font-medium text-foreground mb-2">
                  Loan Term
                </label>
                <div className="flex flex-wrap gap-2">
                  {[15, 20, 30, 50].map((years) => (
                    <button
                      key={years}
                      type="button"
                      aria-pressed={formData.loanTerm === years}
                      onClick={() => handleInputChange('loanTerm', years)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
                        formData.loanTerm === years
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card/60 text-foreground/80 hover:border-primary/50'
                      }`}
                    >
                      {years} years
                    </button>
                  ))}
                </div>
                {formData.loanTerm === 50 ? (
                  <p className="mt-2 text-sm text-foreground/70">
                    A 50-year term is a portfolio / non-agency product — it is not offered on FHA, VA,
                    or USDA loans, and the lower payment is bought with substantially more total
                    interest. Compare the totals below against 30 years before assuming it is cheaper.
                  </p>
                ) : null}
              </div>

              {/* Rate structure */}
              <div>
                <label htmlFor="rateStructure" className="block text-sm font-medium text-foreground mb-2">
                  Rate Structure
                </label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { id: 'fixed', label: 'Fixed rate' },
                    { id: 'arm-7-6', label: '7/6 ARM' },
                  ] as const).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={formData.rateStructure === option.id}
                      onClick={() => handleInputChange('rateStructure', option.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
                        formData.rateStructure === option.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card/60 text-foreground/80 hover:border-primary/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {formData.rateStructure === 'arm-7-6' ? (
                  <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-sm text-foreground/80">
                      7/6 means the rate is fixed for seven years, then may adjust every six months.
                      {' '}{ARM_CAPS.fullyIndexed}
                    </p>
                    <p className="mt-2 text-sm text-foreground/70">{ARM_CAPS.notation}</p>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <NumberField
                        id="armInitialCap"
                        label="Initial cap"
                        kind="percent"
                        min={0}
                        max={10}
                        step={0.5}
                        value={formData.armInitialCap}
                        defaultValue={DEFAULTS.armInitialCap}
                        onChange={(next) => handleInputChange('armInitialCap', next)}
                      />
                      <NumberField
                        id="armPeriodicCap"
                        label="Periodic cap"
                        kind="percent"
                        min={0}
                        max={10}
                        step={0.5}
                        value={formData.armPeriodicCap}
                        defaultValue={DEFAULTS.armPeriodicCap}
                        onChange={(next) => handleInputChange('armPeriodicCap', next)}
                      />
                      <NumberField
                        id="armLifetimeCap"
                        label="Lifetime cap"
                        kind="percent"
                        min={0}
                        max={15}
                        step={0.5}
                        value={formData.armLifetimeCap}
                        defaultValue={DEFAULTS.armLifetimeCap}
                        onChange={(next) => handleInputChange('armLifetimeCap', next)}
                      />
                    </div>
                    <p className="mt-3 text-xs text-foreground/60">
                      Enter the caps from your own Loan Estimate — the values above are placeholders,
                      not a quote. {ARM_CAPS.paymentNote}
                    </p>
                  </div>
                ) : null}
              </div>

              <NumberField
                id="propertyTax"
                label="Annual Property Tax"
                kind="currency"
                min={0}
                step={100}
                value={formData.propertyTax}
                defaultValue={DEFAULTS.propertyTax}
                onChange={(next) => handleInputChange('propertyTax', next)}
              />

              <NumberField
                id="insurance"
                label="Annual Homeowners Insurance"
                kind="currency"
                min={0}
                step={100}
                value={formData.insurance}
                defaultValue={DEFAULTS.insurance}
                onChange={(next) => handleInputChange('insurance', next)}
              />

              <div>
                <NumberField
                  id="hoaMonthly"
                  label="Monthly HOA Dues"
                  kind="currency"
                  min={0}
                  step={25}
                  value={formData.hoaMonthly}
                  defaultValue={DEFAULTS.hoaMonthly}
                  defaultBadge="None"
                  onChange={(next) => handleInputChange('hoaMonthly', next)}
                  hint="Leave at 0 if the property has no association."
                />
                {formData.hoaMonthly > 0 ? (
                  <p className="mt-2 text-sm text-foreground/70">{DTI_HOA.frontEnd}</p>
                ) : null}
              </div>

              {/* Loan Program */}
              <div>
                <label htmlFor="loanProgram" className="block text-sm font-medium text-foreground mb-2">
                  Loan Program
                </label>
                <select
                  id="loanProgram"
                  value={formData.program}
                  onChange={(e) => handleInputChange('program', e.target.value as LoanProgram)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                >
                  <option value="conventional">Conventional</option>
                  <option value="fha">FHA</option>
                  <option value="va">VA</option>
                  <option value="usda">USDA</option>
                </select>
              </div>

              <NumberField
                id="creditScore"
                label="Credit Score"
                kind="count"
                min={300}
                max={850}
                step={10}
                value={formData.creditScore}
                defaultValue={DEFAULTS.creditScore}
                onChange={(next) => handleInputChange('creditScore', next)}
              />

              {/* Finance Upfront Fee */}
              <div className="flex items-center space-x-2">
                <input
                  id="financeUpfront"
                  type="checkbox"
                  checked={formData.financeUpfront}
                  onChange={(e) => handleInputChange('financeUpfront', e.target.checked as unknown as number)}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label htmlFor="financeUpfront" className="text-sm text-foreground">Finance upfront fee into loan (FHA/VA/USDA)</label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Monthly Payment Summary */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Monthly Payment Breakdown</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Principal & Interest:</span>
                      <span className="font-semibold">{formatCurrency(results.monthlyPI)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">• Principal (first month):</span>
                      <span className="text-primary">{formatCurrency(results.principal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">• Interest (first month):</span>
                      <span className="text-destructive-emphasis">{formatCurrency(results.interest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Property Tax:</span>
                      <span className="font-semibold">{formatCurrency(results.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Insurance:</span>
                      <span className="font-semibold">{formatCurrency(results.insurance)}</span>
                    </div>
                    {results.pmi > 0 && (
                      <div className="flex justify-between">
                        <span className="text-foreground/70">PMI:</span>
                        <span className="font-semibold">{formatCurrency(results.pmi)}</span>
                      </div>
                    )}
                    {results.hoa > 0 && (
                      <div className="flex justify-between">
                        <span className="text-foreground/70">HOA dues:</span>
                        <span className="font-semibold">{formatCurrency(results.hoa)}</span>
                      </div>
                    )}
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Monthly Payment:</span>
                      <span className="text-primary">{formatCurrency(results.totalMonthly)}</span>
                    </div>

                    {formData.rateStructure === 'arm-7-6' && results.armLifetimeMaxPI !== null ? (
                      <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                        <h3 className="text-sm font-semibold text-foreground">
                          After the 7-year fixed period — worst case
                        </h3>
                        <p className="mt-1 text-xs text-foreground/70">
                          The rate after year 7 is the index plus your margin, which nobody can
                          quote today. What the note does fix is the ceiling. These are principal
                          and interest at your caps, re-amortized over the balance left at reset —
                          a maximum, not a prediction.
                        </p>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-foreground/70">
                              Now (fixed, years 1–7):
                            </span>
                            <span className="font-semibold">{formatCurrency(results.monthlyPI)}</span>
                          </div>
                          {results.armFirstAdjustmentPI !== null ? (
                            <div className="flex justify-between">
                              <span className="text-foreground/70">
                                Max at first adjustment (+{formData.armInitialCap}%):
                              </span>
                              <span className="font-semibold">
                                {formatCurrency(results.armFirstAdjustmentPI)}
                              </span>
                            </div>
                          ) : null}
                          <div className="flex justify-between">
                            <span className="text-foreground/70">
                              Max ever (+{formData.armLifetimeCap}% lifetime cap):
                            </span>
                            <span className="font-semibold text-foreground">
                              {formatCurrency(results.armLifetimeMaxPI)}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-foreground/60">
                          Taxes, insurance and HOA sit on top of these figures and can rise
                          independently of any rate cap.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Cost Summary */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Cost Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Annual Payment:</span>
                      <span className="font-semibold">{formatCurrency(results.totalYearly)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total Cost ({formData.loanTerm} years):</span>
                      <span className="font-semibold">{formatCurrency(results.totalCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total Interest:</span>
                      <span className="font-semibold">{formatCurrency(results.totalInterest)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown Visual */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Payment Breakdown</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Principal & Interest', value: results.monthlyPI, color: 'bg-blue-500' },
                      { label: 'Property Tax', value: results.tax, color: 'bg-emerald-500' },
                      { label: 'Insurance', value: results.insurance, color: 'bg-amber-500' },
                      ...(results.pmi > 0 ? [{ label: 'PMI', value: results.pmi, color: 'bg-red-400' }] : []),
                      ...(results.hoa > 0 ? [{ label: 'HOA', value: results.hoa, color: 'bg-purple-400' }] : []),
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground/70">{label}</span>
                          <span className="font-medium">{formatCurrency(value)} ({((value / results.totalMonthly) * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${(value / results.totalMonthly) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amortization Schedule - Yearly Summary + Expandable Monthly */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Amortization Schedule</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAmortization(!showAmortization)}
                        className="text-primary hover:text-primary text-sm font-medium"
                      >
                        {showAmortization ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                  </div>

                  {showAmortization && (() => {
                    // Group into yearly summaries for cleaner display
                    const years: Array<{
                      year: number;
                      totalPrincipal: number;
                      totalInterest: number;
                      totalPayment: number;
                      endBalance: number;
                      months: typeof results.amortizationSchedule;
                    }> = [];
                    for (let i = 0; i < results.amortizationSchedule.length; i += 12) {
                      const yearMonths = results.amortizationSchedule.slice(i, i + 12);
                      years.push({
                        year: Math.floor(i / 12) + 1,
                        totalPrincipal: yearMonths.reduce((s, m) => s + m.principal, 0),
                        totalInterest: yearMonths.reduce((s, m) => s + m.interest, 0),
                        totalPayment: yearMonths.reduce((s, m) => s + m.payment, 0),
                        endBalance: yearMonths[yearMonths.length - 1]?.remainingBalance ?? 0,
                        months: yearMonths,
                      });
                    }

                    return (
                      <div
                  // A scrollable region must be reachable by keyboard (axe
                  // scrollable-region-focusable / WCAG 2.1.1): the table holds no
                  // focusable children, so the scroller itself takes focus.
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  tabIndex={0}
                  role="region"
                  aria-label="Amortization schedule, scrollable"
                  className="max-h-[500px] overflow-y-auto overflow-x-auto -mx-2 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                        <table className="w-full text-sm min-w-[480px]">
                          <thead className="bg-muted sticky top-0 z-10">
                            <tr>
                              <th className="px-2 py-2 text-left text-foreground">Year</th>
                              <th className="px-2 py-2 text-right text-foreground">Principal</th>
                              <th className="px-2 py-2 text-right text-foreground">Interest</th>
                              <th className="px-2 py-2 text-right text-foreground">Total Paid</th>
                              <th className="px-2 py-2 text-right text-foreground">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {years.map((yr) => (
                              <YearRow key={yr.year} yr={yr} formatCurrency={formatCurrency} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About This Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">What This Calculator Shows:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Monthly mortgage payment breakdown</li>
                <li>Total cost over the loan term</li>
                <li>Interest vs. principal payments</li>
                <li>Amortization schedule</li>
                <li>PMI calculations (if applicable)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Important Notes:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Rates and terms may vary by lender</li>
                <li>Property taxes vary by location</li>
                <li>Insurance costs depend on coverage</li>
                <li>PMI typically required for &lt;20% down</li>
                <li>Consult a mortgage professional for exact rates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="mortgage-payment"
        calculatorName="Mortgage Payment"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

/** Expandable yearly row, click to see individual months */
function YearRow({ yr, formatCurrency }: {
  yr: { year: number; totalPrincipal: number; totalInterest: number; totalPayment: number; endBalance: number; months: Array<{ month: number; payment: number; principal: number; interest: number; remainingBalance: number }> };
  formatCurrency: (n: number) => string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr
        className="border-b border-gray-100 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
        role="button"
        aria-expanded={expanded}
        aria-label={`Year ${yr.year} details`}
      >
        <td className="px-2 py-2 font-medium text-foreground">
          <span className="inline-block w-4 mr-1 text-xs text-foreground/50">{expanded ? '▼' : '▶'}</span>
          Year {yr.year}
        </td>
        <td className="px-2 py-2 text-right text-primary">{formatCurrency(yr.totalPrincipal)}</td>
        <td className="px-2 py-2 text-right text-destructive-emphasis">{formatCurrency(yr.totalInterest)}</td>
        <td className="px-2 py-2 text-right font-medium">{formatCurrency(yr.totalPayment)}</td>
        <td className="px-2 py-2 text-right text-foreground/70">{formatCurrency(yr.endBalance)}</td>
      </tr>
      {expanded && yr.months.map((row) => (
        <tr key={row.month} className="border-b border-gray-50 bg-muted/20 text-xs">
          <td className="px-2 py-1.5 pl-8 text-foreground/60">Mo {row.month}</td>
          <td className="px-2 py-1.5 text-right text-primary/80">{formatCurrency(row.principal)}</td>
          <td className="px-2 py-1.5 text-right text-destructive-emphasis/80">{formatCurrency(row.interest)}</td>
          <td className="px-2 py-1.5 text-right">{formatCurrency(row.payment)}</td>
          <td className="px-2 py-1.5 text-right text-foreground/60">{formatCurrency(row.remainingBalance)}</td>
        </tr>
      ))}
    </>
  );
}

export default MortgagePaymentCalculator;
