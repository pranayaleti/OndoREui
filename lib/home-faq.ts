import { type CityFaq } from "./city-content"
import { propertyManagementFaqBank } from "./service-faq"
import { NOTARY_RON_ACT_USD } from "./notary-fees"

const feeFaq = propertyManagementFaqBank.find((item) => /fees/i.test(item.q))

/** Five homepage questions, one per service, answered from the same sources the service pages use. */
export const HOMEPAGE_FAQS: CityFaq[] = [
  {
    q: "What does property management cost?",
    a:
      feeFaq?.a ??
      "Starter is 10% of collected rent for 1 to 4 units and Growth is 8% for 5 to 15. Leasing is a one-time 50% of the first month's rent when we place a new tenant.",
  },
  {
    q: "How do I apply for one of your rentals?",
    a: "Pick a home on the rentals page and request a showing. After the showing we send an application link. Every applicant is screened against the same written criteria.",
  },
  {
    q: "How do I find out what my home is worth?",
    a: "Use the free home estimate for a rent and sale range built from Ondo city medians. It is not an appraisal or a CMA. For a listing price, book a call and we walk the home with you.",
  },
  {
    q: "What happens when I ask about a home loan?",
    a: "We talk through your goals, income and timeline, then explain which programs may fit. Nothing on this site is a quote, a rate lock or a credit decision.",
  },
  {
    q: "How does remote online notarization work?",
    a: `You meet the notary on a video call, verify your ID and sign electronically. Sessions are remote only, from $${NOTARY_RON_ACT_USD} per notarial act, and accepted in every state when the receiving party takes electronic notarization.`,
  },
]
