import Link from "next/link"
import type { ApiProperty } from "@/app/types/property"
import { listingDetailPath, listingWorksheetPath } from "@/lib/public-property"
import {
  listingCompareFieldValue,
  type PublicPetPolicy,
} from "@/lib/listing-presentation"
import { Button } from "@/components/ui/button"

const COMPARE_FIELDS = [
  "rent",
  "type",
  "beds",
  "baths",
  "sqft",
  "location",
  "availability",
  "amenities",
  "pets",
] as const

const FIELD_LABELS: Record<(typeof COMPARE_FIELDS)[number], string> = {
  rent: "Listed rent",
  type: "Type",
  beds: "Beds",
  baths: "Baths",
  sqft: "Size",
  location: "City",
  availability: "Move-in",
  amenities: "Listed amenities",
  pets: "Pets",
}

type CompareListing = {
  publicId: string
  title: string
  photoUrl?: string | null
  price: number
  type?: string | null
  bedrooms: number
  bathrooms: number
  sqft: number
  city?: string | null
  state?: string | null
  availability?: string | null
  amenities?: string[] | null
  petPolicy?: PublicPetPolicy | null
}

export function listingsFromApi(properties: ApiProperty[]): CompareListing[] {
  return properties.map((property) => ({
    publicId: property.publicId,
    title: property.title,
    photoUrl: [...(property.photos ?? [])].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
    )[0]?.url,
    price: property.price,
    type: property.type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sqft: property.sqft,
    city: property.city,
    state: property.state,
    availability: property.availability,
    amenities: property.amenities,
    petPolicy: property.petPolicy ?? null,
  }))
}

type ListingCompareTableProps = {
  listings: CompareListing[]
  onRemove?: (publicId: string) => void
}

export function ListingCompareTable({ listings, onRemove }: ListingCompareTableProps) {
  if (listings.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <caption className="sr-only">Side-by-side listing facts from the public listings</caption>
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className="w-32 p-3 text-left font-medium text-muted-foreground">
              Fact
            </th>
            {listings.map((listing) => (
              <th key={listing.publicId} scope="col" className="min-w-[10rem] p-3 text-left align-top">
                <div className="flex flex-col items-start">
                  {listing.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.photoUrl}
                      alt=""
                      className="mb-2 h-24 w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="mb-2 h-24 w-full rounded-md bg-muted" />
                  )}
                  <Link href={listingDetailPath(listing.publicId)} className="font-semibold hover:underline">
                    {listing.title}
                  </Link>
                  <Link
                    href={listingWorksheetPath(listing.publicId)}
                    className="inline-flex min-h-11 items-center text-sm font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Worksheet
                  </Link>
                  {onRemove ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-auto min-h-11 px-0 text-sm"
                      onClick={() => onRemove(listing.publicId)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_FIELDS.map((field) => (
            <tr key={field} className="border-t border-border">
              <th scope="row" className="p-3 text-left font-medium text-muted-foreground">
                {FIELD_LABELS[field]}
              </th>
              {listings.map((listing) => (
                <td key={`${listing.publicId}-${field}`} className="p-3 align-top">
                  {listingCompareFieldValue({ id: field, ...listing })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
