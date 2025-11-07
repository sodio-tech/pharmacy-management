import { useState, useEffect, useCallback } from "react"
import { backendApi } from "@/lib/axios-config"

export interface ProductUnit {
  id: number
  unit: string
}

interface UseProductUnitsReturn {
  units: ProductUnit[]
  isLoading: boolean
  error: string | null
  fetchUnits: () => Promise<void>
}

export function useProductUnits(): UseProductUnitsReturn {
  const [units, setUnits] = useState<ProductUnit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUnits = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await backendApi.get("/v1/products/units")
      const data = response.data?.data || response.data
      setUnits(data.product_units || [])
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(errorMessage || "Failed to fetch units")
      setUnits([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  return { units, isLoading, error, fetchUnits }
}

