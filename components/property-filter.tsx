"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export interface PropertyFilters {
  priceRange: [number, number]
  bedrooms: string
  bathrooms: string
  propertyType: string
  amenities: string[]
  location: string
  minSqft: string
  availability: string
}

interface PropertyFilterProps {
  onFilterChange: (filters: PropertyFilters) => void
  initialFilters?: PropertyFilters
  variant?: "sheet" | "sidebar"
}

export const DEFAULT_PROPERTY_FILTERS: PropertyFilters = {
  priceRange: [500, 5000],
  bedrooms: "any",
  bathrooms: "any",
  propertyType: "any",
  amenities: [],
  location: "",
  minSqft: "any",
  availability: "any",
}

const amenitiesList = [
  "In-unit Laundry",
  "Fitness Center",
  "Pet Friendly",
  "Parking",
  "Pool",
  "Balcony",
  "Dishwasher",
  "Hardwood Floors",
  "Air Conditioning",
  "Furnished",
]

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

function FilterFields({
  filters,
  priceDisplay,
  onPriceChange,
  onFiltersChange,
  idPrefix,
}: {
  filters: PropertyFilters
  priceDisplay: [number, number]
  onPriceChange: (value: number[]) => void
  onFiltersChange: (next: PropertyFilters) => void
  idPrefix: string
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Location</h3>
        <Input
          id={`${idPrefix}-location`}
          value={filters.location}
          onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
          placeholder="City, ZIP, or street"
          aria-label="Location"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Monthly rent</h3>
        <Slider
          min={500}
          max={5000}
          step={100}
          value={[priceDisplay[0], priceDisplay[1]]}
          onValueChange={onPriceChange}
          className="py-4"
          aria-label="Monthly rent range"
        />
        <div className="flex items-center justify-between text-sm">
          <div className="rounded-md border px-3 py-1.5">${priceDisplay[0].toLocaleString("en-US")}</div>
          <div className="rounded-md border px-3 py-1.5">${priceDisplay[1].toLocaleString("en-US")}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-availability`}>Availability</Label>
        <select
          id={`${idPrefix}-availability`}
          value={filters.availability}
          onChange={(e) => onFiltersChange({ ...filters, availability: e.target.value })}
          className={selectClass}
        >
          <option value="any">Any</option>
          <option value="now">Available now</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-type`}>Property type</Label>
        <select
          id={`${idPrefix}-type`}
          value={filters.propertyType}
          onChange={(e) => onFiltersChange({ ...filters, propertyType: e.target.value })}
          className={selectClass}
        >
          <option value="any">Any</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="townhouse">Townhouse</option>
          <option value="condo">Condo</option>
          <option value="studio">Studio</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-beds`}>Bedrooms</Label>
        <select
          id={`${idPrefix}-beds`}
          value={filters.bedrooms}
          onChange={(e) => onFiltersChange({ ...filters, bedrooms: e.target.value })}
          className={selectClass}
        >
          <option value="any">Any</option>
          <option value="studio">Studio</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4+">4+</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-baths`}>Bathrooms</Label>
        <select
          id={`${idPrefix}-baths`}
          value={filters.bathrooms}
          onChange={(e) => onFiltersChange({ ...filters, bathrooms: e.target.value })}
          className={selectClass}
        >
          <option value="any">Any</option>
          <option value="1">1</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
          <option value="2.5">2.5</option>
          <option value="3+">3+</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-sqft`}>Building size</Label>
        <select
          id={`${idPrefix}-sqft`}
          value={filters.minSqft}
          onChange={(e) => onFiltersChange({ ...filters, minSqft: e.target.value })}
          className={selectClass}
        >
          <option value="any">Any</option>
          <option value="800">800+ sq ft</option>
          <option value="1200">1,200+ sq ft</option>
          <option value="1600">1,600+ sq ft</option>
          <option value="2000">2,000+ sq ft</option>
        </select>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Amenities</h3>
        <div className="grid grid-cols-1 gap-3">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`${idPrefix}-amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => {
                  const amenities = filters.amenities.includes(amenity)
                    ? filters.amenities.filter((a) => a !== amenity)
                    : [...filters.amenities, amenity]
                  onFiltersChange({ ...filters, amenities })
                }}
              />
              <Label htmlFor={`${idPrefix}-amenity-${amenity}`} className="cursor-pointer text-sm">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PropertyFilter({
  onFilterChange,
  initialFilters = DEFAULT_PROPERTY_FILTERS,
  variant = "sheet",
}: PropertyFilterProps) {
  const [filters, setFilters] = useState<PropertyFilters>({
    ...DEFAULT_PROPERTY_FILTERS,
    ...initialFilters,
  })
  const [priceDisplay, setPriceDisplay] = useState<[number, number]>(filters.priceRange)
  const [isOpen, setIsOpen] = useState(false)

  const handlePriceChange = (value: number[]) => {
    setPriceDisplay([value[0] ?? 0, value[1] ?? 0])
  }

  const applyFilters = (next = filters, close = true) => {
    const updated = {
      ...next,
      priceRange: priceDisplay as [number, number],
    }
    setFilters(updated)
    onFilterChange(updated)
    if (close) setIsOpen(false)
  }

  const resetFilters = () => {
    setFilters(DEFAULT_PROPERTY_FILTERS)
    setPriceDisplay(DEFAULT_PROPERTY_FILTERS.priceRange)
    onFilterChange(DEFAULT_PROPERTY_FILTERS)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.bedrooms !== "any") count++
    if (filters.bathrooms !== "any") count++
    if (filters.propertyType !== "any") count++
    if (filters.location.trim()) count++
    if (filters.minSqft !== "any") count++
    if (filters.availability !== "any") count++
    count += filters.amenities.length
    if (
      filters.priceRange[0] !== DEFAULT_PROPERTY_FILTERS.priceRange[0] ||
      filters.priceRange[1] !== DEFAULT_PROPERTY_FILTERS.priceRange[1]
    )
      count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  if (variant === "sidebar") {
    return (
      <aside className="rounded-xl border border-border bg-card p-4" aria-label="Filter listings">
        <h2 className="mb-4 text-sm font-semibold">Filters</h2>
        <FilterFields
          idPrefix="sidebar"
          filters={filters}
          priceDisplay={priceDisplay}
          onPriceChange={handlePriceChange}
          onFiltersChange={setFilters}
        />
        <div className="mt-6 flex flex-col gap-2">
          <Button className="min-h-11 w-full" onClick={() => applyFilters(filters, false)}>
            Apply filters
          </Button>
          <Button variant="outline" className="min-h-11 w-full" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </aside>
    )
  }

  return (
    <div>
      <Button variant="outline" className="min-h-11 gap-2" onClick={() => setIsOpen(true)}>
        <Filter className="h-4 w-4" aria-hidden="true" />
        Filters
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="z-[9999] w-[400px] p-0 sm:max-w-none">
          <div className="flex h-full flex-col">
            <div className="border-b p-6">
              <SheetHeader className="mb-2">
                <SheetTitle>Filter properties</SheetTitle>
                <SheetDescription>
                  Narrow by rent, type, size, and location. Only listed facts are used.
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <FilterFields
                idPrefix="sheet"
                filters={filters}
                priceDisplay={priceDisplay}
                onPriceChange={handlePriceChange}
                onFiltersChange={setFilters}
              />
            </div>

            <div className="mt-auto border-t p-6">
              <SheetFooter className="flex-row gap-2">
                <Button variant="outline" onClick={resetFilters} className="min-h-11 flex-1">
                  Reset
                </Button>
                <Button onClick={() => applyFilters()} className="min-h-11 flex-1">
                  Apply filters
                </Button>
              </SheetFooter>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
