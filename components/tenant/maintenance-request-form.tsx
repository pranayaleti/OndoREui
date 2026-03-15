"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Camera, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function MaintenanceRequestForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
    preferredDate: "",
    preferredTimeSlot: "",
    entryPermission: "yes",
    petInHome: "no",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handlePhotoUpload = () => {
    // Simulate photo upload with placeholder images
    const newPhoto = `/placeholder.svg?height=100&width=100&query=maintenance issue ${photos.length + 1}`
    setPhotos((prev) => [...prev, newPhoto])
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors['title'] = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors['description'] = "Description is required"
    }

    if (!formData.category) {
      newErrors['category'] = "Category is required"
    }

    if (!formData.priority) {
      newErrors['priority'] = "Priority is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Maintenance request submitted",
        description: "Your request has been sent to the property manager.",
      })
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "",
        category: "",
        preferredDate: "",
        preferredTimeSlot: "",
        entryPermission: "yes",
        petInHome: "no",
      })
      setPhotos([])
    }, 1500)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader className="bg-muted/50">
        <CardTitle>Submit Maintenance Request</CardTitle>
        <CardDescription>Please provide details about the issue you're experiencing</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please fix the errors below before submitting.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Issue Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Leaking Faucet, Broken Heater"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="appliances">Appliances</SelectItem>
                  <SelectItem value="flooring">Flooring</SelectItem>
                  <SelectItem value="windows">Windows & Doors</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                  <SelectItem value="pest_control">Pest Control</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger id="priority" className={errors.priority ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency (24 hours)</SelectItem>
                  <SelectItem value="high">High (2-3 days)</SelectItem>
                  <SelectItem value="medium">Medium (this week)</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-500 mt-1">{errors.priority}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Detailed Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Please describe the issue in detail. Include when it started and any troubleshooting you've tried."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Photos (Optional)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Maintenance issue photo ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md border"
                    width={96}
                    height={96}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-foreground rounded-full p-1 shadow-sm"
                    aria-label="Remove photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handlePhotoUpload}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-foreground/70 hover:text-foreground hover:border-gray-400 transition-colors"
                aria-label="Add photo"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-xs">Add Photo</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate" className="text-sm font-medium">
                Preferred Date (Optional)
              </Label>
              <Input
                id="preferredDate"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTimeSlot" className="text-sm font-medium">
                Preferred Time (Optional)
              </Label>
              <Select
                value={formData.preferredTimeSlot}
                onValueChange={(value) => handleSelectChange("preferredTimeSlot", value)}
              >
                <SelectTrigger id="preferredTimeSlot">
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPermission" className="text-sm font-medium">
                Permission to Enter
              </Label>
              <Select
                value={formData.entryPermission}
                onValueChange={(value) => handleSelectChange("entryPermission", value)}
              >
                <SelectTrigger id="entryPermission">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, enter if I'm not home</SelectItem>
                  <SelectItem value="no">No, I must be present</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="petInHome" className="text-sm font-medium">
                Pets in Home
              </Label>
              <Select value={formData.petInHome} onValueChange={(value) => handleSelectChange("petInHome", value)}>
                <SelectTrigger id="petInHome">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 flex flex-col sm:flex-row gap-2 justify-end">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit Maintenance Request"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
