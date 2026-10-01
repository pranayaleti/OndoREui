"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Home, Landmark, PiggyBank } from 'lucide-react';
import { LeadCaptureModal } from "@/components/calculators/lead-capture-modal"
import { NumberField } from "@/components/calculators/number-field";
import { calculateRetirement, type RetirementInputs, type RetirementResults } from "@/lib/retirement";

const RetirementCalculator: React.FC = () => {
  const [formData, setFormData] = useState<RetirementInputs>({
    currentAge: 35,
    retirementAge: 65,
    lifeExpectancy: 85,
    currentSavings: 100000,
    currentIncome: 80000,
    currentExpenses: 60000,
    currentRealEstateValue: 200000,
    realEstateIncome: 24000,
    realEstateExpenses: 12000,
    realEstateAppreciation: 3,
    monthlyContribution: 1000,
    investmentReturn: 7,
    inflationRate: 2.5,
    desiredRetirementIncome: 60000,
    socialSecurityIncome: 24000,
    otherIncome: 12000
  });

  const [results, setResults] = useState<RetirementResults | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  useEffect(() => {
    runCalculation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const runCalculation = () => {
    setResults(calculateRetirement(formData));
    setHasCalculated(true);
  };

  const handleInputChange = (field: keyof RetirementInputs, value: number) => {
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

  const isSurplus = results ? results.retirementIncomeGap <= 0 : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to all calculators</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Retirement Planning Calculator</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Enter Your Information</h2>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField
                    id="currentAge"
                    label="Current Age"
                    kind="years"
                    min={0} max={120}
                    value={formData.currentAge}
                    onChange={(next) => handleInputChange('currentAge', next)}
                  />
                  <NumberField
                    id="retirementAge"
                    label="Retirement Age"
                    kind="years"
                    min={0} max={120}
                    value={formData.retirementAge}
                    onChange={(next) => handleInputChange('retirementAge', next)}
                  />
                  <NumberField
                    id="lifeExpectancy"
                    label="Life Expectancy"
                    kind="years"
                    min={0} max={120}
                    value={formData.lifeExpectancy}
                    onChange={(next) => handleInputChange('lifeExpectancy', next)}
                  />
                </div>
              </div>

              {/* Current Financial Status */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Landmark className="h-5 w-5 mr-2 text-primary" />
                  Current Financial Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField
                    id="currentSavings"
                    label="Current Savings"
                    kind="currency"
                    value={formData.currentSavings}
                    onChange={(next) => handleInputChange('currentSavings', next)}
                  />
                  <NumberField
                    id="currentIncome"
                    label="Annual Income"
                    kind="currency"
                    value={formData.currentIncome}
                    onChange={(next) => handleInputChange('currentIncome', next)}
                  />
                  <NumberField
                    id="currentExpenses"
                    label="Annual Expenses"
                    kind="currency"
                    value={formData.currentExpenses}
                    onChange={(next) => handleInputChange('currentExpenses', next)}
                  />
                </div>
              </div>

              {/* Real Estate Investments */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-primary" />
                  Real Estate Investments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField
                    id="currentRealEstateValue"
                    label="Current Real Estate Value"
                    kind="currency"
                    value={formData.currentRealEstateValue}
                    onChange={(next) => handleInputChange('currentRealEstateValue', next)}
                  />
                  <NumberField
                    id="realEstateIncome"
                    label="Annual Real Estate Income"
                    kind="currency"
                    value={formData.realEstateIncome}
                    onChange={(next) => handleInputChange('realEstateIncome', next)}
                  />
                  <NumberField
                    id="realEstateExpenses"
                    label="Annual Real Estate Expenses"
                    kind="currency"
                    value={formData.realEstateExpenses}
                    onChange={(next) => handleInputChange('realEstateExpenses', next)}
                  />
                  <NumberField
                    id="realEstateAppreciation"
                    label="Real Estate Appreciation"
                    kind="rate"
                    step={0.1}
                    value={formData.realEstateAppreciation}
                    onChange={(next) => handleInputChange('realEstateAppreciation', next)}
                  />
                </div>
              </div>

              {/* Investment Strategy */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2 text-primary" />
                  Investment Strategy
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField
                    id="monthlyContribution"
                    label="Monthly Contribution"
                    kind="currency"
                    value={formData.monthlyContribution}
                    onChange={(next) => handleInputChange('monthlyContribution', next)}
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
                    id="inflationRate"
                    label="Inflation Rate"
                    kind="rate"
                    step={0.1}
                    value={formData.inflationRate}
                    onChange={(next) => handleInputChange('inflationRate', next)}
                  />
                </div>
              </div>

              {/* Retirement Goals */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  Retirement Goals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberField
                    id="desiredRetirementIncome"
                    label="Desired Retirement Income"
                    kind="currency"
                    value={formData.desiredRetirementIncome}
                    onChange={(next) => handleInputChange('desiredRetirementIncome', next)}
                  />
                  <NumberField
                    id="socialSecurityIncome"
                    label="Social Security Income"
                    kind="currency"
                    value={formData.socialSecurityIncome}
                    onChange={(next) => handleInputChange('socialSecurityIncome', next)}
                  />
                  <NumberField
                    id="otherIncome"
                    label="Other Income"
                    kind="currency"
                    value={formData.otherIncome}
                    onChange={(next) => handleInputChange('otherIncome', next)}
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
                  <h2 className="text-xl font-semibold text-foreground mb-6">Retirement Analysis Results</h2>

                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-foreground mb-2">Total Retirement Savings</h3>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(results.totalRetirementSavings)}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-success-emphasis mb-2">Real Estate Value at Retirement</h3>
                      <p className="text-2xl font-bold text-success-emphasis">{formatCurrency(results.realEstateValueAtRetirement)}</p>
                    </div>
                  </div>

                  {/* Total Assets */}
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-2">Total Retirement Assets</h3>
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(results.totalRetirementAssets)}</p>
                  </div>

                  {/* Income Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-foreground mb-2">Annual Retirement Income</h3>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(results.annualRetirementIncome)}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className={`text-sm font-medium mb-2 ${isSurplus ? 'text-success-emphasis' : 'text-destructive-emphasis'}`}>
                        {isSurplus ? 'Income Surplus' : 'Income Gap'}
                      </h3>
                      <p className={`text-xl font-bold ${isSurplus ? 'text-success-emphasis' : 'text-destructive-emphasis'}`}>
                        {formatCurrency(Math.abs(results.retirementIncomeGap))}
                      </p>
                    </div>
                  </div>

                  {/* Retirement Readiness */}
                  <div className="p-4 rounded-lg mb-6 bg-muted">
                    <h3 className="text-lg font-medium text-foreground mb-2">Retirement Readiness</h3>
                    <p className={`text-xl font-bold mb-2 ${
                      results.retirementReadiness === 'On Track' ? 'text-success-emphasis' :
                      results.retirementReadiness === 'Close to Target' ? 'text-warning-emphasis' : 'text-destructive-emphasis'
                    }`}>
                      {results.retirementReadiness}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-foreground">{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Inputs that shape the plan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-foreground mb-2">Annual Savings Capacity</h3>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(results.annualSavingsCapacity)}</p>
                      <p className="text-xs text-foreground/70 mt-1">Income minus expenses today</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-foreground mb-2">Years in Retirement</h3>
                      <p className="text-xl font-bold text-foreground">{results.yearsOfRetirement}</p>
                      <p className="text-xs text-foreground/70 mt-1">Retirement age to life expectancy</p>
                    </div>
                  </div>
                  {results.notes.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 mb-6" aria-label="Notes on your inputs">
                      {results.notes.map((note) => (
                        <li key={note} className="text-sm text-foreground">{note}</li>
                      ))}
                    </ul>
                  )}

                  {/* Monthly Budget */}
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-indigo-900 mb-2">Monthly Retirement Budget</h3>
                    <p className="text-2xl font-bold text-indigo-900">{formatCurrency(results.monthlyRetirementBudget)}</p>
                  </div>

                  {/* Year-by-Year Projection */}
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Savings Projection</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Age</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Year</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Savings</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Real Estate</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Total Assets</th>
                          </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-gray-200">
                          {results.yearByYearProjection.slice(0, 10).map((projection) => (
                            <tr key={projection.year}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-foreground">{projection.age}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-foreground/70">{projection.year}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-primary">{formatCurrency(projection.savings)}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-primary">{formatCurrency(projection.realEstateValue)}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-foreground">{formatCurrency(projection.totalAssets)}</td>
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
        calculatorSlug="retirement"
        calculatorName="Retirement"
        hasCalculated={hasCalculated}
      />
    </div>
  );
};

export default RetirementCalculator;
