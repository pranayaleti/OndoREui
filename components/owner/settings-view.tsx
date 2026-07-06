"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Mail, CreditCard, Globe, Moon, Sun, Smartphone, Laptop, CheckCircle } from "lucide-react"
import { TwoFactorAuthDialog } from "@/components/ui/two-factor-auth-dialog"

type SettingsState = {
  general: {
    theme: string
    language: string
    timezone: string
  }
  notifications: {
    email: {
      marketing: boolean
      maintenance: boolean
      payments: boolean
      leases: boolean
      messages: boolean
    }
    push: {
      maintenance: boolean
      payments: boolean
      leases: boolean
      messages: boolean
    }
  }
  security: {
    twoFactor: boolean
    sessionTimeout: string
    loginAlerts: boolean
  }
  billing: {
    plan: string
    paymentMethod: string
    autoRenew: boolean
  }
}

const initialSettings: SettingsState = {
  general: {
    theme: "light",
    language: "english",
    timezone: "America/New_York",
  },
  notifications: {
    email: {
      marketing: true,
      maintenance: true,
      payments: true,
      leases: true,
      messages: true,
    },
    push: {
      maintenance: true,
      payments: true,
      leases: false,
      messages: true,
    },
  },
  security: {
    twoFactor: false,
    sessionTimeout: "30",
    loginAlerts: true,
  },
  billing: {
    plan: "professional",
    paymentMethod: "visa",
    autoRenew: true,
  },
}

export function SettingsView() {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState<SettingsState>(initialSettings)
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false)
  const { toast } = useToast()

  const handleToggleChange = (
    category: keyof SettingsState,
    subcategory: string,
    setting: string,
  ) => {
    setSettings((prev) => {
      const next = structuredClone ? structuredClone(prev) : JSON.parse(JSON.stringify(prev))

      if (category === "notifications" && (subcategory === "email" || subcategory === "push")) {
        const target = next.notifications[subcategory] as Record<string, boolean>
        if (setting in target) {
          target[setting] = !target[setting]
        }
      } else if (category === "security") {
        if (setting in next.security) {
          const key = setting as keyof SettingsState["security"]
          next.security[key] = !next.security[key]
        }
      } else if (category === "billing") {
        if (setting in next.billing) {
          const key = setting as keyof SettingsState["billing"]
          const current = next.billing[key]
          if (typeof current === "boolean") {
            next.billing[key] = !current as SettingsState["billing"][keyof SettingsState["billing"]]
          }
        }
      }

      return next
    })
  }

  const handleSelectChange = (category: keyof SettingsState, setting: string, value: string) => {
    setSettings((prev) => {
      const next = { ...prev }
      if (category === "general") {
        next.general = { ...prev.general, [setting]: value }
      } else if (category === "security") {
        next.security = { ...prev.security, [setting]: value }
      } else if (category === "billing") {
        next.billing = { ...prev.billing, [setting]: value }
      }
      return next
    })
  }

  const handleSaveSettings = () => {
    // In a real app, this would call an API to save the settings
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid grid-cols-4 w-full md:w-auto">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your general account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.general.theme}
                  onValueChange={(value) => handleSelectChange("general", "theme", value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Laptop className="h-4 w-4 mr-2" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.general.language}
                  onValueChange={(value) => handleSelectChange("general", "language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        English
                      </div>
                    </SelectItem>
                    <SelectItem value="spanish">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Spanish
                      </div>
                    </SelectItem>
                    <SelectItem value="french">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        French
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.general.timezone}
                  onValueChange={(value) => handleSelectChange("general", "timezone", value)}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Manage which emails you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <Label htmlFor="marketing-emails">Marketing emails</Label>
              </div>
              <Switch
                id="marketing-emails"
                checked={settings.notifications.email.marketing}
                onCheckedChange={() => handleToggleChange("notifications", "email", "marketing")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <Label htmlFor="maintenance-emails">Maintenance updates</Label>
              </div>
              <Switch
                id="maintenance-emails"
                checked={settings.notifications.email.maintenance}
                onCheckedChange={() => handleToggleChange("notifications", "email", "maintenance")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <Label htmlFor="payment-emails">Payment notifications</Label>
              </div>
              <Switch
                id="payment-emails"
                checked={settings.notifications.email.payments}
                onCheckedChange={() => handleToggleChange("notifications", "email", "payments")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <Label htmlFor="lease-emails">Lease updates</Label>
              </div>
              <Switch
                id="lease-emails"
                checked={settings.notifications.email.leases}
                onCheckedChange={() => handleToggleChange("notifications", "email", "leases")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <Label htmlFor="message-emails">Message notifications</Label>
              </div>
              <Switch
                id="message-emails"
                checked={settings.notifications.email.messages}
                onCheckedChange={() => handleToggleChange("notifications", "email", "messages")}
              />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>Manage your mobile app notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <Label htmlFor="maintenance-push">Maintenance updates</Label>
              </div>
              <Switch
                id="maintenance-push"
                checked={settings.notifications.push.maintenance}
                onCheckedChange={() => handleToggleChange("notifications", "push", "maintenance")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <Label htmlFor="payment-push">Payment notifications</Label>
              </div>
              <Switch
                id="payment-push"
                checked={settings.notifications.push.payments}
                onCheckedChange={() => handleToggleChange("notifications", "push", "payments")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <Label htmlFor="lease-push">Lease updates</Label>
              </div>
              <Switch
                id="lease-push"
                checked={settings.notifications.push.leases}
                onCheckedChange={() => handleToggleChange("notifications", "push", "leases")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <Label htmlFor="message-push">Message notifications</Label>
              </div>
              <Switch
                id="message-push"
                checked={settings.notifications.push.messages}
                onCheckedChange={() => handleToggleChange("notifications", "push", "messages")}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor">Two-factor authentication</Label>
                <p className="text-sm text-foreground/70">
                  Add an extra layer of security to your account with two-factor authentication (coming soon)
                </p>
              </div>
              <Switch
                id="two-factor"
                checked={settings.security.twoFactor}
                onCheckedChange={() => setIs2FADialogOpen(true)}
                disabled
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session timeout</Label>
              <p className="text-sm text-foreground/70">Automatically log out after a period of inactivity</p>
              <Select
                value={settings.security.sessionTimeout}
                onValueChange={(value) => handleSelectChange("security", "sessionTimeout", value)}
              >
                <SelectTrigger id="session-timeout">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="login-alerts">Login alerts</Label>
                <p className="text-sm text-foreground/70">
                  Receive email notifications for new logins to your account
                </p>
              </div>
              <Switch
                id="login-alerts"
                checked={settings.security.loginAlerts}
                onCheckedChange={() => handleToggleChange("security", "loginAlerts", "")}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Recent login activity</Label>
              <div className="rounded-md border">
                <div className="flex items-center p-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Salt Lake City, UT, USA</p>
                    <div className="flex items-center text-xs text-foreground/70">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      <span>Current session</span>
                      <span className="mx-2">•</span>
                      <span>Chrome on Windows</span>
                      <span className="mx-2">•</span>
                      <span>Today, 2:15 PM</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center p-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Salt Lake City, UT, USA</p>
                    <div className="flex items-center text-xs text-foreground/70">
                      <span>Safari on iPhone</span>
                      <span className="mx-2">•</span>
                      <span>Yesterday, 10:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="billing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Manage your subscription and payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="plan">Current Plan</Label>
              <Select
                value={settings.billing.plan}
                onValueChange={(value) => handleSelectChange("billing", "plan", value)}
              >
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Plan - $29/month</SelectItem>
                  <SelectItem value="professional">Professional Plan - $49/month</SelectItem>
                  <SelectItem value="enterprise">Enterprise Plan - $99/month</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-foreground/70">Your current billing cycle ends on June 1, 2023</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <CreditCard className="h-5 w-5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-foreground/70">Expires 04/2024</p>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-renew">Auto-renew subscription</Label>
                <p className="text-sm text-foreground/70">
                  Automatically renew your subscription at the end of the billing cycle
                </p>
              </div>
              <Switch
                id="auto-renew"
                checked={settings.billing.autoRenew}
                onCheckedChange={() => handleToggleChange("billing", "autoRenew", "")}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Billing History</Label>
              <div className="rounded-md border">
                <div className="flex items-center p-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Professional Plan - May 2023</p>
                    <p className="text-xs text-foreground/70">May 1, 2023 • $49.00</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center p-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Professional Plan - April 2023</p>
                    <p className="text-xs text-foreground/70">April 1, 2023 • $49.00</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center p-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Professional Plan - March 2023</p>
                    <p className="text-xs text-foreground/70">March 1, 2023 • $49.00</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="text-destructive">
              Cancel Subscription
            </Button>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TwoFactorAuthDialog
        open={is2FADialogOpen}
        onOpenChange={setIs2FADialogOpen}
        currentValue={settings.security.twoFactor}
        onConfirm={(enabled) => {
          setSettings((prev) => ({
             ...prev,
             security: {
               ...prev.security,
               twoFactor: enabled
             }
          }))
        }}
      />
    </Tabs>
  )
}
