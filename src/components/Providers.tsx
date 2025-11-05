"use client"

import { UserProvider, useUser } from "@/contexts/UserContext"
import { ToastContainer } from "react-toastify"

function AppLoadingOverlay({ children }: { children: React.ReactNode }) {
  const { isLoading } = useUser()

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0f766e] border-t-transparent"></div>
            <p className="text-[#6b7280] font-medium">Loading...</p>
          </div>
        </div>
      )}
      {children}
    </>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ToastContainer />
      <AppLoadingOverlay>{children}</AppLoadingOverlay>
    </UserProvider>
  )
}

