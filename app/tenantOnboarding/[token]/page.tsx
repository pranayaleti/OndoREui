import type { Metadata } from "next"
import { OnboardingClient } from "./onboarding-client"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}


export function generateStaticParams() {
  return [{ token: "_" }]
}

export default function TenantOnboardingPage() {
  return <OnboardingClient />
}
