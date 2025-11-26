"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { backendApi } from '@/lib/axios-config'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setAccessToken } from '@/store/slices/authSlice'
import { logout } from '@/lib/auth'

// User Interface (matches API response exactly)
export interface User {
  id: number
  fullname: string
  pharmacy_name: string
  email: string
  email_verified?: boolean
  role: string
  subscription_status?: string
  phone_number: string
  drug_license_number?: string
  two_fa_enabled: boolean
  pharmacy_id: number
  pharmacy_branch_id?: number
  profile_image?: string | null
  last_login?: string | null
  image?: string | null 
  currency_code?: string
  country?: string 
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
  const accessToken = useAppSelector((state) => state.auth.access_token)
  const dispatch = useAppDispatch()

  // Refresh access token using refresh token
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await backendApi.get(`/v1/auth/refresh-token`);

      if (response.data && response.data.success) {
        const newAccessToken = response.data.data?.access_token;
        
        if (newAccessToken) {
          // Update Redux state and localStorage
          dispatch(setAccessToken(newAccessToken));
          return newAccessToken;
        }
      }
      
      throw new Error('Failed to refresh token');
    } catch (error) {
      // Refresh failed - use global logout function
      // silent=true to avoid console errors during automatic logout
      setUser(null);
      logout(true);
      return null;
    }
  }, [dispatch]);

  const fetchUserData = useCallback(async () => {
    // Get access_token from Redux state (persisted in localStorage)
    const token = accessToken || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null)
    
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
      
      // Map profile_image to image for UI compatibility
      if (userData.profile_image) {
        userData.image = userData.profile_image
      }
      
      setUser(userData)
    } catch (err: unknown) {
      
      const error = err as { response?: { status?: number; data?: { message?: string } } }
      
      // If unauthorized, try to refresh token first
      if (error.response?.status === 401) {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Retry the request with new token
          try {
            const retryResponse = await backendApi.get('/v1/profile');
            
            let userData: User;
            if (retryResponse.data && retryResponse.data.success) {
              userData = retryResponse.data.data;
            } else {
              userData = retryResponse.data;
            }
            
            if (userData.profile_image) {
              userData.image = userData.profile_image;
            }
            
            setUser(userData);
            setError(null);
          } catch (retryErr) {
            // If retry also fails, use global logout function
            setUser(null);
            logout(true);
          }
        } else {
          // Refresh token failed, already handled in refreshAccessToken
          setUser(null);
          logout(true);
        }
      } else {
        setError(error.response?.data?.message || 'Failed to fetch user data')
      }
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, dispatch, refreshAccessToken])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

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

