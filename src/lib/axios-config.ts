import { API } from '@/app/utils/constants';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store/store';
import { setAccessToken } from '@/store/slices/authSlice';
import { logout } from '@/lib/auth';
import { getAccessTokenFromStorage } from './utils';

// Backend API base URL
const BACKEND_API_BASE = `${API}/api`;

// Flag to prevent multiple simultaneous refresh token requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Refresh access token using refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await backendApi.get(`/v1/auth/refresh-token`);

    if (response.data && response.data.success) {
      const newAccessToken = response.data.data?.access_token;
      
      if (newAccessToken) {
        // Update Redux state and localStorage
        store.dispatch(setAccessToken(newAccessToken));
        return newAccessToken;
      }
    }
    
    throw new Error('Failed to refresh token');
  } catch (error) {
    logout(true);
    throw error;
  }
};

// Create axios instance for backend API calls
export const backendApi = axios.create({
  baseURL: BACKEND_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add access token
backendApi.interceptors.request.use(
  (config) => {
    // Always get fresh token (no caching) to ensure latest token after refresh or branch switch
    const token = getAccessTokenFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
backendApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return backendApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;
        
        // Process queued requests
        processQueue(null, newAccessToken);
        
        // Retry original request with new token
        if (originalRequest.headers && newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        return backendApi(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default backendApi;