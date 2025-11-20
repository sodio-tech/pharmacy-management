import { API } from '@/app/utils/constants';
import axios, { AxiosError } from 'axios';
import { store } from '@/store/store';
// import { InternalAxiosRequestConfig } from 'axios'; // Commented out - not used (refresh token logic is disabled)
// import { setAccessToken, clearAuth } from '@/store/slices/authSlice'; // Commented out - not used (refresh token logic is disabled)
// import { getRefreshToken } from './cookies'; // Commented out - not used (refresh token logic is disabled)
// import { clearAuthCookies } from './cookies'; // Commented out - not used (refresh token logic is disabled)

// Backend API base URL
const BACKEND_API_BASE = `${API}/api`;

// Get access token from Redux state, fallback to localStorage
const getAccessTokenFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    // First, try to get token from Redux state
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

// // Track if we're currently refreshing token to avoid multiple refresh calls
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: any) => void;
//   reject: (error?: any) => void;
// }> = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
  
//   failedQueue = [];
// };

// // Response interceptor to handle errors and token refresh
// backendApi.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

//     // If error is 401 and we haven't already tried to refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // If already refreshing, queue this request
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//             }
//             return backendApi(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // Get refresh_token from cookie
//         const refreshToken = getRefreshToken();

//         if (!refreshToken) {
//           throw new Error('No refresh token available');
//         }

//         const response = await axios.post(
//           `${API}/api/v1/auth/refresh-token?token=${refreshToken}`,
//           {},
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         if (response.data?.success && response.data?.data?.access_token) {
//           const newAccessToken = response.data.data.access_token;

//           // Update access_token in Redux state
//           store.dispatch(setAccessToken(newAccessToken));

//           // Update the original request with new token
//           if (originalRequest.headers) {
//             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           }

//           // Process queued requests
//           processQueue(null, newAccessToken);

//           // Retry the original request
//           return backendApi(originalRequest);
//         } else {
//           throw new Error('Invalid refresh token response');
//         }
//       } catch (refreshError) {
//         // Refresh token failed, clear auth and redirect to login
//         processQueue(refreshError, null);
        
//         // Clear Redux state and cookies
//         store.dispatch(clearAuth());
//         clearAuthCookies();

//         // Redirect to login
//         if (typeof window !== 'undefined') {
//           window.location.href = '/login';
//         }

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // For non-401 errors or if refresh already attempted, reject normally
//     return Promise.reject(error);
//   }
// );

// Response interceptor to handle errors and token refresh
backendApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default backendApi;