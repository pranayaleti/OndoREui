import InvitePageClient from "./invite-page-client"

export function generateStaticParams() {
  return [{ token: "_" }]
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <InvitePageClient token={token} />
}
