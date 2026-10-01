/**
 * Parity copy of the request schemas the Edge API enforces for lead forms.
 *
 * Source of truth (OndoREBackend, outside this repo):
 *   supabase/functions/_shared/routes/leads.ts           contactLeadSchema
 *   supabase/functions/_shared/marketing-attribution.ts  marketingAttributionSchema (.strict())
 *   supabase/functions/_shared/lead-inbox-helpers.ts     INQUIRY_TYPES
 *
 * Component tests that mock `submitContactLead` only see what was handed to it, so a payload the
 * API would reject (a bad enum, an over-long value, an unknown key) still passes. Tests that use
 * this copy parse the body that actually goes over the wire. When the Edge schema changes, update
 * this file in the same change.
 */
import { z } from "zod"

export const EDGE_INQUIRY_TYPES = [
  "owner",
  "renter",
  "buyer",
  "seller",
  "agent",
  "current_client",
  "vendor",
  "other",
  "tenant_looking_to_rent",
  "agent_referrals",
  "owner_rental_services",
  "vendor_maintenance",
  "current_resident",
] as const

const marketingTouchSchema = z
  .object({
    utm_source: z.string().max(256).optional(),
    utm_medium: z.string().max(256).optional(),
    utm_campaign: z.string().max(256).optional(),
    utm_term: z.string().max(256).optional(),
    utm_content: z.string().max(256).optional(),
    gclid: z.string().max(256).optional(),
    fbclid: z.string().max(256).optional(),
    msclkid: z.string().max(256).optional(),
    path: z.string().max(1024).optional(),
    href: z.string().max(2048).optional(),
    recorded_at: z.string().max(64).optional(),
  })
  .strict()

export const edgeMarketingAttributionSchema = z
  .object({
    first: marketingTouchSchema.nullable().optional(),
    last: marketingTouchSchema.nullable().optional(),
  })
  .strict()

/** POST /api/leads/contact. Unknown top-level keys are stripped by zod, as on the server. */
export const edgeContactLeadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[+\d\s\-().]+$/)
    .optional(),
  message: z.string().max(2000).optional(),
  propertyId: z.string().uuid().optional(),
  source: z.enum(["website", "referral", "direct", "social", "ad", "popup"]).default("website"),
  inquiryType: z.enum(EDGE_INQUIRY_TYPES).optional(),
  attribution: edgeMarketingAttributionSchema.optional(),
})

/** Body of POST lead-qualify (see lib/api/qualification.ts). */
export const edgeQualifyRequestSchema = z.object({
  session_token: z.string().min(1),
  lead_type: z.enum(["property", "website"]),
  message: z.string().min(1),
})

/**
 * Parse a request body and fail with the schema's own messages. Also fails on top-level keys the
 * form should not send: zod would silently strip them, hiding a form that sends the wrong shape.
 */
export function parseContactLeadBody(body: unknown) {
  const result = edgeContactLeadSchema.strict().safeParse(body)
  if (!result.success) {
    throw new Error(`Edge contactLeadSchema rejected the request: ${JSON.stringify(result.error.flatten())}`)
  }
  return result.data
}
