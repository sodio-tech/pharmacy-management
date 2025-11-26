import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  access_token: string | null
}

// Load persisted access_token from localStorage
const loadPersistedToken = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem("access_token")
  } catch {
    return null
  }
}

const initialState: AuthState = {
  access_token: loadPersistedToken(),
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.access_token = action.payload
      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          if (action.payload !== null) {
            localStorage.setItem("access_token", action.payload)
          } else {
            localStorage.removeItem("access_token")
          }
        } catch (error) {
          console.error("Failed to persist access token:", error)
        }
      }
    },
    clearAuth: (state) => {
      state.access_token = null
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
        } catch (error) {
          console.error("Failed to clear access token:", error)
        }
      }
    },
  },
})

export const { setAccessToken, clearAuth } = authSlice.actions

export default authSlice.reducer

