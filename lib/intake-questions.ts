/**
 * Client intake questionnaire (/intake). Edit questions here; the form renders whatever this
 * file describes and every answer is saved under its `id` in `website_leads.intake_answers`
 * (OndoREBackend migration 20261013070431). New questions need no backend or database change.
 *
 * Field shape:
 *   id        snake_case key saved with the lead (answers.<id>)
 *   label     question text (also sent so the staff email and inbox read naturally)
 *   type      text | email | tel | number | date | textarea | radio | checkboxes
 *   required  true to block Continue until answered
 *   options   for radio / checkboxes
 *   other     true adds an "Other" choice with a text box
 *   layout    "chips" renders short options in a row
 *   half      true puts two fields side by side on wider screens
 *   help      small hint under the label
 *   showIf    (answers) => boolean, show only when this returns true
 *
 * Compliance, read before adding questions:
 * - Renter questions stay Fair Housing safe: nothing about children, familial or marital
 *   status, religion, national origin, race, sex, disability, or source of income (Utah
 *   protects source of income). Screening belongs in the formal rental application, applied the
 *   same way to every applicant. lib/intake-questions.test.ts enforces the obvious terms.
 * - No lending offers or rate talk here. Ondo does not market loans from this form, so the
 *   financing question only asks where the buyer is, it does not offer a "second opinion".
 * - Text/call consent is not a question: the form renders the shared counsel-reviewed checkbox
 *   from lib/text-consent.ts, unticked and optional.
 *
 * NOTE(i18n): English-only, per OndoREui/CLAUDE.md.
 */

export const INTAKE_TYPE_IDS = ["buyer", "seller", "owner", "tenant"] as const
export type IntakeTypeId = (typeof INTAKE_TYPE_IDS)[number]

export function isIntakeTypeId(value: unknown): value is IntakeTypeId {
  return typeof value === "string" && (INTAKE_TYPE_IDS as readonly string[]).includes(value)
}

export const OTHER = "Other"

export type IntakeAnswerValue = string | string[]
export type IntakeFormAnswers = Record<string, IntakeAnswerValue | undefined>

export type IntakeFieldType = "text" | "email" | "tel" | "number" | "date" | "textarea" | "radio" | "checkboxes"

export interface IntakeField {
  id: string
  label: string
  type: IntakeFieldType
  required?: boolean
  options?: readonly string[]
  other?: boolean
  layout?: "chips"
  half?: boolean
  help?: string
  autoComplete?: string
  showIf?: (answers: IntakeFormAnswers) => boolean
}

export interface IntakeSection {
  id: string
  title: string
  intro?: string
  fields: readonly IntakeField[]
}

export interface IntakeTypeOption {
  id: IntakeTypeId
  title: string
  blurb: string
}

const WASATCH_CITIES = [
  "Draper",
  "Sandy",
  "South Jordan",
  "Herriman",
  "Riverton",
  "West Jordan",
  "Bluffdale",
  "Lehi",
  "Saratoga Springs",
  "Salt Lake City",
]

const BEDS = ["1", "2", "3", "4", "5+"]
const BATHS = ["1", "2", "3", "4", "5+"]
const MUST_NICE = ["Must have", "Nice to have", "Could add one later"]

export const INTAKE_TYPES: readonly IntakeTypeOption[] = [
  { id: "buyer", title: "Buy a home", blurb: "Tell us what you want so we can start the search." },
  { id: "seller", title: "Sell a home", blurb: "Share the details and we'll map out pricing and timing." },
  { id: "owner", title: "Rent out my property", blurb: "Property management, tenant placement, or a rent estimate." },
  { id: "tenant", title: "Find a rental", blurb: "Let us know what you need and when you want to move." },
]

/** Contact fields are sent as top-level API fields, not as answers. */
export const CONTACT_SECTION: IntakeSection = {
  id: "contact",
  title: "How to reach you",
  intro: "We use this only to follow up on your request.",
  fields: [
    { id: "first_name", label: "First name", type: "text", required: true, half: true, autoComplete: "given-name" },
    { id: "last_name", label: "Last name", type: "text", required: true, half: true, autoComplete: "family-name" },
    { id: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
    { id: "phone", label: "Best phone number", type: "tel", required: true, half: true, autoComplete: "tel" },
    { id: "phone_type", label: "Phone type", type: "radio", required: true, layout: "chips", options: ["Mobile", "Work", "Home"] },
    {
      id: "preferred_contact",
      label: "Best way to reach you",
      type: "radio",
      required: true,
      layout: "chips",
      options: ["Text", "Phone call", "Email", "Any of these"],
    },
    {
      id: "referral_source",
      label: "How did you hear about us?",
      type: "radio",
      required: true,
      other: true,
      options: ["Referral from someone", "Google search", "Social media", "Saw a sign", "Past client"],
    },
    {
      id: "referred_by",
      label: "Who sent you our way? We'd love to thank them.",
      type: "text",
      showIf: (a) => a["referral_source"] === "Referral from someone",
    },
  ],
}

// ---------------------------------------------------------------------------
// Buyers
// ---------------------------------------------------------------------------

const BUYER_SECTIONS: readonly IntakeSection[] = [
  {
    id: "buyer_situation",
    title: "Where you are now",
    fields: [
      { id: "current_address", label: "Current address", type: "text", required: true, autoComplete: "street-address" },
      { id: "current_housing", label: "Do you rent or own right now?", type: "radio", required: true, layout: "chips", options: ["Own", "Rent", "Neither"] },
      { id: "sell_first", label: "Do you need to sell a home before you buy?", type: "radio", required: true, layout: "chips", options: ["Yes", "No", "Not sure"] },
      { id: "co_buyer_name", label: "Co-buyer name", type: "text", half: true, help: "Optional. Anyone buying with you. We'll only contact them after you introduce us." },
      { id: "co_buyer_email", label: "Co-buyer email", type: "email", half: true },
      { id: "co_buyer_phone", label: "Co-buyer phone", type: "tel", half: true },
    ],
  },
  {
    id: "buyer_money",
    title: "Budget and timing",
    fields: [
      {
        id: "financing",
        label: "Where are you with financing?",
        type: "radio",
        required: true,
        options: ["Pre-approved with a lender", "Talking with a lender", "Haven't talked to a lender yet", "Paying cash"],
      },
      {
        id: "lender",
        label: "Lender name and company",
        type: "text",
        help: "So we can coordinate with them.",
        showIf: (a) => a["financing"] === "Pre-approved with a lender" || a["financing"] === "Talking with a lender",
      },
      {
        id: "price_range",
        label: "Price range",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["Under $500K", "$500K to $1M", "$1M to $1.5M", "$1.5M to $2M", "$2M to $2.5M", "$2.5M to $3M", "$3M+"],
      },
      {
        id: "timeframe",
        label: "When do you want to buy?",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["Right away", "1 to 3 months", "3 to 6 months", "6+ months", "Just watching the market"],
      },
      {
        id: "pace",
        label: "Where are you in the process?",
        type: "radio",
        options: ["Just browsing", "2 to 4 weeks from making an offer", "Ready to make an offer"],
      },
    ],
  },
  {
    id: "buyer_location",
    title: "Where you want to live",
    fields: [
      { id: "cities", label: "Cities you're interested in", type: "checkboxes", required: true, other: true, layout: "chips", options: WASATCH_CITIES },
      { id: "neighborhoods_like", label: "Neighborhoods you love", type: "textarea" },
      {
        id: "neighborhoods_avoid",
        label: "Areas to rule out, and why",
        type: "textarea",
        help: "For example: commute time, HOA rules, lot size, traffic. Tell us about the homes and the drive, not the neighbors.",
      },
      {
        id: "school_importance",
        label: "How much does the school district matter?",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["A lot", "Somewhat", "Not much"],
        help: "We'll share official district boundary maps and state report-card links so you can compare. We don't rank schools or neighborhoods.",
      },
      { id: "transit", label: "Do you need to be near public transit?", type: "radio", required: true, layout: "chips", options: ["Yes", "No", "Maybe"] },
      { id: "condo_townhome", label: "Open to a townhome or condo?", type: "radio", required: true, layout: "chips", options: ["Yes", "No", "Maybe"] },
    ],
  },
  {
    id: "buyer_home",
    title: "The home itself",
    fields: [
      { id: "bedrooms", label: "Bedrooms", type: "radio", required: true, layout: "chips", half: true, options: BEDS },
      { id: "bathrooms", label: "Bathrooms", type: "radio", required: true, layout: "chips", half: true, options: BATHS },
      { id: "garage", label: "Garage spaces", type: "radio", required: true, layout: "chips", options: ["1", "2", "3+", "Not important"] },
      { id: "primary_suite", label: "Primary suite", type: "radio", required: true, layout: "chips", options: MUST_NICE },
      { id: "family_room", label: "Family room separate from the living room", type: "radio", required: true, layout: "chips", options: MUST_NICE },
      {
        id: "kitchen",
        label: "Kitchen",
        type: "radio",
        required: true,
        options: ["A small kitchen is fine", "A galley kitchen is fine", "Large with an island", "Large, island not required"],
      },
      { id: "yard", label: "Yard", type: "radio", required: true, layout: "chips", other: true, options: ["Must have", "Nice to have", "Not important"] },
      {
        id: "entertaining",
        label: "How do you like to host?",
        type: "radio",
        required: true,
        options: ["Formal, in the dining and living room", "Casual, kitchen plus outdoor space", "Mostly backyard BBQs"],
      },
      {
        id: "work_tolerance",
        label: "How much work are you willing to put into the house?",
        type: "radio",
        required: true,
        options: [
          "None, it needs to be move-in ready",
          "Light cosmetic work like paint, carpet, or fixtures",
          "Some remodeling is fine",
          "Moving walls or adding on doesn't scare me",
        ],
      },
      { id: "must_have_features", label: "Features or upgrades you can't live without", type: "textarea" },
      { id: "anything_else", label: "Anything else we should know about your search?", type: "textarea" },
    ],
  },
  {
    id: "buyer_personal",
    title: "A little about you",
    intro: "All optional. It helps us get to know you beyond the house.",
    fields: [
      { id: "favorite_drink", label: "Favorite drink", type: "text", half: true },
      { id: "downtime", label: "Favorite way to spend downtime", type: "text", half: true },
      { id: "casual_dining", label: "Go-to casual restaurant or cuisine", type: "text", half: true },
      { id: "celebration_dining", label: "Where you go to celebrate", type: "text", half: true },
      { id: "pets", label: "Pets and their names", type: "text" },
    ],
  },
]

// ---------------------------------------------------------------------------
// Sellers
// ---------------------------------------------------------------------------

const SELLER_SECTIONS: readonly IntakeSection[] = [
  {
    id: "seller_property",
    title: "Your property",
    fields: [
      { id: "property_address", label: "Property address", type: "text", required: true, autoComplete: "street-address" },
      {
        id: "property_type",
        label: "Property type",
        type: "radio",
        required: true,
        layout: "chips",
        other: true,
        options: ["Single family", "Townhome", "Condo", "Multi-family", "Land"],
      },
      { id: "bedrooms", label: "Bedrooms", type: "radio", required: true, layout: "chips", half: true, options: BEDS },
      { id: "bathrooms", label: "Bathrooms", type: "radio", required: true, layout: "chips", half: true, options: BATHS },
      { id: "square_feet", label: "Approximate square feet", type: "number", half: true },
      { id: "year_built", label: "Year built", type: "number", half: true },
      { id: "occupancy", label: "Who lives there now?", type: "radio", required: true, layout: "chips", options: ["I do", "A tenant", "It's vacant"] },
      { id: "condition", label: "Overall condition", type: "radio", required: true, options: ["Move-in ready", "Needs a few updates", "Needs major work"] },
      { id: "upgrades", label: "Recent upgrades or things buyers will love", type: "textarea" },
      { id: "co_owner", label: "Anyone else on title?", type: "text", help: "Optional. Name of a co-owner who will sign." },
    ],
  },
  {
    id: "seller_plans",
    title: "Your plans",
    fields: [
      {
        id: "reason",
        label: "What's prompting the sale?",
        type: "radio",
        other: true,
        options: ["Moving up", "Downsizing", "Relocating", "Cashing out an investment", "A life change"],
      },
      {
        id: "sell_timeframe",
        label: "When do you want to sell?",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["As soon as possible", "1 to 3 months", "3 to 6 months", "6+ months", "Just curious what it's worth"],
      },
      { id: "price_expectation", label: "What do you think it's worth?", type: "text", help: "A rough guess is fine." },
      {
        id: "listing_status",
        label: "Has it been on the market?",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["Not yet", "Listed right now", "Listed in the past year"],
      },
      {
        id: "buying_next",
        label: "Are you buying your next home too?",
        type: "radio",
        required: true,
        options: ["Yes, and I want help with it", "Yes, I've got that covered", "No", "Not sure yet"],
      },
      { id: "anything_else", label: "Anything else we should know?", type: "textarea" },
    ],
  },
]

// ---------------------------------------------------------------------------
// Rental owners
// ---------------------------------------------------------------------------

const OWNER_SECTIONS: readonly IntakeSection[] = [
  {
    id: "owner_property",
    title: "Your rental property",
    fields: [
      { id: "property_address", label: "Property address", type: "text", required: true, autoComplete: "street-address" },
      {
        id: "property_type",
        label: "Property type",
        type: "radio",
        required: true,
        layout: "chips",
        other: true,
        options: ["Single family", "Townhome", "Condo", "Duplex to fourplex", "5+ units", "Basement apartment or ADU"],
      },
      { id: "units", label: "Number of units", type: "number", required: true, half: true },
      { id: "bed_bath", label: "Beds and baths", type: "text", required: true, half: true, help: "For example: 3 bed, 2 bath" },
      {
        id: "occupancy",
        label: "Current status",
        type: "radio",
        required: true,
        options: ["Rented with a tenant in place", "Vacant and ready to rent", "Vacant and needs work", "I live there now"],
      },
      { id: "current_rent", label: "Current monthly rent", type: "text", half: true, help: "If it's rented today." },
      { id: "hoa", label: "Is there an HOA?", type: "radio", layout: "chips", half: true, options: ["Yes", "No", "Not sure"] },
    ],
  },
  {
    id: "owner_needs",
    title: "How we can help",
    fields: [
      {
        id: "management_today",
        label: "Who manages it today?",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["I do", "Another company", "Nobody yet, it's a new rental"],
      },
      {
        id: "services",
        label: "What do you need?",
        type: "checkboxes",
        required: true,
        options: ["Full-service management", "Find and place a tenant", "Rent collection", "Maintenance coordination", "A rent estimate"],
      },
      {
        id: "start_timeframe",
        label: "When do you want to start?",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["Right away", "Within 30 days", "1 to 3 months", "Just exploring"],
      },
      {
        id: "also_interested",
        label: "Anything else on your radar?",
        type: "checkboxes",
        layout: "chips",
        options: ["Selling this property", "Buying another rental"],
      },
      {
        id: "goals",
        label: "Biggest headache or goal with this property",
        type: "textarea",
        help: "Every applicant is screened by the same written criteria, as fair housing law requires, so preferences about who lives there can't be part of the plan.",
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Renters (Fair Housing: see the header before adding anything here)
// ---------------------------------------------------------------------------

const TENANT_SECTIONS: readonly IntakeSection[] = [
  {
    id: "tenant_search",
    title: "Your ideal rental",
    fields: [
      { id: "move_in_date", label: "Ideal move-in date", type: "date", required: true, half: true },
      { id: "lease_length", label: "Lease length", type: "radio", required: true, layout: "chips", half: true, options: ["6 months", "12 months", "18+ months", "Flexible"] },
      {
        id: "rent_budget",
        label: "Monthly rent budget",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["Under $1,500", "$1,500 to $2,000", "$2,000 to $2,500", "$2,500 to $3,000", "$3,000+"],
      },
      { id: "bedrooms", label: "Bedrooms", type: "radio", required: true, layout: "chips", half: true, options: ["Studio", "1", "2", "3", "4+"] },
      { id: "bathrooms", label: "Bathrooms", type: "radio", required: true, layout: "chips", half: true, options: ["1", "2", "3+"] },
      {
        id: "home_type",
        label: "Type of home",
        type: "checkboxes",
        required: true,
        layout: "chips",
        options: ["House", "Townhome", "Apartment or condo", "Basement apartment", "No preference"],
      },
      { id: "cities", label: "Cities you're interested in", type: "checkboxes", required: true, other: true, layout: "chips", options: WASATCH_CITIES },
    ],
  },
  {
    id: "tenant_details",
    title: "Move-in details",
    fields: [
      {
        id: "occupants",
        label: "How many people will live in the home?",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["1", "2", "3", "4", "5", "6+"],
        help: "Used only to check the home's occupancy limit.",
      },
      {
        id: "pets",
        label: "Pets",
        type: "radio",
        required: true,
        layout: "chips",
        options: ["No pets", "Dog", "Cat", "Dog and cat", "Other pet"],
        help: "Assistance animals aren't pets and never carry pet fees or pet rent.",
      },
      {
        id: "pet_details",
        label: "Tell us about your pets",
        type: "text",
        help: "Type, breed, and weight.",
        showIf: (a) => typeof a["pets"] === "string" && a["pets"] !== "No pets",
      },
      { id: "current_housing", label: "Current living situation", type: "radio", layout: "chips", other: true, options: ["Renting", "Own a home"] },
      { id: "must_haves", label: "Must-haves", type: "textarea", help: "Parking, in-unit laundry, yard, commute, and so on." },
    ],
  },
]

export const SECTIONS_BY_TYPE: Record<IntakeTypeId, readonly IntakeSection[]> = {
  buyer: BUYER_SECTIONS,
  seller: SELLER_SECTIONS,
  owner: OWNER_SECTIONS,
  tenant: TENANT_SECTIONS,
}

/** Topic named in the text-consent checkbox, per questionnaire. */
export const INTAKE_CONSENT_TOPIC: Record<IntakeTypeId, string> = {
  buyer: "your home search",
  seller: "selling your home",
  owner: "managing your rental",
  tenant: "finding a rental",
}
