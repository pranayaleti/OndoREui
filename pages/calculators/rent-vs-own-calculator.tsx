"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Home, Building2, Eye, EyeOff } from 'lucide-react';
import { LoanProgram, DEFAULT_MORTGAGE_RATE } from '@/lib/mortgage-utils';
import { calculateRentVsOwn, type RentVsOwnInputs, type RentVsOwnResults } from '@/lib/rent-vs-own';
import { useFinancialVisibility } from '@/lib/financial-visibility';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field";

const RentVsOwnCalculator: React.FC = () => {
  const [formData, setFormData] = useState<RentVsOwnInputs>({
    monthlyRent: 2000,
    rentIncrease: 3,
    securityDeposit: 2000,
    rentersInsurance: 200,
    homePrice: 400000,
    downPayment: 80000,
    interestRate: DEFAULT_MORTGAGE_RATE,
    loanTerm: 30,
    propertyTax: 4000,
    homeownersInsurance: 1200,
    maintenance: 3000,
    hoa: 0,
    program: 'conventional',
    creditScore: 740,
    analysisYears: 10,
    investmentReturn: 7,
    homeAppreciation: 3,
    buyingCostPct: 3,
    sellingCostPct: 6
  });

  const [results, setResults] = useState<RentVsOwnResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const { showValues, toggle } = useFinancialVisibility();

  useEffect(() => {
    calculateResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateResults = () => {
    setResults(calculateRentVsOwn(formData));
    setHasCalculated(true);
  };

  const handleInputChange = (field: keyof RentVsOwnInputs, value: number | string) => {
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
      <div className="bg-card shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/calculators" className="text-primary hover:text-primary">
                <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to all calculators</span>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Rent vs Own Calculator</h1>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs text-foreground/70 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={showValues ? "Hide financial amounts" : "Show financial amounts"}
            >
              {showValues ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              <span className="hidden sm:inline">
                {showValues ? "Hide amounts" : "Show amounts"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Information</h2>
            
            <div className="space-y-6">
              {/* Rent Scenario */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  Rent Scenario
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField
                    id="monthlyRent"
                    label="Monthly Rent"
                    kind="currency"
                    value={formData.monthlyRent}
                    onChange={(next) => handleInputChange('monthlyRent', next)}
                  />
                  <NumberField
                    id="rentIncrease"
                    label="Annual Rent Increase"
                    kind="rate"
                    step={0.1}
                    value={formData.rentIncrease}
                    onChange={(next) => handleInputChange('rentIncrease', next)}
                  />
                  <NumberField
                    id="securityDeposit"
                    label="Security Deposit"
                    kind="currency"
                    value={formData.securityDeposit}
                    onChange={(next) => handleInputChange('securityDeposit', next)}
                  />
                  <NumberField
                    id="rentersInsurance"
                    label="Annual Renters Insurance"
                    kind="currency"
                    value={formData.rentersInsurance}
                    onChange={(next) => handleInputChange('rentersInsurance', next)}
                  />
                </div>
              </div>

              {/* Buy Scenario */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-primary" />
                  Buy Scenario
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField
                    id="homePrice"
                    label="Home Price"
                    kind="currency"
                    value={formData.homePrice}
                    onChange={(next) => handleInputChange('homePrice', next)}
                  />
                  <NumberField
                    id="downPayment"
                    label="Down Payment"
                    kind="currency"
                    value={formData.downPayment}
                    onChange={(next) => handleInputChange('downPayment', next)}
                  />
                  <NumberField
                    id="interestRate"
                    label="Interest Rate"
                    kind="rate"
                    value={formData.interestRate}
                    onChange={(next) => handleInputChange('interestRate', next)}
                  />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Loan Program
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => handleInputChange('program', e.target.value as LoanProgram)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                  >
                    <option value="conventional">Conventional</option>
                    <option value="fha">FHA</option>
                    <option value="va">VA</option>
                    <option value="usda">USDA</option>
                  </select>
                </div>
                <NumberField
                  id="creditScore"
                  label="Credit Score"
                  kind="count"
                  min={300}
                  max={850}
                  value={formData.creditScore}
                  onChange={(next) => handleInputChange('creditScore', next)}
                />
                  <NumberField
                    id="loanTerm"
                    label="Loan Term"
                    kind="years"
                    value={formData.loanTerm}
                    onChange={(next) => handleInputChange('loanTerm', next)}
                  />
                  <NumberField
                    id="propertyTax"
                    label="Annual Property Tax"
                    kind="currency"
                    value={formData.propertyTax}
                    onChange={(next) => handleInputChange('propertyTax', next)}
                  />
                  <NumberField
                    id="homeownersInsurance"
                    label="Annual Homeowners Insurance"
                    kind="currency"
                    value={formData.homeownersInsurance}
                    onChange={(next) => handleInputChange('homeownersInsurance', next)}
                  />
                  <NumberField
                    id="maintenance"
                    label="Annual Maintenance"
                    kind="currency"
                    value={formData.maintenance}
                    onChange={(next) => handleInputChange('maintenance', next)}
                  />
                  <NumberField
                    id="hoa"
                    label="Annual HOA Fees"
                    kind="currency"
                    value={formData.hoa}
                    onChange={(next) => handleInputChange('hoa', next)}
                  />
                </div>
              </div>

              {/* Analysis Settings */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Analysis Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField
                    id="analysisYears"
                    label="Analysis Period"
                    kind="years"
                    min={1}
                    max={60}
                    value={formData.analysisYears}
                    onChange={(next) => handleInputChange('analysisYears', next)}
                  />
                  <NumberField
                    id="investmentReturn"
                    label="Investment Return"
                    kind="rate"
                    step={0.1}
                    value={formData.investmentReturn}
                    onChange={(next) => handleInputChange('investmentReturn', next)}
                  />
                  <NumberField
                    id="homeAppreciation"
                    label="Home Appreciation"
                    kind="rate"
                    step={0.1}
                    value={formData.homeAppreciation}
                    onChange={(next) => handleInputChange('homeAppreciation', next)}
                  />
                  <NumberField
                    id="buyingCostPct"
                    label="Buying Costs"
                    kind="rate"
                    step={0.1}
                    min={0}
                    max={20}
                    hint="Closing costs, percent of price"
                    value={formData.buyingCostPct}
                    onChange={(next) => handleInputChange('buyingCostPct', next)}
                  />
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
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results && (
              <>
                <div className="bg-card rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Analysis Results</h2>

                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-foreground mb-2">Total Rent Cost ({formData.analysisYears} years)</h3>
                      <p className="text-2xl font-bold text-foreground">
                        {showValues ? formatCurrency(results.rentTotalCost) : '••••'}
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-900 mb-2">Total Buy Cost ({formData.analysisYears} years)</h3>
                      <p className="text-2xl font-bold text-green-900">
                        {showValues ? formatCurrency(results.buyTotalCost) : '••••'}
                      </p>
                    </div>
                  </div>

                  {/* Break-even Analysis */}
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-yellow-900 mb-2">Break-even Analysis</h3>
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>Break-even point:</strong>{" "}
                      {results.breakEvenYears === null
                        ? `Does not break even within ${results.analysisYears} ${results.analysisYears === 1 ? 'year' : 'years'}`
                        : `${results.breakEvenYears} ${results.breakEvenYears === 1 ? 'year' : 'years'}`}
                    </p>
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>Net cost of renting:</strong>{" "}
                      {showValues ? formatCurrency(results.netRentCost) : '••••'}
                    </p>
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>Net cost of buying:</strong>{" "}
                      {showValues ? formatCurrency(results.netBuyCost) : '••••'}
                    </p>
                    <p className="text-xs text-yellow-800 mb-2">
                      Net cost of buying counts buying and selling costs and the return your down payment could have earned, minus the equity you keep. Net cost of renting counts the return your deposit could have earned, since the deposit comes back.
                    </p>
                    <p className="text-sm text-yellow-800">
                      <strong>Monthly rent equivalent:</strong>{" "}
                      {showValues ? formatCurrency(results.monthlyRentEquivalent) : '••••'}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-purple-900 mb-2">Recommendation</h3>
                    <p className="text-lg font-semibold text-purple-900 mb-2">{results.recommendation}</p>
                    <p className="text-sm text-purple-800">{results.explanation}</p>
                  </div>

                  {/* Annual Comparison */}
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Annual Cost Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Year</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">Rent Cost</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Buy Cost</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Principal Paid</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-indigo-500 uppercase tracking-wider">Equity</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Difference</th>
                          </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-gray-200">
                          {results.annualComparison.slice(0, 10).map((year) => (
                            <tr key={year.year}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-foreground">{year.year}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-primary">
                                {showValues ? formatCurrency(year.rentCost) : '••••'}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-primary">
                                {showValues ? formatCurrency(year.buyCost) : '••••'}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-green-700">
                                {showValues ? formatCurrency(year.principalPaid) : '••••'}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-indigo-600">
                                {showValues ? formatCurrency(year.equity) : '••••'}
                              </td>
                              <td className={`px-3 py-2 whitespace-nowrap text-sm font-medium ${
                                year.difference > 0 ? 'text-destructive-emphasis' : 'text-primary'
                              }`}>
                                {showValues ? `${year.difference > 0 ? '+' : ''}${formatCurrency(year.difference)}` : '••••'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <LeadCaptureModal
        calculatorSlug="rent-vs-own"
        calculatorName="Rent vs Own"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default RentVsOwnCalculator;
