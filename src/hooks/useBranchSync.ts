import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setBranches, setLoading, setError } from "@/store/slices/branchSlice"
import { useBranches } from "./useBranches"

/**
 * Hook to sync branches from API to Redux store
 * Use this in a component that needs to fetch and sync branches
 */
export function useBranchSync(pharmacyId: number | undefined) {
  const dispatch = useAppDispatch()
  const { branches, isLoading, error, fetchBranches } = useBranches(pharmacyId)

  // Explicitly fetch when pharmacyId becomes available
  useEffect(() => {
    if (pharmacyId) {
      fetchBranches()
    }
  }, [pharmacyId, fetchBranches])

  useEffect(() => {
    dispatch(setLoading(isLoading))
  }, [isLoading, dispatch])

  useEffect(() => {
    dispatch(setError(error))
  }, [error, dispatch])

  useEffect(() => {
    dispatch(setBranches(branches))
  }, [branches, dispatch])

  return { branches, isLoading, error }
}

