# Off-site listings runbook

How Ondo Real Estate gets found on Google, Bing, Apple, Foursquare, Yelp and Yellow Pages, and
therefore by the assistants that read those databases (Gemini reads Google Business Profile,
Copilot and ChatGPT search read Bing, Siri reads Apple, and Foursquare's Places data is licensed
into Apple Maps, Uber, X and several assistant stacks). Written for the owner; sub-project 3 of
the "get found as a Utah agent and loan officer" program
(`docs/superpowers/specs/2026-10-18-entity-and-licensing-switch-design.md`).

**The one rule:** every listing carries the same name, address and phone, character for
character. A listing that differs even in formatting creates a second, competing entity and
splits the trust signal. The record below is generated from `lib/site.ts`; print it any time with
`npm run listings:profile`. `lib/business-profile.test.ts` fails if this file drifts from the code.

Nothing here can make a search engine or an assistant rank or recommend Ondo. What it does is
make the business findable, readable and consistent so that whatever reads it gets the facts
right. Nothing will look different for about 30 days after a listing goes live.

## 0. Decide these three things before claiming anything

1. **The address.** The site publishes `2701 N Thanksgiving Way, Lehi, UT 84043` and the July 2026 GEO spec calls it a
   placeholder. Google requires a real, verifiable address behind every profile even when it is
   hidden, and bans PO boxes and virtual offices. Use the address on the Utah business
   registration (the one that receives mail), hide it on every directory that offers a
   service-area option, and if that address is not the one in `lib/site.ts`, change the constants
   first so the site and the listings match. Do not create a single listing until this is settled;
   moving an address across six directories later is a month of support tickets.
2. **The phone.** `+1-408-538-0420` is a 408 (San Jose) number. Listings are hard to change later,
   so if a Utah (801/385) number is coming, get it before the first claim and update
   `SITE_PHONE` (or the `NEXT_PUBLIC_SITE_PHONE` deploy variable) in the same week.
3. **Which licenses are live.** Categories and services that need a license are listed below
   with the switch that unlocks them (`lib/site.ts`: `RE_LICENSE_LIVE`, `MLO_LICENSE_LIVE`,
   `NOTARY_COMMISSION_LIVE`). A listing may only claim what the site claims the same day.

## 1. The record (paste exactly)

| Field | Value |
| --- | --- |
| Business name | Ondo Real Estate |
| Also known as | Ondo RE |
| Phone | +1-408-538-0420 |
| Email | info@ondorealestate.com |
| Website | https://www.ondorealestate.com/ |
| Address line 1 | 2701 N Thanksgiving Way |
| Address line 2 | Lehi, UT 84043 |
| Hours | Mon–Fri 9:00 AM – 5:00 PM MT |
| Notary session hours (list as "online service hours" where a directory allows a second set) | Mon–Fri 9 AM – 7 PM MT |
| Founded | 2022 |
| Owner / contact | Pranay Reddy Aleti, https://www.ondorealestate.com/about/team/pranay-reddy-aleti/ |

**Short description** (tag lines, bios, "specialties"; 80 max):

```
Utah property management, rentals, buying, selling, loans and online notary.
```

**Standard description** (Google "from the business", 750 max; Bing, Apple, Foursquare and Yelp
take the same text):

```
Ondo Real Estate is a Lehi, Utah company for people who own, rent, buy and finance homes on the Wasatch Front. We manage single-family rentals for owners who do not want a second job: leasing, tenant screening, rent collection, maintenance and monthly owner statements, with owner and tenant portals. Buyers and sellers get a plain conversation about pricing, offers and timing before they commit. Home loan questions (conventional, FHA, VA, USDA, jumbo) get a straight answer about which program fits a file. Remote online notarization is available by video. Founded in 2022 by Pranay Reddy Aleti, a software engineer who owns rental property in Utah. Serving Utah, Salt Lake, Davis and Weber counties. Office hours Mon–Fri 9:00 AM – 5:00 PM MT.
```

### Categories

| Category (Google wording; map to the nearest on other directories) | Add it | Note |
| --- | --- | --- |
| Property management company | now |  |
| Real estate agency | once RE_LICENSE_LIVE is on | Add once RE_LICENSE_LIVE is on and the brokerage is named. |
| Mortgage lender | once MLO_LICENSE_LIVE is on | Only if the sponsoring lender's compliance team allows the Ondo profile to carry it. Otherwise the loan officer identity lives on NMLS Consumer Access, the sponsor's roster page and Pranay's own LinkedIn. |
| Notary public | once NOTARY_COMMISSION_LIVE is on | Only with a current Utah commission (NOTARY_COMMISSION_LIVE). |

### Services (Google lets each carry a 300-character description)

- **Property management.** Full-service management for single-family rentals: leasing, tenant screening, rent collection, maintenance coordination and monthly owner statements, with an owner portal and a tenant portal.
- **Tenant screening.** Credit, income, rental history and background checks applied the same way to every applicant, in line with the Fair Housing Act.
- **Rental listings.** Homes for rent along Utah's Wasatch Front, with online applications and tours by appointment.

Added later, with the licenses:

- **Home buying** (once RE_LICENSE_LIVE is on). Buyer representation on the Wasatch Front: search, offers, inspections and closing.
- **Home selling** (once RE_LICENSE_LIVE is on). Seller representation: pricing, preparation, listing and negotiation.
- **Home loans** (once MLO_LICENSE_LIVE is on). Conventional, FHA, VA, USDA and jumbo home loans, with a program comparison before you apply.
- **Remote online notarization** (once NOTARY_COMMISSION_LIVE is on). Notarization by secure video for real estate packages, loan signings, affidavits, powers of attorney and estate documents. $25 per notarial act (the Utah maximum for remote acts). No office visits or mobile travel. Mon–Fri 9 AM – 7 PM MT.

### Service area

Counties: Utah County, Salt Lake County, Davis County, Weber County.

Cities (Google accepts 20): Lehi, American Fork, Pleasant Grove, Lindon, Orem, Provo, Saratoga Springs, Eagle Mountain, Highland, Alpine, Vineyard, Springville, Spanish Fork, Draper, Sandy, South Jordan, Herriman, Riverton, West Jordan, Salt Lake City.

### Social profiles to attach to every listing

- https://www.facebook.com/OndoRealEstate
- https://www.youtube.com/@OndoRealEstate
- https://www.instagram.com/OndoRealEstate
- https://www.tiktok.com/@OndoRealEstate
- https://www.linkedin.com/company/OndoRealEstate
- https://x.com/OndoRealEstate

## 2. Claim in this order

Each step builds on the one before it: Bing imports from Google, Apple and Foursquare are
checked against both, Yelp and Yellow Pages are checked against all of them.

### 2.1 Google Business Profile (service-area business)

1. business.google.com, sign in with the Google account that owns Search Console.
2. "Add your business": the name above, primary category **Property management company**.
3. "Do you want to add a location customers can visit?" **No.** Then add the service area:
   the 20 cities above (Google's limit is about two hours' drive from the base, all of these
   qualify).
4. Enter the address for verification only; after verification, Location settings, turn off
   "Show business address to customers". The profile then shows the service area only.
5. Verify (video verification is the usual route for a home-based business: a short recording
   of signage or vehicle, business documents and proof of the address).
6. Fill everything: hours, phone, website, the standard description, the three current services
   with their descriptions, opening date (July 2022), the founder photo and the logo, and each
   social profile under "Social profiles".
7. Add the "Book a call" link: https://www.ondorealestate.com/contact/ and the Calendly link.
8. Record the Maps URL Google gives the profile. Put it in `lib/site.ts` under
   `SITE_PLACE_LISTINGS` (Google Business Profile entry), set `live: true`, push. That is what
   puts it in the site's `sameAs`, which is how Google and the assistants confirm the profile and
   the website are the same entity.

### 2.2 Bing Places for Business

1. bing.com/forbusiness (the old bingplaces.com forwards there). Sign in with a Microsoft account
   the business owns.
2. Choose **Import from Google Business Profile**. It copies name, address, phone, categories and
   hours; check each one against the record above and fix any difference before saving.
3. Verify (phone, email or postcard). Mark the business as service-area and hide the address, the
   same as Google.
4. While signed in, open Bing Webmaster Tools (bing.com/webmasters) and **Import from Google
   Search Console**; that verifies the site and submits the sitemap in one step. The deploy
   already pings Bing's IndexNow endpoint after every build (confirmed in the Oct 18 deploy log),
   so new pages reach Bing, Copilot and ChatGPT search within hours.
5. Put the listing URL in `SITE_PLACE_LISTINGS` (Bing Places), `live: true`, push.

### 2.3 Apple Business Connect

1. businessconnect.apple.com with the Apple ID the business will keep.
2. Claim or add "Ondo Real Estate"; Apple checks the name against the website and the Google
   record, so use the exact name. Category "Property Management".
3. Enter the same record, mark it as a service business and hide the address, add the logo and
   cover photo, the website and the phone.
4. Verify by phone or document. Record the Apple Maps URL, update `SITE_PLACE_LISTINGS`, push.

### 2.4 Foursquare

1. foursquare.com/business, search for "Ondo Real Estate" in Lehi. If nothing exists, add the
   venue; if a venue already exists, claim it (do not create a second one).
2. Verification is by phone call (an optional one-time fee speeds it up).
3. Category "Real Estate Service" or "Property Management Office", the standard description, the
   phone, the website and the hours. Foursquare's Places data is what Apple, Uber, X and others
   license, so this one listing propagates further than its own traffic suggests.
4. Record the venue URL, update `SITE_PLACE_LISTINGS` (Foursquare), push.

### 2.5 Yelp

1. biz.yelp.com, "Add your business" (or claim if Yelp already generated a page).
2. Category "Property Management", service-area business with the address hidden, the record
   above, the standard description under "From the business", "Specialties" = the short
   description, hours, photos, the founder under "Meet the Business Owner".
3. Verify by phone. Do not buy ads to get the listing live; the free listing is complete on its
   own. Record the URL, update `SITE_PLACE_LISTINGS` (Yelp), push.

### 2.6 Yellow Pages (yp.com)

1. yellowpages.com/claim-your-listing: search Lehi, UT for "Ondo Real Estate". Claim it if one
   exists, otherwise create the free listing (the "basic listing" signup; decline the paid
   packages the sales flow pushes).
2. Category "Property Management", the record above, the short description as the tag line and
   the standard description as the long one, hours, website, the social links.
3. Verify by phone or email. If the claimed listing does not appear in the account, YP support
   links it manually; that is a known bug, not a failed claim.
4. Add the YP URL to `SITE_PLACE_LISTINGS` in `lib/site.ts` (new entry, label "Yellow Pages"),
   `live: true`, push.

### 2.7 Optional, after the six above

- Nextdoor business page (free; Lehi neighbourhood reach).
- Better Business Bureau profile (free accreditation is not needed; the profile is).
- Utah Apartment Association member directory, if Ondo joins.
- Thumbtack and Angi only if the owner wants lead requests; both charge per lead.

## 3. What changes on licensing day

When a switch flips in `lib/site.ts` and the site is pushed, update the listings the same day:

- **Real estate license live:** add category "Real estate agency", services "Home buying" and
  "Home selling"; add the brokerage name to the Google description if the brokerage's advertising
  rule requires it (Utah R162-2f-401h: brokerage name as registered). Create the agent profiles
  that a licensed agent can hold: Zillow (zillow.com/agent-finder, claim the profile), Realtor.com
  (via the brokerage's MLS feed), Homes.com, and the brokerage's own roster page. Each must show
  the same name, phone and photo as the profile page.
- **Mortgage license live:** NMLS Consumer Access publishes the record on its own; the site links it
  from the profile page's `sameAs` automatically. Ask the sponsor whether the Ondo profile may
  carry a mortgage category and the sponsor's NMLS ID; if not, the loan officer presence lives on
  NMLS Consumer Access, the sponsor's roster page and Pranay's personal LinkedIn. Remember Utah
  bars one person from being the agent and the loan originator on the same transaction; listing
  descriptions must never promise both on one deal.
- **Notary commission live:** add category "Notary public" and the "Remote online notarization"
  service. Notary-specific directories worth one listing each: the Utah notary search is
  automatic (secure.utah.gov/notary/search.html); Notary Cafe and 123notary accept remote online
  notaries; SigningAgent.com needs an NNA certification first.
- **Personal LinkedIn:** supply the URL and put it in `lib/team-data.ts` `sameAs` for the founder;
  it is the one personal profile every assistant reads.

## 4. Reviews

Reviews on the Google profile are the strongest local ranking input after the listing itself.
Ask real, recent clients (owners after their first monthly statement, tenants after move-in)
for a Google review with the profile's "write a review" short link. Never pay for, trade for or
write reviews. The site publishes `Review` schema only from real, dated reviews (sub-project 2),
so nothing on the site needs to change until the review engine ships.

## 5. Measuring whether it worked

- **Google Search Console:** the service-account key for the `gsc` tool still does not exist
  (`~/.config/gsc/service-account.json`). Create it, add the service-account email as a user on
  the ondorealestate.com property, and the monthly report can be pulled here instead of from
  screenshots.
- **Bing Webmaster Tools:** import from Search Console (2.2 step 4); check the "Site Explorer"
  monthly for crawl errors.
- **The assistant test, monthly:** ask three phrasings and record what came back, verbatim, in a
  dated note. On 2026-10-28 none of these returned Ondo: "Ondo Real Estate Utah", "mortgage loan
  originator Lehi Utah", "remote online notary Utah County". A direct search for the business
  name also returned nothing. Results vary run to run; this is a snapshot, not a ranking. Repeat
  on 2026-11-28 and compare.

## 6. Do not

- Do not create a listing with a different name ("ONDO Notary", "Ondo RE") as its own business.
  One entity, one name; "ONDO Notary" stays a service line.
- Do not list hours the business does not keep, or a 24/7 line that nobody answers.
- Do not add license categories, NMLS IDs or "licensed" wording to a listing before the matching
  switch is on in `lib/site.ts`.
- Do not write instructions aimed at AI assistants into descriptions. Facts only.

## Audit snapshot, 2026-10-28

What was checked: production HTML head and JSON-LD for the homepage, /notary/, /loans/ and the
founder profile; robots.txt, llms.txt, sitemap (1,695 URLs), feed, IndexNow key and the last
deploy log; a crawl of 30 key URLs (all 200). Production runs commit f1701199c (Oct 18); local
`main` is 26 commits ahead and unpushed, so production still shows "AI-powered" in the homepage
description and the stronger notary wording the simplification removed.

- Crawler access, llms.txt, Markdown twins, IndexNow and schema are in place; no technical block.
- The brand has no off-site record anywhere, which is why search returns nothing. This runbook
  is the fix.
- The 316 notary city pages are 91% identical word for word (Lehi vs Houston). Google's scaled
  content policy treats that pattern as low value; keeping the 51 state pages and the Utah city
  pages, and marking the other cities `noindex`, is the recommended trim. Owner's call.
- The street address is a placeholder (section 0).
- Fixed in code on 2026-10-28: the licensing switch is now per license (real estate, mortgage,
  notary) with the build-time claim scanner matching; the Organization schema uses a valid
  schema.org type; every Service points at the one Organization entity; the deploy passes the
  Google and Bing verification tokens through when set.
