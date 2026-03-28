export interface ApiSuccess<T> {
  success: true
  message?: string
  data: T
}

export interface ApiError {
  success: false
  error: string
  details?: string[]
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface QueryFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
