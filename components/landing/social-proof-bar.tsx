import { Building, Users, Shield, Clock } from "lucide-react"

const stats = [
  { icon: Building, value: "Wasatch Front", label: "Service area — Salt Lake City to Payson" },
  { icon: Users, value: "6 roles", label: "Owner, tenant, manager, investor, maintenance, admin" },
  { icon: Shield, value: "24/7", label: "Emergency maintenance response" },
  { icon: Clock, value: "< 1 week", label: "Average owner onboarding time" },
]

export function SocialProofBar() {
  return (
    <section className="py-10 bg-muted/50 dark:bg-muted/10 border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-2">
              <stat.icon className="h-6 w-6 text-primary" aria-hidden />
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-foreground/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
