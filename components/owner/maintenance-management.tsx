"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, PenToolIcon as Tool, Search, ArrowRight, Calendar, Home, AlertCircle } from "lucide-react"
import Link from "next/link"

// Mock data for maintenance requests
const MOCK_REQUESTS = [
  {
    id: "req-001",
    title: "Leaking Kitchen Faucet",
    property: "123 Main St, Apt 4B",
    tenant: "John Smith",
    dateSubmitted: "2023-05-10",
    status: "in-progress",
    priority: "medium",
    category: "plumbing",
    lastUpdated: "2023-05-12",
    scheduledDate: "2023-05-15",
    description: "The kitchen faucet has been leaking steadily for the past two days.",
  },
  {
    id: "req-002",
    title: "Broken Air Conditioning",
    property: "456 Oak Ave, Unit 7",
    tenant: "Sarah Johnson",
    dateSubmitted: "2023-05-08",
    status: "scheduled",
    priority: "high",
    category: "hvac",
    lastUpdated: "2023-05-09",
    scheduledDate: "2023-05-11",
    description: "The AC unit is not cooling properly and making strange noises.",
  },
  {
    id: "req-003",
    title: "Bathroom Light Fixture Not Working",
    property: "789 Pine St, Apt 2C",
    tenant: "Michael Brown",
    dateSubmitted: "2023-05-05",
    status: "completed",
    priority: "medium",
    category: "electrical",
    lastUpdated: "2023-05-07",
    scheduledDate: "2023-05-06",
    description: "The light fixture in the main bathroom doesn't turn on even after replacing the bulb.",
  },
  {
    id: "req-004",
    title: "Dishwasher Not Draining",
    property: "123 Main St, Apt 2A",
    tenant: "Emily Wilson",
    dateSubmitted: "2023-05-01",
    status: "pending",
    priority: "medium",
    category: "appliances",
    lastUpdated: "2023-05-01",
    scheduledDate: null,
    description: "The dishwasher isn't draining properly after cycles and leaves standing water.",
  },
]

type MaintenanceRequest = (typeof MOCK_REQUESTS)[0]

export function OwnerMaintenanceManagement() {
  const [requests] = useState<MaintenanceRequest[]>(MOCK_REQUESTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProperty, setFilterProperty] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "in-progress":
        return <Tool className="h-5 w-5 text-primary" />
      case "scheduled":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-foreground/70" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-muted text-yellow-700 border-yellow-200">
            Pending Review
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-muted text-primary border-border">
            In Progress
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-muted text-purple-700 border-purple-200">
            Scheduled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-muted text-green-700 border-green-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "emergency":
        return <Badge className="bg-red-500">Emergency</Badge>
      case "high":
        return <Badge className="bg-primary">High</Badge>
      case "medium":
        return <Badge className="bg-primary">Medium</Badge>
      case "low":
        return <Badge className="bg-gray-500">Low</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const filterRequestsByStatus = (status: string | null) => {
    let filtered = requests

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply property filter
    if (filterProperty && filterProperty !== "all") {
      filtered = filtered.filter((req) => req.property === filterProperty)
    }

    // Apply category filter
    if (filterCategory && filterCategory !== "all") {
      filtered = filtered.filter((req) => req.category === filterCategory)
    }

    // Apply status filter
    if (status && status !== "all") {
      filtered = filtered.filter((req) => req.status === status)
    }

    return filtered
  }

  // Get unique properties for filter
  const uniqueProperties = [...new Set(requests.map((req) => req.property))]

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-muted/50">
        <CardTitle>Maintenance Requests</CardTitle>
        <CardDescription>Manage maintenance requests for your properties</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
            <Input
              placeholder="Search by title, property, or tenant..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterProperty} onValueChange={setFilterProperty}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {uniqueProperties.map((property) => (
                <SelectItem key={property} value={property}>
                  {property}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="hvac">HVAC</SelectItem>
              <SelectItem value="appliances">Appliances</SelectItem>
              <SelectItem value="windows">Windows & Doors</SelectItem>
              <SelectItem value="structural">Structural</SelectItem>
              <SelectItem value="pest_control">Pest Control</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {["all", "pending", "scheduled", "in-progress", "completed"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filterRequestsByStatus(status).length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <AlertCircle className="h-12 w-12 mx-auto text-foreground/70 mb-3" />
                  <h3 className="text-lg font-medium text-foreground/70">No maintenance requests found</h3>
                  <p className="text-sm text-foreground/70 mt-1">
                    {searchTerm || filterProperty || filterCategory
                      ? "Try adjusting your filters"
                      : "No maintenance requests in this category"}
                  </p>
                </div>
              ) : (
                filterRequestsByStatus(status).map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">{getStatusIcon(request.status)}</div>
                        <div>
                          <h3 className="font-medium">{request.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-foreground/70 mt-1 gap-y-1 gap-x-2">
                            <div className="flex items-center">
                              <Home className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span>{request.property}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <span>Tenant: {request.tenant}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {getStatusBadge(request.status)}
                            {getPriorityBadge(request.priority)}
                            <Badge variant="outline" className="capitalize">
                              {request.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Link href={`/owner/maintenance/${request.id}`} className="sm:shrink-0">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <span className="mr-1">Manage</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 pt-3 border-t text-sm text-foreground/70 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Submitted: {request.dateSubmitted}</span>
                      <span>Last Updated: {request.lastUpdated}</span>
                      {request.scheduledDate && <span>Scheduled: {request.scheduledDate}</span>}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
