"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

interface GRMData {
  purchasePrice: number;
  monthlyRent: number;
  annualRent: number;
}

interface GRMResults {
  grossRentMultiplier: number;
  annualRent: number;
  recommendedPrice: number;
  recommendedRent: number;
}

const GRMCalculator: React.FC = () => {
  const [formData, setFormData] = useState<GRMData>({
    purchasePrice: 300000,
    monthlyRent: 2500,
    annualRent: 0
  });

  const [results, setResults] = useState<GRMResults | null>(null);
  const [targetGRM, setTargetGRM] = useState(12);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateGRM = useCallback(() => {
    const { purchasePrice, monthlyRent, annualRent } = formData;

    // Use annual rent if provided, otherwise calculate from monthly
    const effectiveAnnualRent = annualRent > 0 ? annualRent : monthlyRent * 12;

    // Calculate Gross Rent Multiplier
    const grossRentMultiplier = effectiveAnnualRent > 0 ? purchasePrice / effectiveAnnualRent : 0;

    // Calculate recommended price based on target GRM
    const recommendedPrice = effectiveAnnualRent * targetGRM;

    // Calculate recommended rent based on target GRM
    const recommendedRent = purchasePrice / targetGRM;

    setResults({
      grossRentMultiplier,
      annualRent: effectiveAnnualRent,
      recommendedPrice,
      recommendedRent
    });
    setHasCalculated(true);
  }, [formData, targetGRM]);

  useEffect(() => {
    calculateGRM();
  }, [calculateGRM]);

  const handleInputChange = (field: keyof GRMData, value: number) => {
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

  const getGRMColor = (grm: number) => {
    if (grm <= 10) return 'text-green-600';
    if (grm <= 15) return 'text-primary';
    if (grm <= 20) return 'text-yellow-600';
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
            <h1 className="text-2xl font-bold text-foreground">Gross Rent Multiplier Calculator</h1>
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

              {/* Target GRM */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target GRM (for comparison)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.1"
                  value={targetGRM || ''}
                  onChange={(e) => setTargetGRM(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="12.0"
                />
                <p className="text-sm text-foreground/70 mt-1">
                  Typical GRM: 8-12 for good deals, 12-15 average, 15+ may be overpriced
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* GRM */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Gross Rent Multiplier</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">GRM</p>
                        <p className={`text-4xl font-bold ${getGRMColor(results.grossRentMultiplier)}`}>
                          {results.grossRentMultiplier.toFixed(2)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Purchase Price ÷ Annual Rent
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Purchase Price</p>
                        <p className="text-lg font-semibold text-foreground">{formatCurrency(formData.purchasePrice)}</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Annual Rent</p>
                        <p className="text-lg font-semibold text-primary">{formatCurrency(results.annualRent)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Recommended Price at {targetGRM} GRM</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.recommendedPrice)}</p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Based on current rent
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Required Rent for {targetGRM} GRM</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.recommendedRent)}</p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Monthly: {formatCurrency(results.recommendedRent / 12)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Analysis</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    {results.grossRentMultiplier <= 10 ? (
                      <p className="text-primary font-medium">✓ Excellent GRM! This property shows strong income potential relative to price.</p>
                    ) : results.grossRentMultiplier <= 15 ? (
                      <p className="text-primary font-medium">✓ Good GRM. This property shows decent income potential.</p>
                    ) : results.grossRentMultiplier <= 20 ? (
                      <p className="text-yellow-600 font-medium">⚠ Moderate GRM. Consider if appreciation potential justifies the lower income ratio.</p>
                    ) : (
                      <p className="text-destructive font-medium">⚠ High GRM. This property may be overpriced relative to rental income.</p>
                    )}
                    <p>• Lower GRM = better income-to-price ratio</p>
                    <p>• GRM doesn't account for expenses or financing</p>
                    <p>• Compare GRM within the same market and property type</p>
                    <p>• Use GRM for quick screening, then analyze with cap rate</p>
                    <p>• Typical GRM varies by market (8-15 is common range)</p>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Gross Rent Multiplier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">What It Measures:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Relationship between property price and gross rent</li>
                <li>Quick screening tool for investment properties</li>
                <li>Does not include expenses or financing</li>
                <li>Useful for comparing similar properties</li>
                <li>Simple metric for initial property evaluation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Typical GRM Ranges:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>8-10: Excellent income-to-price ratio</li>
                <li>10-12: Good income-to-price ratio</li>
                <li>12-15: Average income-to-price ratio</li>
                <li>15-20: Lower income-to-price ratio</li>
                <li>20+: May indicate overpriced property</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="grm"
        calculatorName="GRM"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default GRMCalculator;

