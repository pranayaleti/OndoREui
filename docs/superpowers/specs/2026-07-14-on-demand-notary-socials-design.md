# On-Demand Notary + `/socials` Hub — Design Spec

**Date:** 2026-07-14  
**Status:** Implemented  
**Repo:** OndoREui (Next.js 15 App Router)

---

## Goal

1. Promote **on-demand notary** with honest **same-day when we can** messaging — both on `/notary` and a dedicated `/notary/on-demand` page.
2. Add a public **`/socials`** hub that combines curated social posts, profile links/embeds, and the latest items from `/news`.

---

## Decisions (from brainstorming)

| Topic | Choice |
|-------|--------|
| `/socials` content | **C** — curated posts + profile embeds/links + latest `/news` |
| On-demand notary placement | **C** — section on `/notary` **and** dedicated `/notary/on-demand` |
| Implementation approach | Static content + shared data modules (no live social APIs) |

---

## Non-goals

- Live Instagram/X/Facebook API feeds or OAuth
- Auto-posting or scheduling social content
- Changing Google Business / paid ads
- OndoREDashboard / Mobile / Backend changes
- Guaranteeing same-day notary (copy must remain best-effort)

---

## Design

### 1. On-demand notary

#### 1a. Section on `/notary` (`notary-client.tsx`)

Add a clear section (near services / CTAs) titled **On-demand notary**:

- Headline + short copy: we offer on-demand notarization and **try to accommodate same-day** when capacity allows (RON nationwide; mobile in Utah service area).
- Primary CTA → `/notary/on-demand`
- Secondary CTA → existing booking / Calendly / contact patterns on the page

Also add “On-demand notary” to JSON-LD `makesOffer` / service list if present.

#### 1b. New page `/notary/on-demand`

Server metadata + client or server page matching existing `/notary` visual language (tokens, banner/hero, CTAs).

**Content blocks (one job each):**

1. **Hero** — On-demand notary; same-day when we can  
2. **How it works** — request → confirm availability → RON or mobile appointment  
3. **Same-day expectations** — best-effort; earlier requests improve odds; not a hard SLA  
4. **RON vs mobile** — when each applies  
5. **CTA** — book (existing NotaryBooking / Calendly), email `SITE_EMAILS.notary`, phone  

SEO: title/description/canonical; breadcrumbs; optional Service JSON-LD; register in `site-index`, `lib/search-index.ts`, `llms.txt` notary bullet.

### 2. `/socials` hub

New route `app/socials/page.tsx` (prefer server component + small client bits only if tabs need interactivity).

**Sections:**

| Section | Content |
|---------|---------|
| Hero | Socials & updates — posts, profiles, news |
| Social posts | Curated cards from `lib/social-posts.ts` |
| Follow us | Live entries from `SITE_SOCIAL_LINKS` (+ optional Linktree iframe/embed) |
| Latest news | Top items from shared news data (same source as `/news`) |

Each social card: platform, title, excerpt, date, external URL (new tab).  
Each news card: reuse news item shape; link to source; “See all news” → `/news`.

**Data modules:**

- `lib/news-items.ts` — extract current `newsItems` from `app/news/page.tsx`; `/news` and `/socials` both import  
- `lib/social-posts.ts` — curated starter posts (can point at real Ondo links / Linktree / blog announcements); easy to edit later  

No requirement that social accounts be `live: true` for the Follow section — show all configured profiles, mark unclaimed ones carefully **or** only show `live` + Linktree (prefer: show `live` profiles prominently; list others as “coming soon” only if useful — default to **live + Linktree** to avoid dead links).

### 3. Discovery / nav

- `lib/site-index.ts` — Notary child link for on-demand; Company/Learn link for Socials  
- Footer (and header nav if a natural slot exists) — link to `/socials`; keep News links  
- `lib/search-index.ts` — entries for on-demand notary + socials  
- Insights or about hubs that list News may add Socials alongside  

### 4. Copy constraints

- Same-day: **“We’ll try to accommodate same-day when capacity allows”** — never “guaranteed same-day.”  
- English only.  
- Reuse design tokens; no new purple/cream AI aesthetic; match existing notary/news pages.

---

## Files likely touched / created

| Path | Change |
|------|--------|
| `app/notary/notary-client.tsx` | On-demand section + offer |
| `app/notary/on-demand/page.tsx` | New page (+ optional client split) |
| `app/socials/page.tsx` | New hub |
| `lib/news-items.ts` | Shared news data |
| `lib/social-posts.ts` | Curated social posts |
| `app/news/page.tsx` | Import shared news data |
| `lib/site-index.ts` | Register routes |
| `lib/search-index.ts` | Search entries |
| `components/footer.tsx` | Socials link |
| `public/llms.txt` / site-index LLM strings | Mention on-demand + socials |

---

## Success criteria

- `/notary` shows on-demand section linking to `/notary/on-demand`  
- `/notary/on-demand` loads with same-day best-effort copy and booking CTAs  
- `/socials` shows curated posts, follow links, and latest news from shared module  
- `/news` still works and uses the same news data  
- Routes appear in site-index / sitemap pipeline  
- No live social API dependencies  

---

## Out of scope follow-ups

- CMS for social posts  
- Platform embeds beyond simple iframes  
- Guaranteed SLA / paid rush fee matrix (can add later on on-demand page)
