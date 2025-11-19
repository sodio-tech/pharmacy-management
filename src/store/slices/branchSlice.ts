import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Branch } from "@/hooks/useBranches"

interface BranchState {
  selectedBranchId: number | null
  branches: Branch[]
  isLoading: boolean
  error: string | null
}

// Load persisted selected branch from localStorage
const loadPersistedBranch = (): number | null => {
  if (typeof window === "undefined") return null
  try {
    const persisted = localStorage.getItem("selectedBranchId")
    return persisted ? Number(persisted) : null
  } catch {
    return null
  }
}

const initialState: BranchState = {
  selectedBranchId: loadPersistedBranch(),
  branches: [],
  isLoading: false,
  error: null,
}

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setSelectedBranch: (state, action: PayloadAction<number | null>) => {
      state.selectedBranchId = action.payload
      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          if (action.payload !== null) {
            localStorage.setItem("selectedBranchId", action.payload.toString())
          } else {
            localStorage.removeItem("selectedBranchId")
          }
        } catch (error) {
          console.error("Failed to persist branch selection:", error)
        }
      }
    },
    setBranches: (state, action: PayloadAction<Branch[]>) => {
      state.branches = action.payload
      // Auto-select first branch if none selected and branches available
      if (state.selectedBranchId === null && action.payload.length > 0) {
        const firstBranchId = action.payload[0].id
        state.selectedBranchId = firstBranchId
        // Persist auto-selected branch
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("selectedBranchId", firstBranchId.toString())
          } catch (error) {
            console.error("Failed to persist branch selection:", error)
          }
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearBranches: (state) => {
      state.branches = []
      state.selectedBranchId = null
      state.error = null
    },
  },
})

export const { setSelectedBranch, setBranches, setLoading, setError, clearBranches } =
  branchSlice.actions

export default branchSlice.reducer

