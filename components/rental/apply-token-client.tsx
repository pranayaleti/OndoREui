"use client"

import { useParams } from "next/navigation"
import { RentalStartClient } from "@/components/rental/rental-start-client"

export function ApplyTokenClient({ token }: { token?: string }) {
  const params = useParams()
  const resolved = token || String(params?.token ?? "")
  return <RentalStartClient token={resolved} />
}
