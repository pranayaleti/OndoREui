/**
 * Pure helpers behind components/intake/intake-form.tsx: validation, answer cleanup, the API
 * payload, and the session draft. Kept out of the component so they can be unit-tested.
 */
import {
  CONTACT_SECTION,
  OTHER,
  SECTIONS_BY_TYPE,
  isIntakeTypeId,
  type IntakeField,
  type IntakeFormAnswers,
  type IntakeTypeId,
} from "@/lib/intake-questions"
import type { SubmitIntakeLeadPayload } from "@/lib/leads-api"
import type { MarketingAttribution } from "@/lib/attribution"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const otherKey = (fieldId: string) => `${fieldId}__other`

export function isVisible(field: IntakeField, answers: IntakeFormAnswers): boolean {
  return !field.showIf || field.showIf(answers)
}

function allowedOptions(field: IntakeField): readonly string[] {
  const options = field.options ?? []
  return field.other ? [...options, OTHER] : options
}

/** The answer only if it still fits the field (answers carry over when someone switches type). */
export function currentValue(field: IntakeField, answers: IntakeFormAnswers): string | string[] {
  const v = answers[field.id]
  if (field.type === "radio") return typeof v === "string" && allowedOptions(field).includes(v) ? v : ""
  if (field.type === "checkboxes") return Array.isArray(v) ? v.filter((x) => allowedOptions(field).includes(x)) : []
  return typeof v === "string" ? v : ""
}

function isBlank(v: string | string[]): boolean {
  return Array.isArray(v) ? v.length === 0 : v.trim() === ""
}

export function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "")
  if (d.startsWith("1")) d = d.slice(1)
  d = d.slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export type IntakeErrors = Record<string, string>

export function validateFields(fields: readonly IntakeField[], answers: IntakeFormAnswers): IntakeErrors {
  const errors: IntakeErrors = {}
  for (const f of fields) {
    if (!isVisible(f, answers)) continue
    const v = currentValue(f, answers)
    if (isBlank(v)) {
      if (f.required) {
        errors[f.id] = f.type === "checkboxes" ? "Pick at least one." : f.type === "radio" ? "Pick one." : "This one is required."
      }
      continue
    }
    if (typeof v === "string") {
      if (f.type === "email" && !EMAIL_RE.test(v.trim())) errors[f.id] = "Check the email address. It should look like name@example.com."
      if (f.type === "tel" && v.replace(/\D/g, "").length < 10) errors[f.id] = "Enter a 10-digit phone number."
    }
    if (f.other) {
      const pickedOther = Array.isArray(v) ? v.includes(OTHER) : v === OTHER
      const otherText = answers[otherKey(f.id)]
      if (pickedOther && !(typeof otherText === "string" && otherText.trim())) errors[f.id] = "Fill in the Other box."
    }
  }
  return errors
}

/** Final value with "Other" replaced by what the visitor typed; undefined when blank. */
export function resolvedValue(field: IntakeField, answers: IntakeFormAnswers): string | string[] | undefined {
  const v = currentValue(field, answers)
  if (isBlank(v)) return undefined
  if (!field.other) return Array.isArray(v) ? v : v.trim()
  const typed = answers[otherKey(field.id)]
  const other = typeof typed === "string" ? typed.trim() : ""
  const swap = (x: string) => (x === OTHER ? `Other: ${other}` : x)
  return Array.isArray(v) ? v.map(swap) : swap(v).trim()
}

const asString = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined)

/** Server field name → contact question id, for mapping 400 `details` back onto the form. */
export const PAYLOAD_TO_CONTACT_FIELD: Record<string, string> = {
  firstName: "first_name",
  lastName: "last_name",
  email: "email",
  phone: "phone",
  phoneType: "phone_type",
  preferredContact: "preferred_contact",
  referralSource: "referral_source",
  referredBy: "referred_by",
}

export function buildIntakePayload(
  type: IntakeTypeId,
  answers: IntakeFormAnswers,
  consent: { textConsent: boolean; consentVersion: string },
  attribution?: MarketingAttribution,
): SubmitIntakeLeadPayload {
  const contact: Record<string, string | undefined> = {}
  for (const f of CONTACT_SECTION.fields) {
    if (isVisible(f, answers)) contact[f.id] = asString(resolvedValue(f, answers))
  }

  const out: Record<string, string | string[]> = {}
  const labels: Record<string, string> = {}
  for (const f of SECTIONS_BY_TYPE[type].flatMap((s) => s.fields)) {
    if (!isVisible(f, answers)) continue
    const v = resolvedValue(f, answers)
    if (v === undefined) continue
    out[f.id] = v
    labels[f.id] = f.label
  }

  const optional = (key: keyof SubmitIntakeLeadPayload, value: string | undefined) => (value ? { [key]: value } : {})

  return {
    intakeType: type,
    firstName: contact["first_name"] ?? "",
    lastName: contact["last_name"] ?? "",
    email: contact["email"] ?? "",
    phone: contact["phone"] ?? "",
    ...optional("phoneType", contact["phone_type"]),
    ...optional("preferredContact", contact["preferred_contact"]),
    ...optional("referralSource", contact["referral_source"]),
    ...optional("referredBy", contact["referred_by"]),
    answers: out,
    labels,
    textConsent: consent.textConsent,
    ...(consent.textConsent ? { consentVersion: consent.consentVersion } : {}),
    ...(attribution ? { attribution } : {}),
  }
}

// ---------------------------------------------------------------------------
// Session draft: a refresh mid-questionnaire keeps the answers (this tab only).
// ---------------------------------------------------------------------------

const DRAFT_KEY = "ondo.intake_draft.v1"

export interface IntakeDraft {
  type: IntakeTypeId | null
  answers: IntakeFormAnswers
  step: number
}

export function readIntakeDraft(): IntakeDraft | null {
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) ?? "null") as unknown
    if (!raw || typeof raw !== "object") return null
    const d = raw as Partial<IntakeDraft>
    return {
      type: isIntakeTypeId(d.type) ? d.type : null,
      answers: d.answers && typeof d.answers === "object" ? d.answers : {},
      step: typeof d.step === "number" && d.step >= 0 ? d.step : 0,
    }
  } catch {
    return null
  }
}

export function writeIntakeDraft(draft: IntakeDraft): void {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // Storage blocked; the form still works.
  }
}

export function clearIntakeDraft(): void {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    // ignore
  }
}
