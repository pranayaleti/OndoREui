"use client"

import { getTeamForCity, type TeamMember } from "@/lib/team-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/lazy-image"
import { Mail, Briefcase } from "lucide-react"

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          {member.image ? (
            <div className="relative h-14 w-14 rounded-full overflow-hidden shrink-0">
              <LazyImage
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                quality={75}
                sizes="56px"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              {member.name.charAt(0)}
            </div>
          )}
          <div>
            <CardTitle className="text-base">{member.name}</CardTitle>
            <p className="text-sm text-foreground/60">{member.title}</p>
            <p className="text-xs text-foreground/50">{member.yearsExperience}+ years experience</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground/70 line-clamp-3">{member.bio}</p>
        <div className="flex flex-wrap gap-1">
          {member.specialties.slice(0, 3).map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
          ))}
        </div>
        {member.email && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={`mailto:${member.email}`}>
              <Mail className="mr-2 h-3.5 w-3.5" />
              Contact {member.name.split(" ")[0]}
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

type CityTeamSectionProps = {
  cityName: string
}

export function CityTeamSection({ cityName }: CityTeamSectionProps) {
  const members = getTeamForCity(cityName)
  if (members.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Briefcase className="h-6 w-6 text-primary" />
        Your {cityName} Real Estate Team
      </h2>
      <p className="text-foreground/60 mb-6 text-sm">
        Local experts who know {cityName}&apos;s neighborhoods, schools, and market inside out.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <TeamCard key={m.slug} member={m} />
        ))}
      </div>
    </section>
  )
}
