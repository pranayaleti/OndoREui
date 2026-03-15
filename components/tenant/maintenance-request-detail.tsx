"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageSquare, Paperclip, Send, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for a maintenance request
const MOCK_REQUEST = {
  id: "req-001",
  title: "Leaking Kitchen Faucet",
  dateSubmitted: "2023-05-10",
  status: "in-progress",
  priority: "medium",
  category: "plumbing",
  lastUpdated: "2023-05-12",
  scheduledDate: "2023-05-15",
  scheduledTime: "1:00 PM - 3:00 PM",
  description:
    "The kitchen faucet has been leaking steadily for the past two days. I've tried tightening it but the leak continues. Water is pooling under the sink and I'm concerned about water damage.",
  photos: ["/leaking-faucet.png", "/placeholder.svg?key=2wzt0"],
  updates: [
    {
      id: "upd-001",
      date: "2023-05-10",
      time: "14:30",
      type: "status-change",
      content: "Maintenance request submitted",
      user: "system",
    },
    {
      id: "upd-002",
      date: "2023-05-11",
      time: "09:15",
      type: "message",
      content:
        "Thank you for your maintenance request. We've assigned a plumber to look at your issue. They will visit on May 15th between 1-3pm. Please let us know if this time works for you.",
      user: "Property Manager",
      avatar: "/property-manager-meeting.png",
    },
    {
      id: "upd-003",
      date: "2023-05-11",
      time: "10:30",
      type: "message",
      content: "That time works for me. Thank you for the quick response!",
      user: "Tenant",
      avatar: "/placeholder.svg?key=nutqz",
    },
    {
      id: "upd-004",
      date: "2023-05-12",
      time: "11:45",
      type: "status-change",
      content: "Status updated to 'In Progress'",
      user: "system",
    },
  ],
}

export function MaintenanceRequestDetail({ requestId: _requestId = "req-001" }: { requestId?: string }) {
  const { toast } = useToast()
  const [request] = useState(MOCK_REQUEST)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    setIsSending(true)

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false)
      setNewMessage("")
      toast({
        title: "Message sent",
        description: "Your message has been sent to the property manager.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center">
        <Link href="/tenant/maintenance" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Maintenance Request Details</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <CardTitle>{request.title}</CardTitle>
              <CardDescription>
                Request #{request.id} • Submitted on {request.dateSubmitted}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(request.status)}
              {getPriorityBadge(request.priority)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-foreground">{request.description}</p>
          </div>

          {request.photos.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Photos</h3>
              <div className="flex flex-wrap gap-4">
                {request.photos.map((photo, index) => (
                  <Image
                    key={index}
                    src={photo || "/placeholder.svg"}
                    alt={`Maintenance issue photo ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md border hover:opacity-90 transition-opacity cursor-pointer"
                    onClick={() => window.open(photo, "_blank")}
                    width={128}
                    height={128}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Badge variant="outline" className="capitalize mr-2">
                  {request.category}
                </Badge>
                <span>Category</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-foreground/70" />
                <span>Last Updated: {request.lastUpdated}</span>
              </div>
              {request.scheduledDate && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-foreground/70" />
                  <span>
                    Scheduled: {request.scheduledDate} ({request.scheduledTime})
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 mr-2 text-foreground/70" />
              <h3 className="font-medium">Communication & Updates</h3>
            </div>

            <div className="space-y-4">
              {request.updates.map((update) => (
                <div
                  key={update.id}
                  className={`p-3 rounded-lg ${
                    update.type === "status-change"
                      ? "bg-muted text-center text-sm text-foreground/70"
                      : update.user === "Tenant"
                        ? "bg-muted ml-0 sm:ml-12"
                        : "bg-muted mr-0 sm:mr-12"
                  }`}
                >
                  {update.type === "status-change" ? (
                    <div>{update.content}</div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={update.avatar || "/placeholder.svg"} alt={update.user} />
                            <AvatarFallback>{update.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{update.user}</span>
                        </div>
                        <span className="text-xs text-foreground/70">
                          {update.date} at {update.time}
                        </span>
                      </div>
                      <p>{update.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center mb-2">
                <h4 className="text-sm font-medium">Add a message</h4>
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <div className="flex flex-col gap-2">
                  <Button size="icon" variant="outline" type="button" title="Attach file">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    disabled={!newMessage.trim() || isSending}
                    onClick={handleSendMessage}
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
