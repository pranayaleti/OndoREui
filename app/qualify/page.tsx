import type { Metadata } from "next"
import QualifyPageClient from "./page-client"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function Page() {
  return <QualifyPageClient />
}
