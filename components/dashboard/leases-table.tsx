"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, ChevronLeft, ChevronRight, Filter, Calendar } from "lucide-react"
import Link from "next/link"
import { getPropertyLeases, type Lease } from "@/lib/api/leases"

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "upcoming":
      return "bg-primary"
    case "expiring":
      return "bg-yellow-500"
    case "expired":
      return "bg-red-500"
    default:
      return "bg-muted"
  }
}

export function LeasesTable({ status, propertyId }: { status?: string; propertyId?: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 5

  useEffect(() => {
    if (!propertyId) {
      setLoading(false)
      return
    }
    setLoading(true)
    getPropertyLeases(propertyId)
      .then((data) => setLeases(data))
      .catch(() => setLeases([]))
      .finally(() => setLoading(false))
  }, [propertyId])

  // Filter leases based on search term and status
  const filteredLeases = leases.filter(
    (lease) =>
      (status ? lease.status === status : true) &&
      lease.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeases.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLeases = filteredLeases.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-foreground/70" />
          <Input
            placeholder="Search leases..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-foreground/70">Loading leases...</div>
      ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lease ID</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Term</TableHead>
            <TableHead>Monthly Rent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLeases.map((lease) => (
            <TableRow key={lease.id}>
              <TableCell className="font-medium">{lease.id.slice(0, 8)}</TableCell>
              <TableCell>
                <span className="text-sm text-foreground/70">{lease.tenantId.slice(0, 8)}...</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-foreground/70" />
                  <div>
                    <div>{new Date(lease.leaseStart).toLocaleDateString()}</div>
                    <div className="text-sm text-foreground/70">
                      to {new Date(lease.leaseEnd).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>${Number(lease.monthlyRent).toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`capitalize ${getStatusColor(lease.status)} text-white`}>
                  {lease.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/leases/view/${lease.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/leases/renew/${lease.id}`}>Renew lease</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/70">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLeases.length)} of{" "}
          {filteredLeases.length} leases
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
