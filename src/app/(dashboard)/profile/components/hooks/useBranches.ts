import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import backendApi from "@/lib/axios-config"
import type { Branch } from "../organization.types"

interface UseBranchesReturn {
  branches: Branch[]
  isLoading: boolean
  fetchBranches: () => Promise<void>
}

export function useBranches(pharmacyId?: number): UseBranchesReturn {
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchBranches = useCallback(async () => {
    if (!pharmacyId) {
      setBranches([])
      return
    }
    
    setIsLoading(true)
    try {
      const response = await backendApi.get(`/v1/org/branches/${pharmacyId}`)
      
      if (response.data.success) {
        setBranches(response.data.data.branches || [])
      } else {
        setBranches([])
      }
    } catch (error) {
      console.error("Error fetching branches:", error)
      setBranches([])
    } finally {
      setIsLoading(false)
    }
  }, [pharmacyId])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  return { branches, isLoading, fetchBranches }
}

