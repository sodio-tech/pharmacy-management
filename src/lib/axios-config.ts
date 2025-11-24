import { API } from '@/app/utils/constants';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store/store';
import { setAccessToken, clearAuth } from '@/store/slices/authSlice';
import { getRefreshToken, clearAuthCookies } from '@/lib/cookies';

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

const getAccessTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const state = store.getState();
    const tokenFromRedux = state.auth?.access_token;
    
    if (tokenFromRedux) {
      return tokenFromRedux;
    }
    
    // Fallback to localStorage if not in Redux state  
    return localStorage.getItem("access_token");
  } catch {
    return null;
  }
};

// Refresh access token using refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.get(`${BACKEND_API_BASE}/v1/auth/refresh-token`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

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
    // Refresh failed - clear auth and logout
    store.dispatch(clearAuth());
    clearAuthCookies();
    
    // Clear entire localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
      } catch (err) {
        console.error("Failed to clear localStorage:", err);
      }
      window.location.href = '/login';
    }
    
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