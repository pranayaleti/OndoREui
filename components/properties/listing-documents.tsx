import { Download, FileText } from "lucide-react"
import {
  listingDocumentLabel,
  type PublicListingDocument,
} from "@/lib/listing-presentation"

type ListingDocumentsProps = {
  documents: PublicListingDocument[]
}

export function ListingDocuments({ documents }: ListingDocumentsProps) {
  if (documents.length === 0) return null

  return (
    <section aria-labelledby="listing-documents-heading" className="mb-8">
      <h2 id="listing-documents-heading" className="mb-3 text-xl font-semibold">
        Documents
      </h2>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate font-medium">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{listingDocumentLabel(doc.type)}</p>
              </div>
            </div>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-input px-3 text-sm font-medium hover:bg-muted"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Download
              <span className="sr-only">{` ${doc.title}`}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
