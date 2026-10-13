"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field";
import { calculateROI, type ROIInput, type ROIResults } from "@/lib/roi";

type ROIData = ROIInput;

const ROICalculator: React.FC = () => {
  const [formData, setFormData] = useState<ROIData>({
    purchasePrice: 300000,
    downPayment: 75000,
    loanAmount: 225000,
    interestRate: 6.5,
    loanTerm: 30,
    monthlyRent: 2500,
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
    salePrice: 0,
    sellingCostPct: 6
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    setResults(calculateROI(formData));
    setHasCalculated(true);
  }, [formData]);

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
    if (roi >= 15) return 'text-success-emphasis';
    if (roi >= 10) return 'text-primary';
    if (roi >= 5) return 'text-warning-emphasis';
    return 'text-destructive-emphasis';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to all calculators</span>
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
              <NumberField
                id="purchasePrice"
                label="Purchase Price"
                kind="currency"
                value={formData.purchasePrice}
                onChange={(next) => handleInputChange('purchasePrice', next)}
              />

              {/* Down Payment */}
              <NumberField
                id="downPayment"
                label="Down Payment"
                kind="currency"
                value={formData.downPayment}
                onChange={(next) => handleInputChange('downPayment', next)}
              />

              {/* Interest Rate */}
              <NumberField
                id="interestRate"
                label="Interest Rate"
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
                  className="w-full px-4 py-3 border border-border bg-card text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>

              {/* Monthly Rent */}
              <NumberField
                id="monthlyRent"
                label="Monthly Rent"
                kind="currency"
                value={formData.monthlyRent}
                onChange={(next) => handleInputChange('monthlyRent', next)}
              />

              {/* Property Tax */}
              <NumberField
                id="propertyTax"
                label="Annual Property Tax"
                kind="currency"
                value={formData.propertyTax}
                onChange={(next) => handleInputChange('propertyTax', next)}
              />

              {/* Insurance */}
              <NumberField
                id="insurance"
                label="Annual Insurance"
                kind="currency"
                value={formData.insurance}
                onChange={(next) => handleInputChange('insurance', next)}
              />

              {/* Maintenance */}
              <NumberField
                id="maintenance"
                label="Annual Maintenance"
                kind="currency"
                value={formData.maintenance}
                onChange={(next) => handleInputChange('maintenance', next)}
              />

              {/* Property Management */}
              <NumberField
                id="propertyManagement"
                label="Property Management (% of gross rent)"
                kind="percent"
                min={0}
                max={100}
                value={formData.propertyManagement}
                onChange={(next) => handleInputChange('propertyManagement', next)}
              />

              {/* Other Expenses */}
              <NumberField
                id="otherExpenses"
                label="Other Annual Expenses"
                kind="currency"
                value={formData.otherExpenses}
                onChange={(next) => handleInputChange('otherExpenses', next)}
              />

              {/* Vacancy Rate */}
              <NumberField
                id="vacancyRate"
                label="Vacancy Rate"
                kind="rate"
                value={formData.vacancyRate}
                onChange={(next) => handleInputChange('vacancyRate', next)}
              />

              {/* Closing Costs */}
              <NumberField
                id="closingCosts"
                label="Closing Costs"
                kind="currency"
                value={formData.closingCosts}
                onChange={(next) => handleInputChange('closingCosts', next)}
              />

              {/* Repairs */}
              <NumberField
                id="repairs"
                label="Initial Repairs/Rehab"
                kind="currency"
                value={formData.repairs}
                onChange={(next) => handleInputChange('repairs', next)}
              />

              {/* Holding Period */}
              <NumberField
                id="holdingPeriod"
                label="Holding Period (years)"
                kind="years"
                min={1}
                max={50}
                value={formData.holdingPeriod}
                onChange={(next) => handleInputChange('holdingPeriod', next)}
              />

              {/* Appreciation Rate */}
              <NumberField
                id="appreciationRate"
                label="Annual Appreciation Rate"
                kind="rate"
                value={formData.appreciationRate}
                onChange={(next) => handleInputChange('appreciationRate', next)}
              />

              {/* Sale Price (optional) */}
              <NumberField
                id="salePrice"
                label="Sale Price (optional, leave 0 to use appreciation)"
                kind="currency"
                value={formData.salePrice}
                onChange={(next) => handleInputChange('salePrice', next)}
              />

              {/* Selling Costs */}
              <NumberField
                id="sellingCostPct"
                label="Selling Costs"
                kind="rate"
                step={0.1}
                min={0}
                max={20}
                hint="Agent and closing costs when you sell"
                value={formData.sellingCostPct}
                onChange={(next) => handleInputChange('sellingCostPct', next)}
              />
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
                        <p className={`text-4xl font-bold ${getROIColor(results.annualizedROI)}`}>
                          {formatPercent(results.totalROI)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Over {formData.holdingPeriod} year{formData.holdingPeriod === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Annualized ROI</p>
                        <p className={`text-lg font-semibold ${getROIColor(results.annualizedROI)}`}>
                          {formatPercent(results.annualizedROI)}
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
                      <span className="text-foreground/70">Total Cash Flow ({formData.holdingPeriod} year{formData.holdingPeriod === 1 ? '' : 's'}):</span>
                      <span className={`font-semibold ${results.totalCashFlow >= 0 ? 'text-primary' : 'text-destructive-emphasis'}`}>{results.totalCashFlow >= 0 ? '+' : '−'}{formatCurrency(Math.abs(results.totalCashFlow))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Net Proceeds at Sale:</span>
                      <span className="font-semibold text-primary">+{formatCurrency(results.netSaleProceeds)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Less Cash Invested:</span>
                      <span className="font-semibold text-destructive-emphasis">−{formatCurrency(results.totalCashInvested)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Return:</span>
                      <span className={results.totalReturn >= 0 ? 'text-primary' : 'text-destructive-emphasis'}>
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
                      <span className="text-foreground/70">Selling Costs ({formData.sellingCostPct}%):</span>
                      <span className="font-semibold text-destructive-emphasis">−{formatCurrency(results.sellingCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Loan Payoff:</span>
                      <span className="font-semibold text-destructive-emphasis">−{formatCurrency(results.loanBalanceAtSale)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Net Proceeds at Sale:</span>
                      <span className={results.netSaleProceeds >= 0 ? 'text-primary' : 'text-destructive-emphasis'}>{formatCurrency(results.netSaleProceeds)}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.annualizedROI >= 15 ? (
                      <p className="text-primary font-medium">✓ Excellent ROI! This investment shows strong return potential.</p>
                    ) : results.annualizedROI >= 10 ? (
                      <p className="text-primary font-medium">✓ Good ROI. This investment shows decent return potential.</p>
                    ) : results.annualizedROI >= 5 ? (
                      <p className="text-warning-emphasis font-medium">⚠ Moderate ROI. Consider if the risk is acceptable.</p>
                    ) : (
                      <p className="text-destructive-emphasis font-medium">⚠ Low ROI. This investment may not meet your return goals.</p>
                    )}
                    <p>• Rating is based on the annualized ROI ({formatPercent(results.annualizedROI)} per year), so holds of different lengths compare fairly</p>
                    <p>• ROI includes both cash flow and appreciation, net of selling costs</p>
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

