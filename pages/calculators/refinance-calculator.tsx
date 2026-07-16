"use client"

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useFinancialVisibility } from '@/lib/financial-visibility';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import {
  DEFAULT_MORTGAGE_RATE,
  calculateMonthlyPI,
  calculateRefinance,
  hasCompleteRefinanceInputs,
  type RefinanceInput,
} from '@/lib/mortgage-utils'

interface RefinanceFormData {
  currentBalance: number;
  currentRate: number;
  currentPayment: number;
  newRate: number;
  newTerm: number;
  closingCosts: number;
  propertyTax: number;
  insurance: number;
}

const RefinanceCalculator: React.FC = () => {
  // Defaults are internally consistent: ~25 years remaining at 7% on $200k + escrow.
  const defaultBalance = 200000
  const defaultRate = 7.0
  const defaultRemainingYears = 25
  const defaultTax = 3000
  const defaultIns = 1200
  const defaultEscrow = defaultTax / 12 + defaultIns / 12
  const defaultPI = calculateMonthlyPI(defaultBalance, defaultRate, defaultRemainingYears)

  const [formData, setFormData] = useState<RefinanceFormData>({
    currentBalance: defaultBalance,
    currentRate: defaultRate,
    currentPayment: Math.round(defaultPI + defaultEscrow),
    newRate: DEFAULT_MORTGAGE_RATE,
    newTerm: 30,
    closingCosts: 3000,
    propertyTax: defaultTax,
    insurance: defaultIns,
  });

  const { showValues, toggle } = useFinancialVisibility();

  const input: RefinanceInput = useMemo(
    () => ({
      currentBalance: formData.currentBalance,
      currentRate: formData.currentRate,
      currentPayment: formData.currentPayment,
      newRate: formData.newRate,
      newTermYears: formData.newTerm,
      closingCosts: formData.closingCosts,
      annualPropertyTax: formData.propertyTax,
      annualInsurance: formData.insurance,
    }),
    [formData]
  );

  const isComplete = hasCompleteRefinanceInputs(input);
  const results = useMemo(
    () => (isComplete ? calculateRefinance(input) : null),
    [input, isComplete]
  );
  const hasCalculated = results != null;

  const handleInputChange = (field: keyof RefinanceFormData, value: number) => {
    setFormData({ ...formData, [field]: value });
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
    <div className="min-h-screen bg-background">
      <div className="bg-background shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/calculators" className="text-primary hover:text-primary">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Refinance Calculator</h1>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs text-foreground/70 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={showValues ? "Hide financial amounts" : "Show financial amounts"}
            >
              {showValues ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              <span className="hidden sm:inline">
                {showValues ? "Hide amounts" : "Show amounts"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Current Mortgage</h2>
            <p className="text-sm text-foreground/70 mb-6">
              All required fields must be filled to see results. Rates shown are example defaults, not live quotes.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Loan Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    inputMode="numeric"
                    value={formData.currentBalance || ''}
                    onChange={(e) => handleInputChange('currentBalance', Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="200000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Interest Rate (%)
                </label>
                <input
                  type="number"
                  onFocus={(e) => e.target.select()}
                  step="0.01"
                  value={formData.currentRate === 0 ? 0 : formData.currentRate || ''}
                  onChange={(e) => handleInputChange('currentRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="7.0"
                />
                <p className="text-sm text-foreground/70 mt-1">
                  Used to estimate remaining term and interest savings
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Monthly Payment (PITI)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.currentPayment || ''}
                    onChange={(e) => handleInputChange('currentPayment', Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,600"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-6 mt-8">New Mortgage</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Interest Rate (%)
                </label>
                <input
                  type="number"
                  onFocus={(e) => e.target.select()}
                  step="0.01"
                  value={formData.newRate === 0 ? 0 : formData.newRate || ''}
                  onChange={(e) => handleInputChange('newRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder={String(DEFAULT_MORTGAGE_RATE)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Loan Term (years)
                </label>
                <select
                  value={formData.newTerm}
                  onChange={(e) => handleInputChange('newTerm', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Refinancing Closing Costs
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.closingCosts === 0 ? 0 : formData.closingCosts || ''}
                    onChange={(e) => handleInputChange('closingCosts', Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="3,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Property Tax
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.propertyTax === 0 ? 0 : formData.propertyTax || ''}
                    onChange={(e) => handleInputChange('propertyTax', Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="3,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Homeowners Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.insurance === 0 ? 0 : formData.insurance || ''}
                    onChange={(e) => handleInputChange('insurance', Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {!isComplete && (
              <div className="bg-card rounded-lg shadow-lg p-6">
                <p className="text-sm text-foreground/70">
                  Enter current balance, current rate, current payment, new rate, and new term to see refinance results.
                  Empty or incomplete fields are not replaced with hidden defaults.
                </p>
              </div>
            )}

            {results && (
              <>
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Monthly Payment Comparison</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-destructive mb-1">Current Payment</p>
                        <p className="text-lg font-semibold text-red-700">
                          {showValues ? formatCurrency(formData.currentPayment) : '••••'}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-primary mb-1">New Payment</p>
                        <p className="text-lg font-semibold text-green-700">
                          {showValues ? formatCurrency(results.newTotalPayment) : '••••'}
                        </p>
                        <p className="text-xs text-foreground/70 mt-1">
                          P&amp;I: {showValues ? formatCurrency(results.newPI) : '••••'} • Escrows:{' '}
                          {showValues ? formatCurrency(results.newEscrows) : '••••'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Monthly Payment Savings</p>
                        <p className="text-2xl font-bold text-foreground">
                          {showValues ? formatCurrency(results.monthlyPaymentSavings) : '••••'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Break-Even Analysis</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-yellow-600 mb-1">Break-Even Time</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {results.breakEvenMonths == null
                            ? 'N/A'
                            : `${results.breakEvenMonths.toFixed(1)} months`}
                        </p>
                        <p className="text-sm text-yellow-600 mt-1">
                          Time to recoup closing costs from payment savings
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Closing costs: {showValues ? formatCurrency(formData.closingCosts) : '••••'}</p>
                      <p>• Monthly payment savings: {showValues ? formatCurrency(results.monthlyPaymentSavings) : '••••'}</p>
                      {results.estimatedRemainingMonths != null && (
                        <p>
                          • Est. remaining term on current loan:{' '}
                          {(results.estimatedRemainingMonths / 12).toFixed(1)} years
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Savings Summary</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Net P&amp;I Payment Savings</p>
                        <p className="text-2xl font-bold text-green-700">
                          {showValues ? formatCurrency(results.netPaymentSavingsOverNewTerm) : '••••'}
                        </p>
                        <p className="text-sm text-primary mt-1">
                          P&amp;I difference over {(results.comparisonMonths / 12).toFixed(1)} years
                          (aligned horizon) minus closing costs
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-foreground/70">
                      {results.interestSavings != null ? (
                        <p>
                          • Estimated interest savings over the same horizon:{' '}
                          {showValues ? formatCurrency(results.interestSavings) : '••••'}
                        </p>
                      ) : (
                        <p>
                          • Interest savings: unavailable — check that current payment covers interest
                          at the current rate
                          {results.monthlyPaymentSavings < 0 && results.extendsTerm
                            ? ', or note that a higher payment with a longer term is not framed as interest savings'
                            : ''}
                        </p>
                      )}
                      <p>• Closing costs: {showValues ? formatCurrency(formData.closingCosts) : '••••'}</p>
                      <p>
                        • Net P&amp;I payment savings: {showValues ? formatCurrency(results.netPaymentSavingsOverNewTerm) : '••••'}
                      </p>
                      {results.extendsTerm && (
                        <p className="text-yellow-700">
                          • This refinance extends your remaining term (
                          {results.estimatedRemainingMonths != null
                            ? `${(results.estimatedRemainingMonths / 12).toFixed(1)} years left`
                            : 'current remaining'}{' '}
                          → {formData.newTerm} years).
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recommendations</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.isBeneficial ? (
                      <p className="text-primary font-medium">
                        ✓ Refinancing looks beneficial: lower payment, positive interest savings, and
                        break-even within the remaining loan term
                      </p>
                    ) : results.monthlyPaymentSavings <= 0 ? (
                      <p className="text-yellow-600 font-medium">
                        ⚠ Monthly payment does not decrease — weigh interest and term tradeoffs carefully
                      </p>
                    ) : (
                      <p className="text-yellow-600 font-medium">
                        ⚠ Consider if you plan to stay long enough for break-even and interest savings to matter
                      </p>
                    )}
                    <p>• Factor in your plans to stay in the home</p>
                    <p>• Consider the opportunity cost of closing costs</p>
                    <p>• Shop around for the best rates and fees</p>
                    <p>• Consult with a mortgage professional</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Refinancing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">When to Consider Refinancing:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Interest rates have dropped significantly</li>
                <li>Your credit score has improved</li>
                <li>You want to change loan terms</li>
                <li>You need to remove PMI</li>
                <li>You want to consolidate debt</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Important Factors:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Break-even time vs. how long you'll stay</li>
                <li>Total closing costs and fees</li>
                <li>Impact on loan term and total interest</li>
                <li>Example rates in this tool are not live market quotes</li>
                <li>Your financial situation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="refinance"
        calculatorName="Refinance"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default RefinanceCalculator;
