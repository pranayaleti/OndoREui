# Blog merge map (October 2026 simplification)

Status: built on 2026-10-19. Twelve mortgage guides now carry the content of 80 retired
posts. Each retired post still renders at its old URL as a noindex,follow page whose
canonical points at its guide, with a "This guide now lives in" link at the top. The
October 2026 pass also removed four off-topic posts and set the nine engineering posts to
noindex pending their move to ondosoft.com.

Rules for any further merge:
- Keep the strongest slug as the guide. Every other slug in the cluster keeps its page but
  passes `mergedInto` to `articleMetadata` and `ArticleShell` (noindex,follow plus the
  canonical). Do not add it to `public/_redirects`: a redirect source cannot also be a
  page, and `lib/legacy-redirects.test.ts` enforces that.
- Move each retired post's unique facts into the guide before retiring it.
- In the same commit: drop the slug from `lib/blog-posts.ts` and `lib/search-index.ts`,
  keep it in `lib/blog-slugs.ts`, tag its node in `lib/content/graph.ts` with
  `mergedInto`, add it to the noindex list in `next-sitemap.config.js` and to the
  `MERGED` map in `app/blog/merged-and-thin-posts.test.tsx`, and re-point every
  `/blog/<slug>` link to the guide.
- Give the guide a `seoTitle` of 60 characters or fewer; the H1 can stay longer.

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
