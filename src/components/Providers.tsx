"use client"

import { UserProvider } from "@/contexts/UserContext"
import { ToastContainer } from "react-toastify"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ToastContainer />
      {children}
    </UserProvider>
  )
}

