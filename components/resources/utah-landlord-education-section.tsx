import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  UTAH_LANDLORD_EDUCATION_DISCLAIMER,
  UTAH_LANDLORD_EDUCATION_INTRO,
  groupedUtahLandlordEducationLinks,
} from "@/lib/resources/utah-landlord-education"

export function UtahLandlordEducationSection() {
  const groups = groupedUtahLandlordEducationLinks()

  return (
    <section
      id="utah-landlord-education"
      aria-labelledby="utah-landlord-education-heading"
      className="scroll-mt-24"
    >
      <h2 id="utah-landlord-education-heading" className="mb-4 text-2xl font-semibold">
        Utah landlord education &amp; official resources
      </h2>
      <p className="mb-4 text-foreground/70">{UTAH_LANDLORD_EDUCATION_INTRO}</p>
      <p className="mb-8 text-sm text-foreground/70">{UTAH_LANDLORD_EDUCATION_DISCLAIMER}</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.kind} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{group.label}</CardTitle>
              <CardDescription>
                Outbound links. Ondo did not author these pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 font-medium text-primary underline-offset-2 hover:underline"
                    >
                      <span>{link.title}</span>
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <p className="mt-1 text-sm text-foreground/70">{link.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline">{link.source}</Badge>
                      {link.loginMayBeRequired ? (
                        <Badge variant="secondary">Member login may be required</Badge>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
