import type { FAQItem } from "@/lib/seo"

export type FractionalFAQItem = FAQItem & { value: string }

export const FRACTIONAL_FAQ_ITEMS: FractionalFAQItem[] = [
  {
    value: "what-is-fractional",
    question: "What is fractional real estate ownership?",
    answer:
      "Fractional ownership allows multiple investors to collectively purchase a share of a commercial property through a legal entity such as an LLC or SPV (Special Purpose Vehicle). Each investor owns a proportional interest and receives distributions based on their ownership percentage.",
  },
  {
    value: "minimum-investment",
    question: "What is the minimum investment amount?",
    answer:
      "Minimum investments vary by opportunity and typically range from $10,000 to $50,000. Each deal listing specifies its own minimum. This structure lowers the barrier to entry compared to purchasing an entire commercial property.",
  },
  {
    value: "how-returns",
    question: "How are returns generated and distributed?",
    answer:
      "Returns come from two sources: ongoing rental income (distributed monthly or quarterly) and potential appreciation realized at the time of property sale. Distribution schedules and projected return ranges are disclosed in each opportunity's offering materials.",
  },
  {
    value: "legal-structure",
    question: "What is the legal structure of each investment?",
    answer:
      "Each property is held in a dedicated LLC or SPV. Investors receive membership interests in the entity. This structure provides liability protection, your risk is limited to the amount you invest. The operating agreement governs distributions, voting rights, and exit terms.",
  },
  {
    value: "liquidity",
    question: "Can I sell my shares before the hold period ends?",
    answer:
      "Fractional real estate investments are generally illiquid. Most offerings have a defined hold period (typically 3–10 years). Some structures allow secondary transfers with manager approval, but early exit is not guaranteed. Review each offering's liquidity provisions before investing.",
  },
  {
    value: "tax-implications",
    question: "What are the tax implications?",
    answer:
      "Investors typically receive a Schedule K-1 for their share of the entity's income, deductions, and credits. Depreciation pass-through can provide tax-advantaged income. Tax treatment varies based on individual circumstances, consult a qualified tax professional.",
  },
  {
    value: "accreditation",
    question: "Do I need to be an accredited investor?",
    answer:
      "Requirements vary by offering. Some opportunities are structured under Regulation D and require accredited investor status. Others may be available under Regulation A+ or Regulation CF with lower qualification thresholds. Each listing specifies eligibility requirements.",
  },
  {
    value: "risks",
    question: "What are the primary risks?",
    answer:
      "Key risks include loss of principal, illiquidity, tenant vacancy, interest rate changes, market downturns, and property-specific factors. All investments involve risk and projected returns are not guaranteed. Review the risk factors disclosed in each opportunity before investing.",
  },
]
