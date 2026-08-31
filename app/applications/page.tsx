import { MyApplicationsClient } from "@/components/rental/my-applications-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "My applications",
}

export default function ApplicationsPage() {
  return <MyApplicationsClient />
}
