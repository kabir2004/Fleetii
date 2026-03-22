export type SortDirection = 'asc' | 'desc'

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface FilterParams {
  search?: string
  dateFrom?: string
  dateTo?: string
  status?: string[]
  [key: string]: unknown
}

export interface SelectOption {
  value: string
  label: string
}

export type CompanyType = 'carrier' | 'broker' | '3pl' | 'shipper'
export type UserRole = 'owner' | 'admin' | 'dispatcher' | 'driver' | 'accountant' | 'member'
export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise'
