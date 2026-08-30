import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { groupUtahCitiesByCounty, toCitySlug } from "@/lib/utah-cities"

type CityServiceDirectoryProps = {
  hrefForCity: (slug: string) => string
  linkLabel: string
}

export function CityServiceDirectory({ hrefForCity, linkLabel }: CityServiceDirectoryProps) {
  const countyGroups = groupUtahCitiesByCounty()

  return (
    <div className="space-y-12">
      {countyGroups.map((group) => (
        <section key={group.county} aria-labelledby={`county-${toCitySlug(group.county)}`}>
          <h2 id={`county-${toCitySlug(group.county)}`} className="mb-4 text-2xl font-bold">
            {group.county} County
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.cities.map((city) => {
              const slug = toCitySlug(city.name)
              return (
                <Card key={city.name} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      {city.name}
                      <Badge variant="outline" className="text-xs">
                        {group.county} Co.
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">ZIP codes: {city.zips.join(", ")}</p>
                    <Link
                      href={hrefForCity(slug)}
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {linkLabel.replace("{city}", city.name)}
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
