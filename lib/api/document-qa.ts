import { postJson } from "@/lib/api/http"

export interface DocumentChunk {
  documentId: string
  documentName: string
  documentType: string
  chunkIndex: number
  content: string
  similarity: number
}

export interface DocumentAskResult {
  chunks: DocumentChunk[]
  question: string
}

export async function askDocuments(
  propertyId: string,
  question: string,
  limit = 5
): Promise<DocumentAskResult> {
  const res = await postJson<{ data: DocumentAskResult }>(
    "/api/documents/ask",
    { propertyId, question, limit }
  )
  return res.data
}
