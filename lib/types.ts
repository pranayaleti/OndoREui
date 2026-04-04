/**
 * Shared TypeScript interfaces and types for the application
 */

// User types
export interface User {
  id: string
  name: string
  email: string
  role: 'tenant' | 'owner' | 'admin'
  avatar?: string
  token?: string
}

export interface AuthUser extends User {
  token: string
}

// Property types
export interface Property {
  id: number
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  type: string
  image: string
  description: string
  features: string[]
  availability?: string
  leaseTerms?: string
  services?: string[]
  fees?: string
  rating?: number
  reviewCount?: number
  phone?: string
  website?: string
  logo?: string
  specialties?: string[]
  valueRanges?: string[]
  images?: string[]
}

// API Response types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginResponse {
  token: string
  user: User
  expiresIn?: number
}

export interface SearchResponse {
  properties: Property[]
  totalCount: number
  hasMore: boolean
}

// Form types
export interface SearchFormData {
  zipCode: string
  city?: string
}

export interface ConsultationFormData {
  name: string
  email: string
  phone: string
  service: string
  message?: string
  preferredTime?: string
}

export interface AuthFormData {
  email: string
  password: string
  role: 'tenant' | 'owner' | 'admin'
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

// SEO types
export interface SEOData {
  title: string
  description: string
  pathname?: string
  image?: string
  keywords?: string[]
  jsonLd?: object | object[]
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Navigation types
export interface NavigationItem {
  href: string
  labelKey: string
  special?: boolean
  external?: boolean
}

// Modal types
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Error types
export interface AppError {
  code: string
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
}

// Validation types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FieldValidation {
  field: string
  isValid: boolean
  message?: string
}

// Blacklist types
export type BlacklistType = 'user' | 'property' | 'ip' | 'email_domain' | 'content'

export interface BaseBlacklistEntry {
  id: string
  reason: string
  blockedBy: string
  blockedAt: string
  expiresAt?: string
  isActive: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface UserBlacklistEntry extends BaseBlacklistEntry {
  userId: string
  email?: string
}

export interface PropertyBlacklistEntry extends BaseBlacklistEntry {
  propertyId: number
}

export interface IPBlacklistEntry extends BaseBlacklistEntry {
  ipAddress: string
}

export interface EmailDomainBlacklistEntry extends BaseBlacklistEntry {
  domain: string
}

export interface ContentFilterEntry {
  id: string
  pattern: string
  reason: string
  blockedBy: string
  blockedAt: string
  isActive: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface BlacklistAuditEntry {
  id: string
  blacklistType: BlacklistType
  blacklistId: string
  action: 'created' | 'updated' | 'deactivated' | 'reactivated' | 'expired'
  performedBy: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oldValues?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newValues?: any
  performedAt: string
  reason?: string
}

// Blacklist API types
export interface CreateUserBlacklistRequest {
  userId: string
  email?: string
  reason: string
  expiresAt?: string
  notes?: string
}

export interface CreatePropertyBlacklistRequest {
  propertyId: number
  reason: string
  expiresAt?: string
  notes?: string
}

export interface CreateIPBlacklistRequest {
  ipAddress: string
  reason: string
  expiresAt?: string
  notes?: string
}

export interface CreateEmailDomainBlacklistRequest {
  domain: string
  reason: string
  expiresAt?: string
  notes?: string
}

export interface CreateContentFilterRequest {
  pattern: string
  reason: string
  notes?: string
}

export interface UpdateBlacklistRequest {
  reason?: string
  expiresAt?: string
  isActive?: boolean
  notes?: string
}

export interface BlacklistQueryParams {
  page?: number
  limit?: number
  isActive?: boolean
  type?: BlacklistType
  search?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BlacklistResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface BlacklistListResponse<T> extends BlacklistResponse<T[]> {
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Blacklist check types
export interface BlacklistCheckResult {
  isBlacklisted: boolean
  reason?: string
  expiresAt?: string
  blockedAt?: string
}

export interface UserBlacklistCheck extends BlacklistCheckResult {
  type: 'user' | 'email_domain'
}

export interface PropertyBlacklistCheck extends BlacklistCheckResult {
  type: 'property'
}

export interface IPBlacklistCheck extends BlacklistCheckResult {
  type: 'ip'
}