"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { backendApi } from '@/lib/axios-config'
import { getAccessToken, clearAuthCookies } from '@/lib/cookies'

// User Interface (matches API response exactly)
export interface User {
  id: number
  fullname: string
  pharmacy_name: string
  email: string
  email_verified: boolean
  role: string
  subscription_status: string
  phone_number: string
  drug_license_number: string
  two_fa_enabled: boolean
  pharmacy_id: number
  image?: string | null // Optional field for UI
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async () => {
    const token = getAccessToken()
    
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await backendApi.get('/v1/profile')
      
      let userData: User
      
      if (response.data && response.data.success) {
        userData = response.data.data
      } else {
        userData = response.data
      }
      
      setUser(userData)
    } catch (err: unknown) {
      
      const error = err as { response?: { status?: number; data?: { message?: string } } }
      
      // If unauthorized, clear cookies and redirect to login
      if (error.response?.status === 401) {
        clearAuthCookies()
        setUser(null)
      } else {
        setError(error.response?.data?.message || 'Failed to fetch user data')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading, error, refetch: fetchUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

/**
 * Higher Order Component to provide user data to any component
 */
export function withUser<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithUserComponent(props: P) {
    const { user, isLoading } = useUser()
    
    return <Component {...props} user={user} isLoading={isLoading} />
  }
}

