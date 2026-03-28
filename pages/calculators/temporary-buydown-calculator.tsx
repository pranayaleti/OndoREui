"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

interface BuydownData {
  loanAmount: number;
  baseRate: number;
  buydownRate: number;
  buydownYears: number;
  buydownCost: number;
  loanTerm: number;
}

interface BuydownResults {
  monthlySavings: number;
  totalSavings: number;
  breakEvenMonths: number;
  effectiveRate: number;
  buydownCost: number;
}

const TemporaryBuydownCalculator: React.FC = () => {
  const [formData, setFormData] = useState<BuydownData>({
    loanAmount: 300000,
    baseRate: 6.5,
    buydownRate: 4.5,
    buydownYears: 2,
    buydownCost: 6000,
    loanTerm: 30
  });

  const [results, setResults] = useState<BuydownResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  useEffect(() => {
    calculateBuydown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateBuydown = () => {
    const { loanAmount, baseRate, buydownRate, buydownYears, buydownCost, loanTerm } = formData;
    
    // Calculate monthly rates
    const baseMonthlyRate = baseRate / 100 / 12;
    const buydownMonthlyRate = buydownRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const buydownPayments = buydownYears * 12;
    
    // Calculate monthly payments
    const baseMonthlyPayment = loanAmount * 
      (baseMonthlyRate * Math.pow(1 + baseMonthlyRate, totalPayments)) / 
      (Math.pow(1 + baseMonthlyRate, totalPayments) - 1);
    
    const buydownMonthlyPayment = loanAmount * 
      (buydownMonthlyRate * Math.pow(1 + buydownMonthlyRate, totalPayments)) / 
      (Math.pow(1 + buydownMonthlyRate, totalPayments) - 1);
    
    // Calculate monthly savings during buydown period
    const monthlySavings = baseMonthlyPayment - buydownMonthlyPayment;
    
    // Calculate total savings during buydown period
    const totalSavings = monthlySavings * buydownPayments;
    
    // Calculate break-even months
    const breakEvenMonths = buydownCost / monthlySavings;
    
    // Calculate effective rate over the buydown period
    const effectiveRate = ((buydownRate * buydownYears) + (baseRate * (loanTerm - buydownYears))) / loanTerm;
    
    setResults({
      monthlySavings,
      totalSavings,
      breakEvenMonths,
      effectiveRate,
      buydownCost
    });
    setHasCalculated(true);
  };

  const handleInputChange = (field: keyof BuydownData, value: number) => {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Information</h2>
            
            <div className="space-y-6">
              {/* Loan Amount */}
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

              {/* Base Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Base Interest Rate (%)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.01"
                  value={formData.baseRate || ''}
                  onChange={(e) => handleInputChange('baseRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="6.5"
                />
              </div>

              {/* Buydown Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Buydown Interest Rate (%)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.01"
                  value={formData.buydownRate || ''}
                  onChange={(e) => handleInputChange('buydownRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="4.5"
                />
                <p className="text-sm text-foreground/70 mt-1">
                  Must be lower than base rate
                </p>
              </div>

              {/* Buydown Years */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Buydown Period (years)
                </label>
                <select
                  value={formData.buydownYears}
                  onChange={(e) => handleInputChange('buydownYears', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                >
                  <option value={1}>1 year</option>
                  <option value={2}>2 years</option>
                  <option value={3}>3 years</option>
                </select>
              </div>

              {/* Buydown Cost */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Buydown Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.buydownCost || ''}
                    onChange={(e) => handleInputChange('buydownCost', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="6,000"
                  />
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  Cost to buy down the interest rate
                </p>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Loan Term (years)
                </label>
                <select
                  value={formData.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Monthly Savings */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Monthly Savings</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Monthly Payment Reduction</p>
                        <p className="text-3xl font-bold text-green-700">{formatCurrency(results.monthlySavings)}</p>
                        <p className="text-sm text-primary mt-1">
                          During {formData.buydownYears} year{formData.buydownYears > 1 ? 's' : ''} buydown period
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Base Rate Payment</p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrency(formData.loanAmount * 
                            ((formData.baseRate / 100 / 12) * Math.pow(1 + formData.baseRate / 100 / 12, formData.loanTerm * 12)) / 
                            (Math.pow(1 + formData.baseRate / 100 / 12, formData.loanTerm * 12) - 1))}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Buydown Payment</p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatCurrency(formData.loanAmount * 
                            ((formData.buydownRate / 100 / 12) * Math.pow(1 + formData.buydownRate / 100 / 12, formData.loanTerm * 12)) / 
                            (Math.pow(1 + formData.buydownRate / 100 / 12, formData.loanTerm * 12) - 1))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Savings */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Total Savings</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Total Savings During Buydown</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.totalSavings)}</p>
                        <p className="text-sm text-primary mt-1">
                          Over {formData.buydownYears} year{formData.buydownYears > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Monthly savings: {formatCurrency(results.monthlySavings)}</p>
                      <p>• Buydown period: {formData.buydownYears} year{formData.buydownYears > 1 ? 's' : ''}</p>
                      <p>• Total savings: {formatCurrency(results.totalSavings)}</p>
                    </div>
                  </div>
                </div>

                {/* Break-Even Analysis */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Break-Even Analysis</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-yellow-600 mb-1">Break-Even Time</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {results.breakEvenMonths.toFixed(1)} months
                        </p>
                        <p className="text-sm text-yellow-600 mt-1">
                          Time to recoup buydown cost
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Buydown cost: {formatCurrency(results.buydownCost)}</p>
                      <p>• Monthly savings: {formatCurrency(results.monthlySavings)}</p>
                      <p>• Break-even: {results.breakEvenMonths.toFixed(1)} months</p>
                    </div>
                  </div>
                </div>

                {/* Effective Rate */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Effective Rate</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-purple-600 mb-1">Effective Interest Rate</p>
                        <p className="text-2xl font-bold text-purple-700">{formatPercent(results.effectiveRate)}</p>
                        <p className="text-sm text-purple-600 mt-1">
                          Weighted average over {formData.loanTerm} years
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Base rate: {formatPercent(formData.baseRate)}</p>
                      <p>• Buydown rate: {formatPercent(formData.buydownRate)}</p>
                      <p>• Effective rate: {formatPercent(results.effectiveRate)}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recommendations</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.breakEvenMonths < formData.buydownYears * 12 ? (
                      <p className="text-primary font-medium">✓ Buydown looks beneficial - you'll break even before the buydown period ends</p>
                    ) : (
                      <p className="text-yellow-600 font-medium">⚠ Consider if the monthly savings are worth the upfront cost</p>
                    )}
                    <p>• Factor in your plans to stay in the home</p>
                    <p>• Consider the opportunity cost of the buydown cost</p>
                    <p>• Compare with other mortgage options</p>
                    <p>• Consult with a mortgage professional</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Temporary Buydowns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">How It Works:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Pay upfront to reduce interest rate temporarily</li>
                <li>Lower payments during the buydown period</li>
                <li>Rate returns to base rate after buydown ends</li>
                <li>Common periods: 1, 2, or 3 years</li>
                <li>Can help with initial affordability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">When to Consider:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>You expect income to increase soon</li>
                <li>You plan to refinance in a few years</li>
                <li>You want lower initial payments</li>
                <li>You have cash available for upfront cost</li>
                <li>You'll stay in the home long enough to benefit</li>
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
