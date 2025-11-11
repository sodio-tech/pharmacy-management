import { useState, useEffect, useCallback } from "react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"

export interface Branch {
  id: number
  branch_name: string
  branch_location?: string
  drug_license_number?: string
}

interface UseBranchesReturn {
  branches: Branch[]
  isLoading: boolean
  error: string | null
  fetchBranches: () => Promise<void>
}

export function useBranches(pharmacyId: number | undefined): UseBranchesReturn {
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBranches = useCallback(async () => {
    if (!pharmacyId) {
      setBranches([])
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await backendApi.get(`/v1/org/branches/${pharmacyId}`)
      const responseData = response.data?.data || response.data
      let branchesList: Branch[] = []
      
      if (responseData?.branches && Array.isArray(responseData.branches)) {
        branchesList = responseData.branches
      } else if (Array.isArray(responseData)) {
        branchesList = responseData
      }
      
      setBranches(branchesList)
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message
      setError(errorMessage || "Failed to fetch branches")
      setBranches([])
      toast.error("शाखाएं लोड करने में विफल")
    } finally {
      setIsLoading(false)
    }
  }, [pharmacyId])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  return { branches, isLoading, error, fetchBranches }
}

