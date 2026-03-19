"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoanProgram, getProgramDTI, getProgramMI, clampCreditScore, calculateMonthlyPI } from '@/lib/mortgage-utils';

interface IncomeData {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  insurance: number;
  monthlyDebts: number;
  program: LoanProgram;
  creditScore: number;
}

interface IncomeResults {
  requiredAnnualIncome: number;
  requiredMonthlyIncome: number;
  frontEndRatio: number;
  backEndRatio: number;
  monthlyPayment: number;
  debtToIncomeRatio: number;
}

const IncomeCalculator: React.FC = () => {
  const [formData, setFormData] = useState<IncomeData>({
    homePrice: 300000,
    downPayment: 60000,
    loanAmount: 240000,
    interestRate: 4.5,
    loanTerm: 30,
    propertyTax: 3000,
    insurance: 1200,
    monthlyDebts: 500,
    program: 'conventional',
    creditScore: 740
  });

  const [results, setResults] = useState<IncomeResults | null>(null);
  const calculateRequiredIncome = useCallback(() => {
    const { homePrice, downPayment, loanAmount, interestRate, loanTerm, propertyTax, insurance, monthlyDebts, program, creditScore } = formData;

    // Calculate monthly mortgage payment (P&I) using utility function
    const monthlyPayment = calculateMonthlyPI(loanAmount, interestRate, loanTerm);

    // Calculate monthly property tax and insurance
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;

    // Calculate program MI
    const credit = clampCreditScore(creditScore);
    const { monthlyMI } = getProgramMI(program, loanAmount, homePrice, credit, loanTerm, downPayment);

    // Calculate total monthly housing payment including MI
    const totalHousingPayment = monthlyPayment + monthlyTax + monthlyInsurance + monthlyMI;
    
    // Qualifying income using program DTI (take the higher required income of the two)
    const dti = getProgramDTI(formData.program);
    const frontRatio = dti.frontPercent > 0 ? (dti.frontPercent / 100) : 0;
    const backRatio = dti.backPercent / 100;
    const requiredMonthlyIncomeFront = frontRatio > 0 ? totalHousingPayment / frontRatio : 0;
    const requiredMonthlyIncomeBack = (totalHousingPayment + monthlyDebts) / backRatio;
    const requiredMonthlyIncome = Math.max(requiredMonthlyIncomeFront, requiredMonthlyIncomeBack);
    const requiredAnnualIncome = requiredMonthlyIncome * 12;
    
    // Calculate ratios at the required income level
    const frontEndRatio = (totalHousingPayment / requiredMonthlyIncome) * 100;
    const backEndRatio = ((totalHousingPayment + monthlyDebts) / requiredMonthlyIncome) * 100;
    const debtToIncomeRatio = backEndRatio;
    
    setResults({
      requiredAnnualIncome,
      requiredMonthlyIncome,
      frontEndRatio,
      backEndRatio,
      monthlyPayment: totalHousingPayment,
      debtToIncomeRatio
    });
  }, [formData]);

  useEffect(() => {
    calculateRequiredIncome();
  }, [calculateRequiredIncome]);

  const handleInputChange = <K extends keyof IncomeData>(field: K, value: IncomeData[K]) => {
    const newData = { ...formData, [field]: value } as IncomeData;
    
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

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Mortgage Income Calculator</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Mortgage Details</h2>
            
            <div className="space-y-6">
              {/* Home Price */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Home Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.homePrice || ''}
                    onChange={(e) => handleInputChange('homePrice', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="300,000"
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.downPayment || ''}
                    onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="60,000"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.01"
                  value={formData.interestRate || ''}
                  onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="4.5"
                />
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Loan Term (years)
                </label>
                <select
                  value={formData.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
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
                    onFocus={(e) => e.target.select()}
                    value={formData.propertyTax || ''}
                    onChange={(e) => handleInputChange('propertyTax', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
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
                    onFocus={(e) => e.target.select()}
                    value={formData.insurance || ''}
                    onChange={(e) => handleInputChange('insurance', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,200"
                  />
                </div>
              </div>

              {/* Monthly Debts */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Monthly Debt Payments
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.monthlyDebts || ''}
                    onChange={(e) => handleInputChange('monthlyDebts', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="500"
                  />
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  Credit cards, car loans, student loans, etc.
                </p>
              </div>

              {/* Loan Program */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Loan Program</label>
                <select
                  value={formData.program}
                  onChange={(e) => handleInputChange('program', e.target.value as LoanProgram)}
                  className="w-full px-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                >
                  <option value="conventional">Conventional</option>
                  <option value="fha">FHA</option>
                  <option value="va">VA</option>
                  <option value="usda">USDA</option>
                </select>
              </div>

              {/* Credit Score */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Credit Score</label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  min={300}
                  max={850}
                  value={formData.creditScore || ''}
                  onChange={(e) => handleInputChange('creditScore', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-border bg-background rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="740"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Required Income */}
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Required Income</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Annual Income Needed</p>
                        <p className="text-3xl font-bold text-green-700">{formatCurrency(results.requiredAnnualIncome)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Monthly Income Needed</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.requiredMonthlyIncome)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Payment Breakdown</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Monthly Housing Payment:</span>
                      <span className="font-semibold">{formatCurrency(results.monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Monthly Debts:</span>
                      <span className="font-semibold">{formatCurrency(formData.monthlyDebts)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total Monthly Debt:</span>
                      <span className="font-semibold">{formatCurrency(results.monthlyPayment + formData.monthlyDebts)}</span>
                    </div>
                  </div>
                </div>

                {/* Debt Ratios */}
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Debt-to-Income Ratios</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Front-End Ratio (Housing):</span>
                      <span className="font-semibold text-primary">{formatPercent(results.frontEndRatio)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Back-End Ratio (Total Debt):</span>
                      <span className="font-semibold text-primary">{formatPercent(results.backEndRatio)}</span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-foreground/70">
                        <strong>Front-End:</strong> Housing expenses ÷ Gross monthly income (target: ≤28%)<br/>
                        <strong>Back-End:</strong> Total debt payments ÷ Gross monthly income (target: ≤36%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recommendations</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    <p>• This calculation uses conservative 28/36 debt-to-income ratios</p>
                    <p>• Consider additional expenses like maintenance and utilities</p>
                    <p>• Factor in emergency savings and other financial goals</p>
                    <p>• Consult with a mortgage professional for personalized advice</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">About This Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">How It Works:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Calculates required income for a specific mortgage</li>
                <li>Uses standard 28% front-end ratio</li>
                <li>Considers property taxes and insurance</li>
                <li>Accounts for existing monthly debt</li>
                <li>Provides debt-to-income ratio analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Important Notes:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Income requirements may vary by lender</li>
                <li>Credit score affects approval chances</li>
                <li>Consider future income stability</li>
                <li>Factor in other living expenses</li>
                <li>Consult a mortgage professional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeCalculator;
