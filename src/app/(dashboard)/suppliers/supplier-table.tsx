"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"
import { Supplier, PurchaseOrder, TabType } from "./components/types"
import { useProductCategories } from "@/hooks/useProductCategories"
import { TabNavigation } from "./components/TabNavigation"
import { SuppliersTable } from "./components/SuppliersTable"
import { OrdersTable } from "./components/OrdersTable"
import { TableShimmer } from "./components/TableShimmer"
import { Pagination } from "./components/Pagination"


export function SupplierTable() {
  const [activeTab, setActiveTab] = useState<TabType>("suppliers")
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(false)
  const { categories } = useProductCategories()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all-categories")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [completingOrderId, setCompletingOrderId] = useState<number | null>(null)
  const limit = 5
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce search term
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset to page 1 when search changes
    }, 500) // 500ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      })
      
      if (debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim())
      }

      if (selectedCategory !== "all-categories") {
        const categoryId = categories.find(
          (cat) => cat.category_name.toLowerCase().replace(/_/g, "-") === selectedCategory
        )?.id
        if (categoryId) {
          params.append("product_category_id", categoryId.toString())
        }
      }

      const response = await backendApi.get(`/v1/supplier/list?${params.toString()}`)
      const data = response.data?.data || response.data
      setSuppliers(data.suppliers || [])
      setTotal(data.total || 0)
      setTotalPages(data.total_pages || 1)
    } catch (error: unknown) {
      console.error("Failed to fetch suppliers:", error)
      toast.error("Failed to load suppliers")
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearchTerm, selectedCategory, categories])

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      })
      
      if (debouncedSearchTerm.trim()) {
        params.append("search", debouncedSearchTerm.trim())
      }

      if (selectedCategory !== "all-categories") {
        const categoryId = categories.find(
          (cat) => cat.category_name.toLowerCase().replace(/_/g, "-") === selectedCategory
        )?.id
        if (categoryId) {
          params.append("product_category_id", categoryId.toString())
        }
      }

      const response = await backendApi.get(`/v1/orders/list?${params.toString()}`)
      const data = response.data?.data || response.data
      setOrders(data.orders || [])
      setTotal(data.total || 0)
      setTotalPages(data.total_pages || 1)
    } catch (error: unknown) {
      console.error("Failed to fetch purchase orders:", error)
      toast.error("Failed to load purchase orders")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, debouncedSearchTerm, selectedCategory, categories])

  useEffect(() => {
    // Reset search and category when switching tabs
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setSelectedCategory("all-categories")
    setCurrentPage(1) // Reset to page 1 when switching tabs
  }, [activeTab])

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when category changes
  }, [selectedCategory])

  useEffect(() => {
    if (activeTab === "suppliers") {
      fetchSuppliers()
    } else {
      fetchOrders()
    }
  }, [activeTab, fetchSuppliers, fetchOrders])

  const handleCompleteOrder = async (orderId: number) => {
    try {
      setCompletingOrderId(orderId)
      await backendApi.patch(`/v1/orders/order-completed/${orderId}`)
      toast.success("Order marked as completed successfully")
      // Refresh orders list
      if (activeTab === "orders") {
        await fetchOrders()
      }
    } catch (error: unknown) {
      console.error("Failed to complete order:", error)
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      toast.error(err?.response?.data?.message || err?.message || "Failed to complete order")
    } finally {
      setCompletingOrderId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={activeTab === "suppliers" ? "Search suppliers..." : "Search orders..."}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.category_name.toLowerCase().replace(/_/g, "-")}>
                  {category.category_name.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <TableShimmer type={activeTab} rows={limit} />
        ) : activeTab === "suppliers" ? (
          <SuppliersTable suppliers={suppliers} />
        ) : (
          <OrdersTable
            orders={orders}
            onComplete={handleCompleteOrder}
            completingOrderId={completingOrderId}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          limit={limit}
          loading={loading}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  )
}
