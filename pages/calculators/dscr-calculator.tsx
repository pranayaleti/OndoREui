"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { calculateMonthlyPI } from '@/lib/mortgage-utils';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

interface DSCRData {
  monthlyRent: number;
  annualRent: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  propertyManagement: number;
  vacancyRate: number;
  otherExpenses: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  requiredDSCR: number;
}

interface DSCRResults {
  annualRentalIncome: number;
  annualOperatingExpenses: number;
  netOperatingIncome: number;
  annualDebtService: number;
  dscr: number;
  maxLoanAmount: number;
  maxPurchasePrice: number;
}

const DSCRCalculator: React.FC = () => {
  const [formData, setFormData] = useState<DSCRData>({
    monthlyRent: 2500,
    annualRent: 0,
    propertyTax: 3600,
    insurance: 1200,
    maintenance: 3000,
    propertyManagement: 0,
    vacancyRate: 5,
    otherExpenses: 0,
    loanAmount: 225000,
    interestRate: 6.5,
    loanTerm: 30,
    requiredDSCR: 1.25
  });

  const [results, setResults] = useState<DSCRResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateDSCR = React.useCallback(() => {
    const {
      monthlyRent,
      annualRent,
      propertyTax,
      insurance,
      maintenance,
      propertyManagement,
      vacancyRate,
      otherExpenses,
      loanAmount,
      interestRate,
      loanTerm,
      requiredDSCR
    } = formData;

    // Use annual rent if provided, otherwise calculate from monthly
    const effectiveAnnualRent = annualRent > 0 ? annualRent : monthlyRent * 12;
    
    // Calculate vacancy loss
    const vacancyLoss = effectiveAnnualRent * (vacancyRate / 100);
    const annualRentalIncome = effectiveAnnualRent - vacancyLoss;

    // Calculate property management
    const managementFee = propertyManagement > 0 && propertyManagement < 1
      ? effectiveAnnualRent * propertyManagement
      : propertyManagement;

    // Calculate annual operating expenses
    const annualOperatingExpenses = propertyTax + insurance + maintenance + managementFee + otherExpenses;

    // Calculate Net Operating Income (NOI)
    const netOperatingIncome = annualRentalIncome - annualOperatingExpenses;

    // Calculate annual debt service
    const monthlyPayment = calculateMonthlyPI(loanAmount, interestRate, loanTerm);
    const annualDebtService = monthlyPayment * 12;

    // Calculate DSCR
    const dscr = annualDebtService > 0 ? netOperatingIncome / annualDebtService : 0;

    // Calculate maximum loan amount based on required DSCR
    const maxNOI = netOperatingIncome;
    const maxAnnualDebtService = maxNOI / requiredDSCR;
    
    // Reverse calculate max loan amount
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const maxMonthlyPayment = maxAnnualDebtService / 12;
    
    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      maxLoanAmount = maxMonthlyPayment * 
        (Math.pow(1 + monthlyRate, totalPayments) - 1) / 
        (monthlyRate * Math.pow(1 + monthlyRate, totalPayments));
    } else {
      maxLoanAmount = maxMonthlyPayment * totalPayments;
    }

    // Estimate max purchase price (assuming 75% LTV)
    const maxPurchasePrice = maxLoanAmount / 0.75;

    setResults({
      annualRentalIncome,
      annualOperatingExpenses,
      netOperatingIncome,
      annualDebtService,
      dscr,
      maxLoanAmount,
      maxPurchasePrice
    });
    setHasCalculated(true);
  }, [formData]);

  useEffect(() => {
    calculateDSCR();
  }, [calculateDSCR]);

  const handleInputChange = (field: keyof DSCRData, value: number) => {
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

  const getDSCRColor = (dscr: number) => {
    if (dscr >= 1.5) return 'text-green-600';
    if (dscr >= 1.25) return 'text-primary';
    if (dscr >= 1.0) return 'text-yellow-600';
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
            <h1 className="text-2xl font-bold text-foreground">Debt Service Coverage Ratio Calculator</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Property Information</h2>
            
            <div className="space-y-6">
              {/* Monthly Rent */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Monthly Rent
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.monthlyRent || ''}
                    onChange={(e) => handleInputChange('monthlyRent', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="2,500"
                  />
                </div>
              </div>

              {/* Annual Rent (optional) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Rent (optional, leave 0 to use monthly × 12)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.annualRent || ''}
                    onChange={(e) => handleInputChange('annualRent', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="0"
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
                    onFocus={(e) => e.target.select()}
                    value={formData.propertyTax || ''}
                    onChange={(e) => handleInputChange('propertyTax', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="3,600"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.insurance || ''}
                    onChange={(e) => handleInputChange('insurance', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,200"
                  />
                </div>
              </div>

              {/* Maintenance */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Maintenance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.maintenance || ''}
                    onChange={(e) => handleInputChange('maintenance', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="3,000"
                  />
                </div>
              </div>

              {/* Property Management */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Property Management (annual $ or % as decimal)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    step="0.01"
                    value={formData.propertyManagement || ''}
                    onChange={(e) => handleInputChange('propertyManagement', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Vacancy Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vacancy Rate (%)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.1"
                  value={formData.vacancyRate || ''}
                  onChange={(e) => handleInputChange('vacancyRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="5.0"
                />
              </div>

              {/* Other Expenses */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Other Annual Expenses
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.otherExpenses || ''}
                    onChange={(e) => handleInputChange('otherExpenses', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="0"
                  />
                </div>
              </div>

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
                    placeholder="225,000"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="6.5"
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

              {/* Required DSCR */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Required DSCR (for max loan calculation)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.05"
                  value={formData.requiredDSCR || ''}
                  onChange={(e) => handleInputChange('requiredDSCR', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="1.25"
                />
                <p className="text-sm text-foreground/70 mt-1">
                  Lenders typically require 1.20-1.35 DSCR for investment properties
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* DSCR */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Debt Service Coverage Ratio</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">DSCR</p>
                        <p className={`text-4xl font-bold ${getDSCRColor(results.dscr)}`}>
                          {results.dscr.toFixed(2)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          NOI ÷ Annual Debt Service
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NOI Breakdown */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Net Operating Income</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Annual Rental Income:</span>
                      <span className="font-semibold text-primary">{formatCurrency(results.annualRentalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Operating Expenses:</span>
                      <span className="font-semibold text-destructive">{formatCurrency(results.annualOperatingExpenses)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Net Operating Income (NOI):</span>
                      <span className="text-primary">{formatCurrency(results.netOperatingIncome)}</span>
                    </div>
                  </div>
                </div>

                {/* Debt Service */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Debt Service</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Annual Debt Service:</span>
                      <span className="font-semibold text-destructive">{formatCurrency(results.annualDebtService)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Monthly Payment:</span>
                      <span className="font-semibold">{formatCurrency(results.annualDebtService / 12)}</span>
                    </div>
                  </div>
                </div>

                {/* Max Loan Analysis */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Maximum Loan Analysis</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Max Loan at {formData.requiredDSCR} DSCR</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.maxLoanAmount)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Estimated Max Purchase Price</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.maxPurchasePrice)}</p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Assuming 75% LTV
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.dscr >= 1.5 ? (
                      <p className="text-primary font-medium">✓ Excellent DSCR! Property generates strong cash flow relative to debt.</p>
                    ) : results.dscr >= 1.25 ? (
                      <p className="text-primary font-medium">✓ Good DSCR. Property should qualify for most lenders.</p>
                    ) : results.dscr >= 1.0 ? (
                      <p className="text-yellow-600 font-medium">⚠ Marginal DSCR. May not meet lender requirements.</p>
                    ) : (
                      <p className="text-destructive font-medium">⚠ Low DSCR. Property does not generate enough income to cover debt service.</p>
                    )}
                    <p>• DSCR measures property's ability to cover debt payments</p>
                    <p>• Lenders typically require 1.20-1.35 DSCR minimum</p>
                    <p>• Higher DSCR = lower risk for lenders</p>
                    <p>• DSCR &lt; 1.0 means negative cash flow</p>
                    <p>• Consider increasing rent or reducing expenses to improve DSCR</p>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About DSCR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">What It Measures:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Property's ability to cover debt service</li>
                <li>Key metric for investment property lenders</li>
                <li>NOI divided by annual debt service</li>
                <li>Higher DSCR = lower default risk</li>
                <li>Critical for qualifying for investment loans</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Lender Requirements:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>1.20-1.25: Minimum for most lenders</li>
                <li>1.25-1.35: Preferred by many lenders</li>
                <li>1.35+: Excellent, best rates available</li>
                <li>&lt; 1.0: Negative cash flow, unlikely to qualify</li>
                <li>Requirements vary by lender and property type</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="dscr"
        calculatorName="DSCR"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default DSCRCalculator;

