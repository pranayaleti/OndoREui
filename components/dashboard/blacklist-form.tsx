"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users, Building, Globe, Mail, FileText } from "lucide-react"
import { format } from "date-fns"
import { BlacklistType } from "@/lib/types"
import { backendUrl } from "@/lib/backend"

interface BlacklistFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function BlacklistForm({ onSuccess, onCancel }: BlacklistFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState<BlacklistType>('user')
  const [formData, setFormData] = useState({
    // User fields
    userId: '',
    email: '',
    // Property fields
    propertyId: '',
    // IP fields
    ipAddress: '',
    // Email domain fields
    domain: '',
    // Content fields
    pattern: '',
    // Common fields
    reason: '',
    expiresAt: undefined as Date | undefined,
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.token) return

    setLoading(true)
    setError(null)

    try {
    const requestData: Record<string, unknown> = {
      type,
      reason: formData.reason,
      notes: formData.notes
    }

      // Add type-specific fields
      switch (type) {
        case 'user':
          requestData['userId'] = formData.userId
          if (formData.email) requestData['email'] = formData.email
          break
        case 'property':
          requestData['propertyId'] = parseInt(formData.propertyId)
          break
        case 'ip':
          requestData['ipAddress'] = formData.ipAddress
          break
        case 'email_domain':
          requestData['domain'] = formData.domain
          break
        case 'content':
          requestData['pattern'] = formData.pattern
          break
      }

      if (formData.expiresAt) {
        requestData['expiresAt'] = formData.expiresAt.toISOString()
      }

      const response = await fetch(backendUrl('/api/blacklist'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create blacklist entry')
      }

      onSuccess()
    } catch (err) {
      console.error('Error creating blacklist entry:', err)
      setError(err instanceof Error ? err.message : 'Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    if (!formData.reason.trim()) return false

    switch (type) {
      case 'user':
        return formData.userId.trim() || formData.email.trim()
      case 'property':
        return formData.propertyId.trim() && !isNaN(parseInt(formData.propertyId))
      case 'ip':
        return formData.ipAddress.trim()
      case 'email_domain':
        return formData.domain.trim()
      case 'content':
        return formData.pattern.trim()
      default:
        return false
    }
  }

  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'user':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                placeholder="Enter user ID (optional if email provided)"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address (optional if user ID provided)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Either User ID or Email must be provided
              </p>
            </div>
          </div>
        )

      case 'property':
        return (
          <div>
            <Label htmlFor="propertyId">Property ID</Label>
            <Input
              id="propertyId"
              type="number"
              value={formData.propertyId}
              onChange={(e) => setFormData(prev => ({ ...prev, propertyId: e.target.value }))}
              placeholder="Enter property ID"
              required
            />
          </div>
        )

      case 'ip':
        return (
          <div>
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              value={formData.ipAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, ipAddress: e.target.value }))}
              placeholder="Enter IP address (e.g., 192.168.1.1)"
              required
            />
          </div>
        )

      case 'email_domain':
        return (
          <div>
            <Label htmlFor="domain">Email Domain</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
              placeholder="Enter domain (e.g., example.com)"
              required
            />
          </div>
        )

      case 'content':
        return (
          <div>
            <Label htmlFor="pattern">Pattern</Label>
            <Input
              id="pattern"
              value={formData.pattern}
              onChange={(e) => setFormData(prev => ({ ...prev, pattern: e.target.value }))}
              placeholder="Enter word or phrase to filter"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will block content containing this exact pattern
            </p>
          </div>
        )

      default:
        return null
    }
  }

  const typeOptions = [
    { value: 'user', label: 'User', icon: Users },
    { value: 'property', label: 'Property', icon: Building },
    { value: 'ip', label: 'IP Address', icon: Globe },
    { value: 'email_domain', label: 'Email Domain', icon: Mail },
    { value: 'content', label: 'Content Filter', icon: FileText }
  ]

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Blacklist Entry</DialogTitle>
          <DialogDescription>
            Create a new blacklist entry to block access or content
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as BlacklistType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type-specific fields */}
          {renderTypeSpecificFields()}

          {/* Common fields */}
          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Why is this being blacklisted?"
              required
            />
          </div>

          <div>
            <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiresAt ? format(formData.expiresAt, "PPP") : "No expiration"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expiresAt}
                  onSelect={(date) => setFormData(prev => ({ ...prev, expiresAt: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formData.expiresAt && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-1 h-auto p-0 text-xs"
                onClick={() => setFormData(prev => ({ ...prev, expiresAt: undefined }))}
              >
                Clear expiration
              </Button>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or context"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !validateForm()}>
              {loading ? 'Creating...' : 'Create Entry'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
