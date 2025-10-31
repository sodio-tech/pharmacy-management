// Sales related types

export interface Product {
  id: string | number
  name: string
  generic_name?: string
  description?: string
  category?: string
  manufacturer?: string
  barcode?: string
  qr_code?: string
  unit_price?: number
  selling_price?: number
  unit_of_measure?: string
  pack_size?: number
  min_stock_level?: number
  max_stock_level?: number
  requires_prescription?: boolean
  is_active?: boolean
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface Customer {
  id?: string
  patient_name: string
  patient_phone: string
  patient_email: string
  doctor_name?: string
  doctor_license?: string
  doctor_phone?: string
  prescription_photo?: string | null
  prescription_text?: string
  created_at?: string
}

export interface Transaction {
  id: string
  customer: string
  items: number
  amount: number
  time: string
  status: string
}

export interface SalesStats {
  total_sales?: number
  total_amount: number
  total_transactions: number
  average_sale: number
}

