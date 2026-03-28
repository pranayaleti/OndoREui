"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoanProgram, getProgramMI } from '@/lib/mortgage-utils';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"

interface ClosingCostData {
  homePrice: number;
  loanAmount: number;
  downPayment: number;
  interestRate?: number;
  loanTerm?: number;
  propertyTax: number;
  insurance: number;
  titleInsurance: number;
  appraisal: number;
  inspection: number;
  originationFee: number;
  discountPoints: number;
  prepaidInterest: number;
  escrowReserves: number;
  program?: LoanProgram;
}

interface ClosingCostResults {
  totalClosingCosts: number;
  outOfPocket: number;
  lenderCosts: number;
  thirdPartyCosts: number;
  prepaidCosts: number;
  monthlyPayment: number;
  breakEvenMonths: number;
  monthlyPI?: number;
}

const ClosingCostCalculator: React.FC = () => {
  const [formData, setFormData] = useState<ClosingCostData>({
    homePrice: 300000,
    loanAmount: 240000,
    downPayment: 60000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 3000,
    insurance: 1200,
    titleInsurance: 1000,
    appraisal: 500,
    inspection: 400,
    originationFee: 1200,
    discountPoints: 0,
    prepaidInterest: 0,
    escrowReserves: 0,
    program: 'conventional'
  });

  const [results, setResults] = useState<ClosingCostResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    calculateClosingCosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateClosingCosts = () => {
    const {
      homePrice, loanAmount, downPayment, propertyTax, insurance, titleInsurance,
      appraisal, inspection, originationFee, discountPoints, prepaidInterest, escrowReserves
    } = formData;

    // Calculate monthly property tax and insurance
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;

    // Calculate lender costs plus program-specific upfront fees
    const baseLender = originationFee + (discountPoints * loanAmount / 100);
    const upfrontFee = getProgramMI(formData.program || 'conventional', loanAmount, homePrice, 740, formData.loanTerm || 30, downPayment).upfrontFee;
    const lenderCosts = baseLender + upfrontFee;

    // Calculate third-party costs
    const thirdPartyCosts = titleInsurance + appraisal + inspection;

    // Convert prepaid interest from days to dollars
    const dailyInterest = formData.interestRate
      ? (loanAmount * (formData.interestRate / 100)) / 365
      : 0;
    const prepaidInterestDollars = dailyInterest * prepaidInterest;

    const prepaidCosts = prepaidInterestDollars + escrowReserves + (monthlyTax * 2) + (monthlyInsurance * 2);

    const totalClosingCosts = lenderCosts + thirdPartyCosts + prepaidCosts;
    const outOfPocket = downPayment + totalClosingCosts;

    let monthlyPI = 0;
    if (formData.interestRate && formData.loanTerm) {
      const r = (formData.interestRate / 100) / 12;
      const n = formData.loanTerm * 12;
      monthlyPI = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const monthlyPayment = monthlyTax + monthlyInsurance + (monthlyPI || (loanAmount * 0.005));

    // First-month principal = P&I payment minus first month's interest
    const firstMonthInterest = formData.interestRate
      ? loanAmount * ((formData.interestRate / 100) / 12)
      : 0;
    const firstMonthPrincipal = monthlyPI > 0 ? monthlyPI - firstMonthInterest : 0;
    const breakEvenMonths = firstMonthPrincipal > 0 ? (totalClosingCosts / firstMonthPrincipal) : 0;

    setResults({
      totalClosingCosts,
      outOfPocket,
      lenderCosts,
      thirdPartyCosts,
      prepaidCosts,
      monthlyPayment,
      breakEvenMonths,
      monthlyPI: monthlyPI || undefined
    });
    setHasCalculated(true);
  };

  const handleInputChange = (field: keyof ClosingCostData, value: number | string) => {
    const newData = { ...formData, [field]: value };
    
    // Auto-calculate loan amount if home price or down payment changes
    if (field === 'homePrice' || field === 'downPayment') {
      newData.loanAmount = Math.max(0, newData.homePrice - newData.downPayment);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Closing Cost Calculator</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Information</h2>
            
            <div className="space-y-6">
              {/* Home Price */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Home Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.homePrice || ''}
                    onChange={(e) => handleInputChange('homePrice', Number(e.target.value))}
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
                    placeholder="60,000"
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
                    placeholder="240,000"
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
                    placeholder="3,000"
                  />
                </div>
              </div>

              {/* Insurance */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Annual Homeowners Insurance
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

              {/* Loan Program */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Loan Program</label>
                <select
                  value={formData.program}
                  onChange={(e) => handleInputChange('program', e.target.value as LoanProgram)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                >
                  <option value="conventional">Conventional</option>
                  <option value="fha">FHA</option>
                  <option value="va">VA</option>
                  <option value="usda">USDA</option>
                </select>
              </div>

              {/* Title Insurance */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Title Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.titleInsurance || ''}
                    onChange={(e) => handleInputChange('titleInsurance', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,000"
                  />
                </div>
              </div>

              {/* Appraisal */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Appraisal Fee
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.appraisal || ''}
                    onChange={(e) => handleInputChange('appraisal', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Inspection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Home Inspection
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.inspection || ''}
                    onChange={(e) => handleInputChange('inspection', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="400"
                  />
                </div>
              </div>

              {/* Origination Fee */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Origination Fee
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.originationFee || ''}
                    onChange={(e) => handleInputChange('originationFee', Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                    placeholder="1,200"
                  />
                </div>
              </div>

              {/* Discount Points */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Discount Points (% of loan)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  step="0.125"
                  value={formData.discountPoints || ''}
                  onChange={(e) => handleInputChange('discountPoints', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="0"
                />
              </div>

              {/* Prepaid Interest */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prepaid Interest (days)
                </label>
                <input
                  type="number"
                    onFocus={(e) => e.target.select()}
                  value={formData.prepaidInterest || ''}
                  onChange={(e) => handleInputChange('prepaidInterest', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary input-no-spinner"
                  placeholder="0"
                />
              </div>

              {/* Escrow Reserves */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Escrow Reserves
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-foreground/70">$</span>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    value={formData.escrowReserves || ''}
                    onChange={(e) => handleInputChange('escrowReserves', Number(e.target.value))}
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
                {/* Total Closing Costs */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Closing Cost Summary</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-destructive mb-1">Total Closing Costs</p>
                        <p className="text-3xl font-bold text-red-700">{formatCurrency(results.totalClosingCosts)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Total Out of Pocket</p>
                        <p className="text-2xl font-bold text-foreground">{formatCurrency(results.outOfPocket)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Cost Breakdown</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Lender Costs:</span>
                      <span className="font-semibold">{formatCurrency(results.lenderCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Third-Party Costs:</span>
                      <span className="font-semibold">{formatCurrency(results.thirdPartyCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Prepaid Costs:</span>
                      <span className="font-semibold">{formatCurrency(results.prepaidCosts)}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-destructive">{formatCurrency(results.totalClosingCosts)}</span>
                    </div>
                  </div>
                </div>

                {/* Break-Even Analysis */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Break-Even Analysis</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Break-Even Time</p>
                        <p className="text-2xl font-bold text-green-700">
                          {results.breakEvenMonths.toFixed(1)} months
                        </p>
                        <p className="text-sm text-primary mt-1">
                          Time to recoup closing costs through principal paydown
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>• Closing costs typically range from 2-5% of home price</p>
                      {results.monthlyPI && (
                        <p>• Estimated P&I payment: {formatCurrency(results.monthlyPI)}</p>
                      )}
                      <p>• Some costs may be negotiable with the seller</p>
                      <p>• Consider rolling costs into the loan if possible</p>
                      <p>• Shop around for title insurance and other services</p>
                    </div>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">About Closing Costs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-foreground/70">
            <div>
              <h3 className="font-medium text-foreground mb-2">Lender Costs:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Origination fees and processing</li>
                <li>Discount points (optional)</li>
                <li>Underwriting fees</li>
                <li>Credit report fees</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Third-Party Costs:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Title insurance and search</li>
                <li>Appraisal and inspection</li>
                <li>Recording fees</li>
                <li>Attorney fees (if applicable)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="closing-cost"
        calculatorName="Closing Cost"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default ClosingCostCalculator;
