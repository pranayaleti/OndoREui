"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Home, Building2, Eye, EyeOff } from 'lucide-react';
import { LoanProgram, getProgramMI, clampCreditScore } from '@/lib/mortgage-utils';
import { useFinancialVisibility } from '@/lib/financial-visibility';

interface RentVsOwnData {
  // Rent scenario
  monthlyRent: number;
  rentIncrease: number;
  securityDeposit: number;
  rentersInsurance: number;
  
  // Buy scenario
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  homeownersInsurance: number;
  pmi: number;
  maintenance: number;
  hoa: number;
  program: LoanProgram;
  creditScore: number;
  
  // Analysis period
  analysisYears: number;
  
  // Investment assumptions
  investmentReturn: number;
  homeAppreciation: number;
}

interface RentVsOwnResults {
  rentTotalCost: number;
  buyTotalCost: number;
  buyTotalCostWithInvestment: number;
  breakEvenYears: number;
  monthlyRentEquivalent: number;
  annualComparison: Array<{
    year: number;
    rentCost: number;
    buyCost: number;
    principalPaid: number;
    equity: number;
    buyWithInvestment: number;
    difference: number;
  }>;
  recommendation: string;
  explanation: string;
}

const RentVsOwnCalculator: React.FC = () => {
  const [formData, setFormData] = useState<RentVsOwnData>({
    monthlyRent: 2000,
    rentIncrease: 3,
    securityDeposit: 2000,
    rentersInsurance: 200,
    homePrice: 400000,
    downPayment: 80000,
    interestRate: 4.5,
    loanTerm: 30,
    propertyTax: 4000,
    homeownersInsurance: 1200,
    pmi: 0,
    maintenance: 3000,
    hoa: 0,
    program: 'conventional',
    creditScore: 740,
    analysisYears: 10,
    investmentReturn: 7,
    homeAppreciation: 3
  });

  const [results, setResults] = useState<RentVsOwnResults | null>(null);
  const { showValues, toggle } = useFinancialVisibility();

  useEffect(() => {
    calculateRentVsOwn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const calculateRentVsOwn = () => {
    const {
      monthlyRent,
      rentIncrease,
      securityDeposit,
      rentersInsurance,
      homePrice,
      downPayment,
      interestRate,
      loanTerm,
      propertyTax,
      homeownersInsurance,
      maintenance,
      hoa,
      analysisYears,
      investmentReturn,
      homeAppreciation
    } = formData;

    // Calculate loan details
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // Calculate monthly costs for buying
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeownersInsurance / 12;
    const monthlyMaintenance = maintenance / 12;
    const monthlyHoa = hoa / 12;
    // Program MI overrides simple PMI when applicable
    const credit = clampCreditScore(formData.creditScore);
    const programMI = getProgramMI(formData.program, loanAmount, homePrice, credit, loanTerm, downPayment).monthlyMI;
    const totalMonthlyBuy = monthlyPayment + monthlyTax + monthlyInsurance + programMI + monthlyMaintenance + monthlyHoa;

    // Calculate annual comparison
    const annualComparison = [];
    let rentTotalCost = 0;
    let buyTotalCost = 0;
    let currentRent = monthlyRent;
    let currentHomeValue = homePrice;
    let remainingLoan = loanAmount;

    for (let year = 1; year <= analysisYears; year++) {
      // Rent costs
      const annualRentCost = currentRent * 12 + (year === 1 ? securityDeposit : 0) + rentersInsurance;
      rentTotalCost += annualRentCost;
      currentRent *= (1 + rentIncrease / 100);

      // Buy costs
      const annualBuyCost = totalMonthlyBuy * 12;
      buyTotalCost += annualBuyCost;

      // Home appreciation
      currentHomeValue *= (1 + homeAppreciation / 100);

      // Equity accumulation (approximate principal paid this year)
      let principalPaidThisYear = 0;
      for (let m = 0; m < 12; m++) {
        const interestPortion = remainingLoan * monthlyRate;
        const principalPortion = monthlyPayment - interestPortion;
        remainingLoan = Math.max(0, remainingLoan - principalPortion);
        principalPaidThisYear += principalPortion;
      }
      const equity = Math.max(0, currentHomeValue - remainingLoan);

      // Investment opportunity cost (what down payment + monthly difference could earn)
      const monthlyDifference = totalMonthlyBuy - currentRent;
      const investmentOpportunity = downPayment * Math.pow(1 + investmentReturn / 100, year) + 
        monthlyDifference * 12 * Math.pow(1 + investmentReturn / 100, year - 0.5);

      annualComparison.push({
        year,
        rentCost: annualRentCost,
        buyCost: annualBuyCost,
        principalPaid: principalPaidThisYear,
        equity,
        buyWithInvestment: annualBuyCost + investmentOpportunity,
        difference: annualBuyCost - annualRentCost
      });
    }

    // Break-even: year when net cost of buying (costs minus equity) drops below renting
    let breakEvenYears = 0;
    let cumulativeRent = 0;
    let cumulativeBuy = 0;
    
    for (let year = 1; year <= analysisYears; year++) {
      cumulativeRent += annualComparison[year - 1].rentCost;
      cumulativeBuy += annualComparison[year - 1].buyCost;
      const equityBuilt = annualComparison[year - 1].equity - downPayment;
      
      if ((cumulativeBuy - equityBuilt) <= cumulativeRent) {
        breakEvenYears = year;
        break;
      }
    }

    // Calculate monthly rent equivalent (what rent would need to be to match buying)
    const monthlyRentEquivalent = totalMonthlyBuy;

    // Determine recommendation
    let recommendation = '';
    let explanation = '';

    if (breakEvenYears <= 3) {
      recommendation = 'Buying is likely the better choice';
      explanation = 'You\'ll break even within 3 years, making buying financially advantageous.';
    } else if (breakEvenYears <= 7) {
      recommendation = 'Buying could be beneficial';
      explanation = 'Moderate break-even time suggests buying may be worthwhile if you plan to stay long-term.';
    } else {
      recommendation = 'Renting may be more cost-effective';
      explanation = 'Long break-even time suggests renting could be cheaper in the short to medium term.';
    }

    setResults({
      rentTotalCost,
      buyTotalCost,
      buyTotalCostWithInvestment: buyTotalCost + (downPayment * Math.pow(1 + investmentReturn / 100, analysisYears)),
      breakEvenYears,
      monthlyRentEquivalent,
      annualComparison,
      recommendation,
      explanation
    });
  };

  const handleInputChange = (field: keyof RentVsOwnData, value: number | string) => {
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Monthly Rent
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.monthlyRent || ''}
                      onChange={(e) => handleInputChange('monthlyRent', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Rent Increase (%)
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      step="0.1"
                      value={formData.rentIncrease || ''}
                      onChange={(e) => handleInputChange('rentIncrease', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Security Deposit
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.securityDeposit || ''}
                      onChange={(e) => handleInputChange('securityDeposit', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Renters Insurance
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.rentersInsurance || ''}
                      onChange={(e) => handleInputChange('rentersInsurance', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                </div>
              </div>

              {/* Buy Scenario */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-primary" />
                  Buy Scenario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Home Price
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.homePrice || ''}
                      onChange={(e) => handleInputChange('homePrice', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Down Payment
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.downPayment || ''}
                      onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      step="0.1"
                      value={formData.interestRate || ''}
                      onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
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
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Credit Score
                  </label>
                  <input
                    type="number"
                    onFocus={(e) => e.target.select()}
                    min={300}
                    max={850}
                    value={formData.creditScore || ''}
                    onChange={(e) => handleInputChange('creditScore', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                  />
                </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Loan Term (years)
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.loanTerm || ''}
                      onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Property Tax
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.propertyTax || ''}
                      onChange={(e) => handleInputChange('propertyTax', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Homeowners Insurance
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.homeownersInsurance || ''}
                      onChange={(e) => handleInputChange('homeownersInsurance', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual Maintenance
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.maintenance || ''}
                      onChange={(e) => handleInputChange('maintenance', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Annual HOA Fees
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.hoa || ''}
                      onChange={(e) => handleInputChange('hoa', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary input-no-spinner"
                    />
                  </div>
                </div>
              </div>

              {/* Analysis Settings */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Analysis Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Analysis Period (years)
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      value={formData.analysisYears || ''}
                      onChange={(e) => handleInputChange('analysisYears', Number(e.target.value))}
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
                      Home Appreciation (%)
                    </label>
                    <input
                      type="number"
                    onFocus={(e) => e.target.select()}
                      step="0.1"
                      value={formData.homeAppreciation || ''}
                      onChange={(e) => handleInputChange('homeAppreciation', Number(e.target.value))}
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
                      <strong>Break-even point:</strong> {results.breakEvenYears} years
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
                                year.difference > 0 ? 'text-destructive' : 'text-primary'
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
    </div>
  );
};

export default RentVsOwnCalculator;
