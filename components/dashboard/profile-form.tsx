"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Camera, Loader2 } from "lucide-react"

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    phone: "(555) 123-4567",
    company: "Real Estate",
    role: "Administrator",
    bio: "Property management professional with over 10 years of experience in residential and commercial properties.",
    timezone: "America/New_York",
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Profile updated successfully!")
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
              <AvatarFallback className="text-3xl">AU</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-foreground/70">Recommended: 300x300px, max 2MB</p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" value={formData.company} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value) => handleSelectChange("role", value)} defaultValue={formData.role}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrator">Administrator</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select onValueChange={(value) => handleSelectChange("timezone", value)} defaultValue={formData.timezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-foreground/70">Receive email notifications for new leads and updates</p>
            </div>
            <Switch
              id="email-notifications"
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-foreground/70">Receive text messages for urgent notifications</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={formData.smsNotifications}
              onCheckedChange={(checked) => handleSwitchChange("smsNotifications", checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
