"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { computeCagr } from '@/lib/investment-utils';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

interface CAGRData {
  beginningValue: number;
  endingValue: number;
  years: number;
}

interface CAGRResults {
  cagr: number;
  totalGrowthPercent: number;
  totalMultiple: number;
}

const CAGRCalculator: React.FC = () => {
  const [formData, setFormData] = useState<CAGRData>({
    beginningValue: 100000,
    endingValue: 161051,
    years: 5,
  });

  const [results, setResults] = useState<CAGRResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateCagr = useCallback(() => {
    const { beginningValue, endingValue, years } = formData;
    const cagr = computeCagr(beginningValue, endingValue, years);
    const totalGrowthPercent =
      beginningValue > 0 ? ((endingValue - beginningValue) / beginningValue) * 100 : 0;
    const totalMultiple = beginningValue > 0 ? endingValue / beginningValue : 0;

    setResults({ cagr, totalGrowthPercent, totalMultiple });
    setHasCalculated(true);
  }, [formData]);

  useEffect(() => {
    calculateCagr();
  }, [calculateCagr]);

  const handleInputChange = (field: keyof CAGRData, value: number) => {
    setFormData({ ...formData, [field]: value });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">CAGR Calculator</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Investment Values</h2>

            <div className="space-y-6">
              {/* Beginning Value */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Beginning Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.beginningValue || ''}
                    onChange={(e) => handleInputChange('beginningValue', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="100,000"
                  />
                </div>
              </div>

              {/* Ending Value */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ending Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.endingValue || ''}
                    onChange={(e) => handleInputChange('endingValue', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="161,051"
                  />
                </div>
              </div>

              {/* Years */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Number of Years
                </label>
                <input
                  type="number"
                  onFocus={(e) => e.target.select()}
                  value={formData.years || ''}
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="5"
                />
                <p className="text-sm text-foreground/70 mt-1">
                  The holding period over which the value grew
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">CAGR</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg border-2 border-primary">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Compound Annual Growth Rate</p>
                        <p className="text-3xl font-bold text-foreground">
                          {formatPercent(results.cagr)}
                        </p>
                        <p className="text-sm text-foreground/70 mt-1">
                          Annualized growth over {formData.years || 0} year{formData.years === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Total Growth</p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatPercent(results.totalGrowthPercent)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground/70 mb-1">Total Multiple</p>
                        <p className="text-lg font-semibold text-foreground">
                          {results.totalMultiple.toFixed(2)}x
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">What this means</h2>
                  <div className="space-y-3 text-sm text-foreground/70">
                    <p>
                      An investment growing from {formatCurrency(formData.beginningValue)} to{' '}
                      {formatCurrency(formData.endingValue)} over {formData.years || 0} year
                      {formData.years === 1 ? '' : 's'} compounds at{' '}
                      <span className="text-foreground font-medium">{formatPercent(results.cagr)}</span>{' '}
                      per year.
                    </p>
                    <p>• CAGR smooths out year-to-year volatility into one annualized rate.</p>
                    <p>• It answers &ldquo;what steady annual rate produces this growth?&rdquo;</p>
                    <p>• Use it to compare investments over different time horizons.</p>
                    <p>• It ignores interim cash flow, pair it with cash-on-cash for income.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About CAGR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">The formula:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>CAGR = (Ending ÷ Beginning) ^ (1 ÷ Years) − 1</li>
                <li>Expressed as an annual percentage</li>
                <li>Assumes steady compounding each period</li>
                <li>Great for comparing multi-year returns</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Keep in mind:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Ignores interim volatility and cash flow</li>
                <li>Past growth doesn&apos;t guarantee future results</li>
                <li>
                  Pair with{' '}
                  <Link href="/calculators/cash-on-cash" className="text-primary hover:underline">
                    cash-on-cash
                  </Link>{' '}
                  and{' '}
                  <Link href="/calculators/cap-rate" className="text-primary hover:underline">
                    cap rate
                  </Link>
                </li>
                <li>
                  Read{' '}
                  <Link
                    href="/blog/cash-on-cash-return-explained"
                    className="text-primary hover:underline"
                  >
                    Cash-on-Cash Return, Explained
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="cagr"
        calculatorName="CAGR"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default CAGRCalculator;
