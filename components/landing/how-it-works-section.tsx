import Link from "next/link"
import { Upload, BarChart3, Wrench, Wallet } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-background dark:bg-[var(--gradient-overlay)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 dark:text-foreground">How Ondo RE works for property owners</h2>
        <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
          Hand off the day-to-day and keep full visibility. Most owners are set up within a week.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted dark:bg-muted p-4 rounded-full mb-4">
              <Upload className="h-8 w-8 text-foreground dark:text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-foreground">1. Onboard your property</h3>
            <p className="text-foreground/70 dark:text-foreground/70">
              Add your rental, upload documents, and we handle tenant placement and screening.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted dark:bg-muted p-4 rounded-full mb-4">
              <Wallet className="h-8 w-8 text-foreground dark:text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-foreground">2. Collect rent automatically</h3>
            <p className="text-foreground/70 dark:text-foreground/70">
              Tenants pay online. You get direct deposits and real-time financial statements.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted dark:bg-muted p-4 rounded-full mb-4">
              <Wrench className="h-8 w-8 text-foreground dark:text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-foreground">3. We handle maintenance</h3>
            <p className="text-foreground/70 dark:text-foreground/70">
              Tenants submit requests in the portal. We coordinate vendors and keep you updated.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted dark:bg-muted p-4 rounded-full mb-4">
              <BarChart3 className="h-8 w-8 text-foreground dark:text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-foreground">4. Track everything live</h3>
            <p className="text-foreground/70 dark:text-foreground/70">
              Your owner dashboard shows rent status, expenses, occupancy, and AI-powered risk alerts.
            </p>
          </div>
        </div>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            See pricing
          </Link>
          <Link href="/properties" className="font-medium text-primary underline-offset-4 hover:underline px-6 py-3">
            Browse rentals
          </Link>
        </div>
      </div>
    </section>
  )
}