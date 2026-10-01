import { CrossLinkSection } from "@/components/cross-link-section"
import { otherCitiesForZip, type ZipService } from "@/lib/zip-pages"
import { toCitySlug } from "@/lib/utah-cities"

type ZipSharedCitiesProps = {
  zip: string
  service: ZipService
}

/** On a shared ZIP, link the other cities that use it so visitors can pick theirs. */
export function ZipSharedCities({ zip, service }: ZipSharedCitiesProps) {
  const others = otherCitiesForZip(zip)
  if (others.length === 0) return null
  return (
    <CrossLinkSection
      title={`ZIP ${zip} is also used by`}
      variant="pills"
      links={others.map((city) => ({
        label: city.name,
        href: `/${service}/${toCitySlug(city.name)}/`,
      }))}
    />
  )
}
