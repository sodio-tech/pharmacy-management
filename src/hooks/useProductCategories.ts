import { useState, useEffect, useCallback } from "react"
import { backendApi } from "@/lib/axios-config"

export interface ProductCategory {
  id: number
  category_name: string
}

interface UseProductCategoriesReturn {
  categories: ProductCategory[]
  isLoading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
}

export function useProductCategories(): UseProductCategoriesReturn {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await backendApi.get("/v1/products/categories")
      const data = response.data?.data || response.data
      setCategories(data.categories || [])
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(errorMessage || "Failed to fetch categories")
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, isLoading, error, fetchCategories }
}

