"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoanProgram, DEFAULT_MORTGAGE_RATE, describeProgramDti, dtiTone } from '@/lib/mortgage-utils';
import { estimateAffordability } from '@/lib/affordability';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field";

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
    interestRate: DEFAULT_MORTGAGE_RATE,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    insuranceRate: 0.5,
    creditScore: 750,
    program: 'conventional'
  });

  const [results, setResults] = useState<BuyingPowerResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateBuyingPower = React.useCallback(() => {
    // Same model as /calculators/affordability, so the two pages cannot disagree.
    const estimate = estimateAffordability({
      annualIncome: formData.annualIncome,
      monthlyDebts: formData.monthlyDebts,
      downPayment: formData.downPayment,
      interestRate: formData.interestRate,
      termYears: formData.loanTerm,
      propertyTaxRatePercent: formData.propertyTaxRate,
      insuranceRatePercent: formData.insuranceRate,
      program: formData.program,
      creditScore: formData.creditScore,
    });

    setResults({
      maxHomePrice: estimate.maxHomePrice,
      maxLoanAmount: estimate.maxLoanAmount,
      monthlyPayment: estimate.monthlyPayment.total,
      debtToIncomeRatio: estimate.backEndRatio,
      recommendedHomePrice: estimate.recommendedHomePrice,
    });
    setHasCalculated(true);
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

  const dtiLimits = describeProgramDti(formData.program);

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-primary';
    if (score >= 700) return 'text-primary';
    if (score >= 650) return 'text-warning-emphasis';
    return 'text-destructive-emphasis';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to all calculators</span>
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
              <NumberField
                id="annualIncome"
                label="Annual Income"
                kind="currency"
                value={formData.annualIncome}
                onChange={(next) => handleInputChange('annualIncome', next)}
              />

              {/* Monthly Debts */}
              <NumberField
                id="monthlyDebts"
                label="Monthly Debt Payments"
                kind="currency"
                value={formData.monthlyDebts}
                onChange={(next) => handleInputChange('monthlyDebts', next)}
              />

              {/* Down Payment */}
              <NumberField
                id="downPayment"
                label="Available Down Payment"
                kind="currency"
                value={formData.downPayment}
                onChange={(next) => handleInputChange('downPayment', next)}
              />

              {/* Credit Score */}
              <NumberField
                id="creditScore"
                label="Credit Score"
                kind="count"
                min={300}
                max={850}
                value={formData.creditScore}
                onChange={(next) => handleInputChange('creditScore', next)}
              />

              {/* Loan Program */}
              <div>
                <label htmlFor="loanProgram" className="block text-sm font-medium text-foreground mb-2">Loan Program</label>
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

              {/* Interest Rate */}
              <NumberField
                id="interestRate"
                label="Expected Interest Rate"
                kind="rate"
                value={formData.interestRate}
                onChange={(next) => handleInputChange('interestRate', next)}
              />

              {/* Loan Term */}
              <div>
                <label htmlFor="loanTermYears" className="block text-sm font-medium text-foreground mb-2">
                  Loan Term (years)
                </label>
                <select
                  id="loanTermYears"
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
              <NumberField
                id="propertyTaxRate"
                label="Property Tax Rate (% of home value)"
                kind="rate"
                value={formData.propertyTaxRate}
                onChange={(next) => handleInputChange('propertyTaxRate', next)}
              />

              {/* Insurance Rate */}
              <NumberField
                id="insuranceRate"
                label="Homeowners Insurance Rate (% of home value)"
                kind="rate"
                value={formData.insuranceRate}
                onChange={(next) => handleInputChange('insuranceRate', next)}
              />
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
                      <span className={`font-semibold ${dtiTone(results.debtToIncomeRatio, dtiLimits.backPercent) === 'good' ? 'text-primary' : 'text-destructive-emphasis'}`}>
                        {formatPercent(results.debtToIncomeRatio)}
                      </span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-foreground/70">
                        <strong>Target:</strong> {dtiLimits.backTarget} for {dtiLimits.programLabel} loans<br/>
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
                      <h3 className="font-semibold text-success-emphasis mb-2">Conservative Home Price</h3>
                      <p className="text-2xl font-bold text-success-emphasis">{formatCurrency(results.recommendedHomePrice)}</p>
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
                <li>Uses the debt-to-income limits for the loan program you select</li>
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
      <LeadCaptureModal
        calculatorSlug="buying-power"
        calculatorName="Buying Power"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default BuyingPowerCalculator;
