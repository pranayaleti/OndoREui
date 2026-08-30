"use client"

import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import { Calendar, User, ArrowRight, MapPin } from "lucide-react"

export default function BlogPage() {
  const featuredPost = {
    title: "Remote Online Notary in All 50 States",
    excerpt: "How ONDO Notary delivers secure Remote Online Notarization nationwide with ID checks, audit trails, and lender-ready documents.",
    author: "ONDO Notary Team",
    date: "January 10, 2025",
    readTime: "6 min read",
    category: "Notary",
    image: "/modern-office-building.png",
    slug: "remote-online-notary-all-50-states"
  }

  const blogPosts = useMemo(() => ([
    {
      title: "What a Lock Does If Rates Drop After You Lock",
      excerpt: "A lock does not automatically follow the market down. Distinct from extension vs floating. Not a live-rate table.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Mortgages",
      image: "/suburban-house-garden.png",
      slug: "rate-lock-if-rates-drop"
    },
    {
      title: "Escrow Shortage After the First Year",
      excerpt: "How a shortage appears on the first annual analysis, and typical options to pay or spread. Not tax advice.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "escrow-shortage-after-first-year"
    },
    {
      title: "Hill AFB / VA: Certificate of Eligibility and Occupancy",
      excerpt: "Davis County, Utah. COE and occupancy — not a mill doorway. Occupancy must match use.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "9 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "hill-afb-va-coe-occupancy"
    },
    {
      title: "Delayed Financing After a Cash Purchase",
      excerpt: "Agency delayed-financing exception. Distinct from HELOC seasoning. Overlay is not a statute.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "9 min read",
      category: "Refinance",
      image: "/modern-townhouse-garage.png",
      slug: "delayed-financing-after-cash-purchase"
    },
    {
      title: "Cosign vs Co-Borrower",
      excerpt: "Who is on the note, who is on title, and who is only helping credit.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "cosign-vs-co-borrower"
    },
    {
      title: "First-Time Buyer Mistakes That Are Really File Mistakes",
      excerpt: "New debt, job change, large deposits, occupancy — not a generic homebuying listicle.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "first-time-buyer-file-mistakes"
    },
    {
      title: "How Long a First Purchase Usually Takes",
      excerpt: "Pre-approval through CTC and funding. Ranges, not a closing-date promise.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "how-long-first-purchase-takes"
    },
    {
      title: "Closing a Credit Card Before You Apply",
      excerpt: "Closing a card can raise utilization by shrinking available credit. Not a score-raise method.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "closing-credit-card-before-mortgage"
    },
    {
      title: "Hazard vs HO-3 vs HO-6",
      excerpt: "Lender hazard coverage vs HO-3 for a house vs HO-6 plus master for a condo. Not insurance advice.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/modern-townhouse-garage.png",
      slug: "hazard-vs-ho3-vs-ho6-condo-insurance"
    },
    {
      title: "Selling with a VA Loan: Entitlement Restoration",
      excerpt: "Restoration after sale and payoff. Distinct from keeping a VA loan and buying another. No entitlement dollars.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "selling-with-va-loan-entitlement-restoration"
    },
    {
      title: "CPA Letter vs Tax Returns: What Actually Moves Underwriting",
      excerpt: "Agency files are moved by returns and transcripts. A CPA letter supports; it does not replace the stack.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "cpa-letter-vs-tax-returns-underwriting"
    },
    {
      title: "Rate Lock Extension vs Floating",
      excerpt: "A lock holds a quoted rate for a window. An extension is usually a cost. Not a live-rate table.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Mortgages",
      image: "/suburban-house-garden.png",
      slug: "rate-lock-extension-vs-floating"
    },
    {
      title: "“No Closing Cost” Refinance: The Cost Is in the Rate",
      excerpt: "A lender credit that covers fees is usually paid for with a higher note rate. Run break-even.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Refinance",
      image: "/modern-office-building.png",
      slug: "no-closing-cost-refinance-rate-credit-tradeoff"
    },
    {
      title: "What a Tri-Merge Credit Report Actually Shows",
      excerpt: "Equifax, Experian, and TransUnion. Mortgage files often use classic FICO and the middle score.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "what-a-tri-merge-credit-report-shows"
    },
    {
      title: "Earnest Money vs Down Payment vs Closing Costs",
      excerpt: "Three cash lines. Earnest money is usually credited at closing. Timing and the Utah REPC still matter.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "earnest-money-vs-down-payment-vs-closing-costs"
    },
    {
      title: "Townhome vs Condo: HOA Docs a Lender Will Ask For",
      excerpt: "Not every townhome is a condo. Lenders underwrite the legal regime, not the listing photo.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/modern-townhouse-garage.png",
      slug: "townhome-vs-condo-hoa-docs-lenders-ask"
    },
    {
      title: "Mortgage Reserves: How Many Months of PITIA",
      excerpt: "Remaining liquid assets after cash to close. Not extra closing costs. Gift funds often cannot fill this line.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "mortgage-reserves-months-of-pitia"
    },
    {
      title: "Asset-Depletion Qualifying: Retirement and Investment Assets",
      excerpt: "Eligible assets as qualifying income under a written formula. Not cash means approved.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "asset-depletion-qualifying-non-qm"
    },
    {
      title: "Gig Plus W-2 Mix: How the Average Is Built",
      excerpt: "Two streams averaged separately, then added. A peak gig month is not the qualifying method.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "gig-plus-w2-income-mortgage-average"
    },
    {
      title: "First Rental: Occupancy If You Still Live in Your Home",
      excerpt: "Stay-put rental is investment occupancy. Distinct from a duplex house-hack. Not occupancy coaching.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "first-rental-occupancy-if-you-still-live-there"
    },
    {
      title: "Depreciation Add-Back: What Agency Files Allow",
      excerpt: "How underwriters add depreciation back on Schedule E. Not tax advice.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "depreciation-add-back-schedule-e"
    },
    {
      title: "Compensating Factors That Appear in Findings",
      excerpt: "Documented strengths in AUS or manual underwriting. Not a guarantee findings will flip.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "compensating-factors-in-aus-findings"
    },
    {
      title: "Utah Property Tax Calendar vs Your First Escrow Analysis",
      excerpt: "Typically due November 30, billed once a year. Why the first impound analysis can surprise.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "utah-property-tax-calendar-first-escrow-analysis"
    },
    {
      title: "Escrow: How the Cushion Is Set, Why It Changes",
      excerpt: "RESPA generally caps the cushion at about two months of disbursements. Not a universal formula.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "escrow-cushion-how-it-is-set"
    },
    {
      title: "USDA vs VA vs FHA for a Veteran in a Rural Tract",
      excerpt: "Comparison of typical tests. Not a recommendation to take one program.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "9 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "usda-vs-va-vs-fha-veteran-rural"
    },
    {
      title: "HELOC After Year Two vs Cash-Out",
      excerpt: "Seasoning overlays after a recent closing. Not a remake of HELOC vs cash-out structure.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Refinance",
      image: "/modern-townhouse-garage.png",
      slug: "heloc-after-year-two-vs-cash-out"
    },
    {
      title: "Cross-Collateral and Using Equity to Buy Another House",
      excerpt: "Pledging more than one property versus cash-out or a HELOC. Not a published agency product.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "cross-collateral-equity-to-buy-another-house"
    },
    {
      title: "Biweekly Extra Principal vs Refinance",
      excerpt: "One extra payment a year versus a new note. This page does not quote interest saved.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Refinance",
      image: "/modern-office-building.png",
      slug: "biweekly-extra-principal-vs-refinance"
    },
    {
      title: "ITIN / Non-U.S. Citizen Mortgage Documentation",
      excerpt: "Legal eligibility and document categories. Not a national-origin preference.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "itin-non-us-citizen-mortgage-documentation"
    },
    {
      title: "DSCR vs Full-Doc Rental Loan",
      excerpt: "DSCR qualifies on rent versus the payment. Full-doc qualifies the borrower. Occupancy still has to match use.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "dscr-vs-full-doc-rental-loan"
    },
    {
      title: "Business Bank vs Personal: Co-Mingling That Stalls Files",
      excerpt: "Business deposits in a personal account stall sourcing and deposit averages.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "business-vs-personal-bank-co-mingling"
    },
    {
      title: "What a Utah REPC Deadline Actually Does to Your Loan",
      excerpt: "Due diligence and financing are separate 5:00 p.m. Mountain Time clocks. Not legal advice.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "utah-repc-deadline-and-your-loan"
    },
    {
      title: "Second Home vs Investment Occupancy",
      excerpt: "Three occupancy types. Misstating occupancy is fraud, not a strategy.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Loan Programs",
      image: "/suburban-house-garden.png",
      slug: "second-home-vs-investment-occupancy"
    },
    {
      title: "Cash-Out to Buy a Rental: Occupancy and LTV Traps",
      excerpt: "Two properties, two occupancy answers, two LTV tests.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Refinance",
      image: "/modern-townhouse-garage.png",
      slug: "cash-out-to-buy-a-rental"
    },
    {
      title: "Medical Collections After the FICO Model Change",
      excerpt: "Bureau reporting changed. Mortgage tri-merge scores are often still classic FICO. Not a score-raise promise.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "medical-collections-after-fico-model-change"
    },
    {
      title: "No Traditional Credit / Alternative Credit",
      excerpt: "Rent and utilities can document a thin file. Weak traditional credit is a different path.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "no-traditional-credit-alternative-credit"
    },
    {
      title: "House-Hacking a Duplex with FHA",
      excerpt: "Occupy one unit as your home. Self-sufficiency is a 3–4 unit test, not a duplex test.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/suburban-house-garden.png",
      slug: "house-hacking-duplex-with-fha"
    },
    {
      title: "Relocating to Utah: Job Seasoning When Work Starts in 60 Days",
      excerpt: "An offer letter can sometimes qualify before the first paycheck. Sixty days is not a published rule.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "relocating-to-utah-job-seasoning"
    },
    {
      title: "APR vs Rate on a Loan Estimate",
      excerpt: "Note rate prices P&I. APR includes most lender prepaid finance charges. Not a live-rate table.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Mortgages",
      image: "/suburban-house-garden.png",
      slug: "apr-vs-rate-on-a-loan-estimate"
    },
    {
      title: "Should I Wait for 20% Down?",
      excerpt: "Waiting can avoid conventional PMI. Buying sooner is a cash-and-timeline trade — not how MIP later ends.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "should-i-wait-for-20-percent-down"
    },
    {
      title: "Removing PMI: Original Value vs New Appraisal",
      excerpt: "HPA uses original value. A new appraisal of current value is a separate investor path.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "pmi-removal-original-value-vs-new-appraisal"
    },
    {
      title: "Discount Points: Breakeven Without a Sales Pitch",
      excerpt: "One point is typically 1% of the loan. Break-even is cost divided by monthly P&I savings.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Mortgages",
      image: "/suburban-house-garden.png",
      slug: "discount-points-breakeven-without-sales-pitch"
    },
    {
      title: "What a Mortgage Conversation Asks",
      excerpt: "Occupancy, income type, debts, assets. A conversation is not approval or a lock.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Mortgages",
      image: "/modern-office-building.png",
      slug: "what-a-mortgage-conversation-asks"
    },
    {
      title: "New Auto Loan During Underwriting",
      excerpt: "A car payment signed after pre-approval usually shows on the next credit pull and changes DTI.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "new-auto-loan-during-underwriting"
    },
    {
      title: "DTI: Front-End vs Back-End with HOA",
      excerpt: "HOA dues are housing expense. A modest PITI plus a large HOA can still fail the ratio.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "dti-frontend-backend-with-hoa"
    },
    {
      title: "Pre-Approval vs AUS vs Clear to Close",
      excerpt: "Three documents, three jobs. A letter is not findings, and findings are not CTC.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "pre-approval-vs-aus-vs-clear-to-close"
    },
    {
      title: "Using a Spouse’s W-2 to Offset 1099 Volatility",
      excerpt: "The W-2 helps when that person is a co-borrower. Utah is not a community-property state.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "spouse-w2-offset-1099-volatility"
    },
    {
      title: "Temporary Buydown: Who Pays, What Happens in Year 3",
      excerpt: "2-1 and 3-2-1 subsidize the payment for a few years. The note rate does not change.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Mortgages",
      image: "/suburban-house-garden.png",
      slug: "temporary-buydown-who-pays-year-three"
    },
    {
      title: "K-1 Income: What Usually Counts",
      excerpt: "Partnership and S-corp K-1 income is taken from the form, not from distributions alone.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "k-1-income-what-usually-counts"
    },
    {
      title: "Rental Income on Schedule E in a Purchase File",
      excerpt: "Schedule E is history on properties you already own. Proposed rent is a different calculation.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "schedule-e-rental-income-purchase-file"
    },
    {
      title: "I Just Went 1099 Last Month",
      excerpt: "A brand-new 1099 job is usually not yet a qualifying average.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "just-went-1099-last-month"
    },
    {
      title: "Parent Is Gifting: Who Signs What",
      excerpt: "Gift letter and donor trail — not a quiet extra signature on the deed.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "parent-gifting-down-payment-who-signs"
    },
    {
      title: "Student Loans and DTI After IDR / SAVE Changes",
      excerpt: "A $0 dashboard line is not automatically $0 in underwriting.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "student-loans-dti-idr-save"
    },
    {
      title: "ARM Caps in Plain English",
      excerpt: "Initial, periodic, and lifetime caps limit the note rate — not the rest of the payment.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Mortgages",
      image: "/suburban-house-garden.png",
      slug: "arm-caps-in-plain-english"
    },
    {
      title: "FHA Condo Roster / Project Approval",
      excerpt: "Look the building up on HUD’s list before you write an FHA offer.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "fha-condo-roster-project-approval"
    },
    {
      title: "How MIP vs PMI Actually Leaves the Loan",
      excerpt: "FHA annual MIP is timed from original LTV. Conventional PMI can often come off with equity.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "mip-vs-pmi-how-mortgage-insurance-ends"
    },
    {
      title: "Streamline Refi: What “Less Docs” Still Requires",
      excerpt: "FHA Streamline and VA IRRRL reduce documentation. Occupancy and net benefit still apply.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "8 min read",
      category: "Refinance",
      image: "/modern-office-building.png",
      slug: "fha-va-streamline-refinance-less-docs"
    },
    {
      title: "Large Deposits: 60-Day Paper Trail",
      excerpt: "Large deposits in the statement window have to be sourced. Undocumented cash stalls files.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "large-deposits-60-day-paper-trail"
    },
    {
      title: "Two Years of Tax Returns vs One Year: When Overlays Allow",
      excerpt: "Most agency self-employed files want two years of returns. Some overlays allow one year in the same line of work.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "two-years-of-tax-returns-vs-one-year-mortgage"
    },
    {
      title: "Overtime on a W-2: What “Likely to Continue” Means",
      excerpt: "Underwriters usually average overtime over a documented history. A strong month is not a qualifying method.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "w2-overtime-likely-to-continue"
    },
    {
      title: "Commission-Only Sales: Averaging and a Down Year",
      excerpt: "Commission income is typically averaged, and a down year usually counts.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "commission-income-mortgage-averaging"
    },
    {
      title: "How Much Cash Do I Need Besides Down Payment in Utah?",
      excerpt: "Earnest money, title, origination, prepaids, and reserves sit on top of down payment.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "utah-cash-to-close-besides-down-payment"
    },
    {
      title: "UHC / DPA Stacked with an FHA Gift",
      excerpt: "Down payment assistance is often a second lien. A gift is not. How they can sit on the same FHA file.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "dpa-stacked-with-fha-gift-funds"
    },
    {
      title: "VA Funding Fee: Finance vs Pay Cash",
      excerpt: "Worked examples of financing the fee versus paying it in cash. Snapshot percents, not a quote.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "va-funding-fee-finance-vs-pay-cash"
    },
    {
      title: "Can I Use VA If I Still Have a VA Loan?",
      excerpt: "Remaining entitlement, occupancy, and restoration when the first VA loan is still open.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "va-entitlement-second-va-loan"
    },
    {
      title: "VA Residual Income vs DTI",
      excerpt: "Residual income is leftover cash after PITI. It can fail when DTI looks fine.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "va-residual-income-vs-dti"
    },
    {
      title: "USDA Map and Income Limit: Am I Even Eligible?",
      excerpt: "USDA is address-specific and household-income-specific. Use the official tools first.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "usda-map-income-limit-eligibility"
    },
    {
      title: "Jumbo vs Conforming: Look Up This Year’s FHFA County Limit",
      excerpt: "A jumbo loan is above the FHFA limit for that county-year. Do not memorize a blog number.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "jumbo-vs-conforming-fhfa-county-limit"
    },
    {
      title: "When a Lower Rate Still Loses After Costs",
      excerpt: "Break-even months include points and origination. A lower note rate can still lose if you move first.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Refinance",
      image: "/modern-office-building.png",
      slug: "refinance-break-even-when-lower-rate-loses"
    },
    {
      title: "Cash-Out vs HELOC: Payment, Lien Position, and Tax Questions",
      excerpt: "A cash-out replaces the first lien. A HELOC sits in second position. Not tax advice.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Refinance",
      image: "/modern-townhouse-garage.png",
      slug: "heloc-vs-cash-out-refinance"
    },
    {
      title: "How Underwriters Verify Income (W-2 vs 1099 vs Bank)",
      excerpt: "Each stack proves a durable average with different paper.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "how-underwriters-verify-income"
    },
    {
      title: "Declined After Pre-Approval: Typical Condition Fails",
      excerpt: "A pre-approval is not a commitment to lend. Job changes, deposits, and new debt are the usual late fails.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "declined-after-pre-approval"
    },
    {
      title: "Closing Costs in Utah: Title, Origination, and Prepaids",
      excerpt: "Utah funds at title companies and has no statewide transfer tax. Fees still vary by county.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "utah-closing-costs-title-origination-prepaids"
    },
    {
      title: "Utah County Conforming Limit Lookup (How-To)",
      excerpt: "How to look up this year’s FHFA limit. Summit is not Salt Lake.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "5 min read",
      category: "Mortgages",
      image: "/modern-office-building.png",
      slug: "utah-county-conforming-loan-limit-lookup"
    },
    {
      title: "Can I Get a Mortgage If My Income Changes Every Month?",
      excerpt: "Yes, if you can document a pattern. Underwriters typically average 12–24 months of variable income rather than last month’s paycheck.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "can-i-get-a-mortgage-if-my-income-changes-every-month"
    },
    {
      title: "1099 Mortgage Documentation Checklist",
      excerpt: "What contract and gig workers typically gather: returns, transcripts, YTD P&L, statements, and contracts.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "Credit",
      image: "/modern-office-building.png",
      slug: "1099-mortgage-documentation-checklist"
    },
    {
      title: "Bank-Statement Loans When Tax Returns Undercount Income",
      excerpt: "When write-offs shrink taxable income, some Non-QM programs look at deposits. Who they are for, and what they are not.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "7 min read",
      category: "Loan Programs",
      image: "/modern-office-building.png",
      slug: "bank-statement-loans-when-tax-returns-undercount-income"
    },
    {
      title: "Gift Funds for a Down Payment: What Lenders Need to See",
      excerpt: "Gift letters, paper trails, and program differences. Family help is common. Undocumented cash is not.",
      author: "Ondo RE Team",
      date: "August 29, 2026",
      readTime: "6 min read",
      category: "First-Time Buyers",
      image: "/suburban-house-garden.png",
      slug: "gift-funds-down-payment-rules"
    },
    {
      title: "FHA vs Conventional Loans in Utah: Which Is Right for You?",
      excerpt: "Down payment, mortgage insurance, credit, and stay-vs-refinance scenarios for Utah buyers.",
      author: "Ondo RE Team",
      date: "March 23, 2026",
      readTime: "8 min read",
      category: "Mortgages",
      image: "/modern-apartment-balcony.webp",
      slug: "fha-vs-conventional-loans-utah"
    },
    {
      title: "The Hidden Math Behind Renting vs Owning",
      excerpt: "Opportunity cost, equity velocity, and inflation-adjusted rent modeled by a developer-landlord.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "7 min read",
      category: "Finance",
      image: "/modern-office-building.png",
      slug: "renting-vs-owning-hidden-math"
    },
    {
      title: "I’m a Full-Stack Dev and Landlord: What Software Gets Wrong",
      excerpt: "UX gaps in property software and how to design flows that serve tenants and owners.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Product",
      image: "/modern-townhouse-garage.png",
      slug: "full-stack-dev-landlord-gaps"
    },
    {
      title: "Commercial Real Estate 101: Cap Rates, NNN, and Tenant Mix",
      excerpt: "A practical primer on how cap rates, lease structures, and tenant mix shape CRE value.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "7 min read",
      category: "Commercial",
      image: "/modern-office-building.png",
      slug: "commercial-real-estate-101-tenant-mix"
    },
    {
      title: "Crypto and Real Estate: Building a Barbell Hedge",
      excerpt: "Balancing fast, volatile assets with slow, cashflowing rentals, without co-mingling risk.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Strategy",
      image: "/modern-apartment-balcony.png",
      slug: "crypto-and-real-estate-hedge"
    },
    {
      title: "New Landlord Mistakes and the Systems That Prevent Them",
      excerpt: "Documentation, reserves, maintenance states, and comms playbooks to avoid expensive errors.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Landlording",
      image: "/modern-office-building.png",
      slug: "new-landlord-mistakes-systems"
    },
    {
      title: "Utah Rent vs Buy: Wasatch Front Playbook",
      excerpt: "Corridor-specific math on taxes, transit, schools, and maintenance along the Wasatch Front.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "7 min read",
      category: "Utah",
      image: "/city-map-with-pin.png",
      slug: "utah-rent-vs-buy-wasatch-front",
      cities: ["Salt Lake City", "Draper", "Lehi", "Provo", "Ogden"],
    },
    {
      title: "Property Management Automation Checklist",
      excerpt: "High-ROI automations for rent, maintenance, and owner reporting, built by a dev-operator.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Automation",
      image: "/modern-office-building.png",
      slug: "property-management-automation-checklist"
    },
    {
      title: "Vacancy Risk Playbook",
      excerpt: "Model, reduce, and recover from vacancy with renewals, turns, and seasonality tactics.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Vacancy",
      image: "/modern-apartment-balcony.png",
      slug: "vacancy-risk-playbook"
    },
    {
      title: "Maintenance and CapEx Strategy for Rentals",
      excerpt: "Lifecycle intervals, reserves, and standardization to keep NOI stable and assets healthy.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Maintenance",
      image: "/modern-office-building.png",
      slug: "maintenance-capex-strategy"
    },
    {
      title: "Home Maintenance Schedule: A Monthly & Annual Checklist",
      excerpt: "A complete home-care checklist, filters, HVAC, gutters, winterizing, and how ONDO auto-reminds you.",
      author: "ONDO Team",
      date: "July 24, 2026",
      readTime: "6 min read",
      category: "Home Care",
      image: "/modern-townhouse-garage.png",
      slug: "home-maintenance-schedule"
    },
    {
      title: "Finishing a Basement: Costs, Permits & ROI",
      excerpt: "What a finished basement really costs, the permits and egress rules that matter, and how the ROI compares to other projects.",
      author: "ONDO Team",
      date: "July 24, 2026",
      readTime: "6 min read",
      category: "Home Improvement",
      image: "/modern-townhouse-garage.png",
      slug: "finishing-basement-roi"
    },
    {
      title: "Backyard Upgrades & Lawn Care: A Seasonal Fertilizer Guide",
      excerpt: "Value-adding backyard projects plus a simple Utah fertilizer schedule and the common DIY fixes that keep a yard healthy.",
      author: "ONDO Team",
      date: "July 24, 2026",
      readTime: "6 min read",
      category: "Home Improvement",
      image: "/modern-apartment-balcony.png",
      slug: "backyard-upgrades-and-fertilizer-guide"
    },
    {
      title: "Cash-on-Cash Return, Explained (with the Math)",
      excerpt: "What cash-on-cash measures, the exact formula, a worked example, and how it differs from cap rate and CAGR.",
      author: "ONDO Team",
      date: "July 24, 2026",
      readTime: "6 min read",
      category: "Finance",
      image: "/modern-office-building.png",
      slug: "cash-on-cash-return-explained"
    },
    {
      title: "Mortgage Pay-Down Hacks That Actually Save Interest",
      excerpt: "Biweekly payments, extra principal, recasting, and refinancing, which tactics really move the needle, and when not to.",
      author: "ONDO Team",
      date: "July 24, 2026",
      readTime: "6 min read",
      category: "Finance",
      image: "/modern-office-building.png",
      slug: "mortgage-paydown-hacks"
    },
    {
      title: "Dashboards for Landlords: See Patterns, Act Faster",
      excerpt: "KPIs, design principles, and build notes for turning rentals into a managed system.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Analytics",
      image: "/modern-office-building.png",
      slug: "dashboards-for-landlords"
    },
    {
      title: "Building a High-Performance Real Estate Platform with Next.js 15 and Supabase",
      excerpt: "A technical deep dive into the architecture of Ondo Real Estate, featuring App Router, React Server Components, and Supabase.",
      author: "Engineering Team",
      date: "December 10, 2025",
      readTime: "8 min read",
      category: "Engineering",
      image: "/modern-office-building.png",
      slug: "building-high-performance-real-estate-nextjs-supabase"
    },
    {
      title: "Engineering Accuracy: Behind the Scenes of Real Estate Investment Calculators",
      excerpt: "How we built the web's most accurate real estate financial calculators using React and TypeScript.",
      author: "Engineering Team",
      date: "December 10, 2025",
      readTime: "7 min read",
      category: "Engineering",
      image: "/modern-townhouse-garage.png",
      slug: "engineering-real-estate-investment-calculators"
    },
    {
      title: "Modernizing Legal Workflows: Integrating Remote Online Notary Services",
      excerpt: "How we integrated seamless booking for mobile and remote online notary services directly into the Ondo platform.",
      author: "Product Team",
      date: "December 10, 2025",
      readTime: "5 min read",
      category: "Product",
      image: "/modern-apartment-balcony.png",
      slug: "modernizing-notary-workflows-integration"
    },
    {
      title: "Technical SEO for Real Estate: JSON-LD, Sitemaps, and Core Web Vitals",
      excerpt: "A blueprint for dominating local real estate search results using Next.js SEO primitives and structured data.",
      author: "Growth Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "SEO",
      image: "/modern-office-building.png",
      slug: "technical-seo-for-real-estate"
    },
    {
      title: "Designing a Property Owner Portal: Managing Assets at Scale",
      excerpt: "How we built a comprehensive dashboard for landlords to track performance, manage tenants, and organize documents.",
      author: "Product Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Product",
      image: "/modern-office-building.png",
      slug: "designing-property-owner-portal"
    },
    {
      title: "Notary in Utah County: Remote Online Notarization, Fees, and How to Book",
      excerpt: "RON for Lehi, Provo, Orem, and the rest of Utah County, posted fees, same-day when we can, no mobile travel appointments.",
      author: "ONDO Notary Team",
      date: "January 10, 2025",
      readTime: "6 min read",
      category: "Notary",
      image: "/modern-apartment-balcony.png",
      slug: "mobile-notary-utah-county-guide"
    },
    {
      title: "Remote Online Notary for Real Estate Closings",
      excerpt: "Step-by-step RON workflow for purchases, refis, HELOCs, and investor deals with title-ready audit trails.",
      author: "ONDO Notary Team",
      date: "January 10, 2025",
      readTime: "7 min read",
      category: "Notary",
      image: "/modern-townhouse-garage.png",
      slug: "remote-online-notary-real-estate-closings"
    },
    {
      title: "Checklist: Prepare for Your Remote Online Notary Session",
      excerpt: "ID verification, tech checks, and witness tips to avoid rescheduling and get sealed PDFs instantly.",
      author: "ONDO Notary Team",
      date: "January 10, 2025",
      readTime: "5 min read",
      category: "Notary",
      image: "/modern-office-building.png",
      slug: "prepare-for-remote-online-notary-session"
    },
    {
      title: "First-Time Home Buyer Guide: Everything You Need to Know",
      excerpt: "Complete guide to buying your first home in Utah, from pre-approval to closing day.",
      author: "Sarah Johnson",
      date: "December 10, 2024",
      readTime: "8 min read",
      category: "Buying Guide",
      image: "/suburban-house-garden.png",
      slug: "first-time-home-buyer-guide"
    },
    {
      title: "Property Management Tips for Utah Landlords",
      excerpt: "Essential tips for managing rental properties in Utah's competitive market.",
      author: "Michael Chen",
      date: "December 5, 2024",
      readTime: "6 min read",
      category: "Property Management",
      image: "/property-manager-meeting.png",
      slug: "property-management-tips-utah-landlords",
      cities: ["Salt Lake City", "Lehi", "Provo", "Ogden"],
    },
    {
      title: "Mortgage Rate Trends: What to Expect in 2025",
      excerpt: "Analysis of current mortgage rate trends and predictions for the coming year.",
      author: "Jennifer Martinez",
      date: "November 28, 2024",
      readTime: "4 min read",
      category: "Mortgage",
      image: "/modern-townhouse-garage.png",
      slug: "mortgage-rate-trends-2025"
    },
    {
      title: "Why Utah is the Best Place to Invest in Real Estate",
      excerpt: "Discover why Utah's real estate market offers excellent investment opportunities.",
      author: "David Thompson",
      date: "November 20, 2024",
      readTime: "7 min read",
      category: "Investment",
      image: "/city-map-with-pin.png",
      slug: "why-utah-best-real-estate-investment",
      cities: ["Salt Lake City", "Draper", "Lehi", "Sandy", "Orem", "Ogden"],
    },
    {
      title: "Home Staging Tips That Actually Work",
      excerpt: "Professional staging tips to help your home sell faster and for more money.",
      author: "Lisa Park",
      date: "November 15, 2024",
      readTime: "5 min read",
      category: "Selling",
      image: "/modern-apartment-balcony.png",
      slug: "home-staging-tips-that-work"
    },
    {
      title: "Understanding Property Taxes in Utah",
      excerpt: "Complete breakdown of Utah property taxes and how they affect your investment.",
      author: "Robert Wilson",
      date: "November 8, 2024",
      readTime: "6 min read",
      category: "Taxes",
      image: "/placeholder.jpg",
      slug: "understanding-property-taxes-utah"
    }
  ]), [])

  const categoryCounts = useMemo(() => {
    return blogPosts.reduce<Record<string, number>>((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {})
  }, [blogPosts])

  const categories = useMemo(() => {
    const names = Object.keys(categoryCounts).sort()
    return [{ name: "All", count: blogPosts.length }, ...names.map(name => ({ name, count: categoryCounts[name] }))]
  }, [blogPosts.length, categoryCounts])

  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [activeCity, setActiveCity] = useState<string>("All")

  // Collect unique cities across all tagged posts
  const citiesWithPosts = useMemo(() => {
    const all = new Set<string>()
    blogPosts.forEach((p) => {
      if ("cities" in p && Array.isArray((p as { cities?: string[] }).cities)) {
        (p as { cities: string[] }).cities.forEach((c) => all.add(c))
      }
    })
    return ["All", ...Array.from(all).sort()]
  }, [blogPosts])

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const catMatch = activeCategory === "All" || post.category === activeCategory
      const cityMatch =
        activeCity === "All" ||
        ("cities" in post &&
          Array.isArray((post as { cities?: string[] }).cities) &&
          (post as { cities: string[] }).cities.includes(activeCity))
      return catMatch && cityMatch
    })
  }, [activeCategory, activeCity, blogPosts])

  return (
    <main className="min-h-screen">
      <SEO
        title="Real Estate Blog | Ondo Real Estate"
        description="Stay updated with the latest Utah real estate news, market insights, and expert advice from Ondo Real Estate professionals."
        pathname="/blog"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ])}
      />
      <PageBanner
        title="Real Estate Blog"
        subtitle="Expert insights, market updates, and helpful tips for Utah real estate"
        backgroundImage="/modern-office-building.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Featured Post */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Featured Article</h2>
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-full">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{featuredPost.category}</Badge>
                      <span className="text-sm text-foreground/70">{featuredPost.readTime}</span>
                    </div>
                    <CardTitle className="text-2xl mb-4">{featuredPost.title}</CardTitle>
                    <CardDescription className="text-lg mb-6">{featuredPost.excerpt}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-foreground/70 mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.date}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Blog Posts */}
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post, index) => (
                    <Link key={index} href={`/blog/${post.slug}`} className="group block h-full">
                      <Card className="h-full hover:shadow-lg transition-shadow group-hover:border-primary/60">
                      <div className="relative h-48">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          <span className="text-xs text-foreground/70">{post.readTime}</span>
                        </div>
                          <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        <CardDescription className="mb-4 line-clamp-2">{post.excerpt}</CardDescription>
                          <div className="flex items-center gap-4 text-xs text-foreground/70">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const isActive = category.name === activeCategory
                        return (
                          <Button
                            key={category.name}
                            variant={isActive ? "secondary" : "outline"}
                            size="sm"
                            className="gap-2"
                            onClick={() => setActiveCategory(category.name)}
                            aria-pressed={isActive}
                          >
                            <span className="text-sm">{category.name}</span>
                            <Badge variant={isActive ? "outline" : "secondary"} className="text-[11px]">
                              {category.count}
                            </Badge>
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* City filter */}
                {citiesWithPosts.length > 1 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Filter by City
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {citiesWithPosts.map((city) => {
                          const isActive = city === activeCity
                          return (
                            <Button
                              key={city}
                              variant={isActive ? "secondary" : "outline"}
                              size="sm"
                              onClick={() => setActiveCity(city)}
                              aria-pressed={isActive}
                            >
                              {city}
                            </Button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Stay Updated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 mb-4">
                      Get the latest real estate insights delivered to your inbox.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/contact">Subscribe to Newsletter</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-card text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Real Estate Move?</h2>
            <p className="text-xl mb-8">
              Our expert team is here to help you navigate Utah's real estate market with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Get Expert Advice</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted dark:border-white dark:text-white dark:hover:bg-card/75"
              >
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
