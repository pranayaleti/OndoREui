"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

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
            </Link>
            <h1 className="text-2xl font-bold text-foreground">1% Rule Calculator</h1>
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
                    placeholder="100,000"
                  />
                </div>
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
                    placeholder="1,000"
                  />
                </div>
              </div>

              {/* After Repair Value (optional) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  After Repair Value (ARV) - optional
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.afterRepairValue || ''}
                    onChange={(e) => handleInputChange('afterRepairValue', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="0"
                  />
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  Use ARV for fix-and-flip or rehab properties
                </p>
              </div>
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
                        <p className={`text-3xl font-bold ${results.meetsRule ? 'text-green-600' : 'text-red-600'}`}>
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

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.meetsRule ? (
                      <p className="text-primary font-medium">✓ Property meets the 1% rule! This is a good starting point for evaluation.</p>
                    ) : (
                      <p className="text-yellow-600 font-medium">⚠ Property does not meet the 1% rule. Consider if other factors justify the investment.</p>
                    )}
                    <p>• The 1% rule is a quick screening tool, not a definitive investment decision</p>
                    <p>• Properties meeting the rule typically have better cash flow potential</p>
                    <p>• Lower-priced markets often meet this rule more easily</p>
                    <p>• Higher-priced markets may not meet the rule but can still be good investments</p>
                    <p>• Always perform detailed financial analysis beyond the 1% rule</p>
                    <p>• Consider expenses, financing, and market conditions</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About the 1% Rule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">What It Is:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Quick screening tool for rental properties</li>
                <li>Monthly rent should be at least 1% of purchase price</li>
                <li>Helps identify properties with cash flow potential</li>
                <li>Not a guarantee of profitability</li>
                <li>Useful for initial property evaluation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Important Notes:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Rule works better in lower-priced markets</li>
                <li>Higher-priced markets may not meet the rule</li>
                <li>Does not account for expenses or financing</li>
                <li>Does not consider appreciation potential</li>
                <li>Always perform detailed financial analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="one-percent-rule"
        calculatorName="1% Rule"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default OnePercentRuleCalculator;

