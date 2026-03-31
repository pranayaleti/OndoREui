"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Home, Hotel, Store, Users } from "lucide-react"

export function PropertyForm() {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    type: "",
    value: "",
    owner: "",
    ownerEmail: "",
    ownerPhone: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to property creation API
    alert("Property added successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="type">Property Type</Label>
            <Select onValueChange={(value) => handleSelectChange("type", value)} defaultValue={formData.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-family">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    <span>Single-Family</span>
                  </div>
                </SelectItem>
                <SelectItem value="multi-family">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Multi-Family</span>
                  </div>
                </SelectItem>
                <SelectItem value="commercial">
                  <div className="flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    <span>Commercial</span>
                  </div>
                </SelectItem>
                <SelectItem value="vacation">
                  <div className="flex items-center">
                    <Hotel className="h-4 w-4 mr-2" />
                    <span>Vacation</span>
                  </div>
                </SelectItem>
                <SelectItem value="association">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    <span>Association</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Property Value</Label>
            <Select onValueChange={(value) => handleSelectChange("value", value)} defaultValue={formData.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select property value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-300k">Under $300,000</SelectItem>
                <SelectItem value="300k-500k">$300,000 - $500,000</SelectItem>
                <SelectItem value="500k-750k">$500,000 - $750,000</SelectItem>
                <SelectItem value="750k-1m">$750,000 - $1,000,000</SelectItem>
                <SelectItem value="over-1m">Over $1,000,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="owner">Owner Name</Label>
            <Input id="owner" name="owner" value={formData.owner} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="ownerEmail">Owner Email</Label>
            <Input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              value={formData.ownerEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="ownerPhone">Owner Phone</Label>
            <Input id="ownerPhone" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[120px]"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Add Property</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
