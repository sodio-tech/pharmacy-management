import { OrderStatus } from "./types"

export const formatDate = (iso?: string | null) => {
  if (!iso) return "-"
  try {
    const date = new Date(iso)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "-"
  }
}

export const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  return `₹${numAmount.toLocaleString("en-IN")}`
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export const getColorForInitials = (name: string) => {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-teal-500"]
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export const getSupplierStatus = (lastPurchaseDate: string | null): "Active" | "Inactive" => {
  if (!lastPurchaseDate) return "Inactive"
  const lastDate = new Date(lastPurchaseDate)
  const now = new Date()
  const daysDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  // If last purchase was within 90 days, consider it Active
  return daysDiff <= 90 ? "Active" : "Inactive"
}

export const getOrderStatusDisplay = (status: OrderStatus | string): string => {
  if (typeof status === "string") {
    status = status as OrderStatus
  }
  switch (status) {
    case OrderStatus.PENDING:
      return "Pending"
    case OrderStatus.FULFILLED:
      return "Fulfilled"
    case OrderStatus.CANCELLED:
      return "Cancelled"
    default:
      return status
  }
}

export const getOrderStatusColor = (status: OrderStatus | string): string => {
  if (typeof status === "string") {
    status = status as OrderStatus
  }
  switch (status) {
    case OrderStatus.FULFILLED:
      return "bg-green-100 text-green-800"
    case OrderStatus.PENDING:
      return "bg-orange-100 text-orange-800"
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

