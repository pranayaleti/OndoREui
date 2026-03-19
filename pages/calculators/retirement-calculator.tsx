"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Home, Landmark, PiggyBank } from 'lucide-react';

interface RetirementData {
  // Personal Information
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  
  // Current Financial Status
  currentSavings: number;
  currentIncome: number;
  currentExpenses: number;
  
  // Real Estate Investments
  currentRealEstateValue: number;
  realEstateIncome: number;
  realEstateExpenses: number;
  realEstateAppreciation: number;
  
  // Investment Strategy
  monthlyContribution: number;
  investmentReturn: number;
  inflationRate: number;
  
  // Retirement Goals
  desiredRetirementIncome: number;
  socialSecurityIncome: number;
  otherIncome: number;
}

interface RetirementResults {
  totalRetirementSavings: number;
  realEstateValueAtRetirement: number;
  totalRetirementAssets: number;
  annualRetirementIncome: number;
  retirementIncomeGap: number;
  yearsOfRetirement: number;
  monthlyRetirementBudget: number;
  retirementReadiness: string;
  recommendations: string[];
  yearByYearProjection: Array<{
    age: number;
    year: number;
    savings: number;
    realEstateValue: number;
    totalAssets: number;
    projectedIncome: number;
  }>;
}

const RetirementCalculator: React.FC = () => {
  const [formData, setFormData] = useState<RetirementData>({
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
  useEffect(() => {
    calculateRetirement();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateRetirement = () => {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      currentRealEstateValue,
      realEstateIncome,
      realEstateExpenses,
      realEstateAppreciation,
      monthlyContribution,
      investmentReturn,
      inflationRate,
      desiredRetirementIncome,
      socialSecurityIncome,
      otherIncome
    } = formData;

    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const yearsOfRetirement = Math.max(0, lifeExpectancy - retirementAge);

    const netRealEstateIncome = Math.max(0, realEstateIncome - realEstateExpenses);

    const futureValueOfSavings = currentSavings * Math.pow(1 + investmentReturn / 100, yearsToRetirement);

    const monthlyRate = investmentReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;
    const futureValueOfContributions = monthlyRate > 0
      ? monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate
      : monthlyContribution * totalMonths;

    // Net rental income reinvested annually (FV of annuity)
    const annualReturn = investmentReturn / 100;
    const futureValueOfRentalIncome = annualReturn > 0
      ? netRealEstateIncome * ((Math.pow(1 + annualReturn, yearsToRetirement) - 1) / annualReturn)
      : netRealEstateIncome * yearsToRetirement;

    const totalRetirementSavings = futureValueOfSavings + futureValueOfContributions + futureValueOfRentalIncome;

    const realEstateValueAtRetirement = currentRealEstateValue * 
      Math.pow(1 + realEstateAppreciation / 100, yearsToRetirement);

    const totalRetirementAssets = totalRetirementSavings + realEstateValueAtRetirement;

    const retirementIncomeFromAssets = totalRetirementAssets * 0.04;

    const annualRetirementIncome = retirementIncomeFromAssets + socialSecurityIncome + otherIncome;

    // Inflate desired income to future dollars for an apples-to-apples comparison
    const inflatedDesiredIncome = desiredRetirementIncome * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const retirementIncomeGap = inflatedDesiredIncome - annualRetirementIncome;

    // Calculate monthly retirement budget
    const monthlyRetirementBudget = annualRetirementIncome / 12;

    // Determine retirement readiness
    let retirementReadiness = '';
    let recommendations: string[] = [];

    if (annualRetirementIncome >= inflatedDesiredIncome) {
      retirementReadiness = 'On Track';
      recommendations = [
        'You\'re on track for retirement! Consider increasing real estate investments for additional income.',
        'Review your investment allocation to ensure optimal returns.',
        'Consider early retirement options if desired.'
      ];
    } else if (annualRetirementIncome >= inflatedDesiredIncome * 0.8) {
      retirementReadiness = 'Close to Target';
      recommendations = [
        'You\'re close to your retirement goal. Consider increasing monthly contributions.',
        'Explore additional real estate investment opportunities.',
        'Review your retirement age - working a few more years could help.'
      ];
    } else {
      retirementReadiness = 'Needs Attention';
      recommendations = [
        'Increase your monthly savings contributions significantly.',
        'Consider investing in additional real estate properties for rental income.',
        'Review your retirement age - you may need to work longer.',
        'Explore ways to reduce retirement expenses or increase income sources.'
      ];
    }

    // Generate year-by-year projection
    const yearByYearProjection = [];
    let currentSavingsAmount = currentSavings;
    let currentRealEstateValueAmount = currentRealEstateValue;

    for (let year = 1; year <= yearsToRetirement; year++) {
      const age = currentAge + year;
      
      // Monthly compounding for savings + contributions + net rental income
      for (let m = 0; m < 12; m++) {
        currentSavingsAmount = currentSavingsAmount * (1 + monthlyRate) + monthlyContribution;
      }
      currentSavingsAmount += netRealEstateIncome;
      
      currentRealEstateValueAmount = currentRealEstateValueAmount * (1 + realEstateAppreciation / 100);
      
      const totalAssets = currentSavingsAmount + currentRealEstateValueAmount;
      const projectedIncome = totalAssets * 0.04;

      yearByYearProjection.push({
        age,
        year,
        savings: currentSavingsAmount,
        realEstateValue: currentRealEstateValueAmount,
        totalAssets: totalAssets,
        projectedIncome: projectedIncome
      });
    }

    setResults({
      totalRetirementSavings,
      realEstateValueAtRetirement,
      totalRetirementAssets,
      annualRetirementIncome,
      retirementIncomeGap,
      yearsOfRetirement,
      monthlyRetirementBudget,
      retirementReadiness,
      recommendations,
      yearByYearProjection
    });
  };

  const handleInputChange = (field: keyof RetirementData, value: number) => {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/calculators" className="text-primary hover:text-primary">
              <ArrowLeft className="h-6 w-6" />
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Age
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.currentAge || ''}
                      onChange={(e) => handleInputChange('currentAge', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Retirement Age
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.retirementAge || ''}
                      onChange={(e) => handleInputChange('retirementAge', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Life Expectancy
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.lifeExpectancy || ''}
                      onChange={(e) => handleInputChange('lifeExpectancy', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                </div>
              </div>

              {/* Current Financial Status */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Landmark className="h-5 w-5 mr-2 text-primary" />
                  Current Financial Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Savings
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.currentSavings || ''}
                      onChange={(e) => handleInputChange('currentSavings', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Income
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.currentIncome || ''}
                      onChange={(e) => handleInputChange('currentIncome', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Expenses
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.currentExpenses || ''}
                      onChange={(e) => handleInputChange('currentExpenses', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                </div>
              </div>

              {/* Real Estate Investments */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-primary" />
                  Real Estate Investments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Real Estate Value
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.currentRealEstateValue || ''}
                      onChange={(e) => handleInputChange('currentRealEstateValue', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Real Estate Income
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.realEstateIncome || ''}
                      onChange={(e) => handleInputChange('realEstateIncome', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Real Estate Expenses
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.realEstateExpenses || ''}
                      onChange={(e) => handleInputChange('realEstateExpenses', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Real Estate Appreciation (%)
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      step="0.1"
                      value={formData.realEstateAppreciation || ''}
                      onChange={(e) => handleInputChange('realEstateAppreciation', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                </div>
              </div>

              {/* Investment Strategy */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2 text-purple-600" />
                  Investment Strategy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Monthly Contribution
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.monthlyContribution || ''}
                      onChange={(e) => handleInputChange('monthlyContribution', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Investment Return (%)
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      step="0.1"
                      value={formData.investmentReturn || ''}
                      onChange={(e) => handleInputChange('investmentReturn', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Inflation Rate (%)
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      step="0.1"
                      value={formData.inflationRate || ''}
                      onChange={(e) => handleInputChange('inflationRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                </div>
              </div>

              {/* Retirement Goals */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  Retirement Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Desired Retirement Income
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.desiredRetirementIncome || ''}
                      onChange={(e) => handleInputChange('desiredRetirementIncome', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Social Security Income
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.socialSecurityIncome || ''}
                      onChange={(e) => handleInputChange('socialSecurityIncome', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Other Income
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.otherIncome || ''}
                      onChange={(e) => handleInputChange('otherIncome', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
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
                      <h3 className="text-sm font-medium text-green-900 mb-2">Real Estate Value at Retirement</h3>
                      <p className="text-2xl font-bold text-green-900">{formatCurrency(results.realEstateValueAtRetirement)}</p>
                    </div>
                  </div>

                  {/* Total Assets */}
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-medium text-purple-900 mb-2">Total Retirement Assets</h3>
                    <p className="text-3xl font-bold text-purple-900">{formatCurrency(results.totalRetirementAssets)}</p>
                  </div>

                  {/* Income Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-foreground mb-2">Annual Retirement Income</h3>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(results.annualRetirementIncome)}</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-red-900 mb-2">Income Gap</h3>
                      <p className="text-xl font-bold text-red-900">{formatCurrency(results.retirementIncomeGap)}</p>
                    </div>
                  </div>

                  {/* Retirement Readiness */}
                  <div className="p-4 rounded-lg mb-6 bg-muted">
                    <h3 className="text-lg font-medium text-foreground mb-2">Retirement Readiness</h3>
                    <p className={`text-xl font-bold mb-2 ${
                      results.retirementReadiness === 'On Track' ? 'text-green-900' :
                      results.retirementReadiness === 'Close to Target' ? 'text-yellow-900' : 'text-red-900'
                    }`}>
                      {results.retirementReadiness}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-foreground">{rec}</li>
                      ))}
                    </ul>
                  </div>

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
    </div>
  );
};

export default RetirementCalculator;
