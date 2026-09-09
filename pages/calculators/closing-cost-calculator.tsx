"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoanProgram, getProgramMI, calculateMonthlyPI, DEFAULT_MORTGAGE_RATE } from '@/lib/mortgage-utils';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field";

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
  /** Months of first-month principal needed to equal total closing costs (rough equity payback, not true break-even). */
  equityPaybackMonths: number;
  monthlyPI?: number;
}

const ClosingCostCalculator: React.FC = () => {
  const [formData, setFormData] = useState<ClosingCostData>({
    homePrice: 300000,
    loanAmount: 240000,
    downPayment: 60000,
    interestRate: DEFAULT_MORTGAGE_RATE,
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
    if (formData.interestRate != null && formData.loanTerm) {
      monthlyPI = calculateMonthlyPI(loanAmount, formData.interestRate, formData.loanTerm);
    }
    const monthlyPayment = monthlyTax + monthlyInsurance + (monthlyPI || (loanAmount * 0.005));

    // First-month principal = P&I payment minus first month's interest
    const firstMonthInterest = formData.interestRate
      ? loanAmount * ((formData.interestRate / 100) / 12)
      : 0;
    const firstMonthPrincipal = monthlyPI > 0 ? monthlyPI - firstMonthInterest : 0;
    const equityPaybackMonths = firstMonthPrincipal > 0 ? (totalClosingCosts / firstMonthPrincipal) : 0;

    setResults({
      totalClosingCosts,
      outOfPocket,
      lenderCosts,
      thirdPartyCosts,
      prepaidCosts,
      monthlyPayment,
      equityPaybackMonths,
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
              <span className="sr-only">Back to all calculators</span>
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
              <NumberField
                id="homePrice"
                label="Home Price"
                kind="currency"
                value={formData.homePrice}
                onChange={(next) => handleInputChange('homePrice', next)}
              />

              {/* Down Payment */}
              <NumberField
                id="downPayment"
                label="Down Payment"
                kind="currency"
                value={formData.downPayment}
                onChange={(next) => handleInputChange('downPayment', next)}
              />

              {/* Loan Amount */}
              <NumberField
                id="loanAmount"
                label="Loan Amount"
                kind="currency"
                value={formData.loanAmount}
                onChange={(next) => handleInputChange('loanAmount', next)}
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
                label="Annual Homeowners Insurance"
                kind="currency"
                value={formData.insurance}
                onChange={(next) => handleInputChange('insurance', next)}
              />

              {/* Interest Rate */}
              <NumberField
                id="interestRate"
                label="Interest Rate"
                kind="rate"
                value={formData.interestRate ?? 0}
                onChange={(next) => handleInputChange('interestRate', next)}
              />

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
              <NumberField
                id="titleInsurance"
                label="Title Insurance"
                kind="currency"
                value={formData.titleInsurance}
                onChange={(next) => handleInputChange('titleInsurance', next)}
              />

              {/* Appraisal */}
              <NumberField
                id="appraisal"
                label="Appraisal Fee"
                kind="currency"
                value={formData.appraisal}
                onChange={(next) => handleInputChange('appraisal', next)}
              />

              {/* Inspection */}
              <NumberField
                id="inspection"
                label="Home Inspection"
                kind="currency"
                value={formData.inspection}
                onChange={(next) => handleInputChange('inspection', next)}
              />

              {/* Origination Fee */}
              <NumberField
                id="originationFee"
                label="Origination Fee"
                kind="currency"
                value={formData.originationFee}
                onChange={(next) => handleInputChange('originationFee', next)}
              />

              {/* Discount Points */}
              <NumberField
                id="discountPoints"
                label="Discount Points (% of loan)"
                kind="percent"
                step={0.125}
                value={formData.discountPoints}
                onChange={(next) => handleInputChange('discountPoints', next)}
              />

              {/* Prepaid Interest */}
              <NumberField
                id="prepaidInterest"
                label="Prepaid Interest (days)"
                kind="currency"
                value={formData.prepaidInterest}
                onChange={(next) => handleInputChange('prepaidInterest', next)}
              />

              {/* Escrow Reserves */}
              <NumberField
                id="escrowReserves"
                label="Escrow Reserves"
                kind="currency"
                value={formData.escrowReserves}
                onChange={(next) => handleInputChange('escrowReserves', next)}
              />
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
                        <p className="text-sm text-destructive-emphasis mb-1">Total Closing Costs</p>
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
                      <span className="text-destructive-emphasis">{formatCurrency(results.totalClosingCosts)}</span>
                    </div>
                  </div>
                </div>

                {/* Equity payback (not true cash-flow break-even) */}
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Principal Payback Context</h2>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-primary mb-1">Closing Costs ÷ First-Month Principal</p>
                        <p className="text-2xl font-bold text-green-700">
                          {results.equityPaybackMonths.toFixed(1)} months
                        </p>
                        <p className="text-sm text-primary mt-1">
                          Rough months of early principal needed to match closing costs (not a cash-flow break-even)
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
