"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field";

interface OnePercentRuleData {
  purchasePrice: number;
  monthlyRent: number;
  afterRepairValue: number;
}

interface OnePercentRuleResults {
  onePercentRule: number;
  requiredMonthlyRent: number;
  actualPercent: number;
  meetsRule: boolean;
  meetsRuleARV: boolean;
  requiredRentARV: number;
}

const OnePercentRuleCalculator: React.FC = () => {
  const [formData, setFormData] = useState<OnePercentRuleData>({
    purchasePrice: 100000,
    monthlyRent: 1000,
    afterRepairValue: 0
  });

  const [results, setResults] = useState<OnePercentRuleResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const calculateOnePercentRule = useCallback(() => {
    const { purchasePrice, monthlyRent, afterRepairValue } = formData;

    // 1% Rule: Monthly rent should be at least 1% of purchase price
    const onePercentRule = purchasePrice * 0.01;
    const requiredMonthlyRent = onePercentRule;
    const actualPercent = purchasePrice > 0 ? (monthlyRent / purchasePrice) * 100 : 0;
    const meetsRule = monthlyRent >= onePercentRule;

    // Also check against ARV if provided
    const requiredRentARV = afterRepairValue > 0 ? afterRepairValue * 0.01 : 0;
    const meetsRuleARV = afterRepairValue > 0 ? monthlyRent >= requiredRentARV : false;

    setResults({
      onePercentRule,
      requiredMonthlyRent,
      actualPercent,
      meetsRule,
      meetsRuleARV,
      requiredRentARV
    });
    setHasCalculated(true);
  }, [formData]);

  useEffect(() => {
    calculateOnePercentRule();
  }, [calculateOnePercentRule]);

  const handleInputChange = (field: keyof OnePercentRuleData, value: number) => {
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
    return `${value.toFixed(2)}%`;
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
            <h1 className="text-2xl font-bold text-foreground">1% and 50% Rule Calculator</h1>
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

              {/* Monthly Rent */}
              <NumberField
                id="monthlyRent"
                label="Monthly Rent"
                kind="currency"
                value={formData.monthlyRent}
                onChange={(next) => handleInputChange('monthlyRent', next)}
              />

              {/* After Repair Value (optional) */}
              <NumberField
                id="afterRepairValue"
                label="After Repair Value (ARV) - optional"
                kind="currency"
                value={formData.afterRepairValue}
                onChange={(next) => handleInputChange('afterRepairValue', next)}
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* 1% Rule Result */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">1% Rule Analysis</h2>
                  <div className="space-y-4">
                    <div className={`bg-muted p-4 rounded-lg ${results.meetsRule ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}>
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">
                          {results.meetsRule ? '✓ Meets 1% Rule' : '✗ Does Not Meet 1% Rule'}
                        </p>
                        <p className={`text-3xl font-bold ${results.meetsRule ? 'text-success-emphasis' : 'text-destructive-emphasis'}`}>
                          {formatPercent(results.actualPercent)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Actual rent as % of purchase price
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Required Rent</p>
                        <p className="text-lg font-semibold text-foreground">{formatCurrency(results.requiredMonthlyRent)}</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Actual Rent</p>
                        <p className="text-lg font-semibold text-foreground">{formatCurrency(formData.monthlyRent)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ARV Analysis (if provided) */}
                {formData.afterRepairValue > 0 && (
                  <div className="bg-card rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">ARV Analysis</h2>
                    <div className="space-y-4">
                      <div className={`bg-muted p-4 rounded-lg ${results.meetsRuleARV ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}>
                        <div className="text-center">
                          <p className="text-sm text-primary mb-1">
                            {results.meetsRuleARV ? '✓ Meets 1% Rule (ARV)' : '✗ Does Not Meet 1% Rule (ARV)'}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {formatCurrency(results.requiredRentARV)}
                          </p>
                          <p className="text-sm text-foreground/70 mt-1">
                            Required rent based on ARV
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 50% rule quick check */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">50% Rule Estimate</h2>
                  <p className="text-sm text-foreground/70 mb-4">
                    The 50% rule assumes operating expenses (taxes, insurance, repairs, vacancy, management) eat about half of rent, before the mortgage.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-foreground/70 mb-1">Estimated monthly expenses</p>
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(formData.monthlyRent * 0.5)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-sm text-foreground/70 mb-1">Estimated monthly NOI</p>
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(formData.monthlyRent * 0.5)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/60 mt-3">
                    Annual: {formatCurrency(formData.monthlyRent * 12 * 0.5)} in expenses, {formatCurrency(formData.monthlyRent * 12 * 0.5)} in NOI before debt service.
                  </p>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.meetsRule ? (
                      <p className="text-primary font-medium">Meets the 1% rule. A good starting point.</p>
                    ) : (
                      <p className="text-warning-emphasis font-medium">Does not meet the 1% rule. Look at the rest of the numbers before you decide.</p>
                    )}
                    <p>• Both rules are quick screens, not a decision. They ignore financing, appreciation and your actual expenses.</p>
                    <p>• Lower-priced markets clear the 1% rule more easily; many Wasatch Front homes do not and can still work.</p>
                    <p>• Run cap rate, cash-on-cash and DSCR before you make an offer.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About the two rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">1% rule</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Monthly rent should be at least 1% of the purchase price</li>
                <li>A fast way to sort a list of listings</li>
                <li>Ignores expenses, financing and appreciation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">50% rule</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Operating expenses run about half of gross rent over time</li>
                <li>What is left is NOI, before the mortgage</li>
                <li>Replace it with real tax, insurance and repair numbers before you offer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="one-percent-rule"
        calculatorName="1% and 50% Rule"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default OnePercentRuleCalculator;

