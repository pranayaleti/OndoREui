// lib/notary-location-copy.ts
import { getNotaryCity, type NotaryCityRecord } from "./notary-cities"
import type { RonStateRecord } from "./notary-ron-states"

const TIMEZONE_LABELS: Record<string, string> = {
  "America/Los_Angeles": "Pacific Time",
  "America/Denver": "Mountain Time",
  "America/Boise": "Mountain Time",
  "America/Phoenix": "Arizona/Phoenix Time",
  "America/Chicago": "Central Time",
  "America/New_York": "Eastern Time",
  "America/Indiana/Indianapolis": "Eastern Time",
  "America/Detroit": "Eastern Time",
  "America/Anchorage": "Alaska Time",
  "Pacific/Honolulu": "Hawaii Time",
}

export type NotaryFaq = { question: string; answer: string }

export function friendlyTimezoneLabel(iana?: string): string | undefined {
  if (!iana) return undefined
  const mapped = TIMEZONE_LABELS[iana]
  if (mapped) return mapped
  return iana.replace(/^([A-Za-z]+)\//, "").replace(/_/g, " ")
}

export function receivingPartyCaveat(): string {
  return "Receiving parties — lenders, title companies, courts, and agencies — set their own rules for accepting remote online notarizations. Confirm acceptance before your session."
}

export function buildCityRonIntro(city: NotaryCityRecord, state: RonStateRecord): string {
  const parts: string[] = []
  parts.push(
    `ONDO Notary provides remote online notarization (RON) for clients in ${city.name}, ${state.name}.`
  )

  if (city.county && city.metro) {
    parts.push(
      `Whether you are in ${city.county} or elsewhere in the ${city.metro}, you can complete a secure video session with identity verification from home or office.`
    )
  } else if (city.county) {
    parts.push(
      `Clients across ${city.county} use RON for real estate, loan, and estate documents without traveling to a notary office.`
    )
  } else if (city.metro) {
    parts.push(
      `Across the ${city.metro}, RON lets you notarize documents on a schedule that fits busy workdays.`
    )
  }

  if (city.timezone) {
    const tzLabel = friendlyTimezoneLabel(city.timezone)
    if (tzLabel) {
      parts.push(
        `Sessions are scheduled with ${tzLabel} availability in mind so closings and affidavits stay on track.`
      )
    }
  }

  if (city.nearbyCitySlugs && city.nearbyCitySlugs.length > 0) {
    const labels = city.nearbyCitySlugs
      .slice(0, 3)
      .map((s) => getNotaryCity(city.stateSlug, s)?.name ?? s.replace(/-/g, " "))
      .join(", ")
    parts.push(`Nearby communities we also serve online include ${labels}.`)
  }

  if (state.code === "UT") {
    parts.push(
      `In Utah's Wasatch Front we also offer mobile and in-office notary when you prefer an in-person appointment; RON remains available nationwide.`
    )
  }

  parts.push(receivingPartyCaveat())
  return parts.join(" ")
}

export function buildStateRonFaqs(state: RonStateRecord): NotaryFaq[] {
  return [
    {
      question: `Is remote online notary available in ${state.name}?`,
      answer: `Yes. ONDO Notary offers RON for clients in ${state.name}. ${receivingPartyCaveat()}`,
    },
    {
      question: `How does a RON session work in ${state.name}?`,
      answer: `You join a secure video session, complete identity verification, review your documents, and e-sign while a commissioned notary completes the notarization online.`,
    },
    {
      question: `Do I need a local notary office in ${state.name}?`,
      answer: `No for RON — you can complete the session from anywhere with a supported device and internet. ${state.code === "UT" ? "Utah clients can also book mobile or in-office notary along the Wasatch Front." : "Mobile and in-office notary from ONDO is focused on Utah; elsewhere we specialize in RON."}`,
    },
    {
      question: `What documents can be notarized for ${state.name} clients?`,
      answer: `Common use cases include real estate packages, loan signings, estate planning documents, powers of attorney, and affidavits — subject to receiving-party acceptance.`,
    },
  ]
}

export function buildCityRonFaqs(city: NotaryCityRecord, state: RonStateRecord): NotaryFaq[] {
  const shared = buildStateRonFaqs(state).map((f) => ({
    question: f.question.replace(state.name, `${city.name}, ${state.name}`),
    answer: f.answer,
  }))
  const local: NotaryFaq[] = [
    {
      question: `Can I get an online notary in ${city.name}?`,
      answer: `Yes. ONDO Notary serves clients in ${city.name}, ${state.code} through remote online notarization. ${city.county ? `Many signers in ${city.county} choose RON for faster scheduling. ` : ""}${receivingPartyCaveat()}`,
    },
    {
      question: `Is RON the same as a notary near me in ${city.name}?`,
      answer: `RON replaces an in-person stamp with a secure online session. You still work with a commissioned notary; you do not need to drive to a storefront in ${city.name}.`,
    },
  ]
  return [...local, ...shared].slice(0, 6)
}
