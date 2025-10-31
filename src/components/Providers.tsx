"use client"

import { UserProvider } from "@/contexts/UserContext"
import { ToastContainer } from "react-toastify"
import NextTopLoader from 'nextjs-toploader'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader
        showSpinner={true}
        color="#0f766e"
        height={3}
      />
      <UserProvider>
        <ToastContainer />
        {children}
      </UserProvider>
    </>
  )
}

