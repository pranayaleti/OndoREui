"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoanProgram, calculateMonthlyPI, clampCreditScore, getProgramMI } from '@/lib/mortgage-utils';

interface MortgageData {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
  program: LoanProgram;
  creditScore: number;
  financeUpfront: boolean;
}

interface PaymentBreakdown {
  principal: number;
  interest: number;
  tax: number;
  insurance: number;
  pmi: number;
  monthlyPI: number;
  totalMonthly: number;
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
    interestRate: 4.5,
    loanTerm: 30,
    propertyTax: 3000,
    insurance: 1200,
    pmi: 0,
    program: 'conventional',
    creditScore: 740,
    financeUpfront: true
  });

  const [results, setResults] = useState<PaymentBreakdown | null>(null);
  const [showAmortization, setShowAmortization] = useState(true);

  const calculateMortgage = useCallback(() => {
    const { homePrice, downPayment, loanAmount, interestRate, loanTerm, propertyTax, insurance, program } = formData;

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

    const totalMonthly = monthlyPayment + monthlyTax + monthlyInsurance + monthlyPmi;
    const totalYearly = totalMonthly * 12;
    const totalCost = totalYearly * loanTerm;
    const totalInterest = (monthlyPayment * totalPayments) - financedLoanAmount;

    const amortizationSchedule = [];
    let remainingBalance = financedLoanAmount;

    for (let month = 1; month <= Math.min(360, totalPayments); month++) {
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

    setResults({
      principal: monthlyPayment - firstMonthInterest,
      interest: firstMonthInterest,
      tax: monthlyTax,
      insurance: monthlyInsurance,
      pmi: monthlyPmi,
      monthlyPI: monthlyPayment,
      totalMonthly,
      totalYearly,
      totalCost,
      totalInterest,
      amortizationSchedule
    });
  }, [formData]);

  useEffect(() => {
    calculateMortgage();
  }, [calculateMortgage]);

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
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Mortgage Payment Calculator</h1>
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
              {/* Home Price */}
              <div>
                <label htmlFor="homePrice" className="block text-sm font-medium text-foreground mb-2">
                  Home Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    id="homePrice"
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.homePrice || ''}
                    onChange={(e) => handleInputChange('homePrice', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="300,000"
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label htmlFor="downPaymentAmount" className="block text-sm font-medium text-foreground mb-2">
                  Down Payment
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-foreground/70">$</span>
                    <input
                      id="downPaymentAmount"
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.downPayment || ''}
                      onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                      placeholder="60,000"
                    />
                  </div>
                  <div className="relative">
                    <input
                      id="downPaymentPercent"
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={((formData.downPayment / formData.homePrice) * 100).toFixed(1)}
                      onChange={(e) => {
                        const percent = Number(e.target.value);
                        const newDownPayment = (percent / 100) * formData.homePrice;
                        handleInputChange('downPayment', newDownPayment);
                      }}
                      className="w-full pr-8 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                      placeholder="20.0"
                    />
                    <span className="absolute right-3 top-3 text-foreground/70">%</span>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  {formData.downPayment < formData.homePrice * 0.2 &&
                    "Note: Less than 20% down payment will require PMI"
                  }
                </p>
              </div>

              {/* Loan Amount */}
              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-foreground mb-2">
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    id="loanAmount"
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.loanAmount || ''}
                    onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="240,000"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-foreground mb-2">
                  Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.01"
                  value={formData.interestRate || ''}
                  onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="4.5"
                />
              </div>

              {/* Loan Term */}
              <div>
                <label htmlFor="loanTerm" className="block text-sm font-medium text-foreground mb-2">
                  Loan Term (years)
                </label>
                <select
                  id="loanTerm"
                  value={formData.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>

              {/* Property Tax */}
              <div>
                <label htmlFor="propertyTax" className="block text-sm font-medium text-foreground mb-2">
                  Annual Property Tax
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    id="propertyTax"
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.propertyTax || ''}
                    onChange={(e) => handleInputChange('propertyTax', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="3,000"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div>
                <label htmlFor="insurance" className="block text-sm font-medium text-foreground mb-2">
                  Annual Homeowners Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    id="insurance"
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.insurance || ''}
                    onChange={(e) => handleInputChange('insurance', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,200"
                  />
                </div>
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

              {/* Credit Score */}
              <div>
                <label htmlFor="creditScore" className="block text-sm font-medium text-foreground mb-2">
                  Credit Score
                </label>
                <input
                  id="creditScore"
                  type="number"
                    onFocus={(e) => e.target.select()}
                  min={300}
                  max={850}
                  value={formData.creditScore || ''}
                  onChange={(e) => handleInputChange('creditScore', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="740"
                />
              </div>

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
                      <span className="text-destructive">{formatCurrency(results.interest)}</span>
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
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Monthly Payment:</span>
                      <span className="text-primary">{formatCurrency(results.totalMonthly)}</span>
                    </div>
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

                {/* Amortization Schedule */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Amortization Schedule</h2>
                    <button
                      onClick={() => setShowAmortization(!showAmortization)}
                      className="text-primary hover:text-primary text-sm font-medium"
                    >
                      {showAmortization ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>

                  {showAmortization && (
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-2 py-2 text-left text-foreground">Month</th>
                            <th className="px-2 py-2 text-right text-foreground">Payment</th>
                            <th className="px-2 py-2 text-right text-foreground">Principal</th>
                            <th className="px-2 py-2 text-right text-foreground">Interest</th>
                            <th className="px-2 py-2 text-right text-foreground">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.amortizationSchedule.slice(0, 60).map((row) => (
                            <tr key={row.month} className="border-b border-gray-100">
                              <td className="px-2 py-2 text-foreground/70">{row.month}</td>
                              <td className="px-2 py-2 text-right font-medium">{formatCurrency(row.payment)}</td>
                              <td className="px-2 py-2 text-right text-primary">{formatCurrency(row.principal)}</td>
                              <td className="px-2 py-2 text-right text-destructive">{formatCurrency(row.interest)}</td>
                              <td className="px-2 py-2 text-right text-foreground/70">{formatCurrency(row.remainingBalance)}</td>
                            </tr>
                          ))}
                          {results.amortizationSchedule.length > 60 && (
                            <tr className="bg-muted">
                              <td colSpan={5} className="px-2 py-2 text-center text-foreground/70 text-sm">
                                ... and {results.amortizationSchedule.length - 60} more months
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
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
    </div>
  );
};

export default MortgagePaymentCalculator;
