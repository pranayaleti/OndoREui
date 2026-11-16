#!/usr/bin/env tsx
/**
 * Prints the business listing record (lib/business-profile.ts) as copy blocks for Google Business
 * Profile, Bing Places, Apple Business Connect, Foursquare, Yelp and Yellow Pages, with only the
 * categories and services that are true for the licenses that are live today (lib/site.ts).
 * Usage: npm run listings:profile
 */
import { businessProfile } from "../lib/business-profile"
import { LICENSING } from "../lib/site"

/* eslint-disable no-console -- CLI output */
const profile = businessProfile(LICENSING)
const line = (label: string, value: string) => console.log(`${label.padEnd(16)} ${value}`)

console.log("# Business listing record (paste exactly; every directory must match)\n")
line("Name", profile.name)
line("Also known as", profile.alternateName)
line("Phone", profile.phone)
line("Email", profile.email)
line("Website", profile.website)
line("Address", `${profile.address.streetAddress}, ${profile.address.addressLocality}, ${profile.address.addressRegion} ${profile.address.postalCode}`)
line("Hours", profile.hours)
line("Notary hours", profile.notaryHours)
line("Founded", String(profile.founded))
line("Founder", `${profile.founder.name} (${profile.founder.profile})`)
console.log(`\nLicenses live: re=${LICENSING.re} mlo=${LICENSING.mlo} notary=${LICENSING.notary}`)

console.log("\n## Categories (primary first)")
for (const category of profile.categories) console.log(`- ${category.name}`)

console.log("\n## Services")
for (const service of profile.services) console.log(`- ${service.name}: ${service.description}`)

console.log("\n## Service area")
console.log(`Counties: ${profile.serviceArea.counties.join(", ")}`)
console.log(`Cities (GBP max 20): ${profile.serviceArea.cities.join(", ")}`)

console.log("\n## Short description (tag line / specialties)")
console.log(profile.descriptions.short)
console.log(`(${profile.descriptions.short.length} characters)`)

console.log("\n## Standard description (Google 'from the business', 750 max)")
console.log(profile.descriptions.standard)
console.log(`(${profile.descriptions.standard.length} characters)`)

console.log("\n## Social profiles (add to every listing)")
for (const url of profile.socialProfiles) console.log(`- ${url}`)

console.log("\n## Place listings (lib/site.ts SITE_PLACE_LISTINGS; set live: true with the real URL after claiming)")
for (const listing of profile.placeListings) console.log(`- ${listing.label}: ${listing.url} (${listing.live ? "live" : "not claimed"})`)
