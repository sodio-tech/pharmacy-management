import { ApiResponse } from '@/types/api'
import backendApi from '@/lib/axios-config'

export interface Supplier {
  id: string
  name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  gst_number?: string
  license_number?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateSupplierRequest {
  name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  gst_number?: string
  license_number?: string
}

export interface UpdateSupplierRequest {
  name?: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  gst_number?: string
  license_number?: string
}

class SupplierService {
  private baseUrl = '/suppliers'

  /**
   * Get all suppliers
   */
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await backendApi.get(this.baseUrl)
      return response.data.data || []
    } catch (error: any) {
      console.error('Error fetching suppliers:', error)
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.')
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view suppliers.')
      } else if (error.response?.status === 404) {
        throw new Error('Suppliers endpoint not found. Please check your connection.')
      } else if (error.response?.status >= 500) {
        throw new Error('Server error occurred while fetching suppliers. Please try again later.')
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        throw new Error('Network error. Please check your internet connection and try again.')
      } else {
        throw new Error(error.response?.data?.error || 'Failed to fetch suppliers. Please try again.')
      }
    }
  }

  /**
   * Get supplier by ID
   */
  async getSupplierById(supplierId: string): Promise<Supplier> {
    try {
      const response = await backendApi.get(`${this.baseUrl}/${supplierId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching supplier:', error)
      throw error
    }
  }

  /**
   * Create a new supplier
   */
  async createSupplier(supplierData: CreateSupplierRequest): Promise<Supplier> {
    try {
      const response = await backendApi.post(this.baseUrl, supplierData)
      return response.data.data
    } catch (error) {
      console.error('Error creating supplier:', error)
      throw error
    }
  }

  /**
   * Update supplier
   */
  async updateSupplier(supplierId: string, updateData: UpdateSupplierRequest): Promise<Supplier> {
    try {
      const response = await backendApi.put(`${this.baseUrl}/${supplierId}`, updateData)
      return response.data.data
    } catch (error) {
      console.error('Error updating supplier:', error)
      throw error
    }
  }

  /**
   * Delete supplier
   */
  async deleteSupplier(supplierId: string): Promise<void> {
    try {
      await backendApi.delete(`${this.baseUrl}/${supplierId}`)
    } catch (error) {
      console.error('Error deleting supplier:', error)
      throw error
    }
  }
}

export const supplierService = new SupplierService()
export default supplierService
