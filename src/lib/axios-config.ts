import { API } from '@/app/utils/constants';
import axios from 'axios';
import { getAccessToken, clearAuthCookies } from './cookies';

// Backend API base URL
const BACKEND_API_BASE = `${API}/api`;

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

// Response interceptor to handle errors
backendApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear cookies and redirect to login
      clearAuthCookies();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default backendApi;