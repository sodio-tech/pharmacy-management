"use client"
import React, { useEffect } from 'react'
import { API } from '@/app/utils/constants';
import axios from 'axios';

const page = () => {
    useEffect(() => {
        const refreshToken = async () => {
            const response = await axios.get(`${API}/api/v1/auth/refresh-token`,{
                withCredentials: true,
            });
            console.log(response.data,"response")
        }
        refreshToken();
    }, [])

    return (
        <div>
            <h1>Check</h1>
        </div>
    )
}


export default page