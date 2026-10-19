import type { Metadata } from "next"
import { InvestmentsSubNav } from "@/components/investments/investments-sub-nav"

export const metadata: Metadata = {
  title: {
    default: "Investments | Ondo Real Estate",
    template: "%s | Ondo Real Estate Investments",
  },
  description:
    "How commercial, fractional and Opportunity Zone investing works in Utah. Sample deals only, no live offering.",
}

export default function InvestmentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InvestmentsSubNav />
      {children}
    </>
  )
}
