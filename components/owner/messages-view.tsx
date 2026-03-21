"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Send, Paperclip, MoreVertical, Building, Clock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NewMessageDialog } from "@/components/owner/new-message-dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import * as messagesApi from "@/lib/api/messages"
import type { Thread, Message, MessageTemplate } from "@/lib/api/messages"

export function MessagesView() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [replyText, setReplyText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Load threads and templates on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      messagesApi.listThreads().catch(() => [] as Thread[]),
      messagesApi.listTemplates().catch(() => [] as MessageTemplate[]),
    ]).then(([fetchedThreads, fetchedTemplates]) => {
      setThreads(fetchedThreads)
      setTemplates(fetchedTemplates)
      setLoading(false)
    })
  }, [])

  // Scroll to bottom when messages change or thread changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedThread, messages])

  // Filter threads based on search term and active tab
  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.subject.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "tenants") return matchesSearch && thread.category === "tenant"
    if (activeTab === "vendors") return matchesSearch && thread.category === "vendor"
    if (activeTab === "unread") return matchesSearch && thread.unreadCount > 0

    return matchesSearch
  })

  const handleSelectThread = useCallback(async (thread: Thread) => {
    setSelectedThread(thread)
    setMessages([])
    try {
      const [fetchedMessages] = await Promise.all([
        messagesApi.listMessages(thread.id),
        messagesApi.markRead(thread.id).catch(() => {}),
      ])
      setMessages(fetchedMessages)
      // Clear unread badge in state
      setThreads((prev) =>
        prev.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t))
      )
    } catch {
      toast({ title: "Error", description: "Failed to load messages.", variant: "destructive" })
    }
  }, [toast])

  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedThread) return

    const text = replyText
    setReplyText("")

    try {
      const sent = await messagesApi.sendMessage(selectedThread.id, text)
      setMessages((prev) => [...prev, sent])
      // Update last message timestamp on thread
      setThreads((prev) =>
        prev.map((t) =>
          t.id === selectedThread.id ? { ...t, lastMessageAt: sent.sentAt } : t
        )
      )
    } catch {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" })
      setReplyText(text)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateConversation = async (data: any) => {
    try {
      const thread = await messagesApi.createThread({
        subject: data.recipient,
        category: data.recipientType,
      })
      // Send the initial message if provided
      if (data.message) {
        const msg = await messagesApi.sendMessage(thread.id, data.message)
        setMessages([msg])
      } else {
        setMessages([])
      }
      setThreads((prev) => [thread, ...prev])
      setSelectedThread(thread)
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${data.recipient}.`,
      })
    } catch {
      toast({ title: "Error", description: "Failed to create conversation.", variant: "destructive" })
    }
  }

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  // Derive a display name initial from subject
  const getInitial = (subject: string) => subject.charAt(0).toUpperCase()

  // Collect all quick replies from all templates for the picker
  const allQuickReplies = templates.flatMap((t) => t.quickReplies ?? [])

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Conversations</CardTitle>
              <NewMessageDialog onCreateConversation={handleCreateConversation} />
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/70" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-2 mx-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tenants">Tenants</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-foreground/70 text-sm">
                  Loading conversations...
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <MessageSquare className="h-12 w-12 text-foreground/70 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No conversations found</h3>
                  <p className="text-foreground/70 text-center mb-6">
                    {searchTerm
                      ? "Try adjusting your search"
                      : activeTab === "unread"
                        ? "You have no unread messages"
                        : "Start a new conversation"}
                  </p>
                  <NewMessageDialog onCreateConversation={handleCreateConversation} />
                </div>
              ) : (
                <div>
                  {filteredThreads.map((thread) => (
                    <button
                      key={thread.id}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer text-left",
                        selectedThread?.id === thread.id ? "bg-muted" : "",
                      )}
                      onClick={() => handleSelectThread(thread)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitial(thread.subject)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate">{thread.subject}</div>
                          <div className="text-xs text-foreground/70">
                            {formatTimestamp(thread.lastMessageAt)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center gap-1">
                          <div className="flex gap-1 flex-wrap">
                            {thread.status && (
                              <Badge variant="outline" className="text-xs font-normal rounded-sm h-5 px-1 capitalize">
                                {thread.status}
                              </Badge>
                            )}
                            {thread.priority && thread.priority !== "normal" && (
                              <Badge variant="outline" className="text-xs font-normal rounded-sm h-5 px-1 capitalize">
                                {thread.priority}
                              </Badge>
                            )}
                          </div>
                          {thread.unreadCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full shrink-0">
                              {thread.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        {selectedThread ? (
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitial(selectedThread.subject)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedThread.subject}</div>
                    <div className="flex items-center text-xs text-foreground/70 gap-2">
                      {selectedThread.status && (
                        <Badge variant="outline" className="text-xs font-normal rounded-sm h-5 px-1 capitalize">
                          {selectedThread.status}
                        </Badge>
                      )}
                      {selectedThread.priority && (
                        <Badge variant="outline" className="text-xs font-normal rounded-sm h-5 px-1 capitalize">
                          {selectedThread.priority}
                        </Badge>
                      )}
                      {selectedThread.propertyId && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {selectedThread.propertyId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuItem>View Contact Info</DropdownMenuItem>
                      <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete Conversation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-420px)] p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === "owner"
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground/70"
                          }`}
                        >
                          <div className="text-sm">{message.body}</div>
                          <div className="text-xs mt-1 opacity-70 flex items-center justify-end gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(message.sentAt)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4 border-t space-y-2">
              {allQuickReplies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {allQuickReplies.map((qr, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setReplyText(qr)}
                    >
                      {qr}
                    </Button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" title="Attach File">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  className="flex-1 min-h-[40px] resize-none"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button size="icon" disabled={!replyText.trim()} onClick={handleSendMessage} title="Send Message">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center h-full py-12">
            <MessageSquare className="h-16 w-16 text-foreground/70 mb-6" />
            <h2 className="text-xl font-medium mb-2">No Conversation Selected</h2>
            <p className="text-foreground/70 text-center mb-6 max-w-md">
              Select a conversation from the list or start a new one to begin messaging.
            </p>
            <NewMessageDialog onCreateConversation={handleCreateConversation} />
          </Card>
        )}
      </div>
    </div>
  )
}

export default MessagesView
