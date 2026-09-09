"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field";

interface FiftyPercentRuleData {
  monthlyRent: number;
  annualRent: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  propertyManagement: number;
  vacancyRate: number;
  otherExpenses: number;
}

interface FiftyPercentRuleResults {
  annualRent: number;
  estimatedOperatingExpenses: number;
  actualOperatingExpenses: number;
  estimatedNOI: number;
  actualNOI: number;
  meetsRule: boolean;
  expenseRatio: number;
}

const FiftyPercentRuleCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FiftyPercentRuleData>({
    monthlyRent: 2000,
    annualRent: 0,
    propertyTax: 2400,
    insurance: 1200,
    maintenance: 2400,
    propertyManagement: 0,
    vacancyRate: 5,
    otherExpenses: 0
  });

  const [results, setResults] = useState<FiftyPercentRuleResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateFiftyPercentRule = useCallback(() => {
    const {
      monthlyRent,
      annualRent,
      propertyTax,
      insurance,
      maintenance,
      propertyManagement,
      vacancyRate,
      otherExpenses
    } = formData;

    // Use annual rent if provided, otherwise calculate from monthly
    const effectiveAnnualRent = annualRent > 0 ? annualRent : monthlyRent * 12;

    // 50% Rule: Operating expenses typically equal 50% of gross rent
    const estimatedOperatingExpenses = effectiveAnnualRent * 0.5;
    const estimatedNOI = effectiveAnnualRent - estimatedOperatingExpenses;

    // Calculate actual operating expenses
    const vacancyLoss = effectiveAnnualRent * (vacancyRate / 100);
    const managementFee = propertyManagement > 0 && propertyManagement < 1
      ? effectiveAnnualRent * propertyManagement
      : propertyManagement;
    
    const actualOperatingExpenses = propertyTax + insurance + maintenance + managementFee + otherExpenses + vacancyLoss;
    const actualNOI = effectiveAnnualRent - actualOperatingExpenses;

    // Check if actual expenses are close to 50% rule
    const expenseRatio = effectiveAnnualRent > 0 ? (actualOperatingExpenses / effectiveAnnualRent) * 100 : 0;
    const meetsRule = Math.abs(expenseRatio - 50) <= 10; // Within 10% of 50%

    setResults({
      annualRent: effectiveAnnualRent,
      estimatedOperatingExpenses,
      actualOperatingExpenses,
      estimatedNOI,
      actualNOI,
      meetsRule,
      expenseRatio
    });
    setHasCalculated(true);
  }, [formData]);

  useEffect(() => {
    calculateFiftyPercentRule();
  }, [calculateFiftyPercentRule]);

  const handleInputChange = (field: keyof FiftyPercentRuleData, value: number) => {
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

  const getExpenseRatioColor = (ratio: number) => {
    if (ratio <= 40) return 'text-green-600';
    if (ratio <= 50) return 'text-primary';
    if (ratio <= 60) return 'text-yellow-600';
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
            <h1 className="text-2xl font-bold text-foreground">50% Rule Calculator</h1>
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
              <NumberField
                id="monthlyRent"
                label="Monthly Rent"
                kind="currency"
                value={formData.monthlyRent}
                onChange={(next) => handleInputChange('monthlyRent', next)}
              />

              {/* Annual Rent (optional) */}
              <NumberField
                id="annualRent"
                label="Annual Rent (optional, leave 0 to use monthly × 12)"
                kind="currency"
                value={formData.annualRent}
                onChange={(next) => handleInputChange('annualRent', next)}
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
                label="Property Management (annual $ or % as decimal)"
                kind="percent"
                step={0.01}
                value={formData.propertyManagement}
                onChange={(next) => handleInputChange('propertyManagement', next)}
              />

              {/* Vacancy Rate */}
              <NumberField
                id="vacancyRate"
                label="Vacancy Rate"
                kind="rate"
                value={formData.vacancyRate}
                onChange={(next) => handleInputChange('vacancyRate', next)}
              />

              {/* Other Expenses */}
              <NumberField
                id="otherExpenses"
                label="Other Annual Expenses"
                kind="currency"
                value={formData.otherExpenses}
                onChange={(next) => handleInputChange('otherExpenses', next)}
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* 50% Rule Result */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">50% Rule Analysis</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Actual Expense Ratio</p>
                        <p className={`text-4xl font-bold ${getExpenseRatioColor(results.expenseRatio)}`}>
                          {formatPercent(results.expenseRatio)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Operating Expenses ÷ Gross Rent
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">50% Rule Estimate</p>
                        <p className="text-lg font-semibold text-foreground">{formatCurrency(results.estimatedOperatingExpenses)}</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Actual Expenses</p>
                        <p className="text-lg font-semibold text-foreground">{formatCurrency(results.actualOperatingExpenses)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NOI Comparison */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Net Operating Income</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Annual Gross Rent:</span>
                      <span className="font-semibold text-primary">{formatCurrency(results.annualRent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Estimated NOI (50% rule):</span>
                      <span className="font-semibold text-primary">{formatCurrency(results.estimatedNOI)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Actual NOI:</span>
                      <span className="font-semibold text-primary">{formatCurrency(results.actualNOI)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Difference:</span>
                      <span className={results.actualNOI >= results.estimatedNOI ? 'text-primary' : 'text-destructive-emphasis'}>
                        {formatCurrency(results.actualNOI - results.estimatedNOI)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.expenseRatio <= 40 ? (
                      <p className="text-primary font-medium">✓ Excellent! Expenses are lower than the 50% rule estimate.</p>
                    ) : results.expenseRatio <= 50 ? (
                      <p className="text-primary font-medium">✓ Good! Expenses align with the 50% rule estimate.</p>
                    ) : results.expenseRatio <= 60 ? (
                      <p className="text-yellow-600 font-medium">⚠ Expenses are higher than the 50% rule estimate. Review your costs.</p>
                    ) : (
                      <p className="text-destructive-emphasis font-medium">⚠ High expenses! Significantly above the 50% rule estimate.</p>
                    )}
                    <p>• The 50% rule estimates that operating expenses equal 50% of gross rent</p>
                    <p>• Remaining 50% covers debt service and provides cash flow</p>
                    <p>• Rule assumes property taxes, insurance, maintenance, repairs, vacancy, and management</p>
                    <p>• Lower expense ratios mean more cash flow potential</p>
                    <p>• Higher expense ratios may indicate property management issues</p>
                    <p>• Use this as a guideline, not a strict rule</p>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About the 50% Rule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">What It Is:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Rule of thumb for estimating operating expenses</li>
                <li>Operating expenses typically equal 50% of gross rent</li>
                <li>Remaining 50% covers debt service and cash flow</li>
                <li>Quick way to estimate NOI without detailed analysis</li>
                <li>Useful for initial property screening</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">What's Included:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Property taxes and insurance</li>
                <li>Maintenance and repairs</li>
                <li>Property management fees</li>
                <li>Vacancy and collection losses</li>
                <li>Other operating expenses</li>
                <li>Does NOT include debt service</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="fifty-percent-rule"
        calculatorName="50% Rule"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default FiftyPercentRuleCalculator;

