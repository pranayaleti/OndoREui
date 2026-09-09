"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field";

interface HomeSaleData {
  homeValue: number;
  mortgageBalance: number;
  realtorCommission: number;
  closingCosts: number;
  repairs: number;
  movingCosts: number;
  capitalGainsTax: number;
  originalPurchasePrice?: number;
  originalImprovements?: number;
}

interface HomeSaleResults {
  netProceeds: number;
  totalCosts: number;
  equity: number;
  profit: number;
  basisUsed: number;
}

const HomeSaleCalculator: React.FC = () => {
  const [formData, setFormData] = useState<HomeSaleData>({
    homeValue: 400000,
    mortgageBalance: 250000,
    realtorCommission: 6,
    closingCosts: 8000,
    repairs: 5000,
    movingCosts: 2000,
    capitalGainsTax: 0,
    originalPurchasePrice: 320000,
    originalImprovements: 0
  });

  const [results, setResults] = useState<HomeSaleResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const calculateHomeSale = useCallback(() => {
    const { homeValue, mortgageBalance, realtorCommission, closingCosts, repairs, movingCosts, capitalGainsTax } = formData;
    
    // Calculate realtor commission
    const realtorFee = (homeValue * realtorCommission) / 100;
    
    // Calculate total costs
    const totalCosts = realtorFee + closingCosts + repairs + movingCosts + capitalGainsTax;
    
    // Calculate equity
    const equity = homeValue - mortgageBalance;
    
    // Calculate net proceeds
    const netProceeds = homeValue - totalCosts - mortgageBalance;
    
    // Calculate profit using user-provided cost basis (purchase price + improvements)
    const costBasis = (formData.originalPurchasePrice || 0) + (formData.originalImprovements || 0);
    const profit = homeValue - costBasis - totalCosts;
    
    setResults({
      netProceeds,
      totalCosts,
      equity,
      profit,
      basisUsed: costBasis
    });
    setHasCalculated(true);
  }, [formData]);

  useEffect(() => {
    calculateHomeSale();
  }, [calculateHomeSale]);

  const handleInputChange = (field: keyof HomeSaleData, value: number) => {
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
            <h1 className="text-2xl font-bold text-foreground">Home Sale Calculator</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Information</h2>
            
            <div className="space-y-6">
              {/* Home Value */}
              <NumberField
                id="homeValue"
                label="Estimated Home Sale Price"
                kind="currency"
                value={formData.homeValue}
                onChange={(next) => handleInputChange('homeValue', next)}
              />

              {/* Mortgage Balance */}
              <NumberField
                id="mortgageBalance"
                label="Remaining Mortgage Balance"
                kind="currency"
                value={formData.mortgageBalance}
                onChange={(next) => handleInputChange('mortgageBalance', next)}
              />

              {/* Realtor Commission */}
              <NumberField
                id="realtorCommission"
                label="Realtor Commission"
                kind="currency"
                step={0.1}
                value={formData.realtorCommission}
                onChange={(next) => handleInputChange('realtorCommission', next)}
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
                label="Repairs & Improvements"
                kind="currency"
                value={formData.repairs}
                onChange={(next) => handleInputChange('repairs', next)}
              />

              {/* Moving Costs */}
              <NumberField
                id="movingCosts"
                label="Moving Costs"
                kind="currency"
                value={formData.movingCosts}
                onChange={(next) => handleInputChange('movingCosts', next)}
              />

              {/* Capital Gains Tax */}
              <NumberField
                id="capitalGainsTax"
                label="Capital Gains Tax (if applicable)"
                kind="currency"
                value={formData.capitalGainsTax}
                onChange={(next) => handleInputChange('capitalGainsTax', next)}
              />

              {/* Original Purchase Price */}
              <NumberField
                id="originalPurchasePrice"
                label="Original Purchase Price"
                kind="currency"
                value={formData.originalPurchasePrice ?? 0}
                onChange={(next) => handleInputChange('originalPurchasePrice', next)}
              />

              {/* Capital Improvements */}
              <NumberField
                id="originalImprovements"
                label="Capital Improvements (lifetime)"
                kind="currency"
                value={formData.originalImprovements ?? 0}
                onChange={(next) => handleInputChange('originalImprovements', next)}
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Net Proceeds */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Sale Results</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Net Proceeds</p>
                        <p className="text-3xl font-bold text-green-700">{formatCurrency(results.netProceeds)}</p>
                        <p className="text-sm text-primary mt-1">
                          Cash you'll receive after sale
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Total Equity</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.equity)}</p>
                        <p className="text-sm text-primary mt-1">
                          Home value minus mortgage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Cost Breakdown</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Realtor Commission:</span>
                      <span className="font-semibold">{formatCurrency((formData.homeValue * formData.realtorCommission) / 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Closing Costs:</span>
                      <span className="font-semibold">{formatCurrency(formData.closingCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Repairs & Improvements:</span>
                      <span className="font-semibold">{formatCurrency(formData.repairs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Moving Costs:</span>
                      <span className="font-semibold">{formatCurrency(formData.movingCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Capital Gains Tax:</span>
                      <span className="font-semibold">{formatCurrency(formData.capitalGainsTax)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Costs:</span>
                      <span className="text-destructive-emphasis">{formatCurrency(results.totalCosts)}</span>
                    </div>
                  </div>
                </div>

                {/* Profit Analysis */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Profit Analysis</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-yellow-600 mb-1">Estimated Profit</p>
                        <p className="text-2xl font-bold text-yellow-700">{formatCurrency(results.profit)}</p>
                        <p className="text-sm text-yellow-600 mt-1">
                          After all costs and cost basis
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Cost basis used: {formatCurrency(results.basisUsed)}</p>
                      <p>• This is a rough estimate based on available information</p>
                      <p>• Actual costs may vary significantly</p>
                      <p>• Consider consulting a real estate professional</p>
                      <p>• Factor in market conditions and timing</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Home Sales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">Common Sale Costs:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Realtor commission (typically 5-6%)</li>
                <li>Closing costs and transfer taxes</li>
                <li>Repairs and staging costs</li>
                <li>Moving and storage expenses</li>
                <li>Capital gains tax (if applicable)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Tips for Maximizing Proceeds:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Improve curb appeal and staging</li>
                <li>Make necessary repairs before listing</li>
                <li>Price competitively for your market</li>
                <li>Consider timing and market conditions</li>
                <li>Negotiate commission rates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="home-sale"
        calculatorName="Home Sale"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default HomeSaleCalculator;
