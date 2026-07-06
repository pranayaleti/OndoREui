"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Building, Shield, Upload, Key } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

import { TwoFactorAuthDialog } from "@/components/ui/two-factor-auth-dialog"

// Mock user data
const USER = {
  id: "user123",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "555-123-4567",
  avatar: "/placeholder.svg?key=1g942",
  company: "Johnson Property Management",
  address: "789 Business Ave, Suite 300, Salt Lake City, UT 84101",
  bio: "Property manager with over 10 years of experience in residential and commercial property management.",
  notifications: {
    email: true,
    sms: true,
    app: true,
  },
  twoFactorEnabled: false,
  paymentMethods: [
    {
      id: "pm1",
      type: "credit_card",
      last4: "4242",
      brand: "Visa",
      expMonth: 12,
      expYear: 2024,
      isDefault: true,
    },
  ],
}

export function ProfileView() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState(USER)
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setUserData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked,
      },
    }))
  }

  const handleTwoFactorChange = () => {
    setIs2FADialogOpen(true)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSavePersonalInfo = () => {
    setIsSubmitting(true)

    // In a real app, this would call an API to update the user's profile
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      })
    }, 1000)
  }

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // In a real app, this would call an API to update the user's password
    setTimeout(() => {
      setIsSubmitting(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      })
    }, 1000)
  }

  const _handleLogout = () => {
    // In a real app, this would call an API to log the user out
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/auth")
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the user's account
    toast({
      title: "Account deleted",
      description: "Your account has been successfully deleted.",
    })
    router.push("/auth")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full md:w-[600px]">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          className="pl-8"
                          value={userData.name}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Your email address"
                          className="pl-8"
                          value={userData.email}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Your phone number"
                          className="pl-8"
                          value={userData.phone}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your company name"
                        className="pl-8"
                        value={userData.company}
                        onChange={handlePersonalInfoChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Your address"
                      rows={3}
                      value={userData.address}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="A brief description about you."
                      rows={5}
                      value={userData.bio}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled={isSubmitting} onClick={handleSavePersonalInfo}>
                {isSubmitting ? <>Saving...</> : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                      className="pl-8"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Shield className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      className="pl-8"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Shield className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      className="pl-8"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button disabled={isSubmitting} onClick={handleSavePassword}>
                {isSubmitting ? <>Saving...</> : "Save Password"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Enable or disable two-factor authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">Two-Factor Authentication</p>
                  <p className="text-sm text-foreground/70">
                    Add an extra layer of security to your account by enabling two-factor authentication (coming soon).
                  </p>
                </div>
                <Switch id="twoFactor" checked={userData.twoFactorEnabled} onCheckedChange={() => handleTwoFactorChange()} disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>Permanently delete your account</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from
                      our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage your notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">Email Notifications</p>
                  <p className="text-sm text-foreground/70">
                    Receive important updates and announcements via email.
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={userData.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">SMS Notifications</p>
                  <p className="text-sm text-foreground/70">Get notified about urgent matters via SMS.</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={userData.notifications.sms}
                  onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium leading-none">App Notifications</p>
                  <p className="text-sm text-foreground/70">Receive in-app notifications for real-time updates.</p>
                </div>
                <Switch
                  id="appNotifications"
                  checked={userData.notifications.app}
                  onCheckedChange={(checked) => handleNotificationChange("app", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData.paymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">
                      {paymentMethod.brand} ending in {paymentMethod.last4}
                    </p>
                    <p className="text-sm text-foreground/70">
                      Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                    </p>
                  </div>
                  <div>
                    {paymentMethod.isDefault ? (
                      <Button variant="secondary" size="sm" disabled>
                        Default
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button>Add Payment Method</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your billing history</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No billing history available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <TwoFactorAuthDialog
        open={is2FADialogOpen}
        onOpenChange={setIs2FADialogOpen}
        currentValue={userData.twoFactorEnabled}
        onConfirm={(enabled) => {
          setUserData((prev) => ({
            ...prev,
            twoFactorEnabled: enabled,
          }))
        }}
      />
    </div>
  )
}
