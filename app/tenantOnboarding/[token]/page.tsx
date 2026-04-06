import { OnboardingClient } from "./onboarding-client"

export function generateStaticParams() {
  return [{ token: "_" }]
}

export default function TenantOnboardingPage() {
  return <OnboardingClient />
}
