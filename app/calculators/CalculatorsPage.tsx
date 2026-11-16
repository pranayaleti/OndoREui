"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { analyticsAttributes } from '@/lib/analytics'
import { CALCULATOR_CATALOG } from '@/lib/calculator-catalog'
import { 
  Calculator as CalcIcon,
  Home as HomeIcon,
  Landmark,
  TrendingUp as TrendingUpIcon,
  Tag,
  ArrowLeftRight,
  PiggyBank,
  ChevronRight,
  DollarSign,
  Percent,
  Building2,
  TrendingDown
} from 'lucide-react'

interface CalculatorTile {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category: string;
  color: string;
}

const CalculatorsPage: React.FC = () => {
  const tiles: CalculatorTile[] = [
    {
      id: 'owner-vs-self',
      name: 'Self-Manage vs Ondo RE',
      description: 'Compare self-managing a rental vs Ondo, including the hidden cost of your time.',
      path: '/calculators/owner-vs-self',
      icon: <Building2 className="h-8 w-8" />,
      category: 'Investment',
      color: 'from-orange-500 to-red-700',
    },
    {
      id: 'mortgage-payment',
      name: 'Mortgage Payment Calculator',
      description: 'Calculate your monthly mortgage payment including principal, interest, taxes, and insurance.',
      path: '/calculators/mortgage-payment',
      icon: <CalcIcon className="h-8 w-8" />,
      category: 'Mortgage',
      color: 'from-primary to-primary',
    },
    {
      id: 'affordability',
      name: 'Affordability Calculator',
      description: 'Determine how much house you can afford based on your income and expenses.',
      path: '/calculators/affordability',
      icon: <HomeIcon className="h-8 w-8" />,
      category: 'Mortgage',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'income',
      name: 'Income Calculator',
      description: 'Calculate required income to qualify for a specific mortgage amount.',
      path: '/calculators/income',
      icon: <TrendingUpIcon className="h-8 w-8" />,
      category: 'Mortgage',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'closing-cost',
      name: 'Closing Cost Calculator',
      description: 'Estimate all closing costs when purchasing a home.',
      path: '/calculators/closing-cost',
      icon: <Landmark className="h-8 w-8" />,
      category: 'Purchase',
      color: 'from-primary to-primary',
    },
    {
      id: 'refinance',
      name: 'Refinance Calculator',
      description: 'Analyze the benefits of refinancing your existing mortgage.',
      path: '/calculators/refinance',
      icon: <ArrowLeftRight className="h-8 w-8" />,
      category: 'Mortgage',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 'home-sale',
      name: 'Home Sale Calculator',
      description: 'Calculate net proceeds from selling your home after all costs.',
      path: '/calculators/home-sale',
      icon: <Tag className="h-8 w-8" />,
      category: 'Sale',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'temporary-buydown',
      name: 'Temporary Buydown Calculator',
      description: 'Model 2-1, 3-2-1, or flat temporary payment subsidies and estimated buydown cost.',
      path: '/calculators/temporary-buydown',
      icon: <PiggyBank className="h-8 w-8" />,
      category: 'Mortgage',
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 'rent-vs-own',
      name: 'Rent vs Own Calculator',
      description: 'Compare the financial implications of renting versus buying a home.',
      path: '/calculators/rent-vs-own',
      icon: <ArrowLeftRight className="h-8 w-8" />,
      category: 'Analysis',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 'cash-on-cash',
      name: 'Cash-on-Cash Return Calculator',
      description: 'Calculate the annual return on your actual cash investment in rental properties.',
      path: '/calculators/cash-on-cash',
      icon: <DollarSign className="h-8 w-8" />,
      category: 'Investment',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'cap-rate',
      name: 'Cap Rate Calculator',
      description: 'Calculate the capitalization rate to evaluate property income potential.',
      path: '/calculators/cap-rate',
      icon: <Percent className="h-8 w-8" />,
      category: 'Investment',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      id: 'roi',
      name: 'ROI Calculator',
      description: 'Calculate total return on investment including cash flow and appreciation.',
      path: '/calculators/roi',
      icon: <TrendingUpIcon className="h-8 w-8" />,
      category: 'Investment',
      color: 'from-violet-500 to-violet-600',
    },
    {
      id: 'dscr',
      name: 'DSCR Calculator',
      description: 'Calculate Debt Service Coverage Ratio for investment property loans.',
      path: '/calculators/dscr',
      icon: <TrendingDown className="h-8 w-8" />,
      category: 'Investment',
      color: 'from-rose-500 to-rose-600',
    },
    {
      id: 'one-percent-rule',
      name: '1% Rule Calculator',
      description: 'Two quick screens: rent as a share of price (1%) and expenses as half of rent (50%).',
      path: '/calculators/one-percent-rule',
      icon: <CalcIcon className="h-8 w-8" />,
      category: 'Investment',
      color: 'from-lime-500 to-lime-600',
    }
  ]

  // The catalog is the single source for calculator names, so a tile, the page H1,
  // and the structured data cannot drift apart.
  const calculators = tiles.map((tile) => ({ ...tile, name: CALCULATOR_CATALOG[tile.id]?.name ?? tile.name }))

  const categories = ['All', 'Mortgage', 'Purchase', 'Sale', 'Analysis', 'Investment']

  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredCalculators = selectedCategory === 'All' 
    ? calculators 
    : calculators.filter(calc => calc.category === selectedCategory)

  return (
    <div className="bg-background text-foreground">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-foreground md:text-5xl lg:text-6xl">
            Real Estate Calculators
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-foreground/70 md:text-xl">
            Free tools to model mortgage, purchase, and investment scenarios with clear example rates
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        {/* Category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors ${
                selectedCategory === category
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-transparent text-foreground/80 hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Calculator tiles */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCalculators.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">No calculators found in this category.</p>
            </div>
          ) : (
            filteredCalculators.map((calculator) => (
              <Link
                key={calculator.id}
                href={calculator.path}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                {...analyticsAttributes('calculator_tile_click', 'calculators_hub', calculator.id)}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:h-5 [&_svg]:w-5">
                    {calculator.icon}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{calculator.category}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{calculator.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/70">{calculator.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                  Use Calculator
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Why use our calculators */}
        <div className="mt-16 grid gap-8 border-t border-border pt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Why Use Our Calculators?</h2>
            <p className="mt-3 max-w-sm text-foreground/70">
              Transparent formulas with example defaults you can adjust
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="text-lg font-bold text-foreground">Clear Calculations</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">Standard amortization formulas with example rates you can edit, not live market quotes</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Save Time</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">Quick calculations that would take hours to do manually</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Make Better Decisions</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">Compare scenarios and understand the financial impact of your choices</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-foreground/70 lg:col-span-12">
            Please verify all calculations with a qualified professional. We are not responsible for financial decisions made based on these calculators.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CalculatorsPage