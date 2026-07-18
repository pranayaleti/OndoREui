"use client"

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import {
  DEFAULT_MORTGAGE_RATE,
  type BuydownStructure,
  calculateTemporaryBuydown,
} from '@/lib/mortgage-utils'

interface BuydownFormData {
  loanAmount: number;
  noteRate: number;
  structure: BuydownStructure;
  flatBuydownRate: number;
  flatYears: number;
  loanTerm: number;
  quotedBuydownCost: number;
}

const TemporaryBuydownCalculator: React.FC = () => {
  const [formData, setFormData] = useState<BuydownFormData>({
    loanAmount: 300000,
    noteRate: DEFAULT_MORTGAGE_RATE,
    structure: '2-1',
    flatBuydownRate: DEFAULT_MORTGAGE_RATE - 2,
    flatYears: 2,
    loanTerm: 30,
    quotedBuydownCost: 0,
  });

  const results = useMemo(
    () =>
      calculateTemporaryBuydown({
        loanAmount: formData.loanAmount,
        noteRate: formData.noteRate,
        loanTermYears: formData.loanTerm,
        structure: formData.structure,
        flatBuydownRate: formData.flatBuydownRate,
        flatYears: formData.flatYears,
      }),
    [formData]
  );

  const hasCalculated = results != null;

  const breakEvenMonths = useMemo(() => {
    if (!results || !(formData.quotedBuydownCost > 0) || !(results.averageMonthlySubsidy > 0)) {
      return null;
    }
    return formData.quotedBuydownCost / results.averageMonthlySubsidy;
  }, [results, formData.quotedBuydownCost]);

  const handleInputChange = <K extends keyof BuydownFormData>(field: K, value: BuydownFormData[K]) => {
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

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const structureLabel =
    formData.structure === '2-1'
      ? '2-1 buydown'
      : formData.structure === '3-2-1'
        ? '3-2-1 buydown'
        : `${formData.flatYears}-year flat buydown`;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Temporary Buydown Calculator</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Information</h2>
            <p className="text-sm text-foreground/70 mb-6">
              Models a temporary rate subsidy only: the note rate stays fixed for the full loan term.
              During buydown years you pay a lower payment; the difference is the buydown cost.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.loanAmount || ''}
                    onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="300,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Note Interest Rate (%)
                </label>
                <input
                  type="number"
                  onFocus={(e) => e.target.select()}
                  step="0.01"
                  value={formData.noteRate || ''}
                  onChange={(e) => handleInputChange('noteRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder={String(DEFAULT_MORTGAGE_RATE)}
                />
                <p className="text-sm text-foreground/70 mt-1">
                  Permanent note rate (example default {DEFAULT_MORTGAGE_RATE}%, not a live quote)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Buydown Structure
                </label>
                <select
                  value={formData.structure}
                  onChange={(e) => handleInputChange('structure', e.target.value as BuydownStructure)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="2-1">2-1 (rate −2%, then −1%, then note)</option>
                  <option value="3-2-1">3-2-1 (rate −3%, −2%, −1%, then note)</option>
                  <option value="flat">Flat temporary rate</option>
                </select>
              </div>

              {formData.structure === 'flat' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Temporary Buydown Rate (%)
                    </label>
                    <input
                      type="number"
                      onFocus={(e) => e.target.select()}
                      step="0.01"
                      value={formData.flatBuydownRate || ''}
                      onChange={(e) => handleInputChange('flatBuydownRate', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                      placeholder={String(DEFAULT_MORTGAGE_RATE - 2)}
                    />
                    <p className="text-sm text-foreground/70 mt-1">
                      Must be lower than the note rate
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Buydown Period (years)
                    </label>
                    <select
                      value={formData.flatYears}
                      onChange={(e) => handleInputChange('flatYears', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value={1}>1 year</option>
                      <option value={2}>2 years</option>
                      <option value={3}>3 years</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Loan Term (years)
                </label>
                <select
                  value={formData.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quoted Buydown Cost (optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.quotedBuydownCost || ''}
                    onChange={(e) => handleInputChange('quotedBuydownCost', Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="0"
                  />
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  Optional: compare a lender/seller quote to the estimated subsidy cost below
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {!results && (
              <div className="bg-card rounded-lg shadow-lg p-6">
                <p className="text-foreground/70 text-sm">
                  Enter a valid loan amount, note rate, and buydown structure to see results.
                  For a flat buydown, the temporary rate must be below the note rate.
                </p>
              </div>
            )}

            {results && (
              <>
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Payment Schedule</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-sm text-primary mb-1">Full Note Payment (P&amp;I)</p>
                      <p className="text-3xl font-bold text-foreground">
                        {formatCurrency(results.fullMonthlyPayment)}
                      </p>
                      <p className="text-sm text-primary mt-1">
                        At {formatPercent(formData.noteRate)} for {formData.loanTerm} years
                      </p>
                    </div>

                    <div className="space-y-2">
                      {results.schedule.map((year) => (
                        <div
                          key={year.year}
                          className="flex justify-between items-center p-3 bg-muted rounded-lg text-sm"
                        >
                          <div>
                            <p className="font-medium text-foreground">Year {year.year}</p>
                            <p className="text-foreground/70">
                              {formatPercent(year.ratePercent)} temporary rate
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {formatCurrency(year.monthlyPayment)}/mo
                            </p>
                            <p className="text-primary">
                              Saves {formatCurrency(year.monthlySubsidy)}/mo
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-3 border border-dashed border-gray-300 rounded-lg text-sm">
                        <div>
                          <p className="font-medium text-foreground">After buydown</p>
                          <p className="text-foreground/70">Note rate resumes</p>
                        </div>
                        <p className="font-semibold text-foreground">
                          {formatCurrency(results.fullMonthlyPayment)}/mo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Buydown Cost &amp; Savings</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-sm text-primary mb-1">Estimated Buydown Cost</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(results.estimatedBuydownCost)}
                      </p>
                      <p className="text-sm text-primary mt-1">
                        Sum of (full payment − subsidized payment) over {results.buydownMonths} months
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Avg. Monthly Subsidy</p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrency(results.averageMonthlySubsidy)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Total Subsidy Savings</p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrency(results.totalSubsidySavings)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Structure: {structureLabel}</p>
                      <p>• Note rate never changes; only the payment is subsidized temporarily</p>
                      {formData.quotedBuydownCost > 0 && (
                        <p>
                          • Quoted cost vs estimate:{' '}
                          {formatCurrency(formData.quotedBuydownCost)} vs{' '}
                          {formatCurrency(results.estimatedBuydownCost)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Effective Buydown Rate</h2>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-purple-600 mb-1">Avg. Rate During Buydown Period</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {formatPercent(results.effectiveBuydownRate)}
                    </p>
                    <p className="text-sm text-purple-600 mt-1">
                      Month-weighted average over {results.buydownMonths} subsidy months (not a permanent rate)
                    </p>
                  </div>
                </div>

                {breakEvenMonths != null && (
                  <div className="bg-card rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Quoted Cost Payback</h2>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-sm text-yellow-600 mb-1">Months to Recoup Quoted Cost</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {breakEvenMonths.toFixed(1)} months
                      </p>
                      <p className="text-sm text-yellow-600 mt-1">
                        Using average monthly subsidy during the buydown
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Temporary Buydowns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">How It Works:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Note rate stays at the permanent rate for the full loan</li>
                <li>A subsidy fund covers the difference during early years</li>
                <li>2-1 and 3-2-1 step the subsidy down each year</li>
                <li>Buydown cost ≈ total payment subsidies over those months</li>
                <li>After the buydown ends, you pay the full note payment</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">When to Consider:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>You expect income to rise in the next 1–3 years</li>
                <li>A seller or builder offers a buydown credit</li>
                <li>You want lower payments early without changing the note rate</li>
                <li>Compare the estimated fund size to any quote you receive</li>
                <li>Consult a mortgage professional for exact pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="temporary-buydown"
        calculatorName="Temporary Buydown"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default TemporaryBuydownCalculator;
