"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PlusCircle,
  Search,
  Star,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react"
import {
  listVendors,
  createVendor,
  updateVendor,
  deactivateVendor,
  type Vendor,
  type VendorSpecialty,
  type CreateVendorPayload,
} from "@/lib/api/vendors"

const SPECIALTIES: { value: VendorSpecialty; label: string }[] = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC" },
  { value: "appliances", label: "Appliances" },
  { value: "flooring", label: "Flooring" },
  { value: "windows", label: "Windows" },
  { value: "structural", label: "Structural" },
  { value: "pest_control", label: "Pest Control" },
  { value: "cleaning", label: "Cleaning" },
  { value: "general", label: "General" },
  { value: "landscaping", label: "Landscaping" },
  { value: "roofing", label: "Roofing" },
  { value: "painting", label: "Painting" },
]

const SPECIALTY_COLORS: Record<VendorSpecialty, string> = {
  plumbing: "bg-blue-100 text-blue-800",
  electrical: "bg-yellow-100 text-yellow-800",
  hvac: "bg-cyan-100 text-cyan-800",
  appliances: "bg-purple-100 text-purple-800",
  flooring: "bg-orange-100 text-orange-800",
  windows: "bg-sky-100 text-sky-800",
  structural: "bg-muted text-stone-800",
  pest_control: "bg-red-100 text-red-800",
  cleaning: "bg-green-100 text-green-800",
  general: "bg-muted text-gray-800",
  landscaping: "bg-lime-100 text-lime-800",
  roofing: "bg-amber-100 text-amber-800",
  painting: "bg-pink-100 text-pink-800",
}

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-muted text-gray-800",
  suspended: "bg-red-100 text-red-800",
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

const EMPTY_FORM: CreateVendorPayload = {
  name: "",
  company: "",
  email: "",
  phone: "",
  specialty: "general",
  license_number: "",
  insurance_info: "",
  hourly_rate: undefined,
  notes: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  service_radius_miles: 25,
}

interface VendorFormProps {
  initial?: Partial<CreateVendorPayload>
  onSubmit: (payload: CreateVendorPayload) => Promise<void>
  onCancel: () => void
  loading: boolean
  error?: string
}

function VendorForm({ initial, onSubmit, onCancel, loading, error }: VendorFormProps) {
  const [form, setForm] = useState<CreateVendorPayload>({ ...EMPTY_FORM, ...initial })

  function set<K extends keyof CreateVendorPayload>(key: K, value: CreateVendorPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="John Smith"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={form.company ?? ""}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Smith Plumbing LLC"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(555) 000-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Specialty *</Label>
          <Select
            value={form.specialty}
            onValueChange={(v) => set("specialty", v as VendorSpecialty)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
          <Input
            id="hourly_rate"
            type="number"
            min={0}
            step={0.01}
            value={form.hourly_rate ?? ""}
            onChange={(e) => set("hourly_rate", e.target.value ? Number(e.target.value) : undefined)}
            placeholder="75.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="license_number">License Number</Label>
          <Input
            id="license_number"
            value={form.license_number ?? ""}
            onChange={(e) => set("license_number", e.target.value)}
            placeholder="LIC-123456"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="service_radius_miles">Service Radius (miles)</Label>
          <Input
            id="service_radius_miles"
            type="number"
            min={1}
            value={form.service_radius_miles ?? 25}
            onChange={(e) => set("service_radius_miles", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={form.city ?? ""}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Salt Lake City"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={form.state ?? ""}
            onChange={(e) => set("state", e.target.value)}
            placeholder="UT"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="insurance_info">Insurance Info</Label>
        <Input
          id="insurance_info"
          value={form.insurance_info ?? ""}
          onChange={(e) => set("insurance_info", e.target.value)}
          placeholder="Policy #, carrier, expiry..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={form.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          placeholder="Any additional notes..."
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Vendor"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [search, setSearch] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [addOpen, setAddOpen] = useState(false)
  const [editVendor, setEditVendor] = useState<Vendor | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string>()

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listVendors({
        specialty: filterSpecialty !== "all" ? (filterSpecialty as VendorSpecialty) : undefined,
        status: filterStatus !== "all" ? (filterStatus as "active" | "inactive" | "suspended") : undefined,
      })
      setVendors(data)
    } catch {
      setError("Failed to load vendors.")
    } finally {
      setLoading(false)
    }
  }, [filterSpecialty, filterStatus])

  useEffect(() => { load() }, [load])

  const filtered = vendors.filter((v) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      v.name.toLowerCase().includes(q) ||
      v.company?.toLowerCase().includes(q) ||
      v.city?.toLowerCase().includes(q) ||
      v.specialty.toLowerCase().includes(q)
    )
  })

  async function handleCreate(payload: CreateVendorPayload) {
    setFormLoading(true)
    setFormError(undefined)
    try {
      const v = await createVendor(payload)
      setVendors((prev) => [v, ...prev])
      setAddOpen(false)
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Failed to create vendor")
    } finally {
      setFormLoading(false)
    }
  }

  async function handleUpdate(payload: CreateVendorPayload) {
    if (!editVendor) return
    setFormLoading(true)
    setFormError(undefined)
    try {
      const v = await updateVendor(editVendor.id, payload)
      setVendors((prev) => prev.map((x) => (x.id === v.id ? v : x)))
      setEditVendor(null)
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Failed to update vendor")
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDeactivate(vendor: Vendor) {
    if (!confirm(`Deactivate ${vendor.name}?`)) return
    try {
      await deactivateVendor(vendor.id)
      setVendors((prev) =>
        prev.map((v) => (v.id === vendor.id ? { ...v, status: "inactive" as const } : v))
      )
    } catch {
      alert("Failed to deactivate vendor.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vendors & Contractors</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your approved contractor network
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Add a contractor or service provider to your network.
              </DialogDescription>
            </DialogHeader>
            <VendorForm
              onSubmit={handleCreate}
              onCancel={() => setAddOpen(false)}
              loading={formLoading}
              error={formError}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{vendors.filter((v) => v.status === "active").length}</p>
            <p className="text-sm text-muted-foreground">Active Vendors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">
              {vendors.length > 0
                ? (vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)
                : "—"}
            </p>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{new Set(vendors.map((v) => v.specialty)).size}</p>
            <p className="text-sm text-muted-foreground">Specialties Covered</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4" />
            Vendor Directory
          </CardTitle>
          <CardDescription>
            {filtered.length} vendor{filtered.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, city..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {SPECIALTIES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">Loading vendors...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No vendors found. Add your first vendor above.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          {vendor.company && (
                            <p className="text-xs text-muted-foreground">{vendor.company}</p>
                          )}
                          {vendor.license_number && (
                            <p className="text-xs text-muted-foreground">Lic: {vendor.license_number}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={SPECIALTY_COLORS[vendor.specialty]}
                        >
                          {vendor.specialty.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {vendor.phone && (
                            <div className="flex items-center gap-1 text-xs">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {vendor.phone}
                            </div>
                          )}
                          {vendor.email && (
                            <div className="flex items-center gap-1 text-xs">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {vendor.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(vendor.city || vendor.state) && (
                          <div className="flex items-center gap-1 text-xs">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {[vendor.city, vendor.state].filter(Boolean).join(", ")}
                            {vendor.service_radius_miles && (
                              <span className="text-muted-foreground">
                                ({vendor.service_radius_miles}mi)
                              </span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {vendor.hourly_rate ? (
                          <span className="text-sm">${vendor.hourly_rate}/hr</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {vendor.review_count > 0 ? (
                          <StarRating rating={vendor.rating} />
                        ) : (
                          <span className="text-xs text-muted-foreground">No reviews</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={STATUS_COLORS[vendor.status]}
                        >
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setFormError(undefined)
                              setEditVendor(vendor)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {vendor.status === "active" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeactivate(vendor)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editVendor} onOpenChange={(open) => !open && setEditVendor(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>Update contractor details.</DialogDescription>
          </DialogHeader>
          {editVendor && (
            <VendorForm
              initial={editVendor}
              onSubmit={handleUpdate}
              onCancel={() => setEditVendor(null)}
              loading={formLoading}
              error={formError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
