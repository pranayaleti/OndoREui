"use client"

import { useState } from "react"

interface Receipt {
  id: string
  receiptNumber: string
  amountCents: number
  paymentDate: string
  periodStart: string | null
  periodEnd: string | null
}

interface PaymentReceiptsProps {
  receipts: Receipt[]
  onDownload: (receiptId: string) => Promise<string | undefined>
}

export function PaymentReceipts({ receipts, onDownload }: PaymentReceiptsProps) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (id: string) => {
    setDownloading(id)
    try {
      const url = await onDownload(id)
      if (url) {
        window.open(url, "_blank")
      }
    } finally {
      setDownloading(null)
    }
  }

  if (receipts.length === 0) {
    return <p className="text-center text-gray-500 py-8">No payment receipts available</p>
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Payment Receipts</h3>
      <div className="space-y-2">
        {receipts.map((r) => (
          <div key={r.id} className="flex items-center justify-between bg-card border rounded-lg p-4">
            <div>
              <p className="font-medium text-sm">{r.receiptNumber}</p>
              <p className="text-xs text-gray-500">
                {new Date(r.paymentDate).toLocaleDateString()} — ${(r.amountCents / 100).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => handleDownload(r.id)}
              disabled={downloading === r.id}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {downloading === r.id ? "Loading..." : "Download PDF"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
