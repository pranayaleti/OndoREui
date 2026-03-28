"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { calculateMonthlyPI } from '@/lib/mortgage-utils';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

interface ROIData {
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
  appreciationRate: number;
  holdingPeriod: number;
  salePrice: number;
}

interface ROIResults {
  totalCashInvested: number;
  annualCashFlow: number;
  totalCashFlow: number;
  propertyValueAtSale: number;
  loanBalanceAtSale: number;
  equityAtSale: number;
  totalReturn: number;
  annualROI: number;
  totalROI: number;
  cashOnCashReturn: number;
}

const ROICalculator: React.FC = () => {
  const [formData, setFormData] = useState<ROIData>({
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
    repairs: 5000,
    appreciationRate: 3,
    holdingPeriod: 5,
    salePrice: 0
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const calculateROI = useCallback(() => {
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
      repairs,
      appreciationRate,
      holdingPeriod,
      salePrice
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

    // Calculate monthly mortgage payment
    const monthlyPayment = calculateMonthlyPI(loanAmount, interestRate, loanTerm);
    const annualDebtService = monthlyPayment * 12;

    // Calculate annual cash flow
    const annualCashFlow = netOperatingIncome - annualDebtService;
    const totalCashFlow = annualCashFlow * holdingPeriod;

    // Calculate total cash invested
    const totalCashInvested = downPayment + closingCosts + repairs;

    // Calculate property value at sale (with appreciation or use provided sale price)
    const propertyValueAtSale = salePrice > 0 
      ? salePrice 
      : purchasePrice * Math.pow(1 + appreciationRate / 100, holdingPeriod);

    // Calculate loan balance at sale
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const paymentsMade = holdingPeriod * 12;
    let remainingBalance = loanAmount;
    
    for (let month = 0; month < paymentsMade && month < totalPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);
    }
    
    const loanBalanceAtSale = remainingBalance;

    // Calculate equity at sale
    const equityAtSale = propertyValueAtSale - loanBalanceAtSale;

    // Total return = cash flow + equity at sale - total cash invested
    const totalReturn = totalCashFlow + equityAtSale - totalCashInvested;

    // Calculate ROI
    const totalROI = totalCashInvested > 0 ? (totalReturn / totalCashInvested) * 100 : 0;
    const annualROI = holdingPeriod > 0 ? totalROI / holdingPeriod : 0;

    // Calculate Cash-on-Cash Return
    const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

    setResults({
      totalCashInvested,
      annualCashFlow,
      totalCashFlow,
      propertyValueAtSale,
      loanBalanceAtSale,
      equityAtSale,
      totalReturn,
      annualROI,
      totalROI,
      cashOnCashReturn
    });
    setHasCalculated(true);
  }, [formData]);

  useEffect(() => {
    calculateROI();
  }, [calculateROI]);

  const handleInputChange = (field: keyof ROIData, value: number) => {
    const newData = { ...formData, [field]: value };
    
    // Auto-calculate loan amount if purchase price or down payment changes
    if (field === 'purchasePrice' || field === 'downPayment') {
      newData.loanAmount = Math.max(0, newData.purchasePrice - newData.downPayment);
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

  const getROIColor = (roi: number) => {
    if (roi >= 15) return 'text-green-600';
    if (roi >= 10) return 'text-primary';
    if (roi >= 5) return 'text-yellow-600';
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
            <h1 className="text-2xl font-bold text-foreground">ROI Calculator</h1>
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

              {/* Holding Period */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Holding Period (years)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  value={formData.holdingPeriod || ''}
                  onChange={(e) => handleInputChange('holdingPeriod', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="5"
                />
              </div>

              {/* Appreciation Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Appreciation Rate (%)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.1"
                  value={formData.appreciationRate || ''}
                  onChange={(e) => handleInputChange('appreciationRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="3.0"
                />
              </div>

              {/* Sale Price (optional) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sale Price (optional, leave 0 to use appreciation)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.salePrice || ''}
                    onChange={(e) => handleInputChange('salePrice', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* ROI */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Return on Investment</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Total ROI</p>
                        <p className={`text-4xl font-bold ${getROIColor(results.totalROI)}`}>
                          {formatPercent(results.totalROI)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Over {formData.holdingPeriod} years
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Annual ROI</p>
                        <p className={`text-lg font-semibold ${getROIColor(results.annualROI)}`}>
                          {formatPercent(results.annualROI)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Cash-on-Cash</p>
                        <p className={`text-lg font-semibold ${getROIColor(results.cashOnCashReturn)}`}>
                          {formatPercent(results.cashOnCashReturn)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return Breakdown */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Return Breakdown</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total Cash Invested:</span>
                      <span className="font-semibold">{formatCurrency(results.totalCashInvested)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total Cash Flow ({formData.holdingPeriod} years):</span>
                      <span className="font-semibold text-primary">{formatCurrency(results.totalCashFlow)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Equity at Sale:</span>
                      <span className="font-semibold text-primary">{formatCurrency(results.equityAtSale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Equity Gain:</span>
                      <span className="font-semibold text-primary">{formatCurrency(results.equityAtSale - formData.downPayment)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Return:</span>
                      <span className={results.totalReturn >= 0 ? 'text-primary' : 'text-destructive'}>
                        {formatCurrency(results.totalReturn)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sale Analysis */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Sale Analysis</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Property Value at Sale:</span>
                      <span className="font-semibold">{formatCurrency(results.propertyValueAtSale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Loan Balance at Sale:</span>
                      <span className="font-semibold text-destructive">{formatCurrency(results.loanBalanceAtSale)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Equity at Sale:</span>
                      <span className="text-primary">{formatCurrency(results.equityAtSale)}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.totalROI >= 15 ? (
                      <p className="text-primary font-medium">✓ Excellent ROI! This investment shows strong return potential.</p>
                    ) : results.totalROI >= 10 ? (
                      <p className="text-primary font-medium">✓ Good ROI. This investment shows decent return potential.</p>
                    ) : results.totalROI >= 5 ? (
                      <p className="text-yellow-600 font-medium">⚠ Moderate ROI. Consider if the risk is acceptable.</p>
                    ) : (
                      <p className="text-destructive font-medium">⚠ Low ROI. This investment may not meet your return goals.</p>
                    )}
                    <p>• ROI includes both cash flow and appreciation</p>
                    <p>• Longer holding periods typically improve ROI through appreciation</p>
                    <p>• Consider tax benefits and leverage effects</p>
                    <p>• Compare ROI to alternative investments</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About ROI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">What It Measures:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Total return including cash flow and appreciation</li>
                <li>Return on your total cash investment</li>
                <li>Accounts for equity build-up through loan paydown</li>
                <li>Considers property value appreciation</li>
                <li>Comprehensive investment performance metric</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Key Factors:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Holding period significantly impacts ROI</li>
                <li>Appreciation rate affects long-term returns</li>
                <li>Cash flow provides ongoing returns</li>
                <li>Leverage amplifies returns (and risks)</li>
                <li>Compare to stock market and other investments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="roi"
        calculatorName="ROI"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default ROICalculator;

