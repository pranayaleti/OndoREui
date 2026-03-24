import { ApplyPageClient } from "./apply-page-client"

// Dynamic token URLs are handled client-side via the 404 fallback.
// We generate one placeholder so Next.js static export is satisfied.
export function generateStaticParams() {
  return [{ token: '_' }]
}

export default function ApplyPage() {
  return <ApplyPageClient />
}
