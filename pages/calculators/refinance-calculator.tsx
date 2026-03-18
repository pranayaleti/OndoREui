"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useFinancialVisibility } from '@/lib/financial-visibility';

interface RefinanceData {
  currentBalance: number;
  currentRate: number;
  currentPayment: number;
  newRate: number;
  newTerm: number;
  closingCosts: number;
  propertyTax: number;
  insurance: number;
}

interface RefinanceResults {
  newMonthlyPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  totalSavings: number;
  interestSavings: number;
  newPI: number;
  newEscrows: number;
  currentPI: number;
}

const RefinanceCalculator: React.FC = () => {
  const [formData, setFormData] = useState<RefinanceData>({
    currentBalance: 0,
    currentRate: 0,
    currentPayment: 0,
    newRate: 0,
    newTerm: 0,
    closingCosts: 0,
    propertyTax: 0,
    insurance: 0
  });

  const [results, setResults] = useState<RefinanceResults | null>(null);
  const { showValues, toggle } = useFinancialVisibility();

  useEffect(() => {
    calculateRefinance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateRefinance = () => {
    const hasAnyInput = [
      formData.currentBalance,
      formData.currentRate,
      formData.currentPayment,
      formData.newRate,
      formData.newTerm,
      formData.closingCosts,
      formData.propertyTax,
      formData.insurance
    ].some((v) => v != null && v !== 0);

    if (!hasAnyInput) {
      setResults({
        newMonthlyPayment: 0,
        monthlySavings: 0,
        breakEvenMonths: 0,
        totalSavings: 0,
        interestSavings: 0,
        newPI: 0,
        newEscrows: 0,
        currentPI: 0
      });
      return;
    }

    const currentBalance = formData.currentBalance || 200000;
    const currentPayment = formData.currentPayment || 1200;
    const newRate = formData.newRate || 4.0;
    const newTerm = formData.newTerm || 30;
    const closingCosts = formData.closingCosts || 3000;
    const propertyTax = formData.propertyTax || 3000;
    const insurance = formData.insurance || 1200;

    // Calculate monthly interest rate
    const monthlyRate = newRate / 100 / 12;
    const totalPayments = newTerm * 12;
    
    // Calculate new monthly payment (P&I only)
    const newMonthlyPayment = currentBalance * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    // Add property tax and insurance
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const escrows = monthlyTax + monthlyInsurance;
    const totalNewPayment = newMonthlyPayment + escrows;
    
    const monthlySavings = currentPayment - totalNewPayment;
    
    const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : 0;
    
    // P&I savings over the new loan term
    const currentPI = currentPayment - escrows;
    const piSavingsPerMonth = currentPI - newMonthlyPayment;
    const totalSavings = piSavingsPerMonth > 0 ? piSavingsPerMonth * totalPayments - closingCosts : -closingCosts;
    
    const interestSavings = piSavingsPerMonth * totalPayments;
    
    setResults({
      newMonthlyPayment: totalNewPayment,
      monthlySavings,
      breakEvenMonths,
      totalSavings,
      interestSavings,
      newPI: newMonthlyPayment,
      newEscrows: escrows,
      currentPI
    });
  };

  const handleInputChange = (field: keyof RefinanceData, value: number) => {
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
      {/* Header */}
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
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Current Mortgage</h2>
            
            <div className="space-y-6">
              {/* Current Balance */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Loan Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formData.currentBalance || ''}
                    onChange={(e) => handleInputChange('currentBalance', Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="200000"
                  />
                </div>
              </div>

              {/* Current Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentRate || ''}
                  onChange={(e) => handleInputChange('currentRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="5.5"
                />
              </div>

              {/* Current Payment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Monthly Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    value={formData.currentPayment || ''}
                    onChange={(e) => handleInputChange('currentPayment', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,200"
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-6 mt-8">New Mortgage</h2>

              {/* New Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.newRate || ''}
                  onChange={(e) => handleInputChange('newRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="4.0"
                />
              </div>

              {/* New Term */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Loan Term (years)
                </label>
                <select
                  value={formData.newTerm || 30}
                  onChange={(e) => handleInputChange('newTerm', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>

              {/* Closing Costs */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Refinancing Closing Costs
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    value={formData.closingCosts || ''}
                    onChange={(e) => handleInputChange('closingCosts', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="3,000"
                  />
                </div>
              </div>

              {/* Property Tax */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Property Tax
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    value={formData.propertyTax || ''}
                    onChange={(e) => handleInputChange('propertyTax', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="3,000"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Homeowners Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    value={formData.insurance || ''}
                    onChange={(e) => handleInputChange('insurance', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Monthly Savings */}
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
                          {showValues ? formatCurrency(results.newMonthlyPayment) : '••••'}
                        </p>
                        <p className="text-xs text-foreground/70 mt-1">
                          P&I: {showValues ? formatCurrency(results.newPI) : '••••'} • Escrows:{" "}
                          {showValues ? formatCurrency(results.newEscrows) : '••••'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Monthly Savings</p>
                        <p className="text-2xl font-bold text-foreground">
                          {showValues ? formatCurrency(results.monthlySavings) : '••••'}
                        </p>
                      </div>
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
                          Time to recoup closing costs
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Closing costs: {showValues ? formatCurrency(formData.closingCosts) : '••••'}</p>
                      <p>• Monthly savings: {showValues ? formatCurrency(results.monthlySavings) : '••••'}</p>
                      <p>• Break-even: {results.breakEvenMonths.toFixed(1)} months</p>
                    </div>
                  </div>
                </div>

                {/* Total Savings */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Total Savings</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Total Savings</p>
                        <p className="text-2xl font-bold text-green-700">
                          {showValues ? formatCurrency(results.totalSavings) : '••••'}
                        </p>
                        <p className="text-sm text-primary mt-1">
                          Over {formData.newTerm} years (minus closing costs)
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Interest savings (PI-only est.): {showValues ? formatCurrency(results.interestSavings) : '••••'}</p>
                      <p>• Closing costs: {showValues ? formatCurrency(formData.closingCosts) : '••••'}</p>
                      <p>• Net savings: {showValues ? formatCurrency(results.totalSavings) : '••••'}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recommendations</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.breakEvenMonths < 24 ? (
                      <p className="text-primary font-medium">✓ Refinancing looks beneficial with a quick break-even period</p>
                    ) : (
                      <p className="text-yellow-600 font-medium">⚠ Consider if you plan to stay in the home long enough to benefit</p>
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

        {/* Additional Information */}
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
                <li>Current market conditions</li>
                <li>Your financial situation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefinanceCalculator;
