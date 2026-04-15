"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Building, Plus, Search, Grid, List, Filter, HomeIcon, Users, Store, Hotel } from "lucide-react"
import Link from "next/link"
import { PropertyCard } from "@/components/owner/property-card"
import { PropertyListItem } from "@/components/owner/property-list-item"
import { PropertyFilters } from "@/components/owner/property-filters"
import { PricingInsightsCard } from "@/components/owner/pricing-insights-card"
import { LeaseRenewalCard } from "@/components/owner/lease-renewal-card"
import { ScreeningPanel } from "@/components/owner/screening-panel"
import { AutomationPanel } from "@/components/owner/automation-panel"
import { MaintenancePredictionsCard } from "@/components/owner/maintenance-predictions-card"
import { DocumentQAWidget } from "@/components/owner/document-qa-widget"
import { TourBookingsCard } from "@/components/owner/tour-bookings-card"
import { SyndicationPanel } from "@/components/owner/syndication-panel"
import { ReferralCard } from "@/components/owner/referral-card"
import { SatisfactionCard } from "@/components/owner/satisfaction-card"
import { IntegrationStatusPanel } from "@/components/owner/integration-status-panel"
import { useToast } from "@/hooks/use-toast"

// Mock property data
const PROPERTIES = [
  {
    id: "prop1",
    name: "2701 N Thanksgiving Way",
    address: "2701 N Thanksgiving Way",
    city: "Lehi",
    state: "UT",
    zipCode: "84043",
    type: "multi-family",
    units: 2,
    image: "/modern-apartment-balcony.png",
    occupancy: "Fully Occupied",
    occupancyRate: 100,
    tenants: 2,
    monthlyIncome: 3400,
    leaseEnd: "2023-12-31",
    status: "active",
  },
  {
    id: "prop2",
    name: "456 Oak Avenue",
    address: "456 Oak Avenue",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "11201",
    type: "single-family",
    units: 1,
    image: "/suburban-house-garden.png",
    occupancy: "Fully Occupied",
    occupancyRate: 100,
    tenants: 1,
    monthlyIncome: 1850,
    leaseEnd: "2023-10-15",
    status: "active",
  },
  {
    id: "prop3",
    name: "789 Pine Street",
    address: "789 Pine Street",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "84105",
    type: "commercial",
    units: 1,
    image: "/modern-office-building.png",
    occupancy: "Vacant",
    occupancyRate: 0,
    tenants: 0,
    monthlyIncome: 0,
    leaseEnd: null,
    status: "vacant",
  },
  {
    id: "prop4",
    name: "101 Sunset Drive",
    address: "101 Sunset Drive",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "84103",
    type: "vacation",
    units: 1,
    image: "/placeholder.svg?key=yas44",
    occupancy: "Partially Occupied",
    occupancyRate: 60,
    tenants: 0,
    monthlyIncome: 2200,
    leaseEnd: null,
    status: "active",
  },
  {
    id: "prop5",
    name: "222 Maple Court",
    address: "222 Maple Court",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "84106",
    type: "single-family",
    units: 1,
    image: "/modern-townhouse-garage.png",
    occupancy: "Fully Occupied",
    occupancyRate: 100,
    tenants: 1,
    monthlyIncome: 1950,
    leaseEnd: "2024-02-28",
    status: "active",
  },
]

export function OwnerPropertiesView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { toast: _toast } = useToast()

  // Filter properties based on search term and active tab
  const filteredProperties = PROPERTIES.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "occupied") return matchesSearch && property.occupancyRate === 100
    if (activeTab === "vacant") return matchesSearch && property.occupancyRate === 0
    if (activeTab === "partially") return matchesSearch && property.occupancyRate > 0 && property.occupancyRate < 100

    return matchesSearch
  })

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "single-family":
        return <HomeIcon className="h-4 w-4" />
      case "multi-family":
        return <Users className="h-4 w-4" />
      case "commercial":
        return <Store className="h-4 w-4" />
      case "vacation":
        return <Hotel className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
            <Input
              placeholder="Search properties..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="sm:w-auto" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="flex gap-2">
          <div className="bg-muted rounded-md p-1 flex">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
          <Button asChild>
            <Link href="/owner/properties/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {showFilters && <PropertyFilters onClose={() => setShowFilters(false)} />}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="occupied">Fully Occupied</TabsTrigger>
          <TabsTrigger value="partially">Partially Occupied</TabsTrigger>
          <TabsTrigger value="vacant">Vacant</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-foreground/70 mb-4" />
                <h3 className="text-lg font-medium mb-2">No properties found</h3>
                <p className="text-foreground/70 text-center mb-6">
                  {searchTerm ? "Try adjusting your search or filters" : "Add your first property to get started"}
                </p>
                <Button asChild>
                  <Link href="/owner/properties/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} getPropertyTypeIcon={getPropertyTypeIcon} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} getPropertyTypeIcon={getPropertyTypeIcon} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pricing Insights */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Pricing Insights</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((property) => (
            <PricingInsightsCard
              key={property.id}
              propertyId={property.id}
              propertyTitle={property.name}
            />
          ))}
        </div>
      </div>

      {/* Lease Renewals */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Lease Renewals</h2>
        <LeaseRenewalCard />
      </div>

      {/* Tour Bookings */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tour Bookings</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((property) => (
            <TourBookingsCard key={property.id} propertyId={property.id} />
          ))}
        </div>
      </div>

      {/* Tenant Screening */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tenant Screening</h2>
        <ScreeningPanel />
      </div>

      {/* Workflow Automations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Automations</h2>
        <AutomationPanel />
      </div>

      {/* Predictive Maintenance */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Maintenance Predictions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((property) => (
            <MaintenancePredictionsCard key={property.id} propertyId={property.id} />
          ))}
        </div>
      </div>

      {/* Document Intelligence */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Document Intelligence</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((property) => (
            <DocumentQAWidget key={property.id} propertyId={property.id} />
          ))}
        </div>
      </div>

      {/* Listing Syndication */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Listing Syndication</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((property) => (
            <SyndicationPanel key={property.id} propertyId={property.id} />
          ))}
        </div>
      </div>

      {/* Referral Program */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Referral Program</h2>
        <ReferralCard />
      </div>

      {/* Tenant Satisfaction */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tenant Satisfaction</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.map((property) => (
            <SatisfactionCard key={property.id} propertyId={property.id} />
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Integrations</h2>
        <IntegrationStatusPanel />
      </div>
    </div>
  )
}
