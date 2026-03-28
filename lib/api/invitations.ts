import { networkFirstGet } from "@/lib/api/http"

export interface InvitationDetails {
  email: string
  role: string
  expiresAt: string
  propertyTitle?: string
  unitNumber?: string
}

export interface InvitationValidationResponse {
  success: boolean
  invitation: InvitationDetails
}

export async function validateInviteToken(token: string): Promise<InvitationDetails | null> {
  try {
    const res = await networkFirstGet<InvitationValidationResponse>(
      `/api/invitation/${token}`,
      `invite-${token}`
    )
    return res?.invitation ?? null
  } catch {
    return null
  }
}
