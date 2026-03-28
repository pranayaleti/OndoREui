"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

interface CapRateData {
  purchasePrice: number;
  monthlyRent: number;
  annualRent: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  propertyManagement: number;
  vacancyRate: number;
  otherExpenses: number;
}

interface CapRateResults {
  annualRentalIncome: number;
  annualOperatingExpenses: number;
  netOperatingIncome: number;
  capRate: number;
  propertyValue: number;
}

const CapRateCalculator: React.FC = () => {
  const [formData, setFormData] = useState<CapRateData>({
    purchasePrice: 300000,
    monthlyRent: 2500,
    annualRent: 0,
    propertyTax: 3600,
    insurance: 1200,
    maintenance: 3000,
    propertyManagement: 0,
    vacancyRate: 5,
    otherExpenses: 0
  });

  const [results, setResults] = useState<CapRateResults | null>(null);
  const [targetCapRate, setTargetCapRate] = useState(8);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateCapRate = React.useCallback(() => {
    const {
      purchasePrice,
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

    // Calculate Cap Rate (NOI / Purchase Price)
    const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;

    // Calculate property value based on target cap rate
    const propertyValue = targetCapRate > 0 ? (netOperatingIncome / (targetCapRate / 100)) : 0;

    setResults({
      annualRentalIncome,
      annualOperatingExpenses,
      netOperatingIncome,
      capRate,
      propertyValue
    });
    setHasCalculated(true);
  }, [formData, targetCapRate]);

  useEffect(() => {
    calculateCapRate();
  }, [calculateCapRate]);

  const handleInputChange = (field: keyof CapRateData, value: number) => {
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

  const getCapRateColor = (rate: number) => {
    if (rate >= 10) return 'text-green-600';
    if (rate >= 7) return 'text-primary';
    if (rate >= 4) return 'text-yellow-600';
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
            <h1 className="text-2xl font-bold text-foreground">Cap Rate Calculator</h1>
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

              {/* Target Cap Rate */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Cap Rate (%) - for value calculation
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.1"
                  value={targetCapRate || ''}
                  onChange={(e) => setTargetCapRate(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="8.0"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Cap Rate */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Cap Rate</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Capitalization Rate</p>
                        <p className={`text-4xl font-bold ${getCapRateColor(results.capRate)}`}>
                          {formatPercent(results.capRate)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          NOI ÷ Purchase Price
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

                {/* Property Value at Target Cap Rate */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Property Value Analysis</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Property Value at {targetCapRate}% Cap Rate</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.propertyValue)}</p>
                        <p className="text-sm text-foreground/70 mt-1">
                          NOI ÷ Target Cap Rate
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Current purchase price: {formatCurrency(formData.purchasePrice)}</p>
                      <p>• Value at {targetCapRate}% cap rate: {formatCurrency(results.propertyValue)}</p>
                      <p>• Difference: {formatCurrency(results.propertyValue - formData.purchasePrice)}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.capRate >= 10 ? (
                      <p className="text-primary font-medium">✓ Excellent cap rate! This property shows strong income potential.</p>
                    ) : results.capRate >= 7 ? (
                      <p className="text-primary font-medium">✓ Good cap rate. This property shows decent income potential.</p>
                    ) : results.capRate >= 4 ? (
                      <p className="text-yellow-600 font-medium">⚠ Moderate cap rate. Consider if appreciation potential justifies the lower yield.</p>
                    ) : (
                      <p className="text-destructive font-medium">⚠ Low cap rate. This property may not be a good income investment.</p>
                    )}
                    <p>• Cap rate measures the property's income-generating potential</p>
                    <p>• Higher cap rates typically indicate higher risk or lower appreciation potential</p>
                    <p>• Lower cap rates often indicate safer markets with appreciation potential</p>
                    <p>• Compare cap rates within the same market and property type</p>
                    <p>• Cap rate excludes financing costs (debt service)</p>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Cap Rate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">What It Measures:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Property's income-generating potential</li>
                <li>Return on investment if purchased with cash</li>
                <li>Net operating income relative to property value</li>
                <li>Does not include financing costs</li>
                <li>Useful for comparing properties</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Typical Cap Rates:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>4-6%: Prime locations, high appreciation potential</li>
                <li>6-8%: Good balance of income and appreciation</li>
                <li>8-10%: Higher income, moderate appreciation</li>
                <li>10%+: Higher risk, lower appreciation potential</li>
                <li>Varies significantly by market and property type</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="cap-rate"
        calculatorName="Cap Rate"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default CapRateCalculator;

