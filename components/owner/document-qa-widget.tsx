"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileSearch, Send, FileText } from "lucide-react"
import { askDocuments, type DocumentChunk } from "@/lib/api/document-qa"
import { validateChatInput } from "@/lib/aiGuardrails"

export function DocumentQAWidget({ propertyId }: { propertyId: string }) {
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DocumentChunk[]>([])
  const [lastQuestion, setLastQuestion] = useState("")
  const [guardrailError, setGuardrailError] = useState<string | null>(null)

  const handleAsk = async () => {
    if (!question.trim() || !propertyId) return
    // Run the same guardrails the assistant chat uses so length/prompt-injection
    // checks happen client-side before hitting the network. Backend enforces the
    // same limits, but rejecting locally avoids wasted round trips and surfaces
    // a clearer error to the user.
    const validation = validateChatInput([{ role: "user", content: question }])
    if (!validation.ok) {
      setGuardrailError(validation.error)
      setResults([])
      return
    }
    try {
      setGuardrailError(null)
      setLoading(true)
      setLastQuestion(validation.messages[0].content)
      const res = await askDocuments(propertyId, validation.messages[0].content)
      setResults(res.chunks)
      setQuestion("")
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          Ask About Your Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="e.g. What's my early termination fee?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            disabled={loading}
          />
          <Button
            size="icon"
            onClick={handleAsk}
            disabled={loading || !question.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {guardrailError && (
          <p
            role="alert"
            className="text-sm text-destructive text-center py-2"
          >
            {guardrailError}
          </p>
        )}

        {loading && (
          <p className="text-sm text-foreground/70 text-center py-4">Searching documents...</p>
        )}

        {!loading && lastQuestion && results.length === 0 && (
          <p className="text-sm text-foreground/70 text-center py-4">
            No relevant documents found for &ldquo;{lastQuestion}&rdquo;
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-foreground/70">Results for &ldquo;{lastQuestion}&rdquo;</p>
            {results.map((chunk) => (
              <div key={`${chunk.documentId}-${chunk.chunkIndex}`} className="border rounded-md p-3 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-3.5 w-3.5 text-foreground/70" />
                  <span className="font-medium text-xs">{chunk.documentName}</span>
                  <span className="text-xs text-foreground/50">
                    ({Math.round(chunk.similarity * 100)}% match)
                  </span>
                </div>
                <p className="text-foreground/80 text-xs leading-relaxed line-clamp-4">
                  {chunk.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {!loading && !lastQuestion && (
          <p className="text-sm text-foreground/70 text-center py-4">
            Ask a question about your uploaded documents.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
