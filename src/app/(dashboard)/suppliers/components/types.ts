export enum OrderStatus {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
}

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
  fulfilled_on: string | null
  status: OrderStatus
  supplier_name: string
  phone_number: string
  product_categories: string[]
  gstin: string
}

export type TabType = "suppliers" | "orders"

