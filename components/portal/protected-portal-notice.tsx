import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

export function ProtectedPortalNotice({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <div className="max-w-lg rounded-2xl border bg-background/95 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-foreground/70">{description}</p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href={APP_PORTAL_LOGIN_URL}>Go to Property Management Portal</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Talk to Ondo Real Estate</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
