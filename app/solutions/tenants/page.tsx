import type { Metadata } from "next"
import Link from "next/link"
import { CreditCard, ClipboardList, FolderOpen, MessageSquare, Bell, Shield, Camera, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "For Tenants | Ondo Real Estate",
  description: "Pay rent online, submit maintenance requests, and message your landlord — all in the Ondo tenant portal.",
}

const features = [
  { icon: CreditCard, title: "Online rent payment", body: "Pay securely online via Stripe, get receipts instantly, and set up autopay so you never miss a due date." },
  { icon: ClipboardList, title: "Maintenance request tracking", body: "Submit a request in seconds with photos. Track status in real time and get notified when it's resolved." },
  { icon: FolderOpen, title: "Document access", body: "View your lease, move-in checklist, inspections, and notices anytime from your portal." },
  { icon: MessageSquare, title: "Direct messaging", body: "Message your property manager without phone tag — all conversations saved in one place." },
  { icon: Bell, title: "Push notifications", body: "Get instant alerts for rent reminders, maintenance updates, and important notices." },
  { icon: Camera, title: "Photo maintenance reports", body: "Snap a photo of the issue and attach it to your request — no need to describe it twice." },
  { icon: Shield, title: "Secure & encrypted", body: "Bank-level encryption protects your data. Your portal is available 24/7 from any device." },
  { icon: Users, title: "Rent splitting", body: "Split rent with roommates directly in the portal — each person pays their share independently." },
]

export default function TenantsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="For Tenants | Ondo Real Estate"
        description="Pay rent online, submit maintenance requests, and message your landlord — all in the Ondo tenant portal."
        pathname="/solutions/tenants"
      />
      <PageBanner
        title="Your home. Your portal. Zero friction."
        subtitle="Pay rent, submit requests, and talk to your landlord — all in one app."
      />

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="border border-border">
                <CardContent className="p-6 flex flex-col gap-3">
                  <Icon className="h-7 w-7 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                  <p className="text-foreground/70 text-sm">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-foreground text-lg">Secure, simple, always on — your data is encrypted and your portal is available 24/7.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/tenant">Log in to your portal</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/properties">Find a rental</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
