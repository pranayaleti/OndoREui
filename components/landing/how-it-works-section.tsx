import { Home, Building, DollarSign } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-background dark:bg-[var(--gradient-overlay)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-foreground">How Ondo RE works for renters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted dark:bg-muted p-4 rounded-full mb-4">
              <Home className="h-8 w-8 text-foreground dark:text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-foreground">1. Find Properties</h3>
            <p className="text-foreground/70 dark:text-foreground/70">
              Enter your ZIP code to browse available rental properties in your area.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted dark:bg-muted p-4 rounded-full mb-4">
              <Building className="h-8 w-8 text-foreground dark:text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-foreground">2. Schedule Viewings</h3>
            <p className="text-foreground/70 dark:text-foreground/70">
              Tour your favorite properties with our professional property managers.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-muted dark:bg-muted p-4 rounded-full mb-4">
              <DollarSign className="h-8 w-8 text-foreground dark:text-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-foreground">3. Move In</h3>
            <p className="text-foreground/70 dark:text-foreground/70">
              Complete your application, sign the lease, and enjoy your new home.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}