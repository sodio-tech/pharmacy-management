"use client"
import { API } from '@/app/utils/constants'
import axios from 'axios'
import React, { useEffect } from 'react'

const page = () => {
    const fetchRefreshToken = async () => {
        try {
            const response = await axios.post(
                `${API}/api/v1/auth/refresh-token`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log(response.data)
        } catch (error) {
            console.error('Error refreshing token:', error)
        }
    }
    
    useEffect(() => {
        fetchRefreshToken()
    }, [])

  return (
    <div>page</div>
  )
}

export default page