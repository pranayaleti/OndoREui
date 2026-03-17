// Blacklist checks are handled by the backend. This stub prevents broken imports
// from legacy code. If needed, implement via backendUrl('/api/moderation/check').

import type {
  UserBlacklistCheck,
  PropertyBlacklistCheck,
  IPBlacklistCheck,
} from '@/lib/types'

export async function checkUserBlacklist(
  _userId: string,
  _email?: string,
  _useCache = true
): Promise<UserBlacklistCheck> {
  return { isBlacklisted: false, type: 'user' }
}

export async function checkPropertyBlacklist(
  _propertyId: number,
  _useCache = true
): Promise<PropertyBlacklistCheck> {
  return { isBlacklisted: false, type: 'property' }
}

export async function checkIPBlacklist(
  _ipAddress: string,
  _useCache = true
): Promise<IPBlacklistCheck> {
  return { isBlacklisted: false, type: 'ip' }
}

export function clearBlacklistCache(): void {
  // no-op: cache removed with stub
}

export function getClientIP(_request: Request): string | null {
  return null
}

export async function validateContent(
  _content: string
): Promise<{ isValid: boolean; blockedPattern?: string }> {
  return { isValid: true }
}
