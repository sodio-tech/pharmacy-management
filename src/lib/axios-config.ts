import { API } from '@/app/utils/constants';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, clearAuthCookies, setAuthCookies } from './cookies';

// Backend API base URL
const BACKEND_API_BASE = `${API}/api`;

// Create axios instance for backend API calls
export const backendApi = axios.create({
  baseURL: BACKEND_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Queue to store failed requests while refreshing
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Process the queue of failed requests
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Refresh token function
const refreshToken = async (): Promise<string | null> => {
  try {
    // Create a separate axios instance without interceptors to avoid infinite loop
    const refreshApi = axios.create({
      baseURL: BACKEND_API_BASE,
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await refreshApi.post('/v1/auth/refresh-token');
    const data = response.data?.data || response.data;

    if (data?.access_token) {
      // Update access token in cookies
      setAuthCookies({ access_token: data.access_token }, true);
      return data.access_token;
    }

    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
};

// Request interceptor to add access token
backendApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
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

    // Handle 401 Unauthorized errors
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
        const newToken = await refreshToken();

        if (newToken) {
          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Process queued requests
          processQueue(null, newToken);

          // Retry the original request
          return backendApi(originalRequest);
        } else {
          // Refresh failed, clear auth and redirect to login
          processQueue(error);
          clearAuthCookies();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        processQueue(error);
        clearAuthCookies();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For non-401 errors, reject immediately
    return Promise.reject(error);
  }
);

export default backendApi;