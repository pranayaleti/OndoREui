"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoanProgram, getProgramDTI, getProgramMI, clampCreditScore, calculateMonthlyPI } from '@/lib/mortgage-utils';

interface BuyingPowerData {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  insuranceRate: number;
  creditScore: number;
  program: LoanProgram;
}

interface BuyingPowerResults {
  maxHomePrice: number;
  maxLoanAmount: number;
  monthlyPayment: number;
  debtToIncomeRatio: number;
  recommendedHomePrice: number;
}

const BuyingPowerCalculator: React.FC = () => {
  const [formData, setFormData] = useState<BuyingPowerData>({
    annualIncome: 80000,
    monthlyDebts: 500,
    downPayment: 20000,
    interestRate: 4.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    insuranceRate: 0.5,
    creditScore: 750,
    program: 'conventional'
  });

  const [results, setResults] = useState<BuyingPowerResults | null>(null);

  const calculateBuyingPower = React.useCallback(() => {
    const { annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate, insuranceRate } = formData;

    const monthlyIncome = annualIncome / 12;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    // Calculate maximum monthly payment using program DTI
    const dti = getProgramDTI(formData.program);
    const frontRatio = dti.frontPercent > 0 ? (dti.frontPercent / 100) : 0;
    const backRatio = dti.backPercent / 100;
    const maxFrontEndPayment = frontRatio > 0 ? monthlyIncome * frontRatio : Number.POSITIVE_INFINITY;
    const maxBackEndPayment = (monthlyIncome * backRatio) - monthlyDebts;
    
    // Use the lower of the two ratios
    const maxMonthlyPayment = Math.min(maxFrontEndPayment, maxBackEndPayment);
    
    // Calculate maximum loan amount using the mortgage payment formula
    const maxLoanAmount = maxMonthlyPayment * 
      (1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate;
    
    // Calculate property tax and insurance based on home price
    const maxHomePrice = maxLoanAmount + downPayment;
    let adjustedMaxHomePrice = maxHomePrice;
    
    // Iterate to find the correct home price that fits within the payment constraints
    for (let i = 0; i < 10; i++) {
      const monthlyTax = (adjustedMaxHomePrice * propertyTaxRate / 100) / 12;
      const monthlyInsurance = (adjustedMaxHomePrice * insuranceRate / 100) / 12;
      const estLoan = adjustedMaxHomePrice - downPayment;
      const credit = clampCreditScore(formData.creditScore);
      const mi = getProgramMI(formData.program, estLoan, adjustedMaxHomePrice, credit, loanTerm, downPayment).monthlyMI;
      const availableForPandI = maxMonthlyPayment - monthlyTax - monthlyInsurance - mi;
      
      if (availableForPandI > 0) {
        const newMaxLoanAmount = availableForPandI * 
          (1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate;
        const newMaxHomePrice = newMaxLoanAmount + downPayment;
        
        if (Math.abs(newMaxHomePrice - adjustedMaxHomePrice) < 100) {
          break;
        }
        adjustedMaxHomePrice = newMaxHomePrice;
      } else {
        adjustedMaxHomePrice *= 0.95;
      }
    }
    
    // Calculate final results
    const finalMaxHomePrice = Math.min(maxHomePrice, adjustedMaxHomePrice);
    const finalMaxLoanAmount = finalMaxHomePrice - downPayment;
    
    // Calculate actual monthly payment
    const monthlyTax = (finalMaxHomePrice * propertyTaxRate / 100) / 12;
    const monthlyInsurance = (finalMaxHomePrice * insuranceRate / 100) / 12;
    const monthlyPandI = calculateMonthlyPI(finalMaxLoanAmount, interestRate, loanTerm);
    const credit = clampCreditScore(formData.creditScore);
    const monthlyMI = getProgramMI(formData.program, finalMaxLoanAmount, finalMaxHomePrice, credit, loanTerm, downPayment).monthlyMI;
    
    const totalMonthlyPayment = monthlyPandI + monthlyTax + monthlyInsurance + monthlyMI;
    
    // Calculate debt-to-income ratio
    const debtToIncomeRatio = ((monthlyDebts + totalMonthlyPayment) / monthlyIncome) * 100;
    
    // Recommended home price (conservative estimate)
    const recommendedHomePrice = finalMaxHomePrice * 0.9;
    
    setResults({
      maxHomePrice: finalMaxHomePrice,
      maxLoanAmount: finalMaxLoanAmount,
      monthlyPayment: totalMonthlyPayment,
      debtToIncomeRatio,
      recommendedHomePrice
    });
  }, [formData]);

  useEffect(() => {
    calculateBuyingPower();
  }, [calculateBuyingPower]);

  const handleInputChange = <K extends keyof BuyingPowerData>(field: K, value: BuyingPowerData[K]) => {
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
    return `${value.toFixed(1)}%`;
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-primary';
    if (score >= 700) return 'text-primary';
    if (score >= 650) return 'text-yellow-600';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Buying Power Calculator</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Financial Information</h2>
            
            <div className="space-y-6">
              {/* Annual Income */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.annualIncome || ''}
                    onChange={(e) => handleInputChange('annualIncome', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="80,000"
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
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="500"
                  />
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  Credit cards, car loans, student loans, etc.
                </p>
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Available Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.downPayment || ''}
                    onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="20,000"
                  />
                </div>
              </div>

              {/* Credit Score */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Credit Score
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  min="300"
                  max="850"
                  value={formData.creditScore || ''}
                  onChange={(e) => handleInputChange('creditScore', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="750"
                />
                <p className={`text-sm mt-1 ${getCreditScoreColor(formData.creditScore)}`}>
                  {formData.creditScore >= 750 ? 'Excellent' : 
                   formData.creditScore >= 700 ? 'Good' : 
                   formData.creditScore >= 650 ? 'Fair' : 'Poor'}
                </p>
              </div>

              {/* Loan Program */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Loan Program</label>
                <select
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

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expected Interest Rate (%)
                </label>
                <input
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

              {/* Property Tax Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Property Tax Rate (% of home value)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.1"
                  value={formData.propertyTaxRate || ''}
                  onChange={(e) => handleInputChange('propertyTaxRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="1.2"
                />
              </div>

              {/* Insurance Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Homeowners Insurance Rate (% of home value)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.1"
                  value={formData.insuranceRate || ''}
                  onChange={(e) => handleInputChange('insuranceRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="0.5"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Buying Power Summary */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Your Buying Power</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Maximum Home Price</p>
                        <p className="text-3xl font-bold text-foreground">{formatCurrency(results.maxHomePrice)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Max Loan Amount</p>
                        <p className="text-lg font-semibold text-foreground">{formatCurrency(results.maxLoanAmount)}</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Monthly Payment</p>
                        <p className="text-lg font-semibold text-foreground">{formatCurrency(results.monthlyPayment)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Debt Ratios */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Debt-to-Income Analysis</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/70">Total Debt Ratio:</span>
                      <span className={`font-semibold ${results.debtToIncomeRatio <= 36 ? 'text-primary' : 'text-destructive'}`}>
                        {formatPercent(results.debtToIncomeRatio)}
                      </span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-foreground/70">
                        <strong>Target:</strong> ≤36% for conventional loans<br/>
                        <strong>Current:</strong> {formatPercent(results.debtToIncomeRatio)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Recommendations</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Conservative Home Price</h3>
                      <p className="text-2xl font-bold text-green-700">{formatCurrency(results.recommendedHomePrice)}</p>
                      <p className="text-sm text-primary mt-1">
                        This gives you a 10% buffer for unexpected expenses
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Consider a 20% down payment to avoid PMI</p>
                      <p>• Keep emergency savings separate from down payment</p>
                      <p>• Factor in maintenance costs (1-2% of home value annually)</p>
                      <p>• Account for potential rate increases if using ARM</p>
                    </div>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Buying Power</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">How It Works:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Uses standard 28/36 debt-to-income ratios</li>
                <li>Considers your credit score impact on rates</li>
                <li>Accounts for property taxes and insurance</li>
                <li>Provides conservative recommendations</li>
                <li>Calculates maximum affordable home price</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Important Factors:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Credit score affects interest rates</li>
                <li>Down payment size impacts loan terms</li>
                <li>Property taxes vary by location</li>
                <li>Insurance costs depend on coverage</li>
                <li>Consider future income stability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyingPowerCalculator;
