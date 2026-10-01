import Link from "next/link"
import { getTeam, type TeamMember } from "@/lib/team-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0"
            aria-hidden="true"
          >
            {member.name.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-base">{member.name}</CardTitle>
            <p className="text-sm text-foreground/60">{member.title}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground/70">{member.bio}</p>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/contact/">Contact Ondo</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

type CityTeamSectionProps = {
  cityName: string
}

export function CityTeamSection({ cityName }: CityTeamSectionProps) {
  const members = getTeam()
  if (members.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Briefcase className="h-6 w-6 text-primary" />
        Questions about {cityName}? Talk to the founder
      </h2>
      <p className="text-foreground/60 mb-6 text-sm">
        Send a message through the contact page and ask about {cityName} or anything else.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <TeamCard key={m.slug} member={m} />
        ))}
      </div>
    </section>
  )
}
