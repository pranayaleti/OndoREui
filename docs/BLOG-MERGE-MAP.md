# Blog merge map (follow-up to the October 2026 simplification)

Status: planned, not built. The October 2026 pass removed four off-topic posts, set the
nine engineering posts to noindex pending their move to ondosoft.com, and left the
mortgage library alone. This file is the merge plan for that library.

Rules when a merge is built:
- Keep the strongest slug as the guide. Every other slug in the cluster becomes a
  noindex,follow page with a canonical to the guide (the `MERGED` pattern in
  `app/blog/merged-and-thin-posts.test.tsx`) and a line in `public/_redirects`.
- Move each retired post's unique facts into the guide before retiring it.
- Update `lib/blog-posts.ts`, `lib/blog-slugs.ts`, `lib/content/graph.ts`,
  `lib/search-index.ts` and `next-sitemap.config.js` in the same commit.

## Engineering posts (move to ondosoft.com, then 301)

Uncomment the matching lines at the bottom of `public/_redirects` once each post is live
at `https://ondosoft.com/blog/<slug>/`, rerun `npm run cloudflare:redirects-csv`, and
re-upload the Bulk Redirect list.

- building-high-performance-real-estate-nextjs-supabase
- engineering-real-estate-investment-calculators
- technical-seo-for-real-estate
- modernizing-notary-workflows-integration
- dashboards-for-landlords
- designing-property-owner-portal
- full-stack-dev-landlord-gaps
- property-management-pwa-offline
- how-ondo-re-uses-technology-property-management

## Mortgage clusters (95 posts to about 14 guides)

| Guide (keep) | Fold in |
|---|---|
| how-underwriters-verify-income | can-i-get-a-mortgage-if-my-income-changes-every-month, 1099-mortgage-documentation-checklist, just-went-1099-last-month, two-years-of-tax-returns-vs-one-year-mortgage, w2-overtime-likely-to-continue, commission-income-mortgage-averaging, gig-plus-w2-income-mortgage-average, spouse-w2-offset-1099-volatility, k-1-income-what-usually-counts, schedule-e-rental-income-purchase-file, depreciation-add-back-schedule-e, cpa-letter-vs-tax-returns-underwriting, business-vs-personal-bank-co-mingling, bank-statement-loans-when-tax-returns-undercount-income, relocating-to-utah-job-seasoning, asset-depletion-qualifying-non-qm |
| va-loan-assumption-entitlement (retitle: the VA guide) | va-funding-fee-finance-vs-pay-cash, va-entitlement-second-va-loan, va-residual-income-vs-dti, hill-afb-va-coe-occupancy, selling-with-va-loan-entitlement-restoration, usda-vs-va-vs-fha-veteran-rural |
| fha-vs-conventional-loans-utah | how-fha-loan-assumption-works, fha-condo-roster-project-approval, house-hacking-duplex-with-fha, dpa-stacked-with-fha-gift-funds, usda-map-income-limit-eligibility |
| refinance-break-even-when-lower-rate-loses | no-closing-cost-refinance-rate-credit-tradeoff, discount-points-breakeven-without-sales-pitch, recast-vs-refinance, biweekly-extra-principal-vs-refinance, mortgage-paydown-hacks, fha-va-streamline-refinance-less-docs |
| heloc-vs-cash-out-refinance | heloc-after-year-two-vs-cash-out, cash-out-to-buy-a-rental, cross-collateral-equity-to-buy-another-house, delayed-financing-after-cash-purchase |
| escrow-shortage-after-first-year (retitle: escrow and property tax) | escrow-cushion-how-it-is-set, impounds-vs-waiving-escrow, utah-property-tax-calendar-first-escrow-analysis, understanding-property-taxes-utah |
| rate-lock-if-rates-drop (retitle: rates, locks and APR) | rate-lock-extension-vs-floating, mortgage-rate-trends-2025, apr-vs-rate-on-a-loan-estimate, temporary-buydown-who-pays-year-three, arm-caps-in-plain-english |
| should-i-wait-for-20-percent-down | mip-vs-pmi-how-mortgage-insurance-ends, pmi-removal-original-value-vs-new-appraisal, gift-funds-down-payment-rules, parent-gifting-down-payment-who-signs, large-deposits-60-day-paper-trail, mortgage-reserves-months-of-pitia |
| utah-closing-costs-title-origination-prepaids | utah-cash-to-close-besides-down-payment, earnest-money-vs-down-payment-vs-closing-costs, title-insurance-owner-vs-lender |
| credit-before-mortgage-rapid-rescore | closing-credit-card-before-mortgage, authorized-user-tradelines-mortgage, medical-collections-after-fico-model-change, no-traditional-credit-alternative-credit, what-a-tri-merge-credit-report-shows, new-auto-loan-during-underwriting, student-loans-dti-idr-save |
| pre-approval-vs-aus-vs-clear-to-close | declined-after-pre-approval, compensating-factors-in-aus-findings, what-a-mortgage-conversation-asks, first-time-buyer-file-mistakes |
| townhome-vs-condo-hoa-docs-lenders-ask | refinancing-condo-aging-hoa, hazard-vs-ho3-vs-ho6-condo-insurance |
| renting-vs-buying-salt-lake-city | already merged (three retired posts canonical to it) |

Posts not in a cluster stay as they are: the 21 property management and landlord posts,
the 5 notary posts, the 16 buying, selling and Utah market posts, and the standalone
mortgage posts (appraisal-comes-in-low, cosign-vs-co-borrower, divorce-and-the-mortgage,
first-mortgage-statement-vs-note-rate, home-inspection-vs-appraisal,
how-long-first-purchase-takes, interest-only-mortgages-who-they-are-for,
itin-non-us-citizen-mortgage-documentation, jumbo-vs-conforming-fhfa-county-limit,
manufactured-housing-adu-financing, second-home-vs-investment-occupancy,
seller-concessions-what-they-cover, utah-repc-deadline-and-your-loan,
week-after-mortgage-funding, first-rental-occupancy-if-you-still-live-there,
dscr-vs-full-doc-rental-loan, dti-frontend-backend-with-hoa).
