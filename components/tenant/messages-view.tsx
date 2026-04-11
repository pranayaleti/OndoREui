'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Search } from 'lucide-react';
import * as messagesApi from '@/lib/api/messages';
import type { Thread, Message, MessageTemplate } from '@/lib/api/messages';

export default function TenantMessagesView() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesApi.listThreads()
      .then(setThreads)
      .finally(() => setLoading(false));
    messagesApi.listTemplates().then(setTemplates);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectThread = async (thread: Thread) => {
    setSelectedThread(thread);
    const msgs = await messagesApi.listMessages(thread.id);
    setMessages(msgs);
    await messagesApi.markRead(thread.id);
    setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
  };

  const handleSend = async () => {
    if (!replyText.trim() || !selectedThread || sending) return;
    setSending(true);
    try {
      const msg = await messagesApi.sendMessage(selectedThread.id, replyText);
      setMessages(prev => [...prev, msg]);
      setReplyText('');
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter(t =>
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const priorityColor = (priority: string) => {
    const map: Record<string, string> = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-muted text-gray-800',
    };
    return map[priority] || 'bg-muted text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-lg border overflow-hidden">
      {/* Thread List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No messages yet
            </div>
          ) : (
            filteredThreads.map(thread => (
              <button
                key={thread.id}
                onClick={() => handleSelectThread(thread)}
                className={`w-full text-left p-4 border-b hover:bg-accent transition-colors ${
                  selectedThread?.id === thread.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm truncate flex-1">{thread.subject}</div>
                  {thread.unreadCount > 0 && (
                    <span className="shrink-0 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs ${priorityColor(thread.priority)}`}>
                    {thread.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {thread.lastMessageAt
                      ? new Date(thread.lastMessageAt).toLocaleDateString()
                      : 'No messages yet'}
                  </span>
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selectedThread.subject}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{selectedThread.category}</Badge>
                  <Badge variant="outline">{selectedThread.status}</Badge>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className="flex flex-col gap-1">
                    <div className="text-xs text-muted-foreground">
                      {new Date(msg.sentAt).toLocaleString()}
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-sm max-w-[80%]">
                      {msg.body}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t space-y-2">
              {/* Quick replies from templates */}
              {templates.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {templates.flatMap(t =>
                    t.quickReplies.map((qr, i) => (
                      <button
                        key={`${t.id}-${i}`}
                        onClick={() => setReplyText(qr)}
                        className="text-xs border rounded-full px-3 py-1 hover:bg-accent transition-colors"
                      >
                        {qr}
                      </button>
                    ))
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="resize-none"
                  rows={3}
                />
                <Button onClick={handleSend} disabled={!replyText.trim() || sending} className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Select a message to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
