import { Mail, Phone } from "lucide-react"
import type { ListingAgentCardData } from "@/lib/listing-presentation"
import { cn } from "@/lib/utils"

type ListingAgentCardProps = {
  agents: ListingAgentCardData[]
  inquireHref?: string
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "OR"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
}

export function ListingAgentCard({ agents, inquireHref = "#listing-inquire" }: ListingAgentCardProps) {
  if (agents.length === 0) return null

  return (
    <section aria-labelledby="listing-agent-heading" className="mb-8">
      <h2 id="listing-agent-heading" className="mb-3 text-xl font-semibold">
        {agents.length > 1 ? "Leasing contacts" : "Leasing contact"}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {agents.map((agent) => {
          const tel = agent.phone.replace(/[^\d+]/g, "")
          return (
            <li
              key={`${agent.name}-${agent.email}`}
              className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {agent.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={agent.photoUrl}
                    alt=""
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-outfit text-sm font-semibold text-primary"
                    aria-hidden="true"
                  >
                    {initials(agent.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.title}</p>
                </div>
              </div>
              {agent.bio ? <p className="mt-3 text-sm text-foreground/80">{agent.bio}</p> : null}
              <ul className="mt-3 space-y-1 text-sm">
                {agent.phone ? (
                  <li>
                    <a
                      href={`tel:${tel}`}
                      className="inline-flex min-h-11 items-center gap-2 hover:underline"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {agent.phone}
                    </a>
                  </li>
                ) : null}
                {agent.email ? (
                  <li>
                    <a
                      href={`mailto:${agent.email}`}
                      className="inline-flex min-h-11 items-center gap-2 hover:underline"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      {agent.email}
                    </a>
                  </li>
                ) : null}
              </ul>
              <a
                href={inquireHref}
                className={cn(
                  "mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90",
                )}
              >
                Contact {agent.name.split(" ")[0]}
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
