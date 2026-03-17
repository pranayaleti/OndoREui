"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import {
  MoreHorizontal,
  Search,
  Trash2,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight,
  Users,
  Building,
  Globe,
  Mail,
  FileText,
  Shield
} from "lucide-react"
import {
  BlacklistType,
  BlacklistListResponse
} from "@/lib/types"
import { backendUrl } from "@/lib/backend"

interface BlacklistTableProps {
  type?: BlacklistType
  refreshTrigger?: number
}

export function BlacklistTable({ type, refreshTrigger }: BlacklistTableProps) {
  const { user } = useAuth()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  const pageSize = 10

  const fetchEntries = async () => {
    if (!user?.token) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        isActive: showActiveOnly.toString()
      })

      if (type) params.append('type', type)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`${backendUrl('/api/blacklist')}?${params}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch blacklist entries')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: BlacklistListResponse<any> = await response.json()

      if (data.success && data.data) {
        setEntries(data.data)
        setTotalPages(Math.ceil(data.total / pageSize))
        setTotalEntries(data.total)
      } else {
        setEntries([])
        setTotalPages(1)
        setTotalEntries(0)
      }
    } catch (err) {
      console.error('Error fetching blacklist entries:', err)
      setError(err instanceof Error ? err.message : 'Failed to load entries')
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, type, currentPage, searchTerm, showActiveOnly, refreshTrigger])

  const handleToggleActive = async (entryId: string, entryType: BlacklistType, currentlyActive: boolean) => {
    if (!user?.token) return

    try {
      const response = await fetch(`${backendUrl(`/api/blacklist/${entryId}`)}?type=${entryType}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentlyActive
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update entry')
      }

      // Refresh the list
      fetchEntries()
    } catch (err) {
      console.error('Error toggling entry status:', err)
      setError('Failed to update entry status')
    }
  }

  const handleDelete = async (entryId: string, entryType: BlacklistType) => {
    if (!user?.token) return

    try {
      const response = await fetch(`${backendUrl(`/api/blacklist/${entryId}`)}?type=${entryType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete entry')
      }

      // Refresh the list
      fetchEntries()
    } catch (err) {
      console.error('Error deleting entry:', err)
      setError('Failed to delete entry')
    }
  }

  const getTypeIcon = (entryType: BlacklistType) => {
    switch (entryType) {
      case 'user': return <Users className="h-4 w-4" />
      case 'property': return <Building className="h-4 w-4" />
      case 'ip': return <Globe className="h-4 w-4" />
      case 'email_domain': return <Mail className="h-4 w-4" />
      case 'content': return <FileText className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeLabel = (entryType: BlacklistType) => {
    switch (entryType) {
      case 'user': return 'User'
      case 'property': return 'Property'
      case 'ip': return 'IP Address'
      case 'email_domain': return 'Email Domain'
      case 'content': return 'Content Filter'
      default: return entryType
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatValue = (entry: any) => {
    switch (entry.type) {
      case 'user':
        return entry.email || entry.user_id || 'N/A'
      case 'property':
        return `Property #${entry.property_id}`
      case 'ip':
        return entry.ip_address
      case 'email_domain':
        return entry.domain
      case 'content':
        return entry.pattern
      default:
        return 'N/A'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blacklist entries...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading entries</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchEntries} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showActiveOnly ? "default" : "outline"}
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          size="sm"
        >
          {showActiveOnly ? <Power className="h-4 w-4 mr-2" /> : <PowerOff className="h-4 w-4 mr-2" />}
          {showActiveOnly ? 'Active Only' : 'All Entries'}
        </Button>
      </div>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {entries.length} of {totalEntries} entries
        {type && ` for ${getTypeLabel(type)}`}
      </div>

      {/* Table */}
      {entries.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No entries found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No blacklist entries match your criteria'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(entry.type)}
                      <span className="text-sm font-medium">
                        {getTypeLabel(entry.type)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatValue(entry)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={entry.reason}>
                    {entry.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant={entry.is_active ? "destructive" : "secondary"}>
                      {entry.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(entry.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {entry.expires_at ? formatDate(entry.expires_at) : 'Never'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(entry.id, entry.type, entry.is_active)}
                        >
                          {entry.is_active ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blacklist Entry</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this {getTypeLabel(entry.type).toLowerCase()} blacklist entry?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(entry.id, entry.type)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
