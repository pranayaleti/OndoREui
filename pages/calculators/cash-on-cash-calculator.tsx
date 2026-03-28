"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { calculateMonthlyPI } from '@/lib/mortgage-utils';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

interface CashOnCashData {
  purchasePrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  annualRent: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  propertyManagement: number;
  vacancyRate: number;
  otherExpenses: number;
  closingCosts: number;
  repairs: number;
}

interface CashOnCashResults {
  annualRentalIncome: number;
  annualOperatingExpenses: number;
  netOperatingIncome: number;
  annualDebtService: number;
  annualCashFlow: number;
  monthlyCashFlow: number;
  totalCashInvested: number;
  cashOnCashReturn: number;
  capRate: number;
  grossRentMultiplier: number;
}

const CashOnCashCalculator: React.FC = () => {
  const [formData, setFormData] = useState<CashOnCashData>({
    purchasePrice: 300000,
    downPayment: 75000,
    loanAmount: 225000,
    interestRate: 6.5,
    loanTerm: 30,
    monthlyRent: 2500,
    annualRent: 0,
    propertyTax: 3600,
    insurance: 1200,
    maintenance: 3000,
    propertyManagement: 0,
    vacancyRate: 5,
    otherExpenses: 0,
    closingCosts: 9000,
    repairs: 5000
  });

  const [results, setResults] = useState<CashOnCashResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateCashOnCash = React.useCallback(() => {
    const {
      purchasePrice,
      downPayment,
      loanAmount,
      interestRate,
      loanTerm,
      monthlyRent,
      annualRent,
      propertyTax,
      insurance,
      maintenance,
      propertyManagement,
      vacancyRate,
      otherExpenses,
      closingCosts,
      repairs
    } = formData;

    // Use annual rent if provided, otherwise calculate from monthly
    const effectiveAnnualRent = annualRent > 0 ? annualRent : monthlyRent * 12;

    // Calculate vacancy loss
    const vacancyLoss = effectiveAnnualRent * (vacancyRate / 100);
    const annualRentalIncome = effectiveAnnualRent - vacancyLoss;

    // Calculate property management (if percentage, calculate from gross rent)
    const managementFee = propertyManagement > 0 && propertyManagement < 1
      ? effectiveAnnualRent * propertyManagement
      : propertyManagement;

    // Calculate annual operating expenses
    const annualOperatingExpenses = propertyTax + insurance + maintenance + managementFee + otherExpenses;

    // Calculate Net Operating Income (NOI)
    const netOperatingIncome = annualRentalIncome - annualOperatingExpenses;

    // Calculate monthly mortgage payment
    const monthlyPayment = calculateMonthlyPI(loanAmount, interestRate, loanTerm);
    const annualDebtService = monthlyPayment * 12;

    // Calculate annual cash flow
    const annualCashFlow = netOperatingIncome - annualDebtService;
    const monthlyCashFlow = annualCashFlow / 12;

    // Calculate total cash invested
    const totalCashInvested = downPayment + closingCosts + repairs;

    // Calculate Cash-on-Cash Return
    const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

    // Calculate Cap Rate (NOI / Purchase Price)
    const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;

    // Calculate Gross Rent Multiplier
    const grossRentMultiplier = effectiveAnnualRent > 0 ? purchasePrice / effectiveAnnualRent : 0;

    setResults({
      annualRentalIncome,
      annualOperatingExpenses,
      netOperatingIncome,
      annualDebtService,
      annualCashFlow,
      monthlyCashFlow,
      totalCashInvested,
      cashOnCashReturn,
      capRate,
      grossRentMultiplier
    });
    setHasCalculated(true);
  }, [formData]);

  useEffect(() => {
    calculateCashOnCash();
  }, [calculateCashOnCash]);

  const handleInputChange = (field: keyof CashOnCashData, value: number) => {
    const newData = { ...formData, [field]: value };

    // Auto-calculate loan amount if purchase price or down payment changes
    if (field === 'purchasePrice' || field === 'downPayment') {
      newData.loanAmount = Math.max(0, newData.purchasePrice - newData.downPayment);
    }

    // Auto-calculate annual rent from monthly if monthly changes
    if (field === 'monthlyRent' && newData.annualRent === 0) {
      newData.annualRent = 0; // Keep 0 to indicate using monthly
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
    return `${value.toFixed(2)}%`;
  };

  const getReturnColor = (returnPercent: number) => {
    if (returnPercent >= 10) return 'text-green-600';
    if (returnPercent >= 6) return 'text-primary';
    if (returnPercent >= 3) return 'text-yellow-600';
    return 'text-destructive';
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
              <h1 className="text-2xl font-bold text-foreground">Cash-on-Cash Return Calculator</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Property Information</h2>

            <div className="space-y-6">
              {/* Purchase Price */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.purchasePrice || ''}
                    onChange={(e) => handleInputChange('purchasePrice', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
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
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="75,000"
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
                  Property Management (annual $ or % as decimal, e.g., 0.10 for 10%)
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

              {/* Closing Costs */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Closing Costs
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.closingCosts || ''}
                    onChange={(e) => handleInputChange('closingCosts', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="9,000"
                  />
                </div>
              </div>

              {/* Repairs */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Initial Repairs/Rehab
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.repairs || ''}
                    onChange={(e) => handleInputChange('repairs', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="5,000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Cash-on-Cash Return */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Cash-on-Cash Return</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Cash-on-Cash Return</p>
                        <p className={`text-4xl font-bold ${getReturnColor(results.cashOnCashReturn)}`}>
                          {formatPercent(results.cashOnCashReturn)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Annual cash flow ÷ Total cash invested
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Annual Cash Flow</p>
                        <p className={`text-lg font-semibold ${results.annualCashFlow >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {formatCurrency(results.annualCashFlow)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Monthly Cash Flow</p>
                        <p className={`text-lg font-semibold ${results.monthlyCashFlow >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {formatCurrency(results.monthlyCashFlow)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Income & Expenses */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Income & Expenses</h2>
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
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Net Operating Income (NOI):</span>
                      <span className="font-semibold text-primary">{formatCurrency(results.netOperatingIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Annual Debt Service:</span>
                      <span className="font-semibold text-destructive">{formatCurrency(results.annualDebtService)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Annual Cash Flow:</span>
                      <span className={results.annualCashFlow >= 0 ? 'text-primary' : 'text-destructive'}>
                        {formatCurrency(results.annualCashFlow)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Investment Summary */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Investment Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total Cash Invested:</span>
                      <span className="font-semibold">{formatCurrency(results.totalCashInvested)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">• Down Payment:</span>
                      <span className="text-sm">{formatCurrency(formData.downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">• Closing Costs:</span>
                      <span className="text-sm">{formatCurrency(formData.closingCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">• Repairs/Rehab:</span>
                      <span className="text-sm">{formatCurrency(formData.repairs)}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Additional Metrics</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Cap Rate:</span>
                      <span className="font-semibold text-primary">{formatPercent(results.capRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Gross Rent Multiplier:</span>
                      <span className="font-semibold">{results.grossRentMultiplier.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.cashOnCashReturn >= 10 ? (
                      <p className="text-primary font-medium">✓ Excellent return! This property shows strong cash flow potential.</p>
                    ) : results.cashOnCashReturn >= 6 ? (
                      <p className="text-primary font-medium">✓ Good return. This property shows decent cash flow potential.</p>
                    ) : results.cashOnCashReturn >= 3 ? (
                      <p className="text-yellow-600 font-medium">⚠ Moderate return. Consider if appreciation potential justifies the lower cash flow.</p>
                    ) : (
                      <p className="text-destructive font-medium">⚠ Low or negative return. This property may not be a good cash flow investment.</p>
                    )}
                    <p>• Cash-on-Cash Return measures the annual return on your actual cash investment</p>
                    <p>• A good CoC return is typically 8-12% or higher for rental properties</p>
                    <p>• Consider both cash flow and appreciation potential</p>
                    <p>• Factor in tax benefits and long-term appreciation</p>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Cash-on-Cash Return</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">What It Measures:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Annual return on your actual cash investment</li>
                <li>Pre-tax cash flow from the property</li>
                <li>Excludes appreciation and tax benefits</li>
                <li>Key metric for cash flow investors</li>
                <li>Helps compare different investment opportunities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Important Factors:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Higher down payment = lower CoC (but more equity)</li>
                <li>Lower interest rates improve cash flow</li>
                <li>Vacancy rates significantly impact returns</li>
                <li>Property management fees reduce cash flow</li>
                <li>Consider all operating expenses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="cash-on-cash"
        calculatorName="Cash on Cash"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default CashOnCashCalculator;
