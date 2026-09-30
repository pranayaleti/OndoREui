import { readFileSync } from "node:fs"
import { join } from "node:path"
import { buildContactCard } from "@/lib/contact-card"
import {
  SITE_ADDRESS_CITY,
  SITE_ADDRESS_COUNTRY,
  SITE_ADDRESS_POSTAL_CODE,
  SITE_ADDRESS_REGION,
  SITE_ADDRESS_STREET,
  SITE_EMAILS,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
} from "@/lib/site"

// Written to out/ondo-real-estate.vcf at build time, from the same constants as the rest of the
// site, so the "Save contact" button on /links never hands out a stale phone number or email.
export const dynamic = "force-static"

export function GET(): Response {
  const card = buildContactCard({
    givenName: "Pranay Reddy",
    familyName: "Aleti",
    organization: SITE_NAME,
    title: "Founder",
    phone: SITE_PHONE.replace(/[^+\d]/g, ""),
    email: SITE_EMAILS.primary,
    url: `${SITE_URL.replace(/\/$/, "")}/links/`,
    address: {
      street: SITE_ADDRESS_STREET,
      city: SITE_ADDRESS_CITY,
      region: SITE_ADDRESS_REGION,
      postalCode: SITE_ADDRESS_POSTAL_CODE,
      country: SITE_ADDRESS_COUNTRY,
    },
    note: "Utah real estate, home loans and property management.",
    photoJpegBase64: readFileSync(join(process.cwd(), "public", "links-avatar-card.jpg")).toString("base64"),
  })
  return new Response(card, { headers: { "Content-Type": "text/vcard; charset=utf-8" } })
}
