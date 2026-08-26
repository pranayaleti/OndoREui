import { propertyManagementFaqBank } from "./service-faq"

export const OWNER_PROCESS_STEPS = [
  {
    step: 1,
    title: "Onboard your property",
    desc: "Add your rental, upload documents, and we handle tenant placement and screening.",
  },
  {
    step: 2,
    title: "Collect rent automatically",
    desc: "Tenants pay online. You get direct deposits and real-time financial statements.",
  },
  {
    step: 3,
    title: "We handle maintenance",
    desc: "Tenants submit requests in the portal. We coordinate vendors and keep you updated.",
  },
  {
    step: 4,
    title: "Track everything live",
    desc: "Your owner dashboard shows rent status, expenses, occupancy, and AI-powered risk alerts.",
  },
] as const

const onboardingFaq = propertyManagementFaqBank.find((item) =>
  /onboarding/i.test(item.q),
)

/** Owner onboarding window from the PM FAQ bank — not a dispatched-tech ETA. */
export const OWNER_ONBOARDING_NOTE =
  onboardingFaq?.a ??
  "We review your goals, collect documents and keys, perform a walk-through, set pricing, activate marketing, and begin showings, typically within 48–72 hours."
