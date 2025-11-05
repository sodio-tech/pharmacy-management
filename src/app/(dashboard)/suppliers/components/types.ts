export interface Supplier {
  supplier_id: number
  supplier_name: string
  phone_number: string
  gstin: string
  last_purchase_date: string | null
  total_purchase_amount: string
  product_categories: string[]
}

export interface PurchaseOrder {
  id: number
  purchase_date: string
  pharmacy_id: number
  purchase_amount: number
  expected_delivery_date: string
  delivered_on: string | null
  is_delivered: boolean
  supplier_name: string
  phone_number: string
  product_category_name: string
  gstin: string
}

export type TabType = "suppliers" | "orders"

