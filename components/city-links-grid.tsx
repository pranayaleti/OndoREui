import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { utahCitiesFromNorthOgdenToNephi, toCitySlug } from "@/lib/utah-cities"

type CityLinksGridProps = {
  title: string
  servicePrefix: string
  subServiceSlug: string
}

export function CityLinksGrid({ title, servicePrefix, subServiceSlug }: CityLinksGridProps) {
  // Show top 12 cities by rough population order
  const topCities = [
    "Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem",
    "Sandy", "Ogden", "Layton", "South Jordan", "Lehi", "Draper", "Murray",
  ]

  const cities = utahCitiesFromNorthOgdenToNephi.filter((c) =>
    topCities.includes(c.name),
  )

  return (
    <section className="py-8">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {cities.map((city) => (
          <Link
            key={city.name}
            href={`/${servicePrefix}/${toCitySlug(city.name)}/${subServiceSlug}/`}
          >
            <Badge
              variant="outline"
              className="text-sm py-1.5 px-3 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              {city.name}
            </Badge>
          </Link>
        ))}
        <Link href="/locations/">
          <Badge
            variant="secondary"
            className="text-sm py-1.5 px-3 hover:bg-muted transition-colors cursor-pointer"
          >
            View all 55 cities →
          </Badge>
        </Link>
      </div>
    </section>
  )
}
