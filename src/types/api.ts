export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: string
  pagination?: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams {
  search?: string
  category?: string
  supplier_id?: string
  lowStock?: boolean
  expiringSoon?: boolean
}
