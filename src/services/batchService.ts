import backendApi from '@/lib/axios-config'

export interface Batch {
  id: string
  product_id: string
  batch_number: string
  lot_number?: string
  manufacturing_date: string
  expiry_date: string
  initial_quantity: number
  current_quantity: number
  cost_price: number
  supplier_id: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateBatchRequest {
  product_id: string
  batch_number: string
  lot_number?: string
  manufacturing_date: string
  expiry_date: string
  initial_quantity: number
  cost_price: number
  supplier_id: string
  notes?: string
}

export interface UpdateBatchRequest {
  batch_number?: string
  lot_number?: string
  manufacturing_date?: string
  expiry_date?: string
  cost_price?: number
  supplier_id?: string
  notes?: string
}

export interface UpdateBatchQuantityRequest {
  quantity: number
  reason?: string
}

export interface BatchFilters {
  productId?: string
  expiring?: boolean
  expired?: boolean
  days?: number
  page?: number
  limit?: number
}

class BatchService {
  /**
   * Create a new batch
   */
  async createBatch(batchData: CreateBatchRequest): Promise<Batch> {
    try {
      const response = await backendApi.post("/batches", batchData)
      return response.data.data
    } catch (error: any) {
      console.error('Error creating batch:', error)
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.')
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to create batches.')
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.error || 'Invalid batch data. Please check your inputs.')
      } else if (error.response?.status === 404) {
        throw new Error('Product or supplier not found. Please check your data.')
      } else if (error.response?.status >= 500) {
        throw new Error('Server error occurred while creating batch. Please try again later.')
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Network error. Please check your internet connection and try again.')
      } else {
        throw new Error(error.response?.data?.error || 'Failed to create batch. Please try again.')
      }
    }
  }

  /**
   * Get batches for a specific product
   */
  async getBatchesByProduct(productId: string): Promise<Batch[]> {
    try {
      const response = await backendApi.get(`/batches/product/${productId}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching batches:', error)
      throw error
    }
  }

  /**
   * Get batch by ID
   */
  async getBatchById(batchId: string): Promise<Batch> {
    try {
      const response = await backendApi.get(`/batches/${batchId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching batch:', error)
      throw error
    }
  }

  /**
   * Update batch
   */
  async updateBatch(batchId: string, updateData: UpdateBatchRequest): Promise<Batch> {
    try {
      const response = await backendApi.put(`/batches/${batchId}`, updateData)
      return response.data.data
    } catch (error) {
      console.error('Error updating batch:', error)
      throw error
    }
  }

  /**
   * Update batch quantity
   */
  async updateBatchQuantity(batchId: string, quantityData: UpdateBatchQuantityRequest): Promise<Batch> {
    try {
      const response = await backendApi.put(`/batches/${batchId}/quantity`, quantityData)
      return response.data.data
    } catch (error) {
      console.error('Error updating batch quantity:', error)
      throw error
    }
  }

  /**
   * Delete batch
   */
  async deleteBatch(batchId: string): Promise<void> {
    try {
      await backendApi.delete(`/batches/${batchId}`)
    } catch (error) {
      console.error('Error deleting batch:', error)
      throw error
    }
  }

  /**
   * Get expiring batches
   */
  async getExpiringBatches(days: number = 30): Promise<Batch[]> {
    try {
      const response = await backendApi.get(`/batches/expiring?days=${days}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching expiring batches:', error)
      throw error
    }
  }

  /**
   * Get expired batches
   */
  async getExpiredBatches(): Promise<Batch[]> {
    try {
      const response = await backendApi.get(`/batches/expired`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching expired batches:', error)
      throw error
    }
  }

  /**
   * Get batches with filters
   */
  async getBatches(filters: BatchFilters = {}): Promise<Batch[]> {
    try {
      const params = new URLSearchParams()
      
      if (filters.productId) params.append('productId', filters.productId)
      if (filters.expiring) params.append('expiring', 'true')
      if (filters.expired) params.append('expired', 'true')
      if (filters.days) params.append('days', filters.days.toString())
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await backendApi.get(`/batches?${params.toString()}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching batches:', error)
      throw error
    }
  }
}

export const batchService = new BatchService()
export default batchService
